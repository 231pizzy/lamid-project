import mongoose, { Schema, model } from 'mongoose'

const followupSchema = new Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    files: { type: Array, required: false, default: [] },
    contactMode: { type: Array, required: true },
    clientId: { type: String, required: true },
    goalId: { type: String, required: false },
    nextStep: { type: String, required: true },
    appetiteRanking: { type: String, required: true },
    outcome: { type: Object, required: false, default: {} },
    questionAndAnswers: { type: Array, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });

const Followups = mongoose.models?.Followups || model('Followups', followupSchema)

Followups.schema.add({
    goalId: { type: String, required: false },
    contactMode: { type: Array, required: true },
    nextStep: { type: String, required: true },
    appetiteRanking: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: String, required: false },
    outcome: { type: Object, required: false, default: {} },
    questionAndAnswers: { type: Array, required: true },
})

export default Followups