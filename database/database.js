const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DEV_DB_HOST,
    user: process.env.DEV_DB_USER_NAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DATABASE
});



module.exports.connect = function connect() {
    connection.connect((err) => {
        if (err) {
            throw err;
        }
    });
}

module.exports.connection = connection;