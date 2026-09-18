import z from "zod";

const updatePatientZodSchema = z.object({
    patient: z.object({
        name: z.string().min(2, "name must be long at least two character").optional(),
        profilePicture: z.string().optional(),
        phoneNumber: z.string().optional(),
        address: z.string().optional()
    })
})

export const patientValidation = {
    updatePatientZodSchema
}