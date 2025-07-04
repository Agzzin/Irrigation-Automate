import express from 'express';
import { solicitarRecuperacaoSenha, redefinirSenha } from '../controllers/authController';

const router = express.Router();

router.post('/recuperar-senha', solicitarRecuperacaoSenha);
router.post('/redefinir-senha', redefinirSenha);

export default router;
