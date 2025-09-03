import {Router} from "express";
import * as MapController from "../controllers/Map";
import {authMiddleware} from "../middlewares";
import {Role} from "../utils/consts";

const router = Router();

router.get('/:id', authMiddleware({role: Role.ADMIN}), MapController.getMap);

export default router;