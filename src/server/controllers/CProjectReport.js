import MProject from "../models/MProject.js";
import MProjectStatus from "../models/MProjectStatus.js";
import MMilestone from "../models/MMilestone.js";
import logger from "../../middleware/logger.js";
import { apiProject } from "../../utils/constans.js";

export const searchProjects = async (filters) => {
    const ctx = { ctx: apiProject + "[/search] [CONTROLLER] [searchProjects]" };
    try {
        const query = {};

        // Filtros por estado
        if (filters.status) {
            query.status = filters.status;
        }

        // Filtros por área
        if (filters.area) {
            query.area = { $regex: filters.area, $options: 'i' };
        }

        // Filtros por título
        if (filters.title) {
            query.title = { $regex: filters.title, $options: 'i' };
        }

        // Filtros por fecha de creación
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const projects = await MProject.find(query)
            .populate('coordinator', 'name email')
            .populate('team', 'name email')
            .sort({ createdAt: -1 });

        return {
            success: true,
            body: {
                data: projects,
                message: "Proyectos encontrados correctamente"
            }
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al buscar proyectos" } };
    }
}

export const getProjectsByInstitution = async () => {
    const ctx = { ctx: apiProject + "[/institution] [CONTROLLER] [getProjectsByInstitution]" };
    try {
        // Agrupar proyectos por institución
        const projects = await MProject.aggregate([
            {
                $group: {
                    _id: "$institution",
                    projects: {
                        $push: {
                            id: "$_id",
                            title: "$title",
                            area: "$area",
                            status: "$status",
                            coordinator: "$coordinator",
                            team: "$team",
                            createdAt: "$createdAt"
                        }
                    },
                    totalProjects: { $sum: 1 }
                }
            },
            {
                $project: {
                    institution: "$_id",
                    projects: 1,
                    totalProjects: 1,
                    _id: 0
                }
            },
            { $sort: { institution: 1 } }
        ]);

        // Poblar la información de coordinadores y equipo
        const populatedProjects = await Promise.all(
            projects.map(async (group) => {
                const populatedProjects = await Promise.all(
                    group.projects.map(async (project) => {
                        const populatedProject = await MProject.findById(project.id)
                            .populate('coordinator', 'name email')
                            .populate('team', 'name email');
                        return {
                            ...project,
                            coordinator: populatedProject.coordinator,
                            team: populatedProject.team
                        };
                    })
                );
                return {
                    ...group,
                    projects: populatedProjects
                };
            })
        );

        return {
            success: true,
            body: {
                data: populatedProjects,
                message: "Proyectos agrupados por institución obtenidos correctamente"
            }
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener proyectos por institución" } };
    }
}

export const getProjectsByCoordinator = async () => {
    const ctx = { ctx: apiProject + "[/coordinator] [CONTROLLER] [getProjectsByCoordinator]" };
    try {
        // Agrupar proyectos por coordinador
        const projects = await MProject.aggregate([
            {
                $group: {
                    _id: "$coordinator",
                    projects: {
                        $push: {
                            id: "$_id",
                            title: "$title",
                            area: "$area",
                            status: "$status",
                            institution: "$institution",
                            team: "$team",
                            createdAt: "$createdAt"
                        }
                    },
                    totalProjects: { $sum: 1 }
                }
            },
            {
                $project: {
                    coordinatorId: "$_id",
                    projects: 1,
                    totalProjects: 1,
                    _id: 0
                }
            }
        ]);

        // Poblar la información de coordinadores y equipo
        const populatedProjects = await Promise.all(
            projects.map(async (group) => {
                const coordinator = await MProject.findById(group.projects[0].id)
                    .populate('coordinator', 'name email')
                    .then(p => p.coordinator);

                const populatedProjects = await Promise.all(
                    group.projects.map(async (project) => {
                        const populatedProject = await MProject.findById(project.id)
                            .populate('team', 'name email');
                        return {
                            ...project,
                            team: populatedProject.team
                        };
                    })
                );

                return {
                    coordinator,
                    projects: populatedProjects,
                    totalProjects: group.totalProjects
                };
            })
        );

        return {
            success: true,
            body: {
                data: populatedProjects,
                message: "Proyectos agrupados por coordinador obtenidos correctamente"
            }
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al obtener proyectos por coordinador" } };
    }
}

export const generateProjectReport = async (projectId) => {
    const ctx = { ctx: apiProject + "[/report] [CONTROLLER] [generateProjectReport]" };
    try {
        const project = await MProject.findById(projectId)
            .populate('coordinator', 'name email')
            .populate('team', 'name email');

        if (!project) {
            return { success: false, body: { error: "Proyecto no encontrado" } };
        }

        // Obtener historial de estados
        const statusHistory = await MProjectStatus.find({ projectId })
            .populate('changedBy', 'name email')
            .sort({ changedAt: -1 });

        // Obtener hitos
        const milestones = await MMilestone.find({ _id: { $in: project.milestones } })
            .sort({ date: -1 });

        // Preparar datos para el reporte
        const reportData = {
            project: {
                title: project.title,
                area: project.area,
                objectives: project.objectives,
                timeline: project.timeline,
                budget: project.budget,
                institution: project.institution,
                status: project.status,
                coordinator: project.coordinator,
                team: project.team,
                comments: project.comments
            },
            statusHistory: statusHistory.map(status => ({
                status: status.status,
                observation: status.observation,
                changedBy: status.changedBy,
                changedAt: status.changedAt
            })),
            milestones: milestones.map(milestone => ({
                date: milestone.date,
                description: milestone.description,
                documents: milestone.documents,
                photos: milestone.photos
            }))
        };

        return {
            success: true,
            body: {
                data: reportData,
                message: "Reporte generado correctamente"
            }
        };
    } catch (error) {
        console.log(error);
        logger.child(ctx).error(error);
        return { success: false, body: { error: "Error al generar el reporte" } };
    }
} 