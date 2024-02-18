require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
//Routes
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';
import rolesRoutes from './routes/rolesRoutes';
import { routerValuesObject } from './helpers/valuesHelper';

const app = express();
const port = process.env.DEV_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Using routes
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/likes', likeRoutes);
app.use('/comments', commentRoutes);
app.use('/roles', rolesRoutes);

app.listen(port, () => {
    console.log(routerValuesObject.defaultMessage);
});