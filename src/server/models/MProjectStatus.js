import mongoose from 'mongoose';

const projectStatusSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: ['Formulación', 'Evaluación', 'Activo', 'Inactivo', 'Finalizado'],
        required: true
    },
    observation: {
        type: String,
        required: true
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    changedAt: {
        type: Date,
        default: Date.now
    }
});

const MProjectStatus = mongoose.model('ProjectStatus', projectStatusSchema);

export default MProjectStatus; 