import mongoose, { Schema, model } from 'mongoose'

const contactSchema = new Schema({
    fullName: { type: String, required: true },
    company: { type: String, required: true },
    sector: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    status: { type: String, required: false, default: 'not assigned' },
    supervisor: { type: Array, required: false, default: [] },
    rep: { type: Array, required: false, default: [] },
    handler: { type: Array, required: false, default: [] },
    stage: { type: String, required: false, default: 'prospect' },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    social: { type: Object, required: false, default: [] },
}, { timestamps: true });

const Contacts = mongoose.models?.Contacts || model('Contacts', contactSchema)
Contacts.schema.add({
    status: { type: String, required: false, default: 'not assigned' },
    supervisor: { type: Array, required: false, default: [] },
    rep: { type: Array, required: false, default: [] },
    handler: { type: Array, required: false, default: [] },
    stage: { type: String, required: false, default: 'prospect' },
})

export default Contacts