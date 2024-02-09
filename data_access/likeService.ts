import connect from "../database/database";
import { getJSONObject } from "../helpers/jsonHelper";
import Like from "../models/Like";

const connection = connect();

export async function insertLike(like: Like) : Promise<Boolean> {
    let [newLike] = await connection.query('call insert_tweet_like(?, ?)', [like.userId, like.tweetId]);
    let jsonObject = getJSONObject(newLike);

    return Number(jsonObject.affectedRows) === 1;
}

export async function tweetLikeExists(like: Like) : Promise<Boolean> {
    let [exists] = await connection.query('call tweet_like_exists(?, ?)', [like.userId, like.tweetId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.like_exists);
}