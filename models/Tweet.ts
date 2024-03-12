import { fileNames } from "../helpers/fileHelper";
import { requiredIsNull, requiredNumberIsNull, valueExceedsLength } from "../helpers/modelHelper";
import { errorsObject, maxLenghValue, maxLengthsObject, requiredValue, tweetValuesObject } from "../helpers/valuesHelper";
import Comment from "./Comment";
import ModelHelper from "./ModelHelper";
import Picture from "./Picture";

export default class Tweet extends ModelHelper {
    //#region  Private Fields
    private readonly tweetTextField: string;
    private readonly includePicturesField: string;
    //#endregion

    //#region Public Properites
    public tweetText: string | undefined | null;
    public commentCount: number;
    public pictures: Array<Picture> | null;
    public picturePathStrings: string;
    public captionTextStrings: string;
    public includePictures: boolean | undefined | null;
    public comments: Array<Comment> | null;
    //#endregion

    //#region  Constructors
    

    constructor() {
        super();

        this.tweetTextField = tweetValuesObject.tweetTextField;
        this.includePicturesField = tweetValuesObject.includePicturesField;

        this.tweetText = null;
        this.comments = null;
        this.commentCount = 0;
        this.pictures = null;
        this.picturePathStrings = '';
        this.captionTextStrings = '';
    }
    //#endregion

    //#region  Public Methods
    public create(reqBody: any) : void {
        this.tweetText = reqBody.tweetText;
        this.userId = reqBody.userId;
        this.isEdited = false;

        this.validateCreateData();
        this.validateUserId();

        if (fileNames !== null) {
            this.pictures = new Array<Picture>();

            for (let i = 0; i < fileNames.length; i++) {
                const name = fileNames[i];
                let picture = new Picture();
                picture.newFile(name, reqBody.captionTexts[i]);

                this.captionTextStrings += picture.captionText;
                this.picturePathStrings += picture.picturePath;

                if (i !== fileNames.length - 1) {
                    this.captionTextStrings += ', ';
                    this.picturePathStrings += ', ';
                }
                
                this.pictures.push(picture);
            }
        }
    }

    public update(req: any): void {
        this.validateTweetId(req);

        this.create(req.body);
    }

    public validateTweetId(req: any) : void {
        this.tweetId = req.params.id;
        this.includeComments = req.query.includeComments;
        this.includePictures = req.query.includePictures;

        this.includePictures = this.validateBoolean(this.includePictures, true);
        this.includeComments = this.validateBoolean(this.includeComments, true);

        if (requiredNumberIsNull(this.tweetId)) {
            this.errors.push(errorsObject.idGreaterThanZeroMessage);
        } else {
            this.tweetId = Number(this.tweetId);
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
        let tweetData: any = data[0][0];
        let pictrueData: any = data[1];
        let commentData: any = data[2];

        this.tweetId = tweetData.tweet_id;
        this.tweetText = tweetData.tweet_text;
        this.createDate = new Date(String(tweetData.create_date));
        this.createDateString = this.createDate.toLocaleDateString();
        this.updateDate = tweetData.update_date;
        this.isEdited = this.updateDate !== null;
        this.userId = tweetData.user_id;
        this.userFirstName = tweetData.first_name;
        this.userLastName = tweetData.last_name;
        this.setDisplayName();
        this.likeCount = tweetData.like_count;
        this.liked = Boolean(tweetData.liked);

        if (this.updateDate === null) {
            this.datePublishedString = this.createDateString;
        } else {
            this.updateDate = new Date(String(tweetData.update_date));
            this.updateDateString = this.updateDate.toLocaleDateString();
            this.datePublishedString = this.updateDateString;
        }

        this.commentCount = tweetData.comment_count;

        if (pictrueData) {
            if (this.pictures === null) {
                this.pictures = new Array<Picture>();
            }

            for (let i = 0; i < pictrueData.length; i++) {
                const pictureElement = pictrueData[i];
                if (typeof this.pictures[i] !== 'undefined') {
                    this.pictures![i].pictureId = pictureElement.picture_id;
                    this.pictures![i].createDate = pictureElement.create_date;
                    // this.pictures![i].setCreateDate();
                } else {
                    let newPicture: Picture = new Picture();
                    newPicture.setData(pictureElement);
                    this.pictures.push(newPicture);
                }
            }
        }

        if (commentData) {
            if (this.comments === null) {
                this.comments = new Array<Comment>();
            }

            for (let i = 0; i < commentData.length; i++) {
                const commentElement = commentData[i];
                let newComment = new Comment();
                newComment.setData(commentElement);
                this.comments.push(newComment);
            }
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