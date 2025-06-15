import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateData =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: result.error.errors,
      });
      return;
    }

    next();
  };
