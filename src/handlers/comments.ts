import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const getComments = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await prisma.comment.findMany();
    res.json(comments);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are commentless" });
    return;
  }
};

export const Create_comment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        title: req.body.title,
        rating: req.body.rating,
        comment: req.body.comment,
        belongsToSandwichId: req.body.sandwichId,
        belongsToId: req.body.userId,
      },
    });
    res.json(comment);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({
      message:
        "Impossible to recreate and impossible to make, well no comment.",
    });
    return;
  }
};

export const Update_comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await prisma.comment.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        rating: req.body.rating,
        comment: req.body.comment,
      },
    });
    res.json(comment);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "It looks like your updated comments sucks" });
    return;
  }
};

export const Delete_comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sandwich = await prisma.comment.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json(sandwich);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({
      message:
        "It was such glorius comment that even deleting it is impossible.",
    });
    return;
  }
};
