import {Router} from "express";
import {authMiddleware} from "../middlewares";
import {ScheduleController} from "../controllers/Schedule";
import {Role} from "../utils/consts";

const router = Router();

router.post("/", authMiddleware({role: Role.ADMIN}), ScheduleController.create);

router.post("/bulk", authMiddleware({role: Role.ADMIN}), ScheduleController.createBulk);

router.get("/", authMiddleware({role: Role.ADMIN}), ScheduleController.getMany);

router.get("/:id", authMiddleware({role: Role.ADMIN}), ScheduleController.getOne);

router.put("/:id", authMiddleware({role: Role.ADMIN}), ScheduleController.update);

router.delete("/:id", authMiddleware({role: Role.ADMIN}), ScheduleController.delete);

export default router;