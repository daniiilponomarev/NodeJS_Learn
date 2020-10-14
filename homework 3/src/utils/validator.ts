import { Request, Response } from 'express';

export const validatorError = (
  err: any,
  req: Request,
  res: Response
) => {
  if (err && err.error && err.error.isJoi) {
    // return json response with status 400 if there is a joi error,
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  }
  res.status(500).send(err);
};
