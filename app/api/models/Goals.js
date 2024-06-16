import mongoose, { Schema, model } from 'mongoose'

const goalSchema = new Schema({
    clientId: { type: String, required: true },
    createdBy: { type: String, required: true },
    goalName: { type: String, required: true },
    dueDate: { type: String, required: true },
    flagAt: { type: Number, required: true },
    maxFollowup: { type: Number, required: true },
    statusOnComplete: { type: String, required: true },
    progessStatus: { type: String, required: true },
}, { timestamps: true });

const Goals = mongoose.models?.Goals || model('Goals', goalSchema)
export default Goals