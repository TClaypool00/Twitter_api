import connect from "../database/database";
import { getJSONObject } from "../helpers/jsonHelper";
import { currentUser } from "../helpers/jwtHelper";
import { generateGetAllSql, getAllSql, getallParams } from "../helpers/serviceHelper";
import { commentValuesObject, maxLengthsObject } from "../helpers/valuesHelper";
import Comment from "../models/Comment";
import Like from "../models/Like";
import ModelHelper from "../models/ModelHelper";

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

export async function commentExists(commentId: number, userId: number | null = null) : Promise<Boolean> {
    let [exists] = await connection.query('call comment_exists(?, ?)', [commentId, userId]);
    let jsonObject = getJSONObject(exists);
    jsonObject = jsonObject[0][0];

    return Boolean(jsonObject.comment_exists);
}

export async function getComment(comment:Comment) : Promise<Comment> {
    let [dataComment] = await connection.query('call get_comment_by_id(?, ?)', [comment.commentId, currentUser.userId]);
    let jsonObject = getJSONObject(dataComment);
    jsonObject = jsonObject[0][0];

    comment.setData(jsonObject);

    return comment;
}

export async function deleteComment(comment:Comment): Promise<Boolean> {
    let [deletedComment] = await connection.query(`call delete_comment(?)`, [comment.commentId]);
    let jsonObject = getJSONObject(deletedComment);

    return Number(jsonObject.affectedRows) > 0;
}

export async function getComments(comment:Comment, limitValue: number) : Promise<Array<Comment>> {
    //TODO: Add Start and End date logoic to query
    let comments = new Array<Comment>;
    generateGetAllSql(comment, 'vw_comments', commentValuesObject.likedSql, maxLengthsObject.standardTakeValue, 'comment_text');
    
    let [dataComments] = await connection.query(getAllSql, getallParams);
    let jsonObject = getJSONObject(dataComments);

    if (jsonObject.length > 0) {
        for (let i = 0; i < jsonObject.length; i++) {
            const data = jsonObject[i];
            let dataComment = new Comment();
            dataComment.setData(data);
            comments.push(dataComment);
        }
    }

    return comments;
}

export async function getCommentCountByTweetId(tweetId: number): Promise<number> {
    let [count] = await connection.query('call get_comment_count_by_tweet_id(?)', [tweetId]);
    let jsonObject = getJSONObject(count);
    jsonObject = jsonObject[0][0];

    return Number(jsonObject.comment_count);
}