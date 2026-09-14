import bcrypt from "bcryptjs";
import type { Request } from "express";
import { envVars } from "../../config";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { userRole } from "../../../generated/client/enums";

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
    Role: userRole.ADMIN
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
    Role: userRole.DOCTOR
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
    createDoctorServer
};