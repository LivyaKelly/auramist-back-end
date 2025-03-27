import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'a852ee9104d40500d96f001ccece478e8eebf39b7dcf9b5c1ff76e9cc2212e0b0d91f3f711c50c3a2dbdc729772748355c13eedc4e13630944e43d953438af3e';


export async function register(req, res) {
    try {
        const { name, email, password, phone, role, hasCompletedService } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
        }


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
                phone: phone || null,
                role: role || 'CLIENT',
                hasCompletedService: hasCompletedService !== undefined ? hasCompletedService : false,
            },
        });


        const token = jwt.sign(
            { id: user.id, role: user.role }, // troque userId por id
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          

        return res.status(201).json({
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
        console.error('Erro no registro:', error);
        return res.status(500).json({ message: 'Erro no registro.', error: error.message });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }


        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

        return res.status(200).json({
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
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro no login.', error: error.message });
    }
}
