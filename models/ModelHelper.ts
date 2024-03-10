import { isValidDate } from "../helpers/globalFunctions";
import { requiredNumberIsNull } from "../helpers/modelHelper";
import { booleanValuesObject, globalValuesObject, notANumberValue, picturesValuesObject, requiredValue } from "../helpers/valuesHelper";
import { userValuesObject, tweetValuesObject, commentValuesObject } from "../helpers/valuesHelper";
import { errorsObject } from "../helpers/valuesHelper";

//TODO Make code less redundant. i.e. create, update, setId etc.
export default abstract class ModelHelper {
   //#region Public Properites
    public index: number | null;
    public commentId: number | undefined | null;
    public userId: number | undefined | null;
    public tweetId: number | undefined | null;
    public pictureId: number | undefined | null;
    public errors: [string] = [''];
    public likeCount: number;
    public liked: boolean;
    public search: string | undefined | null;

    public createDate : Date | null;
    public createDateString: string;
    public updateDate: Date | null;
    public datePublished: Date | null;
    public datePublishedString: string;
    public updateDateString : string;
    public startDate: Date | null;
    public endDate: Date | null;
    public isEdited: boolean | null;
    public userFirstName: string;
    public userLastName: string;
    public userDisplayName: string;
   //#endregion

    //#region Protected Fields
    protected indexField: string
    protected userIdField: string;
    protected tweetIdField: string;
    protected startDateField: string;
    protected endDateField: string;
    protected isEditedField: string;
    protected commentIdField: string;
    protected pictureIdField: string;

    //#endregion

    //#region Constructors
    constructor() {
        this.indexField = globalValuesObject.indexField;
        this.userIdField = userValuesObject.userIdField;
        this.tweetIdField = tweetValuesObject.tweetIdField;
        this.startDateField = tweetValuesObject.startDateField;
        this.endDateField = tweetValuesObject.endDateField;
        this.isEditedField = tweetValuesObject.isEditedField;
        this.commentIdField = commentValuesObject.commentIdField;
        this.pictureIdField = picturesValuesObject.pictureIdField;

        this.index = null;
        this.likeCount = 0;
        this.liked = false;

        this.tweetId = null;
        this.userFirstName = '';
        this.userLastName = '';
        this.userDisplayName = '';
        this.createDateString = '';
        this.createDate = null;
        this.updateDate = null;
        this.updateDateString = '';
        this.isEdited = null;
        this.datePublished = null;
        this.datePublishedString = '';
        this.endDate = null;
        this.startDate = null;

        this.errors = [''];
        this.errors.splice(0, 1);
    }
    //#endregion

    //#region Public Methods
    public setCreateDate() : void {
        this.createDateString = this.createDate!.toLocaleDateString();
    }

    //#region User Methods
    public userIdIsNull() {
        if (requiredNumberIsNull(this.userId)) {
            this.errors.push(requiredValue(this.userIdField));
        }
    }

    public commentIdIsNull() {
        if (requiredNumberIsNull(this.commentId)) {
            this.errors.push(requiredValue(this.commentIdField))
        }
    }

    public validateUserId(): void {
        if (isNaN(Number(this.userId))) {
            this.errors.push(notANumberValue(this.userIdField));
        } else {
            this.userId = Number(this.userId);
        }
    }

    public setUserNames(userId: number, firstName: string, lastName: string) : void {
        this.userId = userId;
        this.userFirstName = firstName;
        this.userLastName = lastName;
        this.setUserDisplayName();
    }

    public setUserDisplayName() : void {
        this.userDisplayName = `${this.userFirstName} ${this.userLastName.charAt(0)}.`;
    }
    //#endregion

    //#region  Tweet Methods
    public tweetIdIsNull() {
        if (requiredNumberIsNull(this.tweetId)) {
            this.errors.push(requiredValue(this.tweetIdField));
        } else if (isNaN(Number(this.tweetId))) {
            this.errors.push(notANumberValue(this.tweetIdField));
        } else {
            this.tweetId = Number(this.tweetId);
        }
    }

    //TODO: Validate if value is a number
    //#endregion
    //#endregion

    //#region Protected Mehtods
    protected setIndex(reqQuery: any) {
        let reqIndex : any = reqQuery.index;

        if (reqIndex === null || reqIndex == 0) {
            this.index = 0;
        } else if (typeof reqIndex === 'string' && Number(reqIndex) > 0) {
            this.index = Number(reqIndex) * 10;
        }
    }

    protected subGetAll(reqQuery: any): void {
        if (typeof reqQuery.userId !== 'undefined') {
            this.userId = reqQuery.userId;

            if (requiredNumberIsNull(this.userId)) {
                this.errors.push(`${this.userIdField} ${errorsObject.requiredError}`);
            } else {
                this.userId = Number(this.userId);
            }
        }

        if (typeof reqQuery.startDate !== 'undefined') {
            if (!isValidDate(reqQuery.startDate)) {
                this.errors.push(`${this.startDateField}${errorsObject.dateMessage}`);
            } else {
                this.startDate = new Date(reqQuery.startDate);
            }
        }

        if (typeof reqQuery.endDate !== 'undefined') {
            if (!isValidDate(reqQuery.endDate)) {
                this.errors.push(`${this.endDateField}${errorsObject.dateMessage}`);
            } else {
                this.endDate = new Date(reqQuery.endDate);
            }
        }

        if (typeof reqQuery.isEdited !== 'undefined') {
            if (typeof reqQuery.isEdited === 'string' && (String(reqQuery.isEdited).toLowerCase() === 'true' || String(reqQuery.isEdited ).toLowerCase() === 'false')) {
                this.isEdited = reqQuery.isEdited === 'true';
            } else {
                this.errors.push(`${this.isEditedField}${errorsObject.notBooleanMessage}`);
            }
        }

        if (typeof reqQuery.index !== 'undefined') {
            if (isNaN(reqQuery.index)) {
                this.errors.push(`${this.indexField}${errorsObject.notNumberMessage}`);
            } else {
                this.setIndex(reqQuery);
            }
        } else {
            this.index = 0;
        }
    }

    protected validateBoolean(value: any, canBeNull: boolean = false): boolean | null {
        if (typeof value === 'boolean') {
            return value;
        } else if (typeof value === 'string') {
            let stringValue: string = String(value).toLowerCase();
            if (stringValue === 'true' || stringValue === 'false') {
                return stringValue === 'true';
            } else {
                this.errors.push(booleanValuesObject.stringError);
            }
        } else if (typeof value === 'number') {
            let numberValue: number = Number(value);
            if (numberValue === 0 || numberValue === 1) {
                return numberValue === 1;
            } else {
                this.errors.push(booleanValuesObject.numberError);
            }
        } else if (value === null) {
            if (!canBeNull) {
                this.errors.push(errorsObject.cannotBeNullMessage);
            }

            return value;
        } else {
            this.errors.push(`${typeof value}${booleanValuesObject.notAcceptedMessage}`);
        }

        return null;
    }
    //#endregion
}