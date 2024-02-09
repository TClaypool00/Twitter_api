import ModelHelper from "./ModelHelper";

export default class Like extends ModelHelper {
    //#region Constructotrs
    constructor() {
        super();
    }
    //#endregion

    //#region Public Methods
    public create(reqBody: any): void {
        this.userId = reqBody.userId;
        this.tweetId = reqBody.tweetId;

        this.userIdIsNull();
        this.tweetIdIsNull();
    }
    //#endregion
}