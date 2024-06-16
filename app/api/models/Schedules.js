import mongoose, { Schema, model } from 'mongoose'

const scheduleSchema = new Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    label: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    notify: { type: Boolean, required: false, default: false },
    repeat: { type: Boolean, required: false, default: false },
    type: { type: String, required: true },
    selectedStaff: { type: Array, required: false, default: [] },
});

const Schedules = mongoose.models?.Schedules || model('Schedules', scheduleSchema)

export default Schedules