import mysql from 'mysql2';
require('dotenv').config();

export default function connect() {
    let connection = mysql.createPool({
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER_NAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DATABASE
    }).promise();

    return connection;
}