import type { AnyActionArg } from "react";
import stripe from "../../helper/stripe";
import { prisma } from "../../shared/prisma"
import type { IJwtPayload } from "../../types/common"
import { v4 as uuidv4 } from 'uuid';
import { paginationHelpers } from "../../helper/paginationHelpers";
import { appointmentStatus, userRole, type Prisma } from "../../../generated/client/client";
import apiError from "../../errors/apiError";

const createAppointment = async (user: IJwtPayload, payload: any) => {

    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    })

    const isBookedOrNot = await prisma.doctorSchedule.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                doctorId: doctorData.id,
                patientId: patientData.id,
                scheduleId: payload.scheduleId,
                videoCallingId: videoCallingId,
            }
        })

        await tnx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })

        const transactionId = uuidv4();

        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee ?? 0,
                transactionId: transactionId,
            }
        })

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            customer_email: user.email,

            line_items: [
                {
                    price_data: {
                        currency: "bdt",

                        product_data: {
                            name: "Appointment with " + doctorData.name,
                        },

                        unit_amount: doctorData.appointmentFee ? doctorData.appointmentFee * 100 : 0,
                    },

                    quantity: 1,
                },
            ],

            metadata: {
                appointmentId: appointmentData.id,
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                paymentId: paymentData.id
            },

            success_url: `https://www.google.com/search?q=translate+english+to+bangla&oq=translate+english+to+bangla&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIGCAEQIxgnMg0IAhAAGIMBGLEDGIAEMgoIAxAAGLEDGIAEMgcIBBAAGIAEMgoIBRAAGLEDGIAEMgoIBhAAGLEDGIAEMgYIBxAFGEDSAQgxNjM4ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8`,

            cancel_url: `https://www.facebook.com/`
        });

        console.log("Stripe session created:", session);

        return {
            paymentUrl: session.url,

        };
    })
    return result;
}

const getMyAppointments = async (user: IJwtPayload, filters: any, options: any) => {
    const { limit, page, sortBy, sortOrder, skip } = paginationHelpers.calculatePagination(options);
    const { ...filtersData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user.role == userRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user.email
            }
        })
    }

    if (user.role === userRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user.email
            }
        })
    }

    

    if (Object.keys(filtersData).length > 0) {
        const filterConditions: Prisma.AppointmentWhereInput[] = Object.keys(filtersData).map((key) => ({
            [key]: {
                equals: (filtersData as any)[key],
            },
        }))
        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user.role === userRole.PATIENT
            ? {
                doctor: true,
            }
            : {
                patient: true,
            }
        
    })

    const total = await prisma.appointment.count({
        where: whereConditions
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

const updateAppointmentStatus = async (appointmentId: string, status: appointmentStatus, user: IJwtPayload) => {

    // check appointment exists or not
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true,
        }
    })

    if (user.role === userRole.DOCTOR){
        if (!(user.email === appointmentData.doctor.email)){
            throw new apiError(
                403,
                "You are not authorized to update this appointment"
            )
        }


        const result = await prisma.appointment.update({
            where: {
                id: appointmentId        
            },
            data: {
                status: status
            }
        })

       
        return result;
    }    
}


export const appointmentService = {
    createAppointment,
    getMyAppointments,
    updateAppointmentStatus
}