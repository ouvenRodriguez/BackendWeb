import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    documents: [{
        type: String,
        required: false
    }],
    photos: [{
        type: String,
        required: false
    }]
});

const MMilestone = mongoose.model('Milestone', milestoneSchema);

export default MMilestone; 