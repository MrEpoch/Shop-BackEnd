import express from "express";
import cors from "cors";
import {
  createNewUser_user,
  signIn_user,
  token_refresh_shop
} from "./handlers/user";
import { body } from "express-validator";
import { handleError } from "./modules/middleware";
import morgan from "morgan";
import { Invalidate_REFRESH_TOKEN } from "./modules/auth";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post(
  "/auth_user/login",
  body("name").isString().isLength({ min: 3, max: 100 }),
  body("password").isString().isLength({ min: 8 }),
  handleError,
  signIn_user
);
app.post(
  "/auth_user/signup",
  body("name").isString().isLength({ min: 3, max: 100 }),
  body("password").isString().isLength({ min: 8 }),
  body("email").isString().isEmail().isLength({ min: 1 }),
  body("phone").isNumeric().isLength({ min: 1 }),
  body("address").isString().isLength({ min: 1 }),
  body("city").isString().isLength({ min: 1 }),
  body("postalCode").isNumeric().isLength({ min: 1 }),
  body("country").isString().isLength({ min: 1 }),
  handleError,
  createNewUser_user
);

app.post("/auth_user/token", token_refresh_shop);

app.post("/auth_user/logout", async (req, res) => {
    try {
        await Invalidate_REFRESH_TOKEN(req.body.token);
        res.status(200);
        res.json({ message: "Logged out" });
        return;
    } catch (e) {
        console.log(e);
        res.status(500);
        res.json({ message: "Error" });
        return;
    }
});

export default app;
