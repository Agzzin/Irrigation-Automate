import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bombaRouter from './routes/bomba';
import usuarioRouter from './routes/usuario';
import authResetRoutes from '../src/middlewares/reset-password';
import { authenticateToken} from './middlewares/auth'
import zonesRouter from './routes/zones/zones';


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/auth', authenticateToken);
app.use('/auth', authResetRoutes);
app.use('/bombas', bombaRouter);         
app.use('/usuarios', usuarioRouter);  
app.use('/api/zones', zonesRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
