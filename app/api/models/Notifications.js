import mongoose, { Schema, model } from 'mongoose'

const notificationSchema = new Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    recipients: { type: Array, required: true },
    details: { type: String, required: true },
    delivered: { type: Boolean, required: false, default: false },
    read: { type: Boolean, required: false, default: false },
});

const Notifications = mongoose.models?.Notifications || model('Notifications', notificationSchema)

export default Notifications