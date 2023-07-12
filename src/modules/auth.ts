import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../db";
import { NextFunction, Request, Response } from "express";

export const comparePasswords = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const create_ACCESS_JWT = async (user: any, salt: string) => {
  const token = await jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    salt,
    { expiresIn: "1m" }
  );
  return token;
};

export const create_REFRESH_JWT = async (user: any, salt: string) => {
  try {
    await prisma.refresh_token.updateMany({
      where: {
        belongsToId: user.id,
      },
      data: {
        valid: false,
      },
    });

    const token = await jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      salt,
      { expiresIn: "3d"}
    );

    await prisma.refresh_token.create({
      data: {
        token: token,
        belongsToId: user.id,
      },
    });

    return token;
  } catch (e) {
    console.log(e);
  }
};

export const create_TOKENS = async (user: any, saltACC: string, saltREF: string) => {
  const ACCESS_TOKEN = await create_ACCESS_JWT(user, saltACC);
  const REFRESH_TOKEN = await create_REFRESH_JWT(user, saltREF);
  return { ACCESS_TOKEN, REFRESH_TOKEN };
};

export const delete_REFRESH_TOKEN = async (token: string) => {
  try {
    await prisma.refresh_token.delete({
      where: {
        token: token,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const Invalidate_REFRESH_TOKEN = async (token: string) => {
        const tokenStatus = await prisma.refresh_token.findUnique({
            where: {
                token: token
            },
        });

        if (!tokenStatus) {
            throw new Error("Token not found");
        }

        if (!tokenStatus.valid) {
            throw new Error("Token already invalid");
        }

        await prisma.refresh_token.update({
            where: {
                token: token
            },
            data: {
                valid: false,
            },
        });
};

export const protect_api_route = (req: any, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send({
      message: "You are not authorized to access this part of the site.",
    });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "Invalid token for connection" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Not authorized for connection" });
    return;
  }
};

export const protect_sandwich_route = (req: any, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send({
      message: "You are not authorized to access this part of the site.",
    });
    return;
  }



  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "Invalid token for connection" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Not authorized for connection" });
    return;
  }
};

export const protect_token_creation__admin = async (req: any, res: Response) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send({
      message: "You are not authorized to access this part of the site.",
    });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "Invalid token for connection" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const database_check = await prisma.refresh_token.findUnique({
      where: {
        token: token,
      },
    });

    if (!database_check) {
      res.status(401);
      res.send({ message: "Not authorized for connection" });
      return;
    }

    if (database_check.valid === false) {
      prisma.user_admin.update({
        where: {
          id: user.id,
        },
        data: {
          banned: true,
        },
      });

      res.status(401);
      res.send({ message: "You are banned because of invalid token" });
      return;
    }

    const ACCESS_TOKEN = await create_ACCESS_JWT({
      id: user.id,
      name: user.name,
    }, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    
    res.status(200);
    res.send({ ACCESS_TOKEN });
  } catch (e) {
        console.log(e);
        res.status(401);
        res.send({ message: "Not authorized for connection" });
        return;
    }
};
