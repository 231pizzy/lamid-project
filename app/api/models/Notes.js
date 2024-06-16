import mongoose, { Schema, model } from 'mongoose'

const noteSchema = new Schema({
    clientId: { type: String, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
    attachments: { type: Array, required: false },
}, { timestamps: true });

const Notes = mongoose.models?.Notes || model('Notes', noteSchema)
export default Notes