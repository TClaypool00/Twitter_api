require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.DEV_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
const userRoutes = require('./routes/userRoutes.js');

//Using routes
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});