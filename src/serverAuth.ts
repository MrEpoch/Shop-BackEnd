import express from "express";
import cors from "cors";
import { signIn_admin, token_refresh_admin } from "./handlers/user";
import { body } from "express-validator";
import { handleError } from "./modules/middleware";
import morgan from "morgan";
import { Invalidate_REFRESH_TOKEN, delete_REFRESH_TOKEN, protect_api_route } from "./modules/auth";
import router from "./Routes/router-api";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post(
  "/auth/login",
  body("name").isString().isLength({ min: 3, max: 100 }),
  body("password").isString().isLength({ min: 8 }),
  handleError,
  signIn_admin
);

app.post("/auth/token", token_refresh_admin);

app.post("/auth/logout/", async (req, res) => {
    try {
        await Invalidate_REFRESH_TOKEN(req.body.token);
        res.status(200);
        res.json({ message: "Logged out" });
        return;
    } catch (e) {
        console.log(e);
        res.status(404);
        res.json({ message: "Error, probably your token doesn't exist or is already expired" });
        return;
    }
});

app.use("/auth/api", protect_api_route, router);

export default app;
