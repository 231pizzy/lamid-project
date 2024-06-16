import mongoose, { Schema, model } from 'mongoose'

const projectGroupSchema = new Schema({
    color: { type: String, required: true },
    purpose: { type: String, required: true },
    projectName: { type: String, required: true },
    workPhases: { type: Array, required: true },
});

const ProjectGroups = mongoose.models?.ProjectGroups || model('ProjectGroups', projectGroupSchema)

export default ProjectGroups

// import mongoose, { Schema, model } from 'mongoose'

// const projectGroupSchema = new Schema({
//     color: { type: String, required: true },
//     purpose: { type: String, required: true },
//     projectName: { type: String, required: true },
//     workPhases: { type: Array, required: true },
// });

// const ProjectGroups = mongoose.models?.ProjectGroups || model('ProjectGroups', projectGroupSchema)

// export default ProjectGroups

// import mongoose, { Schema, model } from 'mongoose';

// // Define a schema for tasks within a work phase
// const taskSchema = new Schema({
//     taskName: { type: String, required: true },
//     budget: { type: Number, required: true },
//     status: { type: String, required: true },
//     taskMembers: { type: [String], required: true }
// });

// // Define a schema for a single work phase
// const workPhaseSchema = new Schema({
//     goalName: { type: String, required: true },
//     goalStatus: { type: String, required: true },
//     tasks: { type: [taskSchema], required: true }
// });

// // Define the main schema for project groups
// const projectGroupSchema = new Schema({
//     color: { type: String, required: true },
//     purpose: { type: String, required: true },
//     projectName: { type: String, required: true },
//     workPhases: { type: [workPhaseSchema], required: true }
// });

// // Create the ProjectGroups model
// const ProjectGroups = mongoose.models?.ProjectGroups || model('ProjectGroups', projectGroupSchema);

// export default ProjectGroups;
