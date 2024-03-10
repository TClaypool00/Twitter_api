export default interface pictureModel {
    pictureId: number;
    captionText: string;
    pictureUrl: string;
    isProfilePicture: boolean;
    isCoverPicture: boolean;
    tweetId: number | null;
    userId: number;
    liked: boolean;
    likeCount: number;
    status: string;
}