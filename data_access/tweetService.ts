import connect from "../database/database";
import Tweet from '../models/Tweet';
import { getJSONObject } from '../helpers/jsonHelper';
import { maxLengthsObject, tweetValuesObject } from "../helpers/valuesHelper";
import { generateGetAllSql, getAllSql, getallParams } from "../helpers/serviceHelper";
const connection = connect();

export async function insertTweet(tweet: Tweet) : Promise<Tweet> {
    let [newTweet] = await connection.query('call insert_tweet(?, ?, ?, ?)', [tweet.tweetText, tweet.userId, tweet.picturePathStrings, tweet.captionTextStrings]);

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

export async function tweetExists(tweetId: number, userId: number | null = null) : Promise<Boolean> {
    let [exists] = await connection.query('call tweet_exists(?, ?)', [tweetId, userId]);

    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.tweet_exists);
}

export async function getTweetById(tweet: Tweet) : Promise<Tweet> {
    let [dataTweet] = await connection.query('call get_tweet_by_id(?, ?, ?, ?, ?)', [tweet.tweetId, tweet.userId, tweet.includePictures, tweet.includeComments, maxLengthsObject.subTakeValue]);
    let jsonObject = getJSONObject(dataTweet);

    tweet.setData(jsonObject);

    return tweet;
}

export async function getTweets(tweet:Tweet, limitValue: number) : Promise<Array<Tweet>> {
    //TODO: Add Start and End date logoic to query
    
    let tweets = new Array<Tweet>();
    generateGetAllSql(tweet, 'vw_tweets', tweetValuesObject.likedSql, limitValue, 'tweet_text');
    
    let [dataTweets] = await connection.query(getAllSql, getallParams);
    let jsonObject = getJSONObject(dataTweets);
    
    if (jsonObject.length > 0) {
        for (let i = 0; i < jsonObject.length; i++) {
            const data = jsonObject[i];
            let tweet = new Tweet();
            tweet.setData(data);

            tweets.push(tweet);
        }
    }

    return tweets;
}

export async function deleteTweet(tweetId: number) : Promise<number> {
    let [deletedTweet] = await connection.query('call delete_tweet(?)', [tweetId]);

    let jsonObject = getJSONObject(deletedTweet);
    
    return Number(jsonObject.affectedRows);
}