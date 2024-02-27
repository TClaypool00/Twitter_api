import connect from "../database/database";
import { getJSONObject } from "../helpers/jsonHelper";
import Role from "../models/Role";

const connection = connect();

export async function roleNameExists(role:Role) : Promise<boolean> {
    const [nameExists] = await connection.query('call role_name_exists(?, ?);', [role.roleName, role.roleId]);
    let jsonObject = getJSONObject(nameExists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.role_exists);
}

export async function roleDescriptionExists(role:Role) : Promise<boolean> {
    const [descriptionExists] = await connection.query('call role_description_exists(?, ?);', [role.description, role.roleId]);
    let jsonObject = getJSONObject(descriptionExists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.role_description_exists);
}

export async function roleExistsById(role:Role) : Promise<boolean> {
    const [exists] = await connection.query('call role_exists_by_id(?);', [role.roleId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.role_exists_by_id);
}

export async function insertRole(role:Role) : Promise<Role> {
    const [dataRole] = await connection.query('call insert_role(?, ?);', [role.roleName, role.description]);
    let jsonObject = getJSONObject(dataRole);
    jsonObject = jsonObject[0][0];

    role.setCreateData(jsonObject);

    return role;
}

export async function updateRole(role: Role): Promise<Role> {
    const [dataRole] = await connection.query('call update_role(?, ?)', [role.description, role.roleId]);
    let jsonObject = getJSONObject(dataRole);
    jsonObject = jsonObject[0][0];

    role.setUpdateData(jsonObject);

    return role;
}