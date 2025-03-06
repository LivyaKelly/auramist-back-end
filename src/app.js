import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './middlewares/logger.js'; 
import verifyToken from './middlewares/verifyToken.js'; 
import authRoutes from './routes/auth.js'; 
import userRoutes from './routes/usersRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import reviewRoutes from './routes/reviewRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config(); 

const app = express();

app.use(express.json()); 
app.use(cors({ 
  origin: 'http://localhost:3000',  
  credentials: true                 
}));
app.use(cookieParser());           
app.use(logger);  


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);


app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Acesso autorizado para o usuário ${req.userId}, função: ${req.userRole}` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
