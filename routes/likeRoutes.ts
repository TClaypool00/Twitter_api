import express from 'express';
import { authenticateToken, currentUser, validateUserId } from '../helpers/jwtHelper';
import { getStatus } from '../helpers/globalFunctions';
import Like from '../models/Like';
import { commentLikeExists, deleteLike, insertCommentLike, insertTweetLike, likeExists, tweetLikeExists } from '../data_access/likeService';
import { tweetExists } from '../data_access/tweetService';
import { commentValuesObject, jwtValuesObject, likeValuesObject, tweetValuesObject } from '../helpers/valuesHelper';
import { commentExists } from '../data_access/commentService';
const router = express.Router();

router.post('/tweetLike', authenticateToken, async (req, resp) => {
    try {
        let like = new Like();
        like.createTweetLike(req.body);

        if (like.errors.length > 0) {
            resp.status(400)
            .json(like.errors);

            return;
        }

        if (await tweetLikeExists(like)) {
            resp.status(400)
            .json(getStatus(likeValuesObject.alreadyExistMessage));

            return;
        }

        if (!await tweetExists(Number(like.tweetId))) {
            resp.status(404)
            .json(getStatus(tweetValuesObject.tweetNotFoundMessage));

            return;
        }

        if (!validateUserId(Number(like.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }
        
        if (await insertTweetLike(like)) {
            resp.status(200)
            .json(getStatus(likeValuesObject.createdOKMessage));

            return;
        } else {
            throw likeValuesObject.created500Message;
        }
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.post('/commentLike', authenticateToken, async (req, resp) => {
    try {
        let like = new Like();
        like.createCommentLike(req.body);

        if (like.errors.length > 0) {
            resp.status(400)
            .json(getStatus(like.errors));
        }

        if (await commentLikeExists(like)) {
            resp.status(400)
            .json(getStatus(likeValuesObject.alreadyExistMessage));

            return;
        }

        if (!await commentExists(Number(like.commentId))) {
            resp.status(404)
            .json(getStatus(commentValuesObject.doesNotExistMessage));

            return;
        }

        if (!validateUserId(Number(like.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        if (await insertCommentLike(like)) {
            resp.status(200)
            .json(getStatus(likeValuesObject.createdOKMessage));

            return;
        } else {
            throw likeValuesObject.created500Message;
        }
        
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.delete('/:id', authenticateToken, async (req, resp) => {
    try {
        let like = new Like();
        like.userId = currentUser.userId;
        like.setLikeId(req.params);
        
        like.validateLikeId();

        if (like.errors.length > 0) {
            resp.status(400)
            .json(getStatus(like.errors));

            return;
        }
        
        if (!validateUserId(Number(like.userId))) {
            resp.status(400)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        if (!await likeExists(like)) {
            resp.status(400)
            .json(getStatus(likeValuesObject.doesNotExistMessage));

            return;
        }

        if (await deleteLike(Number(like.likeId))) {
            resp.status(200)
            .json(getStatus(likeValuesObject.deletedOKMessage));
        } else {
            throw likeValuesObject.deleted500Message;
        }

    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

export default router;