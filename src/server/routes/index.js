import { Router } from "express";
import RUser from "./RUser.js";
import RProject from "./RProject.js";
import RMilestone from "./RMilestone.js";
import RProjectStatus from "./RProjectStatus.js";
import RProjectReport from "./RProjectReport.js";
const router = Router();

router.use("/user", RUser);
router.use("/project", RProject);
router.use("/milestone", RMilestone);
router.use("/project-status", RProjectStatus);
router.use("/project-report", RProjectReport);

router.get("/", (req, res) => {
  res.json({ message: "API Web v1.0" });
});

export default router;
