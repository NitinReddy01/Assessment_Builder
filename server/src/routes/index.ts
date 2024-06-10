import { Router } from "express";
import assessmentRouter from "./assessment";
import templateRouter from "./template";

const router = Router();

router.use('/',templateRouter);
router.use('/',assessmentRouter);

export default router;
