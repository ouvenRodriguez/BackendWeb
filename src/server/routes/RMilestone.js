import { Router } from "express";
const router = Router();
import Token from "../../middleware/token.js";
import * as CMilestone from "../controllers/CMilestone.js";
import upload from "../../middleware/multer.js";

// Create milestone with file uploads
router.post("/:projectId/milestone", 
    Token.verifyToken, 
    Token.validateRole(["Profesor", "Estudiante"]), 
    upload.fields([
        { name: 'documents', maxCount: 5 },
        { name: 'photos', maxCount: 5 }
    ]),
    async (req, res) => {
        try {
            const files = req.files;
            const milestoneData = {
                ...req.body,
                documents: files?.documents?.map(file => file.path) || [],
                photos: files?.photos?.map(file => file.path) || []
            };
            const response = await CMilestone.createMilestone(req.params.projectId, milestoneData);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ success: false, body: { error: "Error al procesar los archivos" } });
        }
    }
);


router.get("/:projectId/milestones", Token.verifyToken, async (req, res) => {
    const response = await CMilestone.getProjectMilestones(req.params.projectId);
    res.status(200).json(response);
});


router.put("/:projectId/milestone/:milestoneId", 
    Token.verifyToken, 
    Token.validateRole(["Profesor", "Estudiante"]), 
    upload.fields([
        { name: 'documents', maxCount: 5 },
        { name: 'photos', maxCount: 5 }
    ]),
    async (req, res) => {
        try {
            const files = req.files;
            const milestoneData = {
                ...req.body,
                documents: files?.documents?.map(file => file.path) || [],
                photos: files?.photos?.map(file => file.path) || []
            };
            const response = await CMilestone.updateMilestone(req.params.milestoneId, milestoneData);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ success: false, body: { error: "Error al procesar los archivos" } });
        }
    }
);


router.delete("/:projectId/milestone/:milestoneId", 
    Token.verifyToken, 
    Token.validateRole(["Profesor"]), 
    async (req, res) => {
        const response = await CMilestone.deleteMilestone(req.params.projectId, req.params.milestoneId);
        res.status(200).json(response);
    }
);

export default router;
  