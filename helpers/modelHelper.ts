import Comment from "../models/Comment";
import Tweet from "../models/Tweet";
import User from "../models/User";

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

export function tweetObject(tweet: Tweet, status: string = '') {
    return {
        tweetId: Number(tweet.tweetId),
        tweetText: tweet.tweetText,
        datePublished: tweet.datePublishedString,
        isEdited: tweet.isEdited,
        userId: tweet.userId,
        userDisplay: tweet.userDisplayName,
        likeCount: tweet.likeCount,
        liked: tweet.liked,
        commentCount: tweet.commentCount,
        status: status
    }
}

export function commentObject(comment: Comment, status: string = '') {
    return {
        commentId: Number(comment.commentId),
        commentText: comment.commentText,
        createDate: comment.createDateString,
        isEdited: comment.isEdited,
        tweetId: comment.tweetId,
        userId: comment.userId,
        userDisplayName: comment.userDisplayName,
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