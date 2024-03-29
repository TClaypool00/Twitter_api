import Comment from "../models/Comment";
import Role from "../models/Role";
import Tweet from "../models/Tweet";
import User from "../models/User";
import tweetModel from "../models/interfaces/tweetModel";
import pictureModel from "../models/interfaces/pictureModel";
import Picture from "../models/Picture";
import { getTweetPictureURL, getUserPictureURL } from "./fileHelper";
import commentModel from "../models/interfaces/commentModel";
import apiUserModel from "../models/interfaces/apiUserModel";
import mutliUserModel from "../models/interfaces/multiModels/multiUserModel";
import userModel from "../models/interfaces/userModel";

export function requiredIsNull(value : string | undefined | null) : boolean {
    return value === null || typeof value === 'undefined' || value === '';
}

export function requiredDateIsNull(value: any | undefined | null): boolean {
    return value === null ||  typeof value === 'undefined';
}

export function requiredNumberIsNull(value: number | undefined | null) : boolean {
    return value === null ||  typeof value === 'undefined';
}

export function valueExceedsLength(value: string, length: number) : boolean {
    return value.length > length;
}

export function apiUserObject(user: User, token: string = '', refreshToken: string = '') : apiUserModel {
    return {
        userId: user.userId as number,
        username: user.userName as string,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        email: user.email as string,
        phoneNumber: user.phoneNumber as string,
        token: token,
        refreshToken: refreshToken
    }
}

export function multiUserObject(user: User): mutliUserModel {
    return {
        userId: user.userId as number,
        username: user.userName as string,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        profilePictureURL: user.profilePictureURL
    }
}

export function userObject(user: User, status: string = '') : userModel {
    return {
        userId: user.userId as number,
        username: user.userName as string,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        email: user.email as string,
        phoneNumber: user.phoneNumber as string,
        createDate: user.createDate!.toLocaleDateString() as string,
        profileId: user.profileId as number,
        aboutMe: user.aboutMe as string,
        middleName: user.middleName as string,
        birthDate: user.birthDate?.toLocaleDateString() as string | null,
        genderId: user.genderId as number,
        genderName: user.genderName as string,
        pronoun1: user.pronoun1,
        pronoun2: user.pronoun2,
        coverPictureId: user.coverPictureId,
        coverPicturePath: getUserPictureURL(Number(user.userId), user.coverPicturePath),
        profilePictureId: user.profliePictureId,
        profilePictureURL: getUserPictureURL(Number(user.userId), user.profilePicturePath),
        status: status
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