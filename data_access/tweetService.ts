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

export async function tweetExists(tweetId: number, userId: number | null = null) : Promise<Boolean> {
    let [exists] = await connection.query('call tweet_exists(?, ?)', [tweetId, userId]);

    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.tweet_exists);
}

export async function getTweetById(tweet: Tweet) : Promise<Tweet> {
    let [dataTweet] = await connection.query('call get_tweet_by_id(?)', [tweet.tweetId]);
    let jsonObject = getJSONObject(dataTweet);
    jsonObject = jsonObject[0][0];

    tweet.setData(jsonObject);

    return tweet;
}

export async function getTweets(tweet:Tweet, limitValue: number) : Promise<Array<Tweet>> {
    //TODO: Add Start and End date logoic to query
    
    let tweets = new Array<Tweet>;

    let sql: string = '';
    let whereClause : string = '';
    let sqlParams : [any] = [''];
    sqlParams.splice(0, 1);

    sql = 'SELECT * FROM vw_tweet t';

    if (tweet.tweetText !== null) {
        whereClause += `t.tweet_text LIKE ?`;
        sqlParams.push(tweet.tweetText);
    }

    if (tweet.userId !== null) {
        if (whereClause !== '') {
            whereClause += ' AND ';
        }

        whereClause += `t.user_id = ?`;
        sqlParams.push(tweet.userId);
    }

    if (tweet.isEdited) {
        if (whereClause !== '') {
            whereClause += ' AND ';
        }

        whereClause += 't.update_date IS NOT NULL';
    }

    if (whereClause !== '') {
        sql += ' WHERE ';
        sql += whereClause;
    }

    sql += ` LIMIT ? OFFSET ?`;
    sqlParams.push(limitValue, tweet.index);
    
    let [dataTweets] = await connection.query(sql, sqlParams);
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

export async function deleteTweet(tweetId: number) : Promise<Number> {
    let [deletedTweet] = await connection.query('call delete_tweet(?)', [tweetId]);

    let jsonObject = getJSONObject(deletedTweet);
    
    return Number(jsonObject.affectedRows);
}