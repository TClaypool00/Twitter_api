import connect from "../database/database";
import { getJSONObject } from "../helpers/jsonHelper";
import Comment from "../models/Comment";

const connection = connect();

export async function insertComment(comment: Comment) : Promise<Comment> {
    let [newComment] = await connection.query('call insert_comment(?, ?, ?);', [comment.commentText, comment.userId, comment.tweetId]);
    let jsonObject = getJSONObject(newComment);
    jsonObject = jsonObject[0][0];

    comment.setCreateData(jsonObject);

    return comment;
}

export async function updateComment(comment:Comment) : Promise<Comment> {
    let [updatedComent] = await connection.query('call update_comment(?, ?)', [comment.commentId, comment.commentText]);
    let jsonObject = getJSONObject(updatedComent);
    jsonObject = jsonObject[0][0];

    comment.setUpdateData(jsonObject);

    return comment;
}

export async function commentExists(comment:Comment) : Promise<Boolean> {
    let [exists] = await connection.query('call comment_exists(?, ?)', [comment.commentId, comment.userId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.comment_exists);
}