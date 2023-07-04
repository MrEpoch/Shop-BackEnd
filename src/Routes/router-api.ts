import { Router } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";

const router = Router();

router.get("/sandwiches", );

router.get("/sandwich", (req, res) => {
    res.send("Hello World!");
});

router.post("/sandwich", body("name").isString(), handleError, (req, res) => {
    res.send("Hello World!");
});

router.delete("/sandwich", (req, res) => {
    res.send("Hello World!");
});

router.put("/sandwich", (req, res) => {
    res.send("Hello World!");
});

export default router;
