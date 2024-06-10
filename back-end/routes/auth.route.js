import express from "express";
import { register, login, logout } from "../controller/auth.controller.js";
import { registerValidation } from "../utils/registerValidation.js";
const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
