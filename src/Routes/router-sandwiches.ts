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

router.put("/favourite", 
    body("favourites").isArray(),
           Update_Favourites);

router.put("/comment/:id", 
    body("title").isString().isLength({ min: 3, max: 30 }),
    body("rating").isNumeric().isLength({ min: 1, max: 5 }),
    body("comment").isString().isLength({ min: 3, max: 500 }),
            Update_comment);

router.delete("/comment/:id", Delete_comment);

router.post("/comment",
    body("title").isString().isLength({ min: 3, max: 30 }),
    body("rating").isNumeric().isLength({ min: 1, max: 5 }),
    body("comment").isString().isLength({ min: 3, max: 500 }),
    body("belongsToSandwichId").isString(),
    body("belongsToId").isString(),
            Create_comment);

export default router;
