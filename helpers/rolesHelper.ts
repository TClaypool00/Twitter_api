import { currentUser } from "./jwtHelper";
import { rolesValuesObject } from "./valuesHelper";

export function isAdmin(): boolean {
    return currentUser.roles.includes(rolesValuesObject.adminRole);
}

export function isDev(): boolean {
    return currentUser.roles.includes(rolesValuesObject.devRole);
}