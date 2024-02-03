import { readFileSync } from 'fs';
const values = JSON.parse(readFileSync('values.json', 'utf8'));

const errorsObject = {
    maxLengthError : values.errors.maxLength,
    requiredError: values.errors.required,
    invalidEmailError : values.errors.email,
    invalidPhoneNumberError : values.errors.phoneNumber,
}

const maxLengthsObject = {
    defaultStringMaxLength: values.maxLengths.stringMaxLength,
    phoneNumberMaxLength: values.maxLengths.phoenNum
}

const userValuesObject = {
    usernameField: values.user.username,
    firstNameField: values.user.firstName,
    lastNameField: values.user.lastName,
    emailField: values.user.email,
    phoneNumberField: values.user.phoneNum,
    passwordField: values.user.password,
    confirmPasswordField: values.user.confirmPassword,
    createdOKMessage: values.user.okMessages.created,
    emailExistsMessage: values.user.errors.emailExists,
    phoneNumberExistsMessage: values.user.errors.phoneNumberExists,
    usernameExistsMessage: values.user.errors.usernameExists
}

const passwordValuesObject = {
    passwordsNotMatchMessage: values.password.errors.passwordsNotMatch,
    invalidPasswordMessage: values.password.errors.invalidPassword
}

export function requiredValue(name : string) : string {
    return  `${name} ${errorsObject.requiredError}`;
}

export function maxLenghValue(name : string, maxLengh : number) : string {
    return `${name} ${maxLengh} ${maxLengh}`
}

export {
    errorsObject,
    maxLengthsObject,
    userValuesObject,
    passwordValuesObject
}