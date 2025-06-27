import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const auth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;

  if (!token) {
    res.status(401).json({ msg: 'Sem token' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      userId: number;
    };

    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
