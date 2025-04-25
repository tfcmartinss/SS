import express from "express";

import { token, authorize, register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/authorize", authorize);
router.post("/token", token);

export default router;