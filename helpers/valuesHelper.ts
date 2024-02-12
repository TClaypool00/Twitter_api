import { readFileSync } from 'fs';
const values = JSON.parse(readFileSync('values.json', 'utf8'));

const errorsObject = {
    maxLengthError : values.errors.maxLength,
    requiredError: values.errors.required,
    invalidEmailError : values.errors.email,
    invalidPhoneNumberError : values.errors.phoneNumber,
    idGreaterThanZeroMessage: values.errors.idGreaterThanZero,
    dateMessage: values.errors.date,
    notBooleanMessage : values.errors.notBoolean,
    notNumberMessage: values.errors.notNumber
}

const maxLengthsObject = {
    defaultStringMaxLength: Number(values.maxLengths.stringMaxLength),
    phoneNumberMaxLength: Number(values.maxLengths.phoenNum),
    standardTakeValue: Number(values.maxLengths.standardTakeValue)
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
    startDateField: String(values.tweet.startDate),
    endDateField: String(values.tweet.endDate),
    isEditedField: values.tweet.isEdited,
    createdOKMessage: values.tweet.okMessages.created,
    updatedOKMessage: values.tweet.okMessages.updated,
    deletedOKMessage: values.tweet.okMessages.deleted,
    created500ErrorMessage: values.tweet.errors.cteatedError,
    deleted500ErrorMessage: values.tweet.errors.deletedError,
    tweetNotFoundMessage: values.tweet.errors.tweetNotFound,
    noTweetsMessage: values.tweet.errors.noTweets,
    likedSql: values.tweet.sql.liked
}

const likeValuesObject = {
    createdOKMessage: values.like.okMessages.created,
    deletedOKMessage: values.like.okMessages.deleted,
    created500Message: values.like.errors.createdError,
    deleted500Message: values.like.errors.deletedError,
    alreadyExistMessage: values.like.errors.exist,
    doesNotExistMessage: values.like.errors.doesNotExist,
    likeIdField: values.like.likeId
};

const commentValuesObject = {
    commentIdField: values.comment.commentId,
    commentTextField: values.comment.commentText,
    createdOKMessage: values.comment.okMessages.created,
    created500Message: values.comment.errors.createdError,
    updatedOKMessage: values.comment.okMessages.updated,
    updated500Message: values.comment.errors.updatedError,
    deletedOKMessage: values.comment.okMessages.deleted,
    deleted500Message: values.comment.errors.deletedError,
    doesNotExistMessage: values.comment.errors.commentNotFound
};

const routerValuesObject = {
    defaultMessage: values.router.defaultMessage
}

const globalValuesObject = {
    indexField: values.global.index
}

export function requiredValue(name : string) : string {
    return  `${name} ${errorsObject.requiredError}`;
}

export function maxLenghValue(name : string, maxLengh : number) : string {
    return `${name} ${maxLengh} ${maxLengh}`
}

export function notANumberValue(name: string) : string {
    return `${name} ${errorsObject.notNumberMessage}`;
}

export {
    errorsObject,
    maxLengthsObject,
    userValuesObject,
    passwordValuesObject,
    jwtValuesObject,
    routerValuesObject,
    tweetValuesObject,
    globalValuesObject,
    likeValuesObject,
    commentValuesObject
}