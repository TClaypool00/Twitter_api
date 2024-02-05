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
