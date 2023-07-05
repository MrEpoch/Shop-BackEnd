import { Router } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";

const router = Router();

router.get("/", (_, res) => {
    res.send(true);
});

router.get("/sandwiches", );

router.get("/sandwich", (_, res) => {
    res.send("Hello World!");
});

router.post("/sandwich", body("name").isString(), handleError, (_, res) => {
    res.send("Hello World!");
});

router.delete("/sandwich", (_, res) => {
    res.send("Hello World!");
});

router.put("/sandwich", (_, res) => {
    res.send("Hello World!");
});

export default router;
