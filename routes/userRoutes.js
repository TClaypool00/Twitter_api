const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const userService = require('../data_access/userService.js');
const functions = require('../helpers/globalFunctions.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', (req, resp) => {
    let user = new User(req.body);

    try{
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                throw err;
            }

            bcrypt.hash(user.passowrd, salt, (err, hash) => {

                if (err) {
                    throw err;
                }

                user.passowrd = hash;

                userService.insertUser(user);

                resp.send(functions.getStatus('user has been created'));
            });
        });
    } catch (ex) {
        functions.getStatus(ex);
    }
});

module.exports = router;