import pictureModel from "./pictureModel";

export default interface tweetModel {
    tweetId: number;
    tweetText: string;
    dateCreated: string;
    isEdted: boolean;
    userId: number;
    userDisplayName: string;
    likeCount: number;
    liked: boolean;
    commentCount: number;
    files: Array<pictureModel> | null;
    status: string;
}