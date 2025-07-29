import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient'; 
import { signupSchema, loginSchema } from '../controllers/zodSchemas';

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
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Dados inválidos',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { nome, email, senha } = result.data;

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      res.status(409).json({ message: 'E-mail já cadastrado' });
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoTenant = await prisma.tenant.create({
      data: {
        nome: `${nome} - tenant`, 
      },
    });

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tenantId: novoTenant.id,
      },
    });

    res.status(201).json({
      message: 'Usuário e tenant criados com sucesso',
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tenantId: usuario.tenantId,
      },
    });
  } catch (error) {
    console.error('Erro interno no signup:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Dados inválidos', errors: result.error.flatten().fieldErrors });
      return;
    }

    const { email, senha } = result.data;

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
