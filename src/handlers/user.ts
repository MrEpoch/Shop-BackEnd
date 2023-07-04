import prisma from "../db";
import { createJWT, hashPassword, comparePasswords } from "../modules/auth";

export const createNewUser = async (req, res, next) => {
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
        const token = await createJWT(user);
        res.json({ token });
    } catch (e) {
        e.type = "signUp";
        next(e);
    } 
};

export const signIn = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
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

        const token = await createJWT(user);
        res.json({ token });
    } catch (e) {
        e.type = "signIn";
        next(e);
    }
};
