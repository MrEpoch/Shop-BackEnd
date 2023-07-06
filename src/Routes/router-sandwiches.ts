import { Request, Router } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";
import { allSandwiches, getSandwich } from "../handlers/sandwich";

import {
  Create_comment,
  Delete_comment,
  Update_comment,
} from "../handlers/comments";
import { Update_Favourites } from "../handlers/favourites";

const router = Router();

router.get("/", allSandwiches);

router.get("/:id", getSandwich);

router.put("/favourite", Update_Favourites);

router.put("/comment/:id", Update_comment);

router.delete("/comment/:id", Delete_comment);

router.post("/comment", Create_comment);

export default router;
