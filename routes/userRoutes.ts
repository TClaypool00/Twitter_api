import express from 'express';
const router = express.Router();
import User from '../models/User';
import { insertUser, phoneNumberExists, emailExists, usernameExists } from '../data_access/userService';
import { getError, getErrors, getStatus } from '../helpers/globalFunctions';
import bcrypt from 'bcrypt';
import { passwrdMeetsRequirements } from '../data_access/passwordService';
import { passwordValuesObject, userValuesObject } from '../helpers/valuesHelper';
const saltRounds = 10;

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

                if (await insertUser(user) === 1) {
                    resp.status(200)
                .json(getStatus(userValuesObject.createdOKMessage));    
                }
            });
        });

    } catch (ex : any) {
        resp.status(500)
        .json(getStatus(ex));
    }
});

export default router;