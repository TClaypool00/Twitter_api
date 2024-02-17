import { requiredNumberIsNull } from "../helpers/modelHelper";
import { requiredValue, likeValuesObject } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Like extends ModelHelper {
    //#region Public Properties
    public likeId: number | undefined | null;
    //#endregion

    //#region Private Fields
    protected readonly likeIdField: string;
    //#endregion

    //#region Constructotrs
    constructor() {
        super();

        this.likeIdField = likeValuesObject.likeIdField;
    }
    //#endregion

    //#region Public Methods
    public createTweetLike(reqBody: any): void {
        this.userId = reqBody.userId;
        this.tweetId = reqBody.tweetId;

        this.userIdIsNull();
        this.tweetIdIsNull();
    }

    public createCommentLike(reqBody: any): void {
        this.userId = reqBody.userId;
        this.commentId = reqBody.commentId;

        this.userIdIsNull();
        this.commentIdIsNull();
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