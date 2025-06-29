import { Router } from 'express';
import { prisma } from '../prismaClient';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const dispositivos = await prisma.dispositivo.findMany({
      where: { userId: req.userId }
    });
    res.json(dispositivos);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar dispositivos' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const novo = await prisma.dispositivo.create({
      data: {
        ...req.body,
        userId: req.userId
      }
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar dispositivo' });
  }
});

export default router;