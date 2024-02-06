import Tweet from "../models/Tweet";
import { tweetValuesObject } from "./valuesHelper";

export function requiredIsNull(value : string | undefined | null) : boolean {
    return value === null || value === undefined || value === '';
}

export function requiredNumberIsNull(value: number | undefined | null) : boolean {
    return value === null || value === undefined || value <= 0;
}

export function valueExceedsLength(value: string, length: number) : boolean {
    return value.length > length;
}

export function userObject(user: any, token: string = '', refreshToken: string = '') : object {
    return {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNum: user.phone_number,
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
        status: status
    }
}