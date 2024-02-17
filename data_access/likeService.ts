import connect from "../database/database";
import { getJSONObject } from "../helpers/jsonHelper";
import Like from "../models/Like";

const connection = connect();

export async function insertTweetLike(like: Like) : Promise<Boolean> {
    let [newLike] = await connection.query('call insert_tweet_like(?, ?)', [like.userId, like.tweetId]);
    let jsonObject = getJSONObject(newLike);

    return Number(jsonObject.affectedRows) === 1;
}

export async function insertCommentLike(like: Like) : Promise<Boolean> {
    let [newLike] = await connection.query('call insert_comment_like(?, ?)', [like.commentId, like.userId]);
    let jsonObject = getJSONObject(newLike);

    return Number(jsonObject.affectedRows) === 1;
}

export async function tweetLikeExists(like: Like) : Promise<Boolean> {
    let [exists] = await connection.query('call tweet_like_exists(?, ?)', [like.userId, like.tweetId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.like_exists);
}

export async function commentLikeExists(like:Like) : Promise<Boolean> {
    let [exists] = await connection.query('call comment_like_exists(?, ?)', [like.commentId, like.userId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.like_exists);
}

export async function likeExists(like: Like) : Promise<Boolean> {
    let [exists] = await connection.query('call like_exists(?, ?)', [like.likeId, like.userId]);

    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.like_exists);
}

export async function deleteLike(likeId: number) : Promise<Boolean> {
    let [deletedLike] = await connection.query('call delete_like(?)', [likeId]);
    let jsonObject = getJSONObject(deletedLike);

    return Number(jsonObject.affectedRows) === 1;
}