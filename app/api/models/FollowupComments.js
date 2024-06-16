import mongoose, { Schema, model } from 'mongoose'

const followupCommentsSchema = new Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    comment: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    followupId: { type: String, required: true },
});

const FollowupComments = mongoose.models?.FollowupComments || model('FollowupComments', followupCommentsSchema)

export default FollowupComments