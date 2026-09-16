import { addBusinessDays } from "date-fns";
import type { Doctor, Prisma } from "../../../generated/client/client";
import { paginationHelpers } from "../../helper/paginationHelpers"
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constance";
import type { IDoctorUpdateInput } from "./doctor.interface";
import apiError from "../../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { openai } from "../../helper/open-router";


const getAllFromBD = async (filters: any, options: any) => {

    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers.calculatePagination(options);

    const { searchTerm, specialties, ...filtersData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })

    }

    if (Object.keys(filtersData).length > 0) {
        const filterConditions = Object.keys(filtersData).map((key) => ({
            [key]: {
                equals: (filtersData as any)[key]
            }
        }))
        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    const total = await prisma.doctor.count({
        where: whereConditions
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

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    })

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {

        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialitiesId
                    }
                })
            }

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialitiesId
                    }
                })
            }
        }

        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }
        })

        return updatedData;
    })

}


const getAiSuggestion = async (payload: { symptoms: string[] }) => {
    if (!(payload && payload.symptoms)) {
        throw new apiError(StatusCodes.BAD_REQUEST, "Symptoms are required to get AI suggestion");
    }

    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    const prompt = `
You are an AI doctor recommendation assistant.

A patient has the following symptoms:

${payload.symptoms.join(", ")}

Below is the list of doctors available in our healthcare system.

${JSON.stringify(doctors, null, 2)}

Your task is to recommend the most relevant doctors based ONLY on the doctors
provided above.

IMPORTANT RULES:
1. Never create or invent a doctor.
2. Only use doctor IDs from the provided list.
3. Recommend maximum 3 doctors.
4. Match symptoms with the doctor's specialties.
5. Return doctors in relevance order.
6. This is only a doctor-specialty matching system, not a medical diagnosis.
7. If the symptoms are not clearly related to any available specialty,
   still return the closest relevant doctors.

Return ONLY valid JSON in this exact format:

{
  "recommendations": [
    {
      "doctorId": "doctor-id",
      "reason": "short explanation"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
        model: 'poolside/laguna-s-2.1:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a healthcare doctor recommendation assistant. You must only recommend doctors from the provided database.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });



}

export const doctorService = {
    getAllFromBD,
    updateIntoDB,
    getAiSuggestion
}