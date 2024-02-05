import * as jwt from 'jsonwebtoken'
import User from '../models/User';
import { jwtValuesObject } from './valuesHelper';
import { getStatus } from './globalFunctions';
require('dotenv').config();

const secretKeyEnv = String(process.env.SECRET_KEY);
const refreshSecretKey = String(process.env.REFRESH_KEY);

var currentUser = {
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phonenum: ''
}

export function generateToken(user: User, isRefreshToken : boolean = false) : string {
    currentUser.userId = user.userId;
    currentUser.firstName = String(user.firstName);
    currentUser.lastName = String(user.lastName);
    currentUser.email = String(user.email);
    currentUser.phonenum = String(user.phoneNumber);
    
    if (!isRefreshToken) {
        const options = {
            expiresIn: jwtValuesObject.expiresTimeLimt
        };

        return jwt.sign(currentUser, secretKeyEnv, options);
    }

    return jwt.sign(currentUser, refreshSecretKey);

}

export function authenticateToken(req : any, resp : any, next: any) : any {
    const token = getToken(req);

    if (!token) {
        resp.status(401)
        .json(getStatus(jwtValuesObject.noTokenMessage));

        return;
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
        resp.status(403)
        .json(getStatus(result.error));

        return;
    }

    currentUser = result.data;

    next();
}

export function authenticateRefreshToken(req: any, resp: any, next: any) : any {
    const token = getToken(req);

    if (!token) {
        resp.status(401)
        .json(getStatus(jwtValuesObject.noTokenMessage));

        return;
    }

    const result = verifyAccessToken(token, true);

    if (!result.success) {
        resp.status(403)
        .json(getStatus(result.error));

        return;
    }

    req.user = result.data;

    next();
}

export function verifyAccessToken(token: string, isRefreshToken: boolean = false) : any {
    let secretKey: string = '';

    if (isRefreshToken) {
        secretKey = refreshSecretKey;
    } else {
        secretKey = secretKeyEnv;
    }

    try {
        const decodedData = jwt.verify(token, secretKey);

        return getTokenObject(true, decodedData);
    } catch (error: any) {
        return getTokenObject(false, '', error);
    }
}

export function validateUserId(formUserId: Number, reqUserId: any) : boolean {
    return formUserId === reqUserId;
}

export {
    secretKeyEnv,
    refreshSecretKey,
    currentUser
}

function getTokenObject(success: boolean, data: any = '', error: any = '') : any {
    return {
        success: success,
        data: data,
        error: error
    };
}

function getToken(req: any) : string {
    return req.headers[jwtValuesObject.authorizationHeader];
}