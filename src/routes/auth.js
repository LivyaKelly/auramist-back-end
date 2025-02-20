import express from 'express';
import { register, login } from '../controllers/authController.js'; // ou authController, conforme nome escolhido

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;