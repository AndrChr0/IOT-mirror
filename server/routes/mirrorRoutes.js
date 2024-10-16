import express from "express";
const router = express.Router();
// import {} from "../controllers/mirrorController.js";
import {upload} from "../utils/multerSetup.js";

router.post("/", upload.single("file"), console.log("aaaaaaa"));

export { router };