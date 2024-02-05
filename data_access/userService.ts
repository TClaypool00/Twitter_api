import connect from '../database/database';
import User from '../models/User';
import { getJSONObject } from '../helpers/jsonHelper';
const connection = connect();

//#region Database methods
export async function insertUser(user: User) : Promise<Number> {
    let [newUser] = await connection.query('call insert_user(?, ?, ?, ?, ?, ?)', [user.userName, user.firstName, user.lastName, user.email, user.password, user.phoneNumber]);

    let jsonObject = getJSONObject(newUser);

    return Number(jsonObject.affectedRows);
}

export async function emailExists(email: string, userId : number | null = null) : Promise<Boolean> {
    const [exists] = await connection.query('call email_existts(?, ?)', [email, userId]);
    let jsonObject = getJSONObject(exists);

    return Boolean(jsonObject[0][0].email_exists);
}

export async function usernameExists(username: string, userId: number | null = null) : Promise<Boolean> {

    const [exists] = await connection.query('call username_exists(?, ?)', [username, userId]);

    let jsonObject = getJSONObject(exists);

    return Boolean(jsonObject[0][0].username_exists);


}

export async function phoneNumberExists(phoneNumber : string, userId: number | null = null): Promise<Boolean> {
    const [exists] = await connection.query('call phone_number_exists(?, ?)', [phoneNumber, userId]);

    let jsonObject = getJSONObject(exists);

    return Boolean(jsonObject[0][0].phone_number_exists);
}

export async function getUserByEmail(email: string) : Promise<any> {
    const user = await connection.query('call get_single_user_by_email(?)', [email]);

    let jsonObject = getJSONObject(user);

    return jsonObject[0][0][0];
}


