import z from "zod";

const createPatientZodSchema = z.object({
    password: z.string({ message: "password is required" }).min(6, "Password must be at least 6 characters long"),
    patient: z.object({
        name: z.string().min(2, "name must be long at least two character"),
        email: z.email(),
        profilePicture: z.string().optional(),
        phoneNumber: z.string().optional(),
        address: z.string().optional()
    })
})

const createAdminZodSchema = z.object({
    password: z.string({ message: "password is required" }).min(6, "Password must be at least 6 characters long"),
    admin: z.object({
        name: z.string().min(2, "name must be long at least two character"),
        email: z.email(),
        profilePicture: z.string().optional(),
        phoneNumber: z.string().optional(),
    })
})

const createDoctorZodSchema = z.object({
    password: z.string({ message: "password is required" }).min(6, "Password must be at least 6 characters long"),
    doctor: z.object({
        name: z.string().min(2, "name must be long at least two character"),
        email: z.email(),
        profilePicture: z.string().optional(),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
        licenseNumber: z.string().optional(),
        registrationNumber: z.string().optional(),
        experienceYears: z.number().optional(),
        appointmentFee: z.number().optional(),
        qualifications: z.string().optional(),
        designation: z.string().optional(),
    })
})

export const userValidation = {
    createPatientZodSchema,
    createAdminZodSchema,
    createDoctorZodSchema
}