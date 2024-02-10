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