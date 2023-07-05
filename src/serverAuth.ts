import express from 'express';
import cors from 'cors';
import { createNewUser, signIn } from './handlers/user';
import { body } from 'express-validator';
import { handleError } from './modules/middleware';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/auth/login', 
    body('username').isString().isLength({ min: 0, max: 30}),
    body('password').isString().isLength({ min: 1 })
,handleError ,signIn);
app.post('/auth/signup', 
    body('username').isString().isLength({ min: 0, max: 30}),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 1 })
,handleError, createNewUser);

app.post("/auth/token", (req, res) => {
    const refreshToken = req.body.token;
});

export default app;
