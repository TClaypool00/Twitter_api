import express from 'express';
import { getStatus } from '../helpers/globalFunctions';
import Comment from '../models/Comment';
import { authenticateToken, currentUser, validateUserId } from '../helpers/jwtHelper';
import { commentValuesObject, jwtValuesObject } from '../helpers/valuesHelper';
import { commentExists, insertComment, updateComment } from '../data_access/commentService';
import { commentObject } from '../helpers/modelHelper';

const router = express.Router();

router.post('/', authenticateToken, async (req, resp) => {
    try {
        let comment = new Comment();
        comment.create(req.body);

        if (comment.errors.length > 0) {
            resp.status(400)
            .json(getStatus(comment.errors));

            return;
        }

        if (!validateUserId(Number(comment.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        comment = await insertComment(comment);

        if (comment.commentId !== null) {
            comment.setUserNames(currentUser.userId, currentUser.firstName, currentUser.lastName);

            resp.status(200)
            .json(getStatus(commentObject(comment, commentValuesObject.createdOKMessage)));
        } else {
            throw commentValuesObject.created500Message;
        }

    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.put('/:id', authenticateToken, async (req, resp) => {
    try {
        let comment = new Comment();
        comment.update(req.body, req.params.id);

        if (comment.errors.length > 0) {
            resp.status(400)
            .json(getStatus(comment.errors));

            return;
        }

        if (!validateUserId(Number(comment.userId))) {
            resp.status(403)
            .json(getStatus(jwtValuesObject.unauthorizedMessage));

            return;
        }

        if (!await commentExists(comment)) {
            resp.status(400)
            .json(getStatus(commentValuesObject.doesNotExistMessage));

            return;
        }

        comment = await updateComment(comment);

        if (comment.updateDate !== null) {
            resp.status(200)
            .json(getStatus(commentValuesObject.updatedOKMessage));
        } else {
            throw commentValuesObject.updated500Message;
        }
    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

export default router;