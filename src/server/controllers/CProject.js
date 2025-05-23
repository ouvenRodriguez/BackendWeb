import MProject from "../models/MProject.js";
import MUser from "../models/MUser.js";
import logger from "../../middleware/logger.js";
import { apiProject } from "../../utils/constans.js";


export const createProject = async (data) => {
    const ctx = { ctx: apiProject + "[/create] [CONTROLLER] [createProject]" };
    try {
        await MProject.create(data);
        return { success: true, body: { message: "Proyecto creado correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al crear el proyecto" } };
    }
}

export const updateProjectStatus = async (projectId, data) => {
    const ctx = { ctx: apiProject + "[/update-status] [CONTROLLER] [updateProjectStatus]" };
    try {
        await MProject.findByIdAndUpdate(projectId, data);
        return { success: true, body: { message: "Proyecto actualizado correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al actualizar el proyecto" } };
    }
}


export const getAllProjects = async () => {
    const ctx = { ctx: apiProject + "[/all] [CONTROLLER] [getAllProjects]" };
    try {
        const projects = await MProject.find({});
        
        // Get team member names for each project
        const projectsWithTeamNames = await Promise.all(projects.map(async (project) => {
            const teamMembers = await Promise.all(project.team.map(async (memberId) => {
                const user = await MUser.findById(memberId.id || memberId);
                return user ? { id: memberId.id || memberId, name: `${user.name} ${user.lastName}` } : null;
            }));
            
            return {
                ...project.toObject(),
                team: teamMembers.filter(member => member !== null)
            };
        }));

        return { success: true, body: { data: projectsWithTeamNames, message: "Proyectos obtenidos correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener los proyectos" } };
    }
}

export const getProjectById = async (projectId) => {
    const ctx = { ctx: apiProject + "[/id] [CONTROLLER] [getProjectById]" };
    try {
        const project = await MProject.findById(projectId);
        
        if (!project) {
            return { success: false, body: { error: "Proyecto no encontrado" } };
        }

        // Get team member names
        const teamMembers = await Promise.all(project.team.map(async (memberId) => {
            const user = await MUser.findById(memberId.id || memberId);
            return user ? { id: memberId.id || memberId, name: `${user.name} ${user.lastName}` } : null;
        }));

        const projectWithTeamNames = {
            ...project.toObject(),
            team: teamMembers.filter(member => member !== null)
        };

        return { success: true, body: { data: projectWithTeamNames, message: "Proyecto obtenido correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener el proyecto" } };
    }
};

export const updateProject = async (projectId, data) => {
    const ctx = { ctx: apiProject + "[/update] [CONTROLLER] [updateProject]" };
    try {
        await MProject.findByIdAndUpdate(projectId, data);
        return { success: true, body: { message: "Proyecto actualizado correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al actualizar el proyecto" } };
    }
};

export const deleteProject = async (projectId) => {
    const ctx = { ctx: apiProject + "[/delete] [CONTROLLER] [deleteProject]" };
    try {
        await MProject.findByIdAndDelete(projectId);
        return { success: true, body: { message: "Proyecto eliminado correctamente" } };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al eliminar el proyecto" } };
    }
}