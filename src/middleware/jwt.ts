import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token == null) return res.sendStatus(403)

  jwt.verify(token, process.env.TOKEN as string, (err) => {

    if (err) return res.sendStatus(403);

    next();
  });
};
