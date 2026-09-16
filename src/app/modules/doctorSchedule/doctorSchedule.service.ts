import { prisma } from "../../shared/prisma";
import type { IJwtPayload } from "../../types/common";


const insertIntoDB = async (user: IJwtPayload, payload:{
    schedules: string[]
} ) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
       
    const DoctorSchedulesData = payload.schedules.map(schedule => ({
        doctorId: doctorData.id,
        scheduleId: schedule
    }))

    const result = await prisma.doctorSchedule.createMany({
        data: DoctorSchedulesData,
    })
   return result;
}

export const doctorScheduleService = {
    insertIntoDB
}