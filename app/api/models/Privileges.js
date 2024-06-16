import mongoose, { Schema, model } from 'mongoose'

const privilegeSchema = new Schema({
    name: { type: String, required: true },
    privilegeObject: { type: Object, required: false, default: {} },
});

const Privileges = mongoose.models?.Privileges || model('Privileges', privilegeSchema)

export default Privileges