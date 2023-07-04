import { Router } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";
import { allSandwiches } from "../handlers/sandwich";
import multer from "multer";
import path from "path";

import { CreateSandwich } from "../handlers/sandwich";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get("/", allSandwiches);

router.post("/", body("name").isString(), handleError, upload.single("image"), CreateSandwich)

router.delete("/", (req, res) => {
    res.send("Hello World!");
});

router.put("/", (req, res) => {
    res.send("Hello World!");
});

export default router;
