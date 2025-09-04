import {Router} from "express";
import {authMiddleware} from "../middlewares";
import {WorkflowController} from "../controllers/Workflow";
import {Role} from "../utils/consts";

const router = Router();

router.post("/", authMiddleware({role: Role.ADMIN}), WorkflowController.create);

router.get("/", authMiddleware({role: Role.ADMIN}), WorkflowController.getMany);

router.get("/:id", authMiddleware({role: Role.ADMIN}), WorkflowController.getOne);

router.put("/:id", authMiddleware({role: Role.ADMIN}), WorkflowController.update);

router.delete("/:id", authMiddleware({role: Role.ADMIN}), WorkflowController.delete);

export default router;