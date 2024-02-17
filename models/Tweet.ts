import { requiredIsNull, requiredNumberIsNull, valueExceedsLength } from "../helpers/modelHelper";
import { errorsObject, maxLenghValue, maxLengthsObject, requiredValue, tweetValuesObject } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Tweet extends ModelHelper {
    //#region  Private Fields
    private readonly tweetTextField: string;
    //#endregion

    //#region Public Properites
    public tweetText: string | undefined | null;
    //#endregion

    //#region  Constructors
    

    constructor() {
        super();

        this.tweetTextField = tweetValuesObject.tweetTextField;

        this.tweetText = null;
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
            this.search = `%${String(reqQuery.tweetText)}%`;
        }

        this.subGetAll(reqQuery);
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
        this.likeCount = data.like_count;
        this.liked = Boolean(data.liked);

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