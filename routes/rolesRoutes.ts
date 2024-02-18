import express from 'express';
import { authenticateAdminRole, authenticateToken } from '../helpers/jwtHelper';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdminRole, (req, resp) => {
    resp.status(200)
    .json('Here!');
});

export default router;