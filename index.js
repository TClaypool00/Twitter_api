require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.DEV_PORT;
app.use(express.json());

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});