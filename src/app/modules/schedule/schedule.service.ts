import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";

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

export const scheduleService = {
    insertIntoDB
}