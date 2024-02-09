import { requiredNumberIsNull } from "../helpers/modelHelper";
import { likeValuesObject, requiredValue } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Like extends ModelHelper {
    //#region Public Properties
    public likeId: number | undefined | null;
    //#endregion

    //#region Private field
    private readonly likeIdField: string;
    //#endregion

    //#region Constructotrs
    constructor() {
        super();
        
        this.likeIdField = likeValuesObject.likeIdField;
    }
    //#endregion

    //#region Public Methods
    public create(reqBody: any): void {
        this.userId = reqBody.userId;
        this.tweetId = reqBody.tweetId;

        this.userIdIsNull();
        this.tweetIdIsNull();
    }

    public setLikeId(reqParams: any): void {
        this.likeId = reqParams.id;
    }

    public validateLikeId() {
        if (requiredNumberIsNull(this.likeId)) {
            this.errors.push(requiredValue(this.likeIdField));
        }
    }
    //#endregion
}