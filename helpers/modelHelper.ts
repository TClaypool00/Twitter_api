import Comment from "../models/Comment";
import Role from "../models/Role";
import Tweet from "../models/Tweet";
import User from "../models/User";
import tweetModel from "../models/interfaces/tweetModel";
import pictureModel from "../models/interfaces/pictureModel";
import Picture from "../models/Picture";
import { getTweetPictureURL } from "./fileHelper";
import commentModel from "../models/interfaces/commentModel";

export function requiredIsNull(value : string | undefined | null) : boolean {
    return value === null || value === undefined || value === '';
}

export function requiredNumberIsNull(value: number | undefined | null) : boolean {
    return value === null || value === undefined;
}

export function valueExceedsLength(value: string, length: number) : boolean {
    return value.length > length;
}

export function userObject(user: User, token: string = '', refreshToken: string = '') : any {
    return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNum: user.phoneNumber,
        token: token,
        refreshToken: refreshToken
    }
}

export function tweetObject(tweet: Tweet, status: string = ''): tweetModel {
    let model: tweetModel = {
        tweetId: tweet.tweetId as number,
        tweetText: tweet.tweetText as string,
        dateCreated: tweet.createDateString,
        isEdted: tweet.isEdited as boolean,
        userId: tweet.userId as number,
        userDisplayName: tweet.userDisplayName,
        likeCount: tweet.likeCount,
        liked: tweet.liked,
        commentCount: tweet.commentCount,
        status: status,
        files: null,
        comments: null
    }

    if (tweet.pictures !== null && tweet.pictures.length > 0) {
        model.files = new Array<pictureModel>();

        tweet.pictures.forEach(item => {
            model.files!.push(pictureObject(item, model.tweetId, model.userId));
        })
    }

    if (tweet.comments != null && tweet.comments.length > 0) {
        model.comments = new Array<commentModel>();

        tweet.comments.forEach(item => {
            model.comments!.push(commentObject(item))
        })
    }

    return model;
}

export function commentObject(comment: Comment, status: string = '') : commentModel {
    return {
        commentId: Number(comment.commentId),
        commentText: comment.commentText as string,
        createDate: comment.createDateString,
        isEdited: comment.isEdited as boolean,
        tweetId: comment.tweetId as number | null,
        userId: comment.userId as number,
        username: comment.userDisplayName,
        likeCount: comment.likeCount,
        liked: comment.liked,
        status: status
    };
}

export function commentObjectWithCommentCount(comments: any, commentCount: number) {
    return {
        comments: comments,
        commentCount: commentCount
    };
}

export function roleObject(role: Role, status: string = '') {
    return {
        roleId: role.roleId,
        rolName: role.roleName,
        roleDescription: role.description,
        createdDate: role.createDateString,
        isEdited: role.isEdited,
        status: status
    }
}

export function pictureObject(picture: Picture, tweetId: number | null = null, userId: number, status: string = ''): pictureModel {
    return {
        pictureId: picture.pictureId as number,
        pictureUrl: getTweetPictureURL(userId, String(picture.picturePath), tweetId),
        captionText: picture.captionText as string,
        isCoverPicture : picture.coverPicture as boolean,
        isProfilePicture: picture.profilePicture as boolean,
        likeCount: picture.likeCount,
        liked: picture.liked,
        createDate: picture.createDateString,
        isEdited: picture.isEdited as boolean,
        tweetId: tweetId,
        userId: userId,
        status: status
    }
}