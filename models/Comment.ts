import { requiredIsNull, requiredNumberIsNull } from "../helpers/modelHelper";
import { commentValuesObject, notANumberValue, requiredValue } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Comment extends ModelHelper {
    //#region Private Fields
    private readonly commentTextField: string;
    //#endregion

    //#region Public Properites
    public commentText: string | undefined | null;
    //#endregion

    //#region Constructors
    constructor() {
        super();
        this.commentTextField = commentValuesObject.commentTextField;

        this.commentId = null;
        this.commentText = null;
    }
    //#endregion

    //#region Public Methods
    public create(reqBody: any, update: boolean = false): void {
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
        
        if (!update) {
            this.tweetIdIsNull();
        }
    }

    public update(reqBody: any, id: any) {
        this.setId(id);

        this.create(reqBody, true);
    }

    public getAll(reqQuery: any ) {
        //TODO: make all search by query "search"
        if (typeof reqQuery.commentText !== 'undefined') {
            this.search = `%${String(reqQuery.commentText)}%`;
        }

        if (typeof reqQuery.tweetId !== 'undefined') {
            if (isNaN(reqQuery.tweetId)) {
                this.errors.push(notANumberValue(this.tweetIdField));
            } else {
                this.tweetId = Number(reqQuery.tweetId);
            }
        }

        this.subGetAll(reqQuery);
    }

    public setCreateData(data: any) : void {
        this.commentId = data.comment_id;
        this.createDate = new Date(data.create_date);
        this.setCreateDate();
    }

    public setUpdateData(data: any): void {
        this.updateDate = new Date(String(data.update_date));
        this.isEdited = true;
    }

    public setId(id: any) {
        this.commentId = id;

        if (requiredNumberIsNull(this.commentId)) {
            this.errors.push(requiredValue(this.commentIdField));
        }

        if (isNaN(Number(this.commentId))) {
            this.errors.push(notANumberValue(this.commentIdField));
        }
    }

    public setData(data: any): void {
        this.commentId = Number(data.comment_id);
        this.commentText = data.comment_text;
        this.createDate = new Date(String(data.create_date));
        this.setCreateDate();
        if (data.update_date !== null) {
            this.updateDate = new Date(String(data.update_date));
        }
        
        this.tweetId = data.tweet_id;
        this.likeCount = data.like_count;
        this.liked = Boolean(data.liked);
        this.setUserNames(data.user_id, data.first_name, data.last_name);
        this.isEdited = this.updateDate !== null;
    }
    //#endregion
}