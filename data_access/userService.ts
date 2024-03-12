import connect from '../database/database';
import User from '../models/User';
import { getJSONObject } from '../helpers/jsonHelper';
import { maxLengthsObject } from '../helpers/valuesHelper';
const connection = connect();

//#region Database methods
export async function insertUser(user: User) : Promise<number> {
    let [newUser] = await connection.query('call insert_user(?, ?, ?, ?, ?, ?)', [user.userName, user.firstName, user.lastName, user.email, user.password, user.phoneNumber]);

    let jsonObject = getJSONObject(newUser);

    return Number(jsonObject.affectedRows);
}

export async function emailExists(email: string, userId : number | null = null) : Promise<boolean> {
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

export async function userExistsById(user:User): Promise<Boolean> {
    let [exists] = await connection.query('call user_exists_by_id(?);', [user.userId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.user_exists_by_id);
}

export async function getUserByEmail(user: User) : Promise<User> {
    const [dataUser] = await connection.query('call get_single_user_by_email(?)', [user.email]);
    let jsonObject = getJSONObject(dataUser);

    user.setData(jsonObject);


    return user;
}

export async function getAllUsers(user:User): Promise<Array<User>> {
    let users: Array<User> = new Array<User>();

    const [dataUsers] = await connection.query('call get_all_users(?, ?, ?);', [user.search, user.index, maxLengthsObject.standardTakeValue]);
    let jsonObject = getJSONObject(dataUsers);
    jsonObject = jsonObject[0];

    if (jsonObject.length > 0) {
        for (let i = 0; i < jsonObject.length; i++) {
            const userElement = jsonObject[i];
            let newUser: User = new User();
            newUser.setData(userElement);

            users.push(newUser);
        }
    }

    return users;
}

export async function getUserById(user:User): Promise<User> {
    const [dataUser] = await connection.query('call get_user_by_id(?)', [user.userId]);
    let jsonObject = getJSONObject(dataUser);
    jsonObject = jsonObject[0][0];

    user.setData(jsonObject);

    return user;
}