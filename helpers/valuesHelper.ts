import { readFileSync } from 'fs';
const values = JSON.parse(readFileSync('values.json', 'utf8'));

const errorsObject = {
    maxLengthError : values.errors.maxLength,
    requiredError: values.errors.required,
    invalidEmailError : values.errors.email,
    invalidPhoneNumberError : values.errors.phoneNumber,
    idGreaterThanZeroMessage: values.errors.idGreaterThanZero
}

const maxLengthsObject = {
    defaultStringMaxLength: values.maxLengths.stringMaxLength,
    phoneNumberMaxLength: values.maxLengths.phoenNum
}

const userValuesObject = {
    userIdField: values.user.userId,
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
    usernameExistsMessage: values.user.errors.usernameExists,
    emailDoesNotExistsMessage: values.user.errors.emailDoesNotExists
}

const passwordValuesObject = {
    passwordsNotMatchMessage: values.password.errors.passwordsNotMatch,
    invalidPasswordMessage: values.password.errors.invalidPassword,
    incorrectPassswordMessage: values.password.errors.incorrectPasssword
}

const jwtValuesObject = {
    expiresTimeLimt: values.jwt.expireTimeLimit,
    noTokenMessage: values.jwt.noToken,
    authorizationHeader: values.jwt.authorizationHeader,
    unauthorizedMessage: values.jwt.unauthorized
}

const tweetValuesObject = {
    tweetIdField: values.tweet.tweetId,
    tweetTextField: values.tweet.tweetText,
    createdOKMessage: values.tweet.okMessages.created,
    updatedOKMessage: values.tweet.okMessages.updated,
    created500ErrorMessage: values.tweet.errors.cteatedError,
    tweetNotFoundMessage: values.tweet.errors.tweetNotFound
}

const routerValuesObject = {
    defaultMessage: values.router.defaultMessage
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
    passwordValuesObject,
    jwtValuesObject,
    routerValuesObject,
    tweetValuesObject
}