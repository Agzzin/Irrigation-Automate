import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


interface TokenPayload {
  userId: number;
}

app.get(
  '/usuarios',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, nome: true, email: true },
      });
      res.json({ data: usuarios });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  }
);


app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ message: 'Faltam credenciais' });
      return;
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET não definido!');
      res.status(500).json({ message: 'Configuração inválida do servidor' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '2h' });

    res.json({
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    console.error('Erro interno no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

app.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        res
          .status(400)
          .json({ message: 'Nome, email e senha são obrigatórios' });
        return;
      }
      if (senha.length < 6) {
        res
          .status(400)
          .json({ message: 'Senha precisa ter no mínimo 6 caracteres' });
        return;
      }

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email },
      });
      if (usuarioExistente) {
        res.status(409).json({ message: 'E-mail já cadastrado' });
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuario.create({
        data: { nome, email, senha: senhaHash },
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        data: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
        },
      });
    } catch (error) {
      console.error('Erro interno no signup:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
);


const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
