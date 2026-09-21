import type { Prisma } from "../../../generated/client/client";
import { paginationHelpers } from "../../helper/paginationHelpers";
import { prisma } from "../../shared/prisma";
import type { IJwtPayload } from "../../types/common";
import { patientSearchableFields } from "./patient.constance";


const getAllFromDB = async (filters: any, options: any) => {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filtersData } = filters;

    const andConditions: Prisma.PatientWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filtersData).length > 0) {
        const filterConditions = Object.keys(filtersData).map((key) => {
            return {
                [key]: {
                equals: (filtersData as any)[key]
                }
            }
        })
        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.PatientWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.patient.count({
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

const getPatientById = async (id: string) => {
    const result = await prisma.patient.findUnique({
        where: {
            id: id
        },
    })
    return result;
}

const deletePatientById = async (id: string) => {
    const result = await prisma.patient.delete({
        where: {
            id: id
        }
    })
    return result;
}

const updateIntoDB = async (user: IJwtPayload, payload: any) => {
  
    // patientHealthData  createOrUpdate medicalReport Create patient update

    const { patientHealthData, medicalReport, ...patientData } = payload;
    
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false
        }
    })

    return await prisma.$transaction(async (tnx) => {
        await tnx.patient.update({
            where: {
                id: patientInfo.id
            },
            data: patientData
        })

        // Update or create patientHealthData
        if (patientHealthData) {
            await tnx.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id    
                },
                update: patientHealthData,
                create: {
                    ...patientHealthData,
                    patientId: patientInfo.id
                }
            })
        }

        if (medicalReport) {
            await tnx.medicalReport.create({
                data: {
                    ...medicalReport,
                    patientId: patientInfo.id
                }
            })
        }

        const result = await tnx.patient.findUnique({
            where: {
                id: patientInfo.id
            },
            include: {
                patientHealthData: true,
               medicalReport: true
            }
        })

        return result;

    })

}



export const patientService = {
    getAllFromDB,
    getPatientById,
    deletePatientById,
    updateIntoDB
}