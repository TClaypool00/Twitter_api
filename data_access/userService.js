const database = require('../database/database.js');
const connection = database.connect();

module.exports.insertUser = (user) => {
    connection.query('call insert_user(?, ?, ?, ?, ?, ?)', [user.userName, user.firstName, user.lastName, user.email, user.passowrd, user.phoneNumber], (error, results, fields) => {
        if (error) {
            throw error;
        }
    });
}