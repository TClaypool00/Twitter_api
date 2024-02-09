import express from 'express';
import { authenticateToken } from '../helpers/jwtHelper';
import { getStatus } from '../helpers/globalFunctions';
import Like from '../models/Like';
import { insertLike, tweetLikeExists } from '../data_access/likeService';
import { likeValuesObject } from '../helpers/valuesHelper';

const router = express.Router();

router.post('/tweetLike', authenticateToken, async (req, resp) => {
    try {
        let like = new Like();
        like.create(req.body);

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
        
        if (await insertLike(like)) {
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
})

export default router;