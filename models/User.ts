import { requiredDateIsNull, requiredIsNull, requiredNumberIsNull, valueExceedsLength } from "../helpers/modelHelper";
import * as emailValidator from 'email-validator';
import { maxLengthsObject, passwordValuesObject, userValuesObject, errorsObject, requiredValue, maxLenghValue } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";
import { isAdmin } from "../helpers/rolesHelper";
import { validateUserId } from "../helpers/jwtHelper";

export default class User extends ModelHelper {
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
    public roles: [string] = [''];
    public profilePictureURL: string | null;
    public profileId: number | undefined | null;
    public aboutMe: string | undefined | null;
    public middleName: string | undefined | null;
    public birthDate: Date | undefined | null;
    public genderId: number | undefined | null;
    public genderName: string | undefined | null;
    public pronoun1: string | null;
    public pronoun2: string | null;
    public coverPictureId: number | null;
    public coverPicturePath: string | null;
    public profliePictureId: number | null;
    public profilePicturePath: string | null;
    //#endregion

    //#region  Constructor
    constructor() {
        super();

        this.useerNameField = userValuesObject.usernameField;
        this.firstNameField = userValuesObject.firstNameField;
        this.lastNameField = userValuesObject.lastNameField;
        this.emailField = userValuesObject.emailField;
        this.passwordField = userValuesObject.passwordField;
        this.confirmPasswordField = userValuesObject.confirmPasswordField;
        this.phoneNumberField = userValuesObject.phoneNumberField;
        this.maxLength = maxLengthsObject.defaultStringMaxLength;

        this.profileId = 0;
        this.aboutMe = null;
        this.middleName = null;
        this.birthDate = null;
        this.genderId = null;
        this.genderName = null;
        this.pronoun1 = null;
        this.pronoun2 = null;
        this.coverPictureId = null;
        this.coverPicturePath = null;
        this.profliePictureId = null;
        this.profilePicturePath = null;

        this.profilePictureURL = null;
        
        this.roles.splice(0, 1);
    }
    //#endregion

    //#region Public Methods
    public register(reqBody : any, update: boolean = false) : void {
        this.userName = reqBody.userName;
        this.firstName = reqBody.firstName;
        this.lastName = reqBody.lastName;
        this.email = reqBody.email;
        this.phoneNumber = reqBody.phoneNumber;
        
        if (!update) {
            this.confirmPassword = reqBody.confirmPassword;
            this.password = reqBody.passowrd;
            this.passwordMatches();
        }

        this.validate();
        this.validateEmail();
    }

    public validateLoginInfo() {
        if (requiredIsNull(this.password)) {
            this.errors.push(requiredValue(this.passwordField));
        }

        this.validateEmail();
    }

    public update(reqBody: any, id: any) {
        this.userId = id;
        this.aboutMe = reqBody.aboutMe;
        this.middleName = reqBody.middleName;
        this.genderId = reqBody.genderId;

        this.userId = this.validateId(this.userId, this.userIdField, true);

        this.register(reqBody, true);

        if (typeof this.aboutMe === 'string' && valueExceedsLength(this.aboutMe, this.maxLength)) {
            this.errors.push(maxLenghValue(userValuesObject.aboutMeField, this.maxLength));
        }

        if (typeof this.middleName === 'string' && valueExceedsLength(this.middleName, this.maxLength)) {
            this.errors.push(maxLenghValue(userValuesObject.middleNameField, this.maxLength));
        }
    }

    public setData(data: any) : void {
        let userData: any;
        let elementData: any;

        try {
            userData = data[0][0];
        } catch {
            userData = data;
        }

        this.userId = userData.user_id;
        this.userName = userData.username;
        this.firstName = userData.first_name;
        this.lastName = userData.last_name;
        
        if (validateUserId(Number(this.userId))) {
            if (userData.email) {
                this.email = userData.email;
            }
    
            if (userData.phone_number) {
                this.phoneNumber = userData.phone_number;
            }
        }

        if (userData.password) {
            this.password = userData.password;
        }

        if (userData.profile_picture_path) {
            this.profilePictureURL = userData.profile_picture_path;
        }

        elementData = userData.profile_id;

        if (elementData) {
            this.profileId = elementData;
        }

        elementData = userData.date_created;
        if (elementData) {
            this.createDate = new Date(String(elementData));
        }

        elementData = userData.about_me;
        if (elementData) {
            this.aboutMe = elementData;
        }

        elementData = userData.middle_name;
        if (elementData) {
            this.middleName = elementData;
        }

        elementData = userData.birth_date;
        if (elementData) {
            this.birthDate = new Date(String(elementData));
        }
        
        elementData = userData.gender_id;
        if (elementData) {
            this.genderId = elementData;
        }

        elementData = userData.gender_name;
        if (elementData) {
            this.genderName = elementData;
        }

        elementData = userData.pronoun_1;
        if (elementData) {
            this.pronoun1 = elementData;
        }

        elementData = userData.pronoun_2;
        if (elementData) {
            this.pronoun2 = elementData;
        }

        elementData = userData.cover_picture_id;
        if (elementData) {
            this.coverPictureId = elementData;
        }

        elementData = userData.cover_picture_path;
        if (elementData) {
            this.coverPicturePath = elementData;
        }

        elementData = userData.profile_picture_id;
        if (elementData) {
            this.profliePictureId = elementData;
        }

        let roleData = data[1];
        if (roleData) {
            for (let i = 0; i < roleData.length; i++) {
                this.roles.push(roleData[i].role_name);
            }
        }
    }

    public setUpdateData(data: any): void {
        if (data) {
            this.genderId = data.gender_id;
            this.genderName = data.gender_name;
            this.pronoun1 = data.pronoun_1;
            this.pronoun2 = data.pronoun_2;
            
            if (data.date_created) {
                this.setCreateDate(data.date_created);
            }

            if (data.profile_id) {
                this.profileId = data.profile_id;
            }

            if (data.cover_picture_id) {
                this.coverPictureId = data.cover_picture_id;
            }

            if (data.cover_picture_path) {
                this.coverPicturePath = data.cover_picture_path;
            }

            if (data.profile_picture_id) {
                this.profliePictureId = data.profile_picture_id;
            }

            if (data.profile_picture_path) {
                this.profilePicturePath = data.profile_picture_path;
            }

            if (data.birth_date) {
                this.birthDate = new Date(String(data.birth_date));
            }
        }

        let createDate: any;
        if (createDate) {
            createDate = data[1].date_created;
            this.setCreateDate(createDate);
        }

    }

    public getAll(req: any) {
        if (typeof req.query.search !== 'undefined') {
            this.search = String(req.query.search);

            if (valueExceedsLength(this.search, maxLengthsObject.defaultStringMaxLength)) {
                this.errors.push(maxLenghValue('search', maxLengthsObject.defaultStringMaxLength));
            }
        } else {
            this.search = null;
        }

        this.setIndex(req.query);
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