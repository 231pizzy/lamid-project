import mongoose, { Schema, model } from 'mongoose'

const supervisorEvaluationSchema = new Schema({
    questionAndAnswers: { type: Array, required: true },
    outcome: { type: Object, required: true, default: {} },
    nextStep: { type: String, required: true },
    appetiteRanking: { type: String, required: true },
    handlerPerformance: { type: String, required: true },
    files: { type: Array, required: false, default: [] },
    clientId: { type: String, required: true },
    goalId: { type: String, required: false },
    userId: { type: String, required: true },
    followupId: { type: String, required: true },
}, { timestamps: true });

const SupervisorEvaluations = mongoose.models?.SupervisorEvaluations || model('SupervisorEvaluations', supervisorEvaluationSchema)

SupervisorEvaluations.schema.add({
    userId: { type: String, required: true },
    followupId: { type: String, required: true },
})

export default SupervisorEvaluations