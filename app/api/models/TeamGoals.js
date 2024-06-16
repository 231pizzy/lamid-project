import mongoose, { Schema, model } from 'mongoose';

const teamGoalSchema = new Schema({
    goalName: { type: String, required: true },
    tasks: { type: Array, required: true },
    goalStatus: { 
        type: String, 
        enum: ['To do', 'In progress', 'In review', 'Completed'], 
        default: 'To do' 
    },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const TeamGoal = mongoose.models?.TeamGoal || model('TeamGoal', teamGoalSchema);

export default TeamGoal;
