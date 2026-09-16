import z from "zod";

const createDoctorScheduleSchemaValidation = z.object({
        doctorId: z.string().uuid(),
        schedules: z.array(z.string())
    })

export const doctorScheduleValidation = {
    createDoctorScheduleSchemaValidation
}