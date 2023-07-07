import { validationResult } from "express-validator";

export const handleError = (req, res, next) => {
  const errors = validationResult(req);
  next();
};
