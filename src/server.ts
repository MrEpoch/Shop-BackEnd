import express from "express";
import sandwich_router from "./Routes/router-sandwiches";
import cors from "cors";
import { protect_api_route, protect_sandwich_route } from "./modules/auth";
import morgan from "morgan";
import { allSandwiches, getSandwich, getSandwiches } from "./handlers/sandwich";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/server" ,allSandwiches); 
app.get("/server/:id", getSandwich);

app.use("/server/sandwiches", protect_sandwich_route, getSandwiches, sandwich_router);

export default app;
