import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { enviarEmail } from '../utils/email';
import { RequestHandler } from 'express';
import { solicitarRecuperacaoSchema, redefinirSenhaSchema } from '../controllers/zodSchemas';

const prisma = new PrismaClient();

export const solicitarRecuperacaoSenha: RequestHandler = async (req, res, next) => {
  try {
    const parseResult = solicitarRecuperacaoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    }

    const { email } = parseResult.data;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      res.status(200).json({ message: 'Se o e-mail existir, enviaremos instruções.' });
      return;
    }

    const token = jwt.sign(
      { userId: usuario.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const link = `http://localhost:3000/redefinir-senha?token=${token}`;
    await enviarEmail(email, 'Recuperação de senha', `Clique aqui para redefinir sua senha: ${link}`);

    res.json({ message: 'Se o e-mail existir, enviaremos instruções.' });
  } catch (error) {
    next(error);
  }
};

export const redefinirSenha: RequestHandler = async (req, res, next) => {
  try {
    const parseResult = redefinirSenhaSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    }

    const { token, novaSenha } = parseResult.data;

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const usuario = await prisma.usuario.findUnique({ where: { id: payload.userId } });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senha: senhaHash }
    });

    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
};
