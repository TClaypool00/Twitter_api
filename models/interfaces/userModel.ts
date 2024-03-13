import mutliUserModel from "./multiModels/multiUserModel";

export default interface userModel extends mutliUserModel {
    email: string;
    phoneNumber: string;
    createDate: string;
    profileId: number;
    aboutMe: string | null;
    middleName: string | null;
    birthDate: string | null;
    genderId: number | null;
    genderName: string | null;
    pronoun1: string | null;
    pronoun2: string | null;
    coverPictureId: number | null;
    coverPicturePath: string | null;
    profilePictureId: number | null;
    status: string
}