import express from 'express';
import { authenticateToken, currentUser, validateUserId } from '../helpers/jwtHelper';
import Tweet from '../models/Tweet';
import { getStatus } from '../helpers/globalFunctions';
import { jwtValuesObject, maxLenghValue, maxLengthsObject, tweetValuesObject } from '../helpers/valuesHelper';
import { deleteTweet, getTweetById, getTweets, insertTweet, tweetExists, updateTweet } from '../data_access/tweetService';
import { tweetObject } from '../helpers/modelHelper';
const router = express.Router();

router.post('/', authenticateToken, async (req, resp) => {
    try {
        let tweet = new Tweet();
        tweet.create(req.body); 
        
        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(getStatus(tweet.errors));

            return;
        }

        if (!validateUserId(Number(tweet.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        tweet = await insertTweet(tweet);
        tweet.setUserName(currentUser.userId, currentUser.firstName, currentUser.lastName);

        if (typeof tweet.tweetId === 'number' && tweet.tweetId > 0) {
            resp.status(200)
            .json(tweetObject(tweet, tweetValuesObject.createdOKMessage));
        } else {
            throw tweetValuesObject.created500ErrorMessage;
        }
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.put('/:id', authenticateToken, async (req, resp) => {
    try {
        let tweet = new Tweet();
        tweet.update(req);

        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(tweet.errors);

            return;
        }

        if (!await tweetExists(Number(tweet.tweetId), Number(tweet.userId))) {
            resp.status(400)
            .json(getStatus(tweetValuesObject.tweetNotFoundMessage));

            return;
        }

        if (!validateUserId(Number(tweet.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        tweet = await updateTweet(tweet);

        tweet.setUserName(currentUser.userId, currentUser.firstName, currentUser.lastName);

        resp.status(200)
        .json(tweetObject(tweet, tweetValuesObject.updatedOKMessage));
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.get('/:id', authenticateToken, async (req, resp) => {
    try {
        let tweet = new Tweet();
        tweet.validateTweetId(req);

        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(getStatus(tweet.errors));
        }

        if (!await tweetExists(Number(tweet.tweetId))) {
            resp.status(404)
            .json(getStatus(tweetValuesObject.tweetNotFoundMessage));

            return;
        }

        tweet = await getTweetById(tweet);

        resp.status(200)
        .json(tweetObject(tweet));

    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.get('/', authenticateToken, async (req, resp) => {
    try {
        let tweet : Tweet = new Tweet();
        tweet.getAll(req.query);

        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(getStatus(tweet.errors));

            return;
        }

        if (tweet.userId !== null && tweet.isEdited && !validateUserId(Number(tweet.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        let tweets : Array<Tweet> = await getTweets(tweet, maxLengthsObject.standardTakeValue);

        if (tweets.length === 0) {
            resp.status(404)
            .json(getStatus(tweetValuesObject.noTweetsMessage));

            return;
        }

        let jsonTweets : [any] = [''];
        jsonTweets.splice(0, 1);

        for (let i = 0; i < tweets.length; i++) {
            const tweet = tweets[i];
            jsonTweets.push(tweetObject(tweet));
        }

        resp.status(200)
        .json(getStatus(jsonTweets));
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.delete('/:id', authenticateToken, async (req, resp) => {
    try {
        let tweet = new Tweet();

        tweet.validateTweetId(req);

        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(tweet.errors);
        } 

        if (!await tweetExists(Number(tweet.tweetId), currentUser.userId)) {
            resp.status(400)
            .json(getStatus(tweetValuesObject.tweetNotFoundMessage));
        }

        if (await deleteTweet(Number(tweet.tweetId)) === 1) {
            resp.status(200)
            .json(getStatus(tweetValuesObject.deletedOKMessage));
        } else {
            throw tweetValuesObject.deleted500ErrorMessage;
        }
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

export default router;