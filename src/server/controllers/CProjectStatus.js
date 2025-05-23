import MProject from "../models/MProject.js";
import MProjectStatus from "../models/MProjectStatus.js";
import logger from "../../middleware/logger.js";
import { apiProject } from "../../utils/constans.js";

export const changeProjectStatus = async (projectId, userId, { status, observation }) => {
    const ctx = { ctx: apiProject + "[/status/change] [CONTROLLER] [changeProjectStatus]" };
    try {
        // Verificar que el proyecto existe
        const project = await MProject.findById(projectId);
        if (!project) {
            return { success: false, body: { error: "Proyecto no encontrado" } };
        }

        // Verificar que el usuario es el coordinador
        if (project.coordinator.toString() !== userId) {
            return { success: false, body: { error: "Solo el coordinador puede cambiar el estado del proyecto" } };
        }

        // Crear registro en el historial
        await MProjectStatus.create({
            projectId,
            status,
            observation,
            changedBy: userId
        });

        // Actualizar estado actual del proyecto
        await MProject.findByIdAndUpdate(projectId, { status });

        return { 
            success: true, 
            body: { 
                message: "Estado del proyecto actualizado correctamente",
                status,
                observation
            } 
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al cambiar el estado del proyecto" } };
    }
}

export const getProjectStatusHistory = async (projectId) => {
    const ctx = { ctx: apiProject + "[/status/history] [CONTROLLER] [getProjectStatusHistory]" };
    try {
        const statusHistory = await MProjectStatus.find({ projectId })
            .populate('changedBy', 'name email')
            .sort({ changedAt: -1 });

        return { 
            success: true, 
            body: { 
                data: statusHistory,
                message: "Historial de estados obtenido correctamente" 
            } 
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener el historial de estados" } };
    }
}

export const getCurrentProjectStatus = async (projectId) => {
    const ctx = { ctx: apiProject + "[/status/current] [CONTROLLER] [getCurrentProjectStatus]" };
    try {
        const project = await MProject.findById(projectId)
            .populate('coordinator', 'name email');

        if (!project) {
            return { success: false, body: { error: "Proyecto no encontrado" } };
        }

        return { 
            success: true, 
            body: { 
                data: {
                    status: project.status,
                    coordinator: project.coordinator
                },
                message: "Estado actual obtenido correctamente" 
            } 
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener el estado actual" } };
    }
} 