import express from 'express';
import verifyToken from '../Middlewares/verifyToken.js'; // Proteção de rota

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Listagem de usuários protegida' });
});

export default router;
