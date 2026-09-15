import bcrypt from "bcryptjs";
import type { Request } from "express";
import { envVars } from "../../config";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { userRole } from "../../../generated/client/enums";
import { paginationHelpers } from "../../helper/paginationHelpers";
import type { Prisma } from "../../../generated/client/client";
import { userSearchableFields } from "./user.constant";

// const getAllFromDBService = async ({ page, limit, searchTerm , sortBy, sortOrder, role, status }: { page: number; limit: number; searchTerm?: any; sortBy?: any; sortOrder?:  any, role?: any, status?: any }) => {

//     const pageNumber = page || 1;
//     const limitNumber = limit || 10;

//     const skip = (pageNumber -1 ) * limitNumber;


//     const result = await prisma.user.findMany(
//         { 
//             // shorting
//             orderBy: sortBy && sortOrder ? {
//                 [sortBy]: sortOrder
//             } : {
//                 createdAt: 'desc'
//             },
//             // pagination
//             skip: skip,
//             take: limitNumber,

//             // searching
//             where: {
//                 email: {
//                     contains: searchTerm,
//                     mode: 'insensitive'
//                 },
//                 role: role
//             }
//         }
//     );


//     return result
// }

const getAllFromDBService = async (filters: any, options: any) => {
    const { page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filtersData } = filters;
    const skip = (page - 1) * limit;

    const andConditions: Prisma.UserWhereInput[] = [];

    

    if( searchTerm ) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    if(Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: {
                    equals: (filtersData as any)[key]
                }
            }))
        })
    }

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy] : sortOrder
        }

    })

    const total = await prisma.user.count({
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
    };



const createPatientService = async (req: Request) => {

    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.patient.profilePicture = uploadedResult?.secure_url;
    }

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, Number(envVars.bcrypt_salt_rounds))



    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashedPassword,
            }
        })

        await tnx.patient.create({
            data: req.body.patient
        })

        console.log(req.body)

    });

    return result;
};

const createAdminServer = async (req: Request) => {
    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.admin.profilePicture = uploadedResult?.secure_url;
    }

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, Number(envVars.bcrypt_salt_rounds))
   
   const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN
   }

   const result = await prisma.$transaction( async (tnx) => {
    await tnx.user.create({
        data: userData
    })
    await tnx.admin.create({
        data: req.body.admin
    })
   })
   return result;
};

const createDoctorServer = async (req: Request) => {
    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePicture = uploadedResult?.secure_url;
    }

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, Number(envVars.bcrypt_salt_rounds))
   
   const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: userRole.DOCTOR
   }

   const result = await prisma.$transaction( async (tnx) => {
    await tnx.user.create({
        data: userData
    })
    await tnx.doctor.create({
        data: req.body.doctor
    })
   })
   return result;
};


export const userService = {
    createPatientService,
    createAdminServer,
    createDoctorServer,
    getAllFromDBService
};