import { Router, Request } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";
import multer from "multer";
import path from "path";
import { CreateSandwich, UpdateSandwich } from "../handlers/sandwich";
import { signIn } from "../handlers/user";

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

router.post("/image", upload.single("image"));

router.post("/", body("name").isString(), handleError, CreateSandwich)

router.put("/:id", body("name").isString(), handleError, UpdateSandwich)

router.post("/create_account", body("name").isString(), handleError, signIn)

export default router;
