// import mongoose, { Schema, model } from 'mongoose'

// const documentSchema = new Schema({
//     name: { type: String, required: true },
//     filename: { type: String, required: true },
//     extension: { type: String, required: true },
//     dateTime: { type: String, required: true },
//     downloads: { type: Number, required: false, default: 0 },
// });

// const Documents = mongoose.models?.Documents || model('Documents', documentSchema)

// export default Documents


import mongoose, { Schema, model } from 'mongoose';

const documentSchema = new Schema({
    name: { type: String, required: true },
    filename: { type: String, required: true },
    extension: { type: String, required: true },
    dateTime: { type: String, required: true },
    downloads: { type: Number, required: false, default: 0 },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder' } // Reference to the Folder model
});

const Document = mongoose.models?.Document || model('Document', documentSchema);

export default Document;
