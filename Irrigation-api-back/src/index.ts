import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import bombaRouter from './routes/bomba';
import usuarioRouter from './routes/usuario';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use('/bombas', bombaRouter);         
app.use('/usuarios', usuarioRouter);      

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
