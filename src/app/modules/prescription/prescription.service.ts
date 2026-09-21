import { appointmentStatus, paymentStatus, userRole, type Prescription } from "../../../generated/client/client";
import apiError from "../../errors/apiError";
import { paginationHelpers } from "../../helper/paginationHelpers";
import { prisma } from "../../shared/prisma";
import type { IJwtPayload } from "../../types/common";

const createPrescription = async (user: IJwtPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId as string,
            status: appointmentStatus.COMPLETED,
            paymentStatus: paymentStatus.PAID
        },
        include: {
            doctor: true,
        }
    })

    if ( user.role === userRole.DOCTOR ) {
        if(!(user.email === appointmentData.doctor.email)){
            throw new apiError(
                403,
                "You are not authorized to create prescription for this appointment"
            )
        }
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: payload.appointmentId as string,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate as Date || null,
        },
        include: {
            patient: true,
            doctor: true,
            appointment: true
        }
    })

    return result;

}

const getMyPrescriptions = async (user: IJwtPayload, options: any) => {
    const { page , limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
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
    }

}



export const prescriptionService = {
    createPrescription,
    getMyPrescriptions
}