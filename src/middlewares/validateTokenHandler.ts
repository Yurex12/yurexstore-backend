import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401);
    throw new Error('Token not found');
  }

  try {
    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET as string
    );
    req.user = decodedToken.user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Token has expired.');
  }
}
