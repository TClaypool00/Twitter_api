import { requiredNumberIsNull } from "../helpers/modelHelper";
import { globalValuesObject, requiredValue } from "../helpers/valuesHelper";
import { userValuesObject, tweetValuesObject } from "../helpers/valuesHelper";

export default abstract class ModelHelper {
   //#region Public Properites
    public index: number | null;
    public userId: number | undefined | null;
    public tweetId: number | undefined | null;
    public errors: [string] = [''];
    public likeCount: number;
    public liked: boolean;

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
    //#endregion

    //#region Constructors
    constructor() {
        this.indexField = globalValuesObject.indexField;
        this.userIdField = userValuesObject.userIdField;
        this.tweetIdField = tweetValuesObject.tweetIdField;
        this.startDateField = tweetValuesObject.startDateField;
        this.endDateField = tweetValuesObject.endDateField;
        this.isEditedField = tweetValuesObject.isEditedField;

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
    //#endregion
}