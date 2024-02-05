import express from 'express';
import { authenticateToken, currentUser, validateUserId } from '../helpers/jwtHelper';
import Tweet from '../models/Tweet';
import { getStatus } from '../helpers/globalFunctions';
import { jwtValuesObject, tweetValuesObject } from '../helpers/valuesHelper';
import { insertTweet } from '../data_access/tweetService';
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

        if (!validateUserId(Number(tweet.userId), currentUser.userId)) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        tweet = await insertTweet(tweet);
        tweet.setUserName(currentUser.userId, currentUser.firstName, currentUser.lastName);

        if (typeof tweet.tweetId === 'number' && tweet.tweetId > 0) {
            resp.status(200)
            .json(tweetObject(tweet));
        } else {
            throw tweetValuesObject.created500ErrorMessage;
        }
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

export default router;