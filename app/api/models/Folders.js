import mongoose, { Schema, model } from 'mongoose';

const folderSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Folder = mongoose.models?.Folder || model('Folder', folderSchema);

export default Folder;
