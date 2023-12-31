import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import {
  hashPassword,
  comparePasswords,
  create_TOKENS,
  create_ACCESS_JWT,
  Invalidate_REFRESH_TOKEN,
} from "../modules/auth";
import jwt from "jsonwebtoken";

export const createNewUser_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCheck = await prisma.user_shop.findUnique({
      where: {
        name: req.body.name,
      },
    });

    const emailCheck = await prisma.user_shop.findUnique({
        where: {
            email: req.body.email,
        },
    });

    if (userCheck) {
      res.status(409);
      res.json({ message: "Username already exists" });
      return;
    } else if (emailCheck) {
        res.status(409);
        res.json({ message: "Email already exists" });
        return;
    }

    const user = await prisma.user_shop.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
        password: await hashPassword(req.body.password),
      },
    });
    const token = await create_TOKENS({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);
    
    res.json({
      ACCESS_TOKEN: token.ACCESS_TOKEN,
      REFRESH_TOKEN: token.REFRESH_TOKEN,
      user: user
    });
  } catch (e) {
    e.type = "signUp";
    next(e);
  }
};

export const signIn_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user_shop.findUnique({
      where: {
        name: req.body.name,
      },
      include: {
        orders: true,
      }
    });

    if (!user) {
      res.status(401);
      res.json({ message: "Invalid name" });
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "Invalid password" });
      return;
    }

    await prisma.refresh_token.updateMany({
        where: {
            belongsToId: user.id,
        },
        data: {
            valid: false,
        },
    });


    if (user.banned) {
        res.status(401);
        res.json({ message: "You have been banned" });
        return;
    }

    const token = await create_TOKENS({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);

    res.json({
      REFRESH_TOKEN: token.REFRESH_TOKEN,
      ACCESS_TOKEN: token.ACCESS_TOKEN,
      user: user,
    });
  } catch (e) {
    e.type = "signIn";
    next(e);
  }
};

export const getUser_user = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user_shop.findMany({
            where: {
                id: req.params.id,
            },
            include: {
                orders: true,
            }
        });
        res.json(user);
    } catch (e) {
        e.type = "getUser";
        next(e);
    }
};

export const Delete_user_shop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user_shop.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json(user);
    } catch (e) {
        e.type = "deleteUser";
        next(e);
    }
}


export const createNewUser_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCheck = await prisma.user_admin.findUnique({
      where: {
        name: req.body.name,
      },
    });

    if (userCheck) {
      res.status(409);
      res.json({ message: "Username already exists" });
      return;
    }

    const user = await prisma.user_admin.create({
      data: {
        name: req.body.name,
        password: await hashPassword(req.body.password),
      },
    });
    const token = await create_TOKENS({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET_ADMIN, process.env.REFRESH_TOKEN_SECRET_ADMIN);
    
    res.json({
      ACCESS_TOKEN: token.ACCESS_TOKEN,
      REFRESH_TOKEN: token.REFRESH_TOKEN,
    });
  } catch (e) {
    e.type = "signUp";
    next(e);
  }
};

export const signIn_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user_admin.findUnique({
      where: {
        name: req.body.name,
      },
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

    await prisma.refresh_token.updateMany({
        where: {
            belongsToId: user.id,
        },
        data: {
            valid: false,
        },
    });

    if (user.banned) {
        res.status(401);
        res.json({ message: "You have been banned" });
        return;
    }


    const token = await create_TOKENS({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET_ADMIN, process.env.REFRESH_TOKEN_SECRET_ADMIN);

    res.json({
      REFRESH_TOKEN: token.REFRESH_TOKEN,
      ACCESS_TOKEN: token.ACCESS_TOKEN,
    });
  } catch (e) {
    e.type = "signIn";
    next(e);
  }
};

export const token_refresh_shop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      },
    });

    if (!token) {
      res.status(401);
      res.json({ message: "Invalid token" });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err: any, user: any) => {
        if (err) {
          res.status(403);
          res.json({ message: err.name });
          return;
        }
        const accessToken = create_ACCESS_JWT({
          id: user.id,
          name: user.name,
        }, process.env.ACCESS_TOKEN_SECRET).then((accessToken) => {
            res.json({ ACCESS_TOKEN: accessToken });
        });
        }
    );
  } catch (e) {
    e.type = "token_refresh";
    next(e);
  }
};

export const token_refresh_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      },
    });

    if (!token) {
      res.status(401);
      res.json({ message: "Invalid token" });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_ADMIN,
      (err: any, user: any) => {
        if (err) {
          res.status(403);
          res.json({ message: "Invalid token" });
          return;
        }
        const accessToken = create_ACCESS_JWT({
          id: user.id,
          name: user.name,
        }, process.env.ACCESS_TOKEN_SECRET_ADMIN).then((accessToken) => {
            res.json({ ACCESS_TOKEN: accessToken });
        });
      }
    );
  } catch (e) {
    e.type = "token_refresh";
    next(e);
  }
};
