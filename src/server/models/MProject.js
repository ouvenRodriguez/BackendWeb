import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        
    },
    area: {
        type: String,
    
    },
    objectives: {
        type: String,
    
    },
    dateStart: {
        type: String,
        
    },
    dateEnd: {
        type: String,
        
    },
    budget: {
        type: String,

    },
    institution: {
        type: String,
    },
    team: {
        type: Array,

    },  
    comments: {
        type: String,

    },
    status: {
        type: String,
        enum: ['Formulación', 'Evaluación', 'Activo', 'Inactivo', 'Finalizado'],
        default: 'Activo'
    },

    milestones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone'
    }]
});

const MProject = mongoose.model('Project', projectSchema);

export default MProject;