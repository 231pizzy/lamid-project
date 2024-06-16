import mongoose, { Schema, model } from 'mongoose';

const teamSchema = new Schema({
    teamAvatar: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    members: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Team = mongoose.models?.Team || model('Team', teamSchema);

export default Team;
