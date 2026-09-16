import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { paginationHelpers } from "../../helper/paginationHelpers";
import type { Prisma } from "../../../generated/client/client";
import type { IJwtPayload } from "../../types/common";

const insertIntoDB = async (payload: any) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const interval = 30; // Interval in minutes

    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        )

         const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        )

       while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime;
            const slotEndDateTime = addMinutes(
                startDateTime, interval
            )

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime,
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startTime: scheduleData.startDateTime,
                    endTime: scheduleData.endDateTime
                }
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: {
                        startTime: scheduleData.startDateTime,
                        endTime: scheduleData.endDateTime
                    }
                })

                schedules.push(result);
            }

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + interval);



       }

       currentDate.setDate(currentDate.getDate() + 1);

    }

    return schedules;
}

const schedulesForDoctor = async ( user: IJwtPayload, filters: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);

    const { startTime: startTimeFilter, endTime: endTimeFilter } = filters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (startTimeFilter && endTimeFilter) {
        andConditions.push({
            AND: [
                {
                    startTime: {
                        gte: startTimeFilter
                    }
                },
                {
                    endTime: {
                        lte: endTimeFilter   
                    }
                }
            ]
        })
    }

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    }: {};

    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email
            }
        },
        select: {
            scheduleId: true
        }
    });
    
    // console.log('doctorSchedules:', doctorSchedules);


    const doctorScheduleIds = doctorSchedules.map(ds => ds.scheduleId);
    // console.log('doctorScheduleIds:', doctorScheduleIds);   

    const result = await prisma.schedule.findMany({
        skip,
        take: limit,
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}

const deleteScheduleFromDB = async (id: string) => {
    const result = await prisma.schedule.delete({
        where: {
            id: id
        }
    })
    return result;
}

export const scheduleService = {
    insertIntoDB,
    schedulesForDoctor,
    deleteScheduleFromDB
}