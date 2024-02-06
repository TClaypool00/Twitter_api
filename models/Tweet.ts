import { requiredIsNull, requiredNumberIsNull, valueExceedsLength } from "../helpers/modelHelper";
import { errorsObject, maxLenghValue, maxLengthsObject, requiredValue, tweetValuesObject, userValuesObject } from "../helpers/valuesHelper";

export default class Tweet {
    //#region  Private Fields
    private readonly tweetTextField: string;
    private readonly userIdField : string;
    //#endregion

    //#region Public Properites
    public tweetId: number | undefined | null;
    public tweetText: string | undefined | null;
    public createDate : Date;
    public createDateString: string;
    public updateDate: Date | null;
    public datePublished: Date | null;
    public datePublishedString: string;
    public updateDateString : string;
    public isEdited: boolean;
    public userId : number | undefined | null;
    public userFirstName: string;
    public userLastName: string;
    public userDisplayName: string;
    public errors: [string] = [''];
    //#endregion

    //#region  Constructors
    constructor() {
        this.tweetTextField = tweetValuesObject.tweetTextField;
        this.userIdField = userValuesObject.userIdField;
        this.userFirstName = '';
        this.userLastName = '';
        this.userDisplayName = '';
        this.createDateString = '';
        this.createDate = new Date();
        this.updateDate = null;
        this.updateDateString = '';
        this.isEdited = false;
        this.datePublished = null;
        this.datePublishedString = '';

        this.errors.splice(0, 1);
    }
    //#endregion

    //#region  Public Methods
    public create(reqBody: any) : void {
        this.tweetText = reqBody.tweetText;
        this.userId = reqBody.userId;

        this.validateCreateData();
    }

    public update(req: any): void {
        this.get(req);

        this.create(req.body);
    }

    public get(req: any) : void {
        this.tweetId = req.params.id;

        if (requiredNumberIsNull(this.tweetId)) {
            this.errors.push(errorsObject.idGreaterThanZeroMessage);
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
        this.updateDateString = this.createDate.toLocaleDateString();
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
        this.tweetText = data.tweet_text;
        this.createDate = new Date(String(data.create_date));
        this.createDateString = this.createDate.toLocaleDateString();
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