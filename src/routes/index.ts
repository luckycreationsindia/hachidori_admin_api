import {Router} from "express";
import AuthRoutes from "./AuthRoutes";
import MiscRoutes from "./MiscRoutes";

const router = Router();

router.get('/', (req, res) => res.json({status: 1}));

router.use(AuthRoutes);

router.use(MiscRoutes);

export default router;