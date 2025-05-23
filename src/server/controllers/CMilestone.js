import MMilestone from "../models/MMilestone.js";
import MProject from "../models/MProject.js";
import logger from "../../middleware/logger.js";
import { apiProject } from "../../utils/constans.js";

export const createMilestone = async (projectId, data) => {
    const ctx = { ctx: apiProject + "[/milestone/create] [CONTROLLER] [createMilestone]" };
    try {
        const milestone = await MMilestone.create(data);
        await MProject.findByIdAndUpdate(projectId, {
            $push: { milestones: milestone._id }
        });
        return { success: true, body: { message: "Hito creado correctamente", data: milestone } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al crear el hito" } };
    }
}

export const getProjectMilestones = async (projectId) => {
    const ctx = { ctx: apiProject + "[/milestone/all] [CONTROLLER] [getProjectMilestones]" };
    try {
        const project = await MProject.findById(projectId).populate('milestones');
        return { success: true, body: { data: project.milestones, message: "Hitos obtenidos correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener los hitos" } };
    }
}

export const updateMilestone = async (milestoneId, data) => {
    const ctx = { ctx: apiProject + "[/milestone/update] [CONTROLLER] [updateMilestone]" };
    try {
        const milestone = await MMilestone.findByIdAndUpdate(milestoneId, data, { new: true });
        return { success: true, body: { message: "Hito actualizado correctamente", data: milestone } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al actualizar el hito" } };
    }
}

export const deleteMilestone = async (projectId, milestoneId) => {
    const ctx = { ctx: apiProject + "[/milestone/delete] [CONTROLLER] [deleteMilestone]" };
    try {
        await MMilestone.findByIdAndDelete(milestoneId);
        await MProject.findByIdAndUpdate(projectId, {
            $pull: { milestones: milestoneId }
        });
        return { success: true, body: { message: "Hito eliminado correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al eliminar el hito" } };
    }
} 