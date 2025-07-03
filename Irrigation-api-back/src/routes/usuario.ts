import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient'; 

interface TokenPayload {
  userId: number;
  tenantId: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  googleId?: string;
  facebookId?: string;
}

const router = Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, tenantId } = req.body;

    if (!nome || !email || !senha || !tenantId) {
      res.status(400).json({ message: 'Nome, email, senha e tenantId são obrigatórios' });
      return;
    }
    if (senha.length < 6) {
      res.status(400).json({ message: 'Senha precisa ter no mínimo 6 caracteres' });
      return;
    }

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      res.status(409).json({ message: 'E-mail já cadastrado' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      res.status(400).json({ message: 'Tenant não encontrado' });
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, tenantId },
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      data: { id: usuario.id, nome: usuario.nome, email: usuario.email, tenantId: usuario.tenantId },
    });
  } catch (error) {
    console.error('Erro interno no signup:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      res.status(400).json({ message: 'Faltam credenciais' });
      return;
    }

     const user = await prisma.usuario.findUnique({ where: { email } });
      if (!user || !user.senha || !(await bcrypt.compare(senha, user.senha))) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
  }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET não definido!');
      res.status(500).json({ message: 'Configuração inválida do servidor' });
      return;
    }

    const token = jwt.sign({ userId: user.id, tenantId: user.tenantId } as TokenPayload, secret, {
      expiresIn: '2h',
    });

    res.json({
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email, tenantId: user.tenantId },
    });
  } catch (error) {
    console.error('Erro interno no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

export default router;