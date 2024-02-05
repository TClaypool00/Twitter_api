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

        this.errors.splice(0, 1);
    }
    //#endregion

    //#region  Public Methods
    public create(respbody: any) : void {
        this.tweetText = respbody.tweetText;
        this.userId = respbody.userId;

        this.validateCreateData();

    }

    public setDate(date: any) : void {
        this.createDate = new Date(String(date));
        this.createDateString = this.createDate.toLocaleDateString();

    }

    public setUserName(userId: number, firstName: string, lastName: string) {
        this.userId = userId;
        this.userFirstName = firstName;
        this.userLastName = lastName;
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