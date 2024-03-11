import { newFileName } from "../helpers/fileHelper";
import { requiredIsNull, valueExceedsLength } from "../helpers/modelHelper";
import { maxLenghValue, maxLengthsObject, notBooleanValue, picturesValuesObject, requiredValue } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Picture extends ModelHelper {
    //#region Public Properties
    public picturePath: string | undefined | null;
    public captionText: string | undefined | null;
    public profilePicture: boolean | undefined | null;
    public coverPicture: boolean | undefined | null;
    //#endregion

    //#region Private Fields
    private readonly picturePathField: string;
    private readonly captionTextField: string;
    private readonly profilePictureField: string;
    private readonly coverPictureField: string;
    //#endregion

    //#region Constructors
    constructor() {
        super();

        this.picturePathField = picturesValuesObject.picturePathField;
        this.captionTextField = picturesValuesObject.captionTextField;
        this.profilePictureField = picturesValuesObject.profilePictureField;
        this.coverPictureField = picturesValuesObject.coverPictureField;
    }

    public create(reqBody: any): void {
        this.captionText = reqBody.captionText;
        this.profilePicture = reqBody.profilePicture;
        this.coverPicture = reqBody.coverPicture;

        this.validateCaptionText();
    }

    public newFile(filePath: string, captionText: string): void {
        this.picturePath = filePath;
        this.captionText = captionText;
        this.validateCaptionText();
    }

    public setData(data: any): void {
        this.pictureId = data.picture_id;
        this.setCreateDate(data.create_date)
        this.captionText = data.caption_text;
        this.picturePath = data.picture_path;
        this.profilePicture = Boolean(data.profile_picture);
        this.coverPicture = Boolean(data.cover_picture);
        this.updateDate = data.update_date;
        this.likeCount = data.like_count;
        this.liked = Boolean(data.liked);
        this.isEdited = this.updateDate === null;
        this.setCreateDateString();
    }
    //#endregion

    //#region Private Methods
    private validateCaptionText() {
        if (requiredIsNull(this.captionText)) {
            this.errors.push(requiredValue(this.captionTextField));
        }

        if (typeof this.captionText === 'string' && valueExceedsLength(this.captionText, maxLengthsObject.defaultStringMaxLength)) {
            this.errors.push(maxLenghValue(this.captionTextField, maxLengthsObject.defaultStringMaxLength));
        }
    }
    //#endregion
}