import express from 'express';
import passport from '../middlewares/passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

function gerarJWT(usuario: any) {
  return jwt.sign(
    { userId: usuario.id, email: usuario.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const usuario = req.user as any;
  const token = gerarJWT(usuario);
  res.redirect(`http://localhost:3000/login/social?token=${token}`);
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const usuario = req.user as any;
  const token = gerarJWT(usuario);
  res.redirect(`http://localhost:3000/login/social?token=${token}`); 
});

export default router;