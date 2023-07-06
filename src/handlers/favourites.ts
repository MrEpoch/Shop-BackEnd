import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const Update_Favourites = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_shop = await prisma.user_shop.update({
      where: {
        id: req.user.id,
      },
      data: {
        favourites: req.body.favourites,
      },
    });
    res.json(user_shop);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "No favourites for you!" });
    return;
  }
};
