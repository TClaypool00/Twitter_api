import express from 'express';
const router = express.Router();
import User from '../models/User';
import { insertUser, phoneNumberExists, emailExists, usernameExists, getUserByEmail } from '../data_access/userService';
import { getError, getErrors, getStatus } from '../helpers/globalFunctions';
import bcrypt from 'bcrypt';
import { passwrdMeetsRequirements } from '../data_access/passwordService';
import { passwordValuesObject, userValuesObject, errorsObject } from '../helpers/valuesHelper';
import * as  emailValidator from 'email-validator';
import { userObject } from '../helpers/modelHelper';
import { generateToken } from '../helpers/jwtHelper';
const saltRounds = 10;
require('dotenv').config();

router.post('/', async (req, resp) => {
    let user = new User();
    try{
        user.register(req.body);

        if (user.errors.length > 0) {
            resp.status(400)
            .json(getErrors(user.errors));

            return;
        }

        if (!passwrdMeetsRequirements(String(user.password))) {
            resp.status(400)
            .json(passwordValuesObject.invalidPasswordMessage);

            return;
        }

        if (await usernameExists(String(user.userName))) {
            resp.status(400)
            .json(getError(userValuesObject.usernameExistsMessage));

            return;
        }

        

        if (await phoneNumberExists(String(user.phoneNumber))) {
            resp.status(400)
            .json(userValuesObject.phoneNumberExistsMessage);

            return;
        }

        if (await emailExists(String(user.email))) {
            resp.status(400)
            .json(userValuesObject.emailExistsMessage);

            return;
        }

        bcrypt.genSalt(saltRounds, (err : Error | undefined, salt: string) => {
            if (err) {
                throw err;
            }

            bcrypt.hash(String(user.password), salt, async (err : Error | undefined, hash : string) => {

                if (err) {
                    throw err;
                }

                user.password = hash;

                if (await insertUser(user) > 0) {
                    resp.status(200)
                .json(getStatus(userValuesObject.createdOKMessage));    
                } else {
                    throw userValuesObject.created500ErrorMessage;
                }
            });
        });

    } catch (ex : any) {
        resp.status(500)
        .json(getStatus(ex));
    }
});

router.post('/login', async (req, resp) => {
    let user = new User();
    user.email = req.body.email;
    user.password = req.body.password;

    user.validateLoginInfo();

    if (!emailValidator.validate(String(user.email))) {
        resp.status(400)
        .json(getStatus(errorsObject.invalidEmailError));

        return;
    }

    if (!emailExists(String(user.email))) {
        resp.status(404)
        .json(getStatus(userValuesObject.emailExistsMessage))
    }

    user = await getUserByEmail(user);

    if (!await bcrypt.compare(req.body.password, String(user.password))) {
        resp.status(400)
        .json(getStatus(passwordValuesObject.incorrectPassswordMessage));

        return;
    }

    user.password = '';

    const token = generateToken(user);

    resp.status(200)
    .send(getStatus(userObject(user, token)));
});

export default router;