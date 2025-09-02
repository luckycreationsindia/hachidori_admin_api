import {Router} from "express";
import {authMiddleware} from "../middlewares";
import * as UserController from "../controllers/User";

const router = Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/logout", authMiddleware(), UserController.logout);

router.get('/profile', authMiddleware(), UserController.profile);

export default router;