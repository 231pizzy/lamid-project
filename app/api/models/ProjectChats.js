// import mongoose, { Schema, model } from 'mongoose'

// const projectChatsSchema = new Schema({
//     sender: { type: String, required: true },
//     message: { type: String, required: false, default: '' },
//     goalName: { type: String, required: true },
//     workPhaseName: { type: String, required: true },
//     projectId: { type: String, required: true },
//     dateTime: { type: String, required: true },
//     file: { type: Boolean, required: false, default: false },
//     fileDataArray: { type: Array, required: false, default: [] },
//     link: { type: Boolean, required: false, default: false },
//     linkArray: { type: Array, required: false, default: [] },
// });

// const ProjectChats = mongoose.models?.ProjectChats || model('ProjectChats', projectChatsSchema)

// export default ProjectChats

import mongoose, { Schema, model } from 'mongoose'

const projectChatsSchema = new Schema({
    sender: { type: String, required: true },
    message: { type: String, required: false, default: '' },
    projectId: { type: String, required: true },
    file: { type: Boolean, required: false, default: false },
    fileDataArray: { type: Array, required: false, default: [] },
    link: { type: Boolean, required: false, default: false },
    linkArray: { type: Array, required: false, default: [] },
    dateTime: { type: String, required: true },
});

const ProjectChats = mongoose.models?.ProjectChats || model('ProjectChats', projectChatsSchema)

export default ProjectChats