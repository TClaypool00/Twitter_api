import express from 'express';
import { authenticateToken, currentUser, validateUserId } from '../helpers/jwtHelper';

const router = express.Router();

router.post('/', authenticateToken, async(req, resp) => {
    
});

export default router;