import { requiredIsNull, valueExceedsLength } from "../helpers/modelHelper";
import * as emailValidator from 'email-validator';
import { maxLengthsObject, passwordValuesObject, userValuesObject, errorsObject, requiredValue, maxLenghValue } from "../helpers/valuesHelper";

export default class User {
    //#region Private Fields
    private useerNameField : string;
    private firstNameField : string;
    private lastNameField : string;
    private emailField : string;
    private passwordField : string;
    private confirmPasswordField : string;
    private phoneNumberField : string;
    private maxLength : number;
    //#endregion

    //#region Public Fields
    public userName : string | undefined | null;
    public firstName : string | undefined | null;
    public lastName : string | undefined | null;
    public email : string | undefined | null;
    public password : string | undefined | null;
    public confirmPassword: string | null | undefined;
    public phoneNumber : string | undefined | null;
    public errors : [string] = [''];
    //#endregion

    //#region  Constructor
    constructor() {
        this.useerNameField = userValuesObject.usernameField;
        this.firstNameField = userValuesObject.firstNameField;
        this.lastNameField = userValuesObject.lastNameField;
        this.emailField = userValuesObject.emailField;
        this.passwordField = userValuesObject.passwordField;
        this.confirmPasswordField = userValuesObject.confirmPasswordField;
        this.phoneNumberField = userValuesObject.phoneNumberField;
        this.maxLength = maxLengthsObject.defaultStringMaxLength;

        this.errors.splice(0, 1);
    }
    //#endregion

    //#region Public Methods
    public register(request : any) : void {
        this.userName = request.userName;
        this.firstName = request.firstName;
        this.lastName = request.lastName;
        this.email = request.email;
        this.password = request.passowrd;
        this.phoneNumber = request.phoneNumber;
        this.confirmPassword = request.confirmPassword;

        this.validate();
        this.passwordMatches();
        this.validateEmail();
    }
    //#endregion

    //#region  Private Fields
    private passwordMatches() : void {
        if (this.confirmPassword !== this.password) {
            this.errors.push(passwordValuesObject.passwordsNotMatchMessage);
        }
    }

    private validate() : void {
        if (requiredIsNull(this.userName)) {
            this.errors.push(requiredValue(this.useerNameField));
        }

        if (requiredIsNull(this.firstName)) {
            this.errors.push(requiredValue(this.firstNameField));
        }

        if (requiredIsNull(this.lastName)) {
            this.errors.push(requiredValue(this.lastNameField));
        }

        if (requiredIsNull(this.phoneNumber)) {
            this.errors.push(requiredValue(this.phoneNumberField));
        }

        if (requiredIsNull(this.password)) {
            this.errors.push(requiredValue(this.passwordField));
        }

        if (typeof this.userName === 'string' && valueExceedsLength(this.userName, this.maxLength)) {
            this.errors.push(maxLenghValue(this.useerNameField, this.maxLength));
        }

        if (typeof this.firstName === 'string' && valueExceedsLength(this.firstName, this.maxLength)) {
            this.errors.push(maxLenghValue(this.firstNameField, this.maxLength));
        }

        if (typeof this.lastName === 'string' && valueExceedsLength(this.lastName, this.maxLength)) {
            this.errors.push(maxLenghValue(this.lastNameField, this.maxLength));
        }

        if (typeof this.email === 'string' && valueExceedsLength(this.email, this.maxLength)) {
            this.errors.push(maxLenghValue(this.emailField, this.maxLength));
        }

        if (typeof this.phoneNumber === 'string' && valueExceedsLength(this.phoneNumber, maxLengthsObject.phoneNumberMaxLength)) {
            this.errors.push(maxLenghValue(this.phoneNumberField, maxLengthsObject.phoneNumberMaxLength));
        }

        if (typeof this.password === 'string' && valueExceedsLength(this.password, this.maxLength)) {
            this.errors.push(maxLenghValue(this.passwordField, this.maxLength));
        }

        if (typeof this.lastName === 'string' && valueExceedsLength(this.lastName, this.maxLength)) {
            this.errors.push(maxLenghValue(this.lastNameField, this.maxLength));
        }

        if (typeof this.lastName === 'string' && valueExceedsLength(this.lastName, this.maxLength)) {
            this.errors.push(maxLenghValue(this.lastNameField, this.maxLength));
        }
    }

    private validateEmail() {
        if (typeof this.email === 'string' && !emailValidator.validate(this.email)) {
            this.errors.push(errorsObject.invalidEmailError);
        }
    }
    //#endregion
}