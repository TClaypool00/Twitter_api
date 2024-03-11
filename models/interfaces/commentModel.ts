export default interface commentModel {
    commentId: number;
    commentText: string;
    isEdited: boolean;
    userId: number;
    username: string;
    tweetId: number | null;
    likeCount: number;
    createDate: string;
    liked: boolean;
    status: string;
}