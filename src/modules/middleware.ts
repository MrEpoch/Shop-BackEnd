import { validationResult } from "express-validator";

export const handleError = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
    } else {
        next();
    }
};

