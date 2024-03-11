import express from 'express';
import { authenticateToken, currentUser, validateUserId } from '../helpers/jwtHelper';
import Tweet from '../models/Tweet';
import { getStatus } from '../helpers/globalFunctions';
import { errorsObject, jwtValuesObject, maxLengthsObject, tweetValuesObject, userValuesObject } from '../helpers/valuesHelper';
import { deleteTweet, getTweetById, getTweets, insertTweet, tweetExists, updateTweet } from '../data_access/tweetService';
import { tweetObject } from '../helpers/modelHelper';
import multer from 'multer';
import { deleteTweetFolder, fileNames, storageObject, updateTweetFolder } from '../helpers/fileHelper';
import { isAdmin } from '../helpers/rolesHelper';

const upload = multer({
    storage: storageObject
});
const router = express.Router();

router.post('/', authenticateToken, upload.array('files'), async (req, resp) => {
    try {
        let tweet = new Tweet();
        tweet.create(req.body); 
        if (typeof tweet.userId === 'number') {
            if (tweet.errors.length > 0) {
                deleteTweetFolder(tweet.userId);
    
                resp.status(400)
                .json(getStatus(tweet.errors));
    
                return;
            }
    
            tweet = await insertTweet(tweet);
            tweet.setUserName(currentUser.userId, currentUser.firstName, currentUser.lastName);

            updateTweetFolder(Number(tweet.userId), Number(tweet.tweetId));
    
            if (typeof tweet.tweetId === 'number' && tweet.tweetId > 0) {
                resp.status(200)
                .json(tweetObject(tweet, tweetValuesObject.createdOKMessage));
            } else {
                deleteTweetFolder(Number(tweet.userId), tweet.tweetId)

                throw tweetValuesObject.created500ErrorMessage;
            }

            resp.status(200)
            .send();
        } else {
            deleteTweetFolder(Number(tweet.userId), tweet.tweetId)
            resp.status(400)
            .json(getStatus(`${userValuesObject.userIdField} ${errorsObject.notNumberMessage}`))
        }
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

//Business Logic: PUT route does not update pictures just the tweet itself
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
    let tweet = new Tweet();
        tweet.validateTweetId(req);
        if (isAdmin()) {
            tweet.userId = null;
        } else {
            tweet.userId = currentUser.userId;
        }

        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(getStatus(tweet.errors));

            return;
        }

        if (!await tweetExists(Number(tweet.tweetId), tweet.userId)) {
            resp.status(404)
            .json(getStatus(tweetValuesObject.tweetNotFoundMessage));

            return;
        }

        tweet = await getTweetById(tweet);

        resp.status(200)
        .json(tweetObject(tweet));
});

//TODO: sort by by like count
//TODO: sort by liked
//TODO: add include comments
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

        if (isAdmin()) {
            tweet.userId = null;
        } else {
            tweet.userId = currentUser.userId;
        }

        tweet.validateTweetId(req);
        tweet.validateUserId(!isAdmin());

        if (tweet.errors.length > 0) {
            resp.status(400)
            .json(tweet.errors);
        }

        if (!await tweetExists(Number(tweet.tweetId), tweet.userId)) {
            resp.status(400)
            .json(getStatus(tweetValuesObject.tweetNotFoundMessage));

            return;
        }

        try {
            deleteTweetFolder(Number(tweet.userId), tweet.tweetId)
        } catch(error: any) {
            throw error;
        }

        if (await deleteTweet(Number(tweet.tweetId)) > 0) {
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