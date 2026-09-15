import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

const generateToken = (payload: any, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
    return token;
}

const VerifyToken = (token: string, secret: string ) => {
    return jwt.verify(token, secret) as JwtPayload;
}

export const jwtHelper = {
    generateToken,
    VerifyToken
}