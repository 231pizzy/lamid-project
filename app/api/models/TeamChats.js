import mongoose, { Schema, model } from 'mongoose'

const teamChatsSchema = new Schema({
    sender: { type: String, required: true },
    message: { type: String, required: false, default: '' },
    teamId: { type: String, required: true },
    file: { type: Boolean, required: false, default: false },
    fileDataArray: { type: Array, required: false, default: [] },
    link: { type: Boolean, required: false, default: false },
    linkArray: { type: Array, required: false, default: [] },
    dateTime: { type: String, required: true },
});

const TeamChats = mongoose.models?.TeamChats || model('TeamChats', teamChatsSchema)

export default TeamChats