import connect from "../database/database";
import Tweet from '../models/Tweet';
import { getJSONObject } from '../helpers/jsonHelper';
const connection = connect();

export async function insertTweet(tweet: Tweet) : Promise<Tweet> {
    let [newTweet] = await connection.query('call insert_tweet(?, ?)', [tweet.tweetText, tweet.userId]);

    let jsonObject = getJSONObject(newTweet);
    jsonObject = jsonObject[0][0];

    tweet.tweetId = jsonObject.tweet_id;
    tweet.setDate(jsonObject.create_date);

    return tweet;
}

export async function updateTweet(tweet: Tweet) : Promise<Tweet> {
    let [updatedTweet] = await connection.query('call update_tweet(?, ?)', [tweet.tweetId, tweet.tweetText]);

    let jsonObject = getJSONObject(updatedTweet);
    jsonObject = jsonObject[0][0];

    tweet.setUpdate(jsonObject.update_date);

    return tweet;
}

export async function tweetExists(tweetId: number, userId: number) : Promise<Boolean> {
    let [exists] = await connection.query('call tweet_exists(?, ?)', [tweetId, userId]);

    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.tweet_exists);
}