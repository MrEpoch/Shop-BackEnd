import express from "express";
import cors from "cors";
import { signIn, token_refresh } from "./handlers/user";
import { body } from "express-validator";
import { handleError } from "./modules/middleware";
import morgan from "morgan";
import { delete_REFRESH_TOKEN, protect_api_route } from "./modules/auth";
import router from "./Routes/router-api";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post(
  "/auth/login",
  body("name").isString().isLength({ min: 3, max: 30 }),
  body("password").isString().isLength({ min: 1 }),
  handleError,
  signIn
);

app.post("/auth/token", token_refresh);
app.delete("/auth/logout", delete_REFRESH_TOKEN);

app.use("/auth/api", protect_api_route, router);

export default app;
