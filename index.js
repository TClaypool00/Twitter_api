require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.DEV_PORT;
const database = require('./database/database.js')

app.use(express.json());

database.connect();

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});