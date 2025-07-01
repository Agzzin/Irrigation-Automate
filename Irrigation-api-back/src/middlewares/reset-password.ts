import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prismaClient';

interface ResetBody {
  token: string;
  novaSenha: string;
  tenantId: number;
}

const router = Router();

router.post(
  '/reset-password',
  async (req: Request<{}, {}, ResetBody>, res: Response) => {
    const { token, novaSenha, tenantId } = req.body;

    if (!token || !novaSenha || !tenantId) {
      res.status(400).json({ msg: 'Token, nova senha e tenantId são obrigatórios' });
      return;
    }
    if (novaSenha.length < 6) {
      res.status(400).json({ msg: 'Senha precisa ter pelo menos 6 caracteres' });
      return;
    }

    try {
      const reset = await prisma.passwordResetToken.findUnique({ where: { token } });

      if (!reset || new Date(reset.expiresAt).getTime() < Date.now()) {
        res.status(400).json({ msg: 'Token inválido ou expirado' });
        return;
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: reset.usuarioId },
      }) as { id: number; tenantId: number } | null;

      if (!usuario || usuario.tenantId !== tenantId) {
        res.status(400).json({ msg: 'Token não pertence ao tenant informado' });
        return;
      }

      const senhaHash = await bcrypt.hash(novaSenha, 10);
      await prisma.usuario.update({
        where: { id: reset.usuarioId },
        data: { senha: senhaHash },
      });

      await prisma.passwordResetToken.delete({ where: { id: reset.id } });

      res.json({ msg: 'Senha redefinida com sucesso' });
    } catch (err) {
      console.error('[reset-password]', err);
      res.status(500).json({ msg: 'Erro interno no servidor' });
    }
  }
);

export default router;
