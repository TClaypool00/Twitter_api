import { requiredNumberIsNull } from "../helpers/modelHelper";
import { globalValuesObject, requiredValue } from "../helpers/valuesHelper";
import { userValuesObject, tweetValuesObject } from "../helpers/valuesHelper";

export default abstract class ModelHelper {
   //#region Public Properites
    public index: number | null;
    public userId: number | undefined | null;
    public tweetId: number | undefined | null;
    public errors: [string] = [''];
   //#endregion

    //#region Protected Fields
    protected indexField: string
    protected userIdField: string;
    protected tweetIdField: string;
    //#endregion

    //#region Constructors
    constructor() {
        this.indexField = globalValuesObject.indexField;
        this.userIdField = userValuesObject.userIdField;
        this.tweetIdField = tweetValuesObject.tweetIdField;

        this.index = null;
        this.tweetId = null;
        this.userId = null;
        this.userIdField = '';
        this.tweetIdField = '';
        this.errors = [''];
        this.errors.splice(0, 1);
    }
    //#endregion

    //#region Public Methods
    //#region User Methods
    public userIdIsNull() {
        if (requiredNumberIsNull(this.userId)) {
            this.errors.push(requiredValue(this.userIdField));
        }
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