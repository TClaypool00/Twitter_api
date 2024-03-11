import pictureModel from "./pictureModel";
import commentModel from './commentModel';

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
    comments: Array<commentModel> | null;
    status: string;
}