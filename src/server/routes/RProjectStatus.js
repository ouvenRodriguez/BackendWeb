import { Router } from "express";
const router = Router();
import Token from "../../middleware/token.js";
import * as CProjectStatus from "../controllers/CProjectStatus.js";

// Cambiar estado del proyecto
router.post("/:projectId/status", 
    Token.verifyToken, 
    Token.validateRole(["Profesor"]), 
    async (req, res) => {
        const response = await CProjectStatus.changeProjectStatus(
            req.params.projectId,
            req.user.id,
            req.body
        );
        res.status(200).json(response);
    }
);

// Obtener historial de estados
router.get("/:projectId/status/history", 
    Token.verifyToken, 
    async (req, res) => {
        const response = await CProjectStatus.getProjectStatusHistory(req.params.projectId);
        res.status(200).json(response);
    }
);

// Obtener estado actual
router.get("/:projectId/status/current", 
    Token.verifyToken, 
    async (req, res) => {
        const response = await CProjectStatus.getCurrentProjectStatus(req.params.projectId);
        res.status(200).json(response);
    }
);

export default router; 