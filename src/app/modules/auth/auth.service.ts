import bcrypt from "bcryptjs"
import { userStatus } from "../../../generated/client/enums"
import { prisma } from "../../shared/prisma"
import { jwtHelper } from "../../helper/jwtHelpers"
import { envVars } from "../../config"
import apiError from "../../errors/apiError"
import { StatusCodes } from "http-status-codes"


const login = async ( payload: { email: string, password: string } ) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: userStatus.ACTIVE
        }
    })

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if( !isPasswordMatched ) {

        throw new apiError(StatusCodes.BAD_REQUEST, "inCorrect password");
    }

    const accessToken = jwtHelper.generateToken({
        email: user.email,
        role: user.role
    }, envVars.JWT.secret as string, envVars.JWT.expires_in as string);

    const refreshToken = jwtHelper.generateToken({
        email: user.email,
        role: user.role
    }, envVars.JWT.refresh_token_secret as string, envVars.JWT.refresh_token_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
        role: user.role
    };

}

export const authService = {
    login
}