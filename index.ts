require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
//Routes
import userRoutes from './routes/userRoutes';
const app = express();
const port = process.env.DEV_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Using routes
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});