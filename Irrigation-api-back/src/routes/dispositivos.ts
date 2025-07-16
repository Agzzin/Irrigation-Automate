import { Router } from 'express';
import { prisma } from '../prismaClient';
import { authRoutes } from '../middlewares/auth';

const router = Router();

router.get('/', authRoutes , async (req, res) => {
  try {
    const dispositivos = await prisma.dispositivo.findMany({
  where: {
    usuarioId: req.userId,
    usuario: {
      is: {
        tenantId: req.tenantId
      }
    }
  }
});
    res.json(dispositivos);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar dispositivos' });
  }
});

router.post('/', authRoutes, async (req, res) => {
  try {
    const novo = await prisma.dispositivo.create({
      data: {
        ...req.body,
        usuarioId: req.userId
      }
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar dispositivo' });
  }
});

export default router;
