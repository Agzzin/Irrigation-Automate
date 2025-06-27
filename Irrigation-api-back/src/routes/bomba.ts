import { Router, Request, Response } from 'express';
import { prisma } from '../prismaClient';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  try {
    const bombas = await prisma.bomba.findMany({
      where: { usuarioId: userId },
      orderBy: { id: 'desc' },
    });
    res.json(bombas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar bombas' });
  }
});

router.post('/', auth, async (req: Request, res: Response): Promise<void> => {
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

router.put('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const bombaId = Number(req.params.id);
  const { nome, ativo } = req.body;

  if (!userId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  try {
    const bomba = await prisma.bomba.findUnique({ where: { id: bombaId } });

    if (!bomba || bomba.usuarioId !== userId) {
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

router.delete('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const bombaId = Number(req.params.id);

  if (!userId) {
    res.status(401).json({ msg: 'Usuário não autenticado' });
    return;
  }

  try {
    const bomba = await prisma.bomba.findUnique({ where: { id: bombaId } });

    if (!bomba || bomba.usuarioId !== userId) {
      res.status(404).json({ msg: 'Bomba não encontrada ou sem permissão' });
      return;
    }

    await prisma.bomba.delete({ where: { id: bombaId } });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao deletar bomba' });
  }
});

export default router;
