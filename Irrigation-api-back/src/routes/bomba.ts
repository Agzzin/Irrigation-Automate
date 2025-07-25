import { Router, Request, Response } from 'express';
import { prisma } from '../prismaClient';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const tenantId = req.tenantId;
  if (!userId || !tenantId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  try {
    const bombas = await prisma.bomba.findMany({
      where: {
        usuarioId: userId,
        usuario: { tenantId }
      },
      orderBy: { id: 'desc' },
    });
    res.json(bombas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar bombas' });
  }
});

router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  const { nome } = req.body;
  if (!nome) {
    res.status(400).json({ msg: 'Nome da bomba é obrigatório' });
    return;
  }

  try {
    const bomba = await prisma.bomba.create({
      data: {
        nome,
        usuarioId: userId,
        ativo: false,
      },
    });
    res.status(201).json(bomba);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao criar bomba' });
  }
});

router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const tenantId = req.tenantId;
  const bombaId = Number(req.params.id);
  const { nome, ativo } = req.body;

  if (!userId || !tenantId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  try {
    const bomba = await prisma.bomba.findFirst({ where: { id: bombaId, usuarioId: userId, usuario: { tenantId } } });

    if (!bomba) {
      res.status(404).json({ msg: 'Bomba não encontrada ou sem permissão' });
      return;
    }

    const bombaAtualizada = await prisma.bomba.update({
      where: { id: bombaId },
      data: { nome, ativo },
    });

    res.json(bombaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar bomba' });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const tenantId = req.tenantId;
  const bombaId = Number(req.params.id);

  if (!userId || !tenantId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  try {
    const bomba = await prisma.bomba.findFirst({ where: { id: bombaId, usuarioId: userId, usuario: { tenantId } } });

    if (!bomba) {
      res.status(404).json({ msg: 'Bomba não encontrada ou sem permissão' });
      return;
    }

    await prisma.bomba.delete({ where: { id: bombaId } });
    res.json({ msg: 'Bomba removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao remover bomba' });
  }
});

export default router;