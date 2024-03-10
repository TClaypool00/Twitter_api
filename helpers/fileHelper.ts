import { v4 } from 'uuid';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileValuesObject, notANumberValue, requiredValue, tweetValuesObject, jwtValuesObject, userValuesObject } from './valuesHelper';
import { validateUserId } from '../helpers/jwtHelper';

var fileNames: Array<string> | null = null;
const filePath: string = `${process.env.DEV_FILE_PATH}`;
const urlFilePath: string = `${process.env.DEV_FILE_SERVER}`;

export function newFileName(file: Express.Multer.File): string {
    return `${path.parse(file.originalname).name}-${v4()}${path.extname(file.originalname)}`;
}

export function getTweetPath(userId: number, tweetId: number | null = null): string {
    let path: string = `${getUserFolder(userId)}tweet`;
    
    if (tweetId === null) {
        path += ' NEW';
    } else {
        path += `${tweetId}`;
    }

    path += '\\';

    return path;
}

export function getUserFolder(userId: number) {
    return `${filePath}\\user${userId}\\`;
}

export function getTweetPictureURL(userId: number, file: string, tweetId: number | null = null): string {
    let path: string =`${urlFilePath}user${userId}/`;

    if (tweetId !== null) {
        path += `tweet${tweetId}/`
    }

    path += `${file}`;

    return path;
}

const storageObject : multer.StorageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        let userId: number = req.body.userId;
        let path: string = '';
        let tweetId: number = req.body.tweetId;
        

        if (typeof tweetId === 'undefined') {
            if (req.method === 'PUT') {
                throw requiredValue(tweetValuesObject.tweetIdField);
            } else {
                tweetId = 0;
            }
        } else {
            if (isNaN(tweetId)) {
                throw notANumberValue(tweetValuesObject.tweetIdField);
            } else {
                tweetId = Number(tweetId);
            }
        }

        if (typeof userId === 'undefined') {
            throw requiredValue(userValuesObject.userIdField);
        } else {
            if (isNaN(userId)) {
                throw notANumberValue(userValuesObject.userIdField);
            } else {
                userId = Number(userId);
            }
        }

        if (!validateUserId(userId)) {
            throw jwtValuesObject.unauthorizedMessage;
        }

        if (!fs.existsSync(getUserFolder(userId))) {
            fs.mkdirSync(getUserFolder(userId));
        }

        path = `${getUserFolder(userId)}${fileValuesObject.tweetFolder}`;

        if (req.method === 'POST') {
            path += ' NEW';
        } else {
            path += `${tweetId}`;
        }

        if (!fs.pathExistsSync(path)) {
            if (req.method === 'POST') {
                fs.mkdirSync(path);
            } else {
                throw fileValuesObject.notFoundMessage;
            }
        } else {
            //TODO: Delete folder if it exists for POST
            // if (req.method === 'POST') {
            //     deleteTweetFolder(userId);
            // }
        }
        
        callback(null, path);
    },
    filename: (req: any, file: any, callback: any) => {
        let fileName: string = newFileName(file);
        if (fileNames === null) {
            fileNames = new Array<string>();
        }

        fileNames.push(fileName);

        callback(null, fileName);
    }
});

export function deleteTweetFolder(userId: number, tweetId: number | null = null): void {
    let tweetPath: string = getTweetPath(userId, tweetId);

    if (fs.pathExistsSync(tweetPath)) {
        fs.readdirSync(tweetPath).forEach((file) => {
            let filePath: string = `${tweetPath}\\${file}`;
            fs.unlinkSync(filePath);
        });

        fs.rmdirSync(tweetPath);
    } else {
        throw fileValuesObject.notFoundMessage;
    }
}

export function updateTweetFolder(userId: number, tweetId: number): void {
    fs.renameSync(getTweetPath(userId), getTweetPath(userId, tweetId));
}

export {
    storageObject,
    fileNames,
    filePath,
    urlFilePath
}