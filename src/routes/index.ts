import {Router} from "express";
import AuthRoutes from "./AuthRoutes";
import MiscRoutes from "./MiscRoutes";
import MapRoutes from "./Map";
import ScheduleRoutes from "./Schedule";
import WorkflowRoutes from "./Workflow";

const router = Router();

router.get('/', (req, res) => res.json({status: 1}));

router.use(AuthRoutes);

router.use(MiscRoutes);

router.use("/map", MapRoutes);

router.use("/schedule", ScheduleRoutes);

router.use("/workflow", WorkflowRoutes);

export default router;