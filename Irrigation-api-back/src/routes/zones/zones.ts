import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  try {
    const zones = await prisma.zone.findMany({ include: { schedule: true } });
    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar zonas' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await prisma.zone.findUnique({
      where: { id },
      include: { schedule: true },
    });
    if (!zone) {
      res.status(404).json({ error: 'Zona não encontrada' });
      return;
    }
    res.json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar zona' });
  }
});

router.post('/', async (req, res) => {
  const {
    name,
    status,
    flowRate,
    pressure,
    emitterCount,
    emitterSpacing,
    lastWatered,
    nextWatering,
    schedule,
  } = req.body;

  try {
    const newSchedule = await prisma.schedule.create({
      data: {
        duration: schedule.duration,
        frequency: schedule.frequency,
        days: schedule.days || [],
      },
    });

    const newZone = await prisma.zone.create({
      data: {
        name,
        status,
        flowRate,
        pressure,
        emitterCount,
        emitterSpacing,
        lastWatered: lastWatered ? new Date(lastWatered) : null,
        nextWatering: nextWatering ? new Date(nextWatering) : null,
        scheduleId: newSchedule.id,
      },
      include: { schedule: true },
    });

    res.status(201).json(newZone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar zona' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    status,
    flowRate,
    pressure,
    emitterCount,
    emitterSpacing,
    lastWatered,
    nextWatering,
    schedule,
  } = req.body;

  try {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      res.status(404).json({ error: 'Zona não encontrada' });
      return;
    }

    await prisma.schedule.update({
      where: { id: zone.scheduleId },
      data: {
        duration: schedule.duration,
        frequency: schedule.frequency,
        days: schedule.days || [],
      },
    });

    const updatedZone = await prisma.zone.update({
      where: { id },
      data: {
        name,
        status,
        flowRate,
        pressure,
        emitterCount,
        emitterSpacing,
        lastWatered: lastWatered ? new Date(lastWatered) : null,
        nextWatering: nextWatering ? new Date(nextWatering) : null,
      },
      include: { schedule: true },
    });

    res.json(updatedZone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar zona' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      return res.status(404).json({ error: 'Zona não encontrada' });
    }

    await prisma.zone.delete({ where: { id } });

    if (zone.scheduleId) {
      await prisma.schedule.delete({ where: { id: zone.scheduleId } });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar zona:', error);
    res.status(500).json({ error: 'Erro ao deletar zona' });
  }
});

router.get('/:id/history', async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, eventType } = req.query;

  try {
    const where = {
      zones: id !== 'all' ? { some: { zoneId: id } } : undefined,
      createdAt: {
        gte: startDate ? new Date(startDate as string) : undefined,
        lte: endDate ? new Date(endDate as string) : undefined,
      },
      eventType: eventType ? (eventType as string) : undefined,
    };

    const history = await prisma.historyEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { zones: true },
    });

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

router.post('/:id/history', async (req, res) => {
  const { id } = req.params;
  const {
    eventType,
    action,
    duration,
    humidity,
    temperature,
    weather,
    source,
  } = req.body;

  try {
    const newEvent = await prisma.historyEvent.create({
      data: {
        eventType,
        action,
        duration,
        humidity,
        temperature,
        weather,
        source,
      },
    });

    await prisma.zoneOnHistoryEvent.create({
      data: {
        zoneId: id,
        historyEventId: newEvent.id,
      },
    });

    const createdWithZones = await prisma.historyEvent.findUnique({
      where: { id: newEvent.id },
      include: { zones: true },
    });

    res.status(201).json(createdWithZones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar evento' });
  }
});

export default router;
