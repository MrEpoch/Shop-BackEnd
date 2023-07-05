import { Request, Router } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";
import { DeleteSandwich, UpdateSandwich, allSandwiches, getSandwich } from "../handlers/sandwich";
import multer from "multer";
import path from "path";

import { CreateSandwich } from "../handlers/sandwich";

const router = Router();

const storage = multer.diskStorage({
    destination: function (_: Request, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (_: Request, file, cb: (error: (Error | null), filename: string) => void) {
        cb(null, path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get("/", allSandwiches);

router.get("/:id", getSandwich);

router.post("/image", upload.single("image"));

router.post("/", body("name").isString(), handleError, CreateSandwich)

router.delete("/", DeleteSandwich);

router.put("/", UpdateSandwich);

export default router;
