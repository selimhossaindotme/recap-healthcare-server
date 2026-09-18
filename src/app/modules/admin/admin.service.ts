import type { Prisma } from "../../../generated/client/client";
import apiError from "../../errors/apiError";
import { paginationHelpers } from "../../helper/paginationHelpers"
import { prisma } from "../../shared/prisma";
import { adminSearchableFields } from "./admin.contance";

const getAllAdmin = async (filter: any, options: any) => {

    const { limit, page, sortBy, sortOrder, skip } = paginationHelpers.calculatePagination(options);

    const { searchTerm, ...filtersData } = filter;

    const andConditions: Prisma.AdminWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: adminSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode:'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filtersData).length > 0) {
        const filterConditions = Object.keys(filtersData).map((key) =>{
            return {
                [key]: {
                    equals: (filtersData as any)[key]
                }
            }

        })

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.AdminWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.admin.count({
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

const getAdminById = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id: id
        }
    })
    return result;
}

const updateAdminById = async (id: string, payload: Partial<Prisma.AdminUpdateInput>) => {
    const adminInfo = await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    if (!adminInfo) {
        throw new apiError(404, "Admin not found");
    }

    const result = await prisma.admin.update({
        where: {
            id
        },
        data: payload
    })
    return result;
}

const deleteAdminById = async (id: string) => {
    const result = await prisma.admin.delete({
        where: {
            id: id
        }
    })
    return result;
}

export const adminService = {
    getAllAdmin,
    getAdminById,
    updateAdminById,
    deleteAdminById
}