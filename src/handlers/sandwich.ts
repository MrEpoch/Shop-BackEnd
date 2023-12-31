import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import path from "path";
import fs from "fs";
// @ts-ignore
const CryptoJS = require("crypto-js");

export const getSandwiches = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const sandwiches = await prisma.sandwich.findMany();
    req.sandwiches = sandwiches;
    next();
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are sandwichless" });
    return;
  }
};

export const allSandwiches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sandwiches = await prisma.sandwich.findMany();
    if (sandwiches.length === 0) { 
        res.json([]);
        return;
    }
    res.json(sandwiches);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are sandwichless" });
    return;
  }
};

export const getSandwich = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sandwich = await prisma.sandwich.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json(sandwich);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are sandwichless" });
    return;
  }
};

export const CreateSandwich = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const filtered_path = req.body.image.toLowerCase().split(" ").join("-");
    
    const sandwich = await prisma.sandwich.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stripePriceId: req.body.stripeId,
        image: url + "/uploads/" + filtered_path,
      },
    });
    res.json(sandwich);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are not making sandwiches" });
    return;
  }
};

export const UpdateSandwich = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const filtered_path = req.body.image.toLowerCase().split(" ").join("-");
    const sandwich = await prisma.sandwich.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        rating: req.body.rating,
        image: url + "/uploads/" + filtered_path,
        numReviews: req.body.numReviews,
      },
    });

    fs.unlink(
        path.join(__dirname, "../../uploads/" + req.body.oldImage),
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );

    res.json(sandwich);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are not updating sandwiches" });
    return;
  }
};

export const UpdateSandwich_noImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sandwich = await prisma.sandwich.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
            },
        });
        res.json(sandwich);
    } catch (e) {
        console.log(e);
        res.status(401);
        res.send({ message: "Well you are not updating sandwiches" });
        return;
    }
};

export const UpdateSandwichRating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sandwich = await prisma.sandwich.update({
      where: {
        id: req.params.id,
      },
      data: {
        rating: req.body.rating,
        numReviews: req.body.numReviews,
      },
    });
    res.json(sandwich);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are not updating sandwiches" });
    return;
  }
};

export const DeleteSandwich = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sandwich = await prisma.sandwich.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json(sandwich);
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send({ message: "Well you are not deleting sandwiches" });
    return;
  }
};
