import stripe from "../../helper/stripe";
import { prisma } from "../../shared/prisma"
import type { IJwtPayload } from "../../types/common"
import { v4 as uuidv4 } from 'uuid';

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

        await tnx.payment.create({
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
                        currency: "usd",

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
            },

            success_url: `https://www.google.com/search?q=translate+english+to+bangla&oq=translate+english+to+bangla&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIGCAEQIxgnMg0IAhAAGIMBGLEDGIAEMgoIAxAAGLEDGIAEMgcIBBAAGIAEMgoIBRAAGLEDGIAEMgoIBhAAGLEDGIAEMgYIBxAFGEDSAQgxNjM4ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8`,

            cancel_url: `https://www.facebook.com/`
        });

        console.log("Stripe session created:", session);

            return appointmentData;
        })
        return result;
    }



export const appointmentService = {
        createAppointment
    }