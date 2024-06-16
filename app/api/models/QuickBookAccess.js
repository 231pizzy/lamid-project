import mongoose, { Schema, model } from 'mongoose'

const quickbookSchema = new Schema({
    access_token: { type: String, required: true },
    token_type: { type: String, required: true },
    x_refresh_token_expires_in: { type: Number, required: true },
    refresh_token: { type: String, required: true },
    expires_in: { type: Number, required: true },
});

const Quickbook = mongoose.models?.Quickbook || model('Quickbook', quickbookSchema)

export default Quickbook