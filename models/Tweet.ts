import { isValidDate } from "../helpers/globalFunctions";
import { requiredIsNull, requiredNumberIsNull, valueExceedsLength } from "../helpers/modelHelper";
import { errorsObject, maxLenghValue, maxLengthsObject, requiredValue, tweetValuesObject, userValuesObject } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Tweet extends ModelHelper {
    //#region  Private Fields
    private readonly tweetTextField: string;
    private readonly userIdField : string;
    private readonly startDateField: string;
    private readonly endDateField: string;
    private readonly isEditedField: string;
    //#endregion

    //#region Public Properites
    public tweetId: number | undefined | null;
    public tweetText: string | undefined | null;
    public createDate : Date | null;
    public createDateString: string;
    public updateDate: Date | null;
    public datePublished: Date | null;
    public datePublishedString: string;
    public updateDateString : string;
    public startDate: Date | null;
    public endDate: Date | null;
    public isEdited: boolean | null;
    public userId : number | undefined | null;
    public userFirstName: string;
    public userLastName: string;
    public userDisplayName: string;
    public errors: [string] = [''];
    //#endregion

    //#region  Constructors
    

    constructor() {
        super();

        this.tweetTextField = tweetValuesObject.tweetTextField;
        this.userIdField = userValuesObject.userIdField;
        this.startDateField = tweetValuesObject.startDateField;
        this.endDateField = tweetValuesObject.endDateField;
        this.isEditedField = tweetValuesObject.isEditedField;

        this.tweetText = null;
        this.userId = null;
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

        this.errors.splice(0, 1);
    }
    //#endregion

    //#region  Public Methods
    public create(reqBody: any) : void {
        this.tweetText = reqBody.tweetText;
        this.userId = reqBody.userId;
        this.isEdited = false;

        this.validateCreateData();
    }

    public update(req: any): void {
        this.validateTweetId(req);

        this.create(req.body);
    }

    public validateTweetId(req: any) : void {
        this.tweetId = req.params.id;

        if (requiredNumberIsNull(this.tweetId)) {
            this.errors.push(errorsObject.idGreaterThanZeroMessage);
        }
    }

    public getAll(reqQuery: any) {
        if (typeof reqQuery.tweetText !== 'undefined') {
            this.tweetText = `%${String(reqQuery.tweetText)}%`;

        }

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

    public setDate(date: any) : void {
        this.createDate = new Date(String(date));
        this.createDateString = this.createDate.toLocaleDateString();

        this.datePublished = this.createDate;
        this.datePublishedString = this.createDateString;
    }

    public setUpdate(date: any) : void {
        this.updateDate = new Date(String(date));
        this.updateDateString = this.createDate!.toLocaleDateString();
        this.isEdited = true;

        this.datePublished = this.updateDate;
        this.datePublishedString = this.updateDateString;
    }

    public setUserName(userId: number, firstName: string, lastName: string) {
        this.userId = userId;
        this.userFirstName = firstName;
        this.userLastName = lastName;
        this.setDisplayName();
    }

    public setData(data: any) {
        this.tweetId = data.tweet_id;
        this.tweetText = data.tweet_text;
        this.createDate = new Date(String(data.create_date));
        this.createDateString = this.createDate.toLocaleDateString();
        this.updateDate = data.update_date;
        this.isEdited = this.updateDate !== null;
        this.userId = data.user_id;
        this.userFirstName = data.first_name;
        this.userLastName = data.last_name;
        this.setDisplayName();

        if (this.updateDate === null) {
            this.datePublishedString = this.createDateString;
        } else {
            this.updateDate = new Date(String(data.update_date));
            this.updateDateString = this.updateDate.toLocaleDateString();
            this.datePublishedString = this.updateDateString;
        }

    }

    public setDisplayName(): void {
        this.userDisplayName = `${this.userFirstName} ${this.userLastName.charAt(0)}.`;
    }
    //#endregion

    private validateCreateData() {
        if (requiredIsNull(this.tweetText)) {
            this.errors.push(requiredValue(this.tweetTextField));
        }

        if (requiredNumberIsNull(this.userId)) {
            this.errors.push(requiredValue(this.userIdField));
        }

        if (typeof this.tweetText === 'string' && valueExceedsLength(this.tweetText, maxLengthsObject.defaultStringMaxLength)) {
            this.errors.push(maxLenghValue(this.tweetTextField, errorsObject.maxLengthError));
        }
    }
}