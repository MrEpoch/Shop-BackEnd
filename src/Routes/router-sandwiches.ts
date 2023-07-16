import { Router } from "express";
import { body } from "express-validator";
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const CryptoJS = require("crypto-js");
import {
  Create_comment,
  Delete_comment,
  Update_comment,
} from "../handlers/comments";
import { Update_Favourites } from "../handlers/favourites";
import prisma from "../db";
import { getOrder, getOrders } from "../handlers/orders";
import { getUser_user } from "../handlers/user";

const router = Router();

router.put("/favourites", 
    body("favourites").isArray(),
           Update_Favourites);

router.put("/comment/:id", 
    body("title").isString().isLength({ min: 3, max: 30 }),
    body("rating").isNumeric().isLength({ min: 1, max: 5 }),
    body("comment").isString().isLength({ min: 3, max: 500 }),
            Update_comment);

router.delete("/comment/:id", Delete_comment);

router.put("/update_user", );

router.post("/comment",
    body("title").isString().isLength({ min: 3, max: 30 }),
    body("rating").isNumeric().isLength({ min: 1, max: 5 }),
    body("comment").isString().isLength({ min: 3, max: 500 }),
    body("belongsToSandwichId").isString(),
            Create_comment);

router.post("/checkout", async (req: any ,res) => {
    try {
        const sandwiches = await prisma.sandwich.findMany({});
        const sandwich_orders = [];
        const filtered_valid_orders = sandwiches.filter((sandwich) => {
            const query = req.body.order.find((sandwich_front_end: any) => sandwich.id === sandwich_front_end.id);
            if (query) {
                // @ts-ignore
                sandwich.quantity = query.quantity;
                return true;
            };
        });
        filtered_valid_orders.forEach((sandwich) => {
            sandwich_orders.push({
                price: CryptoJS.AES.decrypt(sandwich.stripePriceId, process.env.STRIPE_SECTET_ENCRYPT).toString(CryptoJS.enc.Utf8),
                // @ts-ignore
                quantity: sandwich.quantity,
            });
        });

        const session = await stripe.checkout.sessions.create({
            line_items: sandwich_orders,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        }, {
            apiKey: process.env.STRIPE_SECRET_KEY,
        });

        await prisma.order.create({
            data: {
               // @ts-ignore
               total: filtered_valid_orders.reduce((acc, sandwich) => { return acc + sandwich.price * sandwich.quantity }, 0),
               items: filtered_valid_orders.map((sandwich) => { return sandwich.id }),
               userId: req.user.id,
            },
        });
        
        res.send(JSON.stringify({ url: session.url }));
    } catch (e) {
        console.log(e);
        res.status(401);
        res.send({ message: "No payment" });
        return;
    }
});

router.get("/order/:id", getOrder);
router.get("/orders", getOrders);
router.get("/user", getUser_user);

router.delete("order/:id", );
router.delete("user/:id", );

export default router;
