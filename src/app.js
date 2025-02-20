import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './Middlewares/logger.js'; 
import verifyToken from './Middlewares/verifyToken.js'; 
import authRoutes from './router/auth.js'; 
import userRoutes from './router/users.js'; 
import serviceRoutes from './router/serviceRoutes.js';

dotenv.config(); 

const app = express();

app.use(express.json()); 
app.use(cors()); 
app.use(logger); 

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', serviceRoutes);

// rota protegida pelo verifyToken
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Acesso autorizado para o usuário ${req.userId}, função: ${req.userRole}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
