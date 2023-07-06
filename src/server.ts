import express from "express";
import router from "./Routes/router-api";
import sandwich_router from "./Routes/router-sandwiches";
import cors from "cors";
import { protectRoute, protect_api_route } from "./modules/auth";
import morgan from "morgan";
import { getSandwiches } from "./handlers/sandwich";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/server/sandwiches", protect_api_route, getSandwiches, sandwich_router);

export default app;
