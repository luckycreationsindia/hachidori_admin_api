import {Router} from "express";
import * as MapController from "../controllers/Map";

const router = Router();

router.get('/:id', MapController.getMap);

export default router;