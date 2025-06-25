import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

app.post('/login', (req, res) => { (async () => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).send('Faltam credenciais');
      }

      const user = await prisma.usuario.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).send('Credenciais inválidas');
      }

      const ok = await bcrypt.compare(senha, user.senha);
      if (!ok) {
        return res.status(401).send('Credenciais inválidas');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!, 
        { expiresIn: '2h' }
      );

      return res.json({
        token,
        usuario: { id: user.id, nome: user.nome, email: user.email },
      });
    } catch (err) {
      console.error('Erro interno no login:', err);
      return res.status(500).send('Erro interno no servidor');
    }
  })();
});

app.post('/signup', (req,res) => {(async () =>{
   try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso' });

  } catch (error) {
    console.error(error);          
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
})});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://192.168.1.10:${PORT}`);
});
