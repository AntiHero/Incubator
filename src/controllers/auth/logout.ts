import { Request, Response } from 'express';

import { customValidationResult } from '@/customValidators/customValidationResults';

export const logout = async (req: Request, res: Response) => {
  if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);
  
  res.sendStatus(204);
};
