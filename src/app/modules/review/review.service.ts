import apiError from "../../errors/apiError";
import { prisma } from "../../shared/prisma";
import type { IJwtPayload } from "../../types/common";

const insertIntoDB = async (user: IJwtPayload, reviewData: any) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: reviewData.appointmentId
        }
    })

    if (appointmentData.patientId !== patientData.id) {
        throw new apiError(403, "You are not authorized to add review for this appointment");
    }

    await prisma.$transaction(async (tnx) => {
        const review = await tnx.review.create({
            data: {
                appointmentId: reviewData.appointmentId,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: reviewData.rating,
                comment: reviewData.comment
            }
        })

        const averageRating = await tnx.review.aggregate({
            where: {
                doctorId: reviewData.doctorId
            },
            _avg: {
                rating: true
            }
        })

        // update the average rating of the doctor
        await tnx.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating
            }
        })
       return review;
    })


}

export const reviewService = {
    insertIntoDB
}