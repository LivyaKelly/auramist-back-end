import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSeguro';


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '24h',});

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no registro.', error });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no login.', error });
  }
});

export default router;
