import mongoose, { Schema, model } from 'mongoose'

const formSchema = new Schema({
    formTitle: { type: String, required: true },
    formJSON: { type: Array, required: false, default: [] },
});

const Forms = mongoose.models?.Forms || model('Forms', formSchema)

export default Forms