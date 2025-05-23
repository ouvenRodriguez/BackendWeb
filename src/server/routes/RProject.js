import { Router } from "express";
const router = Router();
import Token from "../../middleware/token.js";
import * as CProject from "../controllers/CProject.js";
import * as CMilestone from "../controllers/CMilestone.js";

router.post("/create", Token.verifyToken, Token.validateRole(["Profesor"]), async (req, res) => {
  const response = await CProject.createProject(req.body);
  res.status(200).json(response);
});

router.get("/all", Token.verifyToken, Token.validateRole(["Profesor", "Coordinador"]), async (req, res) => {
  const response = await CProject.getAllProjects(req.body);
  res.status(200).json(response);
});

router.get("/get/:projectId", Token.verifyToken, Token.validateRole(["Profesor"]), async (req, res) => {
  const response = await CProject.getProjectById(req.params.projectId);
  res.status(200).json(response);
});

router.put("/update/:projectId", Token.verifyToken, Token.validateRole(["Profesor"]), async (req, res) => {
  const response = await CProject.updateProject(req.params.projectId, req.body);
  res.status(200).json(response);
});

router.put("/update-status/:projectId", Token.verifyToken, Token.validateRole(["Profesor"]), async (req, res) => {
  const response = await CProject.updateProjectStatus(req.params.projectId, req.body);
  res.status(200).json(response);
});

router.delete("/delete/:projectId", Token.verifyToken, Token.validateRole(["Profesor"]), async (req, res) => {
  const response = await CProject.deleteProject(req.params.projectId);
  res.status(200).json(response);
});









export default router;
