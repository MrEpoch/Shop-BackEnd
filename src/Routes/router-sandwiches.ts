import { Request, Router } from "express";
import { body } from "express-validator";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import {
  Create_comment,
  Delete_comment,
  Update_comment,
} from "../handlers/comments";
import { Update_Favourites } from "../handlers/favourites";
import prisma from "../db";

const router = Router();

router.put("/favourite", 
    body("favourites").isArray(),
           Update_Favourites);

router.put("/comment/:id", 
    body("title").isString().isLength({ min: 3, max: 30 }),
    body("rating").isNumeric().isLength({ min: 1, max: 5 }),
    body("comment").isString().isLength({ min: 3, max: 500 }),
            Update_comment);

router.delete("/comment/:id", Delete_comment);

router.post("/comment",
    body("title").isString().isLength({ min: 3, max: 30 }),
    body("rating").isNumeric().isLength({ min: 1, max: 5 }),
    body("comment").isString().isLength({ min: 3, max: 500 }),
    body("belongsToSandwichId").isString(),
            Create_comment);

router.post("/checkout", async (req ,res) => {
    try {
        const sandwiches = await prisma.sandwich.findMany({});
        const sandwich_orders = [];
        const filtered_valid_orders = sandwiches.filter((sandwich) => {
            const query = req.body.find((sandwich_front_end: any) => sandwich.id === sandwich_front_end.id);
            if (query) {
                // @ts-ignore
                sandwich.quantity = query.quantity;
                return true;
            };
        });
        filtered_valid_orders.forEach((sandwich) => {
            sandwich_orders.push({
                price: sandwich.stripePriceId,
                // @ts-ignore
                quantity: sandwich.quantity,
            });
        });

        const session = await stripe.checkout.sessions.create({
            line_items: sandwich_orders,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });
        res.send(JSON.stringify({ url: session.url }));
    } catch (e) {
        console.log(e);
        res.status(401);
        res.send({ message: "No payment" });
        return;
    }
}); 

export default router;
