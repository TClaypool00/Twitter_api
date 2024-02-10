import { requiredIsNull } from "../helpers/modelHelper";
import { commentValuesObject, requiredValue } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Comment extends ModelHelper {
    //#region Private Fields
    private readonly commentIdField: string;
    private readonly commentTextField: string;
    //#endregion

    //#region Public Properites
    public commentId: number | undefined | null;
    public commentText: string | undefined | null;
    //#endregion

    //#region Constructors
    constructor() {
        super();
        this.commentIdField = commentValuesObject.commentIdField;
        this.commentTextField = commentValuesObject.commentTextField;

        this.commentId = null;
        this.commentText = null;
    }
    //#endregion

    //#region Public Methods
    public create(reqBody: any): void {
        this.commentText = reqBody.commentText;
        this.userId = reqBody.userId;
        this.tweetId = reqBody.tweetId;
        this.isEdited = false;

        if (requiredIsNull(this.commentText)) {
            this.errors.push(requiredValue(this.commentTextField));
        } else {
            this.commentText = String(this.commentText);
        }

        this.userIdIsNull();
        this.tweetIdIsNull();
    }

    public setCreateData(data: any) : void {
        this.commentId = data.comment_id;
        this.createDate = new Date(data.create_date);
        this.setCreateDate();
    }
    //#endregion
}