const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const userService = require('../data_access/userService.js');
const functions = require('../helpers/globalFunctions.js');

router.post('/', (req, resp) => {

    console.log(req.body);
    let user = new User(req.body);
    try{
        userService.insertUser(user);

        resp.send(functions.getStatus('user has been created'));
    } catch (ex) {
        functions.getStatus(ex);
    }
});

module.exports = router;