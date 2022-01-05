import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAutenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(`Token de autenticação não enviado.`, 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const tokenDecoded = verify(token, authConfig.jwt.secret);

    const { sub } = tokenDecoded as ITokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
}
