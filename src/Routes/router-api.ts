import { Router, Request } from "express";
import { body } from "express-validator";
import { handleError } from "../modules/middleware";
import multer from "multer";
import path from "path";
import { CreateSandwich, DeleteSandwich, UpdateSandwich, allSandwiches, getSandwich } from "../handlers/sandwich";
import { createNewUser_admin } from "../handlers/user";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (
    req: Request,
    file,
    cb: (error: Error | null, filename: string) => void
  ) {
    const file_name = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, file_name);
  },
});
const upload = multer({ storage: storage,
    fileFilter: (req, file, cb) => {    
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    }
});

router.get("/sandwiches", allSandwiches);

router.get("/sandwich/:id", getSandwich);

router.post("/image", upload.single("image"), (req, res, next) => {
    res.send("Image uploaded");
});

router.post("/", 
    body("name").isString(),
    body("description").isString(),
    body("price").isString(),
    body("image").isString(),
        CreateSandwich);


router.put("/:id", 
    body("name").isString(),
    body("description").isString(),
    body("price").isString(),
    body("rating").isNumeric(),
    body("numReviews").isInt(),
        handleError, UpdateSandwich);

router.post("/create_account", body("name").isString().isLength({ min: 3, max: 30 }),body("password").isString().isLength({min: 8}) , handleError, createNewUser_admin);

router.delete("/sandwich/:id", DeleteSandwich);

export default router;
