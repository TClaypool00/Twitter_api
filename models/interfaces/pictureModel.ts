export default interface pictureModel {
    pictureId: number;
    captionText: string;
    pictureUrl: string;
    isProfilePicture: boolean;
    isCoverPicture: boolean;
    tweetId: number | null;
    createDate: string;
    isEdited: boolean;
    userId: number;
    liked: boolean;
    likeCount: number;
    status: string;
}