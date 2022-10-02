import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) next();
  }

  res.sendStatus(404);
};
