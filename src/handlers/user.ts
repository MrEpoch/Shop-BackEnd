import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { hashPassword, comparePasswords, create_TOKENS, create_ACCESS_JWT } from "../modules/auth";
import jwt from "jsonwebtoken";

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCheck = await prisma.user.findUnique({
            where: {
                username: req.body.username,
            }
        });

        const emailCheck = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            }
        });

        if (emailCheck) {
            res.status(409);
            res.json({ message: "Email already exists" });
            return;
        } else if (userCheck) {
            res.status(409);
            res.json({ message: "Username already exists" });
            return;
        }

        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: await hashPassword(req.body.password),
            }
        });
        const token = await create_TOKENS(user);
        res.json({ ACCESS_TOKEN: token.ACCESS_TOKEN, REFRESH_TOKEN: token.REFRESH_TOKEN});
    } catch (e) {
        e.type = "signUp";
        next(e);
    } 
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.name,
            }
        });

        if (!user) {
            res.status(401);
            res.json({ message: "Invalid email" });
            return;
        }

        const isValid = await comparePasswords(req.body.password, user.password);

        if (!isValid) {
            res.status(401);
            res.json({ message: "Invalid password" });
            return;
        }

        const token = await create_TOKENS(user);
        
        await prisma.refresh_token.create({
            data: {
                token: token.REFRESH_TOKEN,
                belongsToId: user.id,
            }
        });

        res.json({ REFRESH_TOKEN: token.REFRESH_TOKEN, ACCESS_TOKEN: token.ACCESS_TOKEN });
    } catch (e) {
        e.type = "signIn";
        next(e);
    }
};

export const token_refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.body.token;
        if (!refreshToken) {
            res.status(401);
            res.json({ message: "Invalid token" });
            return;
        }
        
        const token = await prisma.refresh_token.findUnique({
            where: {
                token: refreshToken,
            }
        });

        if (!token) {
            res.status(401);
            res.json({ message: "Invalid token" });
            return;
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
            if (err) {
                res.status(403);
                res.json({ message: "Invalid token" });
                return;
            }
            const accessToken = create_ACCESS_JWT(user);
            res.json({ ACCESS_TOKEN: accessToken });
        });
    } catch (e) {
        e.type = "token_refresh";
        next(e);
    }
}


