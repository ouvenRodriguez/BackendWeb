import { Router } from "express";
const router = Router();
import Token from "../../middleware/token.js";
import * as CProjectReport from "../controllers/CProjectReport.js";


router.post("/search", Token.verifyToken, async (req, res) => {
    const response = await CProjectReport.searchProjects(req.body);
    res.status(200).json(response);
});

router.get("/institution", Token.verifyToken, async (req, res) => {
    const response = await CProjectReport.getProjectsByInstitution();
    res.status(200).json(response);
});

router.get("/coordinator", Token.verifyToken, async (req, res) => {
    const response = await CProjectReport.getProjectsByCoordinator();
    res.status(200).json(response);
});

router.get("/report/:projectId", Token.verifyToken, async (req, res) => {
    const response = await CProjectReport.generateProjectReport(req.params.projectId);
    res.status(200).json(response);
});

export default router; 