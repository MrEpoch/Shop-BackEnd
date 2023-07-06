import express from "express";
import cors from "cors";
import {
  createNewUser_user,
  signIn_user,
  token_refresh,
} from "./handlers/user";
import { body } from "express-validator";
import { handleError } from "./modules/middleware";
import morgan from "morgan";
import { delete_REFRESH_TOKEN } from "./modules/auth";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post(
  "/auth_user/login",
  body("name").isString().isLength({ min: 3, max: 30 }),
  body("password").isString().isLength({ min: 1 }),
  handleError,
  signIn_user
);
app.post(
  "/auth_user/signup",
  body("name").isString().isLength({ min: 3, max: 30 }),
  body("password").isString().isLength({ min: 1 }),
  body("email").isString().isEmail().isLength({ min: 1 }),
  body("phone").isNumeric().isLength({ min: 1 }),
  body("address").isString().isLength({ min: 1 }),
  body("city").isString().isLength({ min: 1 }),
  body("postalCode").isNumeric().isLength({ min: 1 }),
  body("country").isString().isLength({ min: 1 }),
  handleError,
  createNewUser_user
);

app.post("/auth_user/token", token_refresh);
app.delete("/auth_user/logout", delete_REFRESH_TOKEN);

export default app;
