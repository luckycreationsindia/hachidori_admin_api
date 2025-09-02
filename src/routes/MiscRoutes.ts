import {Router} from "express";
import * as MiscController from "../controllers/Misc";
import {authMiddleware} from "../middlewares";

const router = Router();

router.post('/refresh', authMiddleware(), MiscController.refreshSession);

export default router;