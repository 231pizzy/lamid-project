import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import Folder from '../models/Folders';
import Document from '../models/Documents';
// Define the handler function for the POST method
export const POST = async (req) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('connecting to db');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        // Handle the POST request
        const { name } = await req.json();

        const existingFolder = await Folder.findOne({ name })

        if (existingFolder) {
            return new NextResponse("Folder already exists", { status: 400 })
          }
        const newFolder = await Folder.create({ name });

        await newFolder.save();

        return NextResponse.json(newFolder, { status: 200 })
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


// Define the handler function for the GET method

export const GET = async (req) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('connecting to db');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }
  
      const folders = await Folder.find().sort({ createdAt: "desc" })
  
      return NextResponse.json(folders, { status: 200 })
    } catch (err) {
      console.log("[folders_GET]", err)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }

  // Function to update folder name 
  export const PUT = async (req) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('connecting to db');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        const { name, folderId } = await req.json();

        // Check if folderId is provided
        if (folderId) {
            // Update existing folder
            const existingFolder = await Folder.findById(folderId);
            if (!existingFolder) {
                return new NextResponse("Folder not found", { status: 404 });
            }

            // Check if the new name already exists
            const folderWithSameName = await Folder.findOne({ name });
            if (folderWithSameName && folderWithSameName._id.toString() !== folderId) {
                return new NextResponse("Folder with the same name already exists", { status: 400 });
            }

            existingFolder.name = name;
            await existingFolder.save();

            return NextResponse.json(existingFolder, { status: 200 });
        } else {
            // Create new folder
            const existingFolder = await Folder.findOne({ name });
            if (existingFolder) {
                return new NextResponse("Folder already exists", { status: 400 });
            }

            const newFolder = await Folder.create({ name });
            await newFolder.save();

            return NextResponse.json(newFolder, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

// Delete folder
// export const DELETE = async (req) => {
//     try {
//         // Ensure database connection
//         if (mongoose.connection.readyState !== 1) {
//             console.log('connecting to db');
//             const dbName = process.env.DB_NAME;
//             const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
//             await mongoose.connect(URI, { dbName: dbName });
//         }

//         const { folderId } = await req.json();

//         // Check if folderId is provided
//         if (!folderId) {
//             return new NextResponse("Missing folderId", { status: 400 });
//         }

//         // Find the folder by its ID
//         const existingFolder = await Folder.findById(folderId);
//         if (!existingFolder) {
//             return new NextResponse("Folder not found", { status: 404 });
//         }

//         // Delete all documents with the matching folderId
//         await Document.deleteMany({ folderId });

//         // Delete the folder
//         await Folder.findByIdAndDelete(folderId);

//         return NextResponse.json({ message: "Folder and associated documents deleted successfully" }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return new NextResponse("Internal Server Error", { status: 500 });
//     }
// };

export const DELETE = async (req) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        const { folderIds } = await req.json();

        if (!folderIds || !Array.isArray(folderIds)) {
            return new NextResponse("Missing or invalid folderIds", { status: 400 });
        }

        for (const folderId of folderIds) {
            const existingFolder = await Folder.findById(folderId);
            if (!existingFolder) {
                console.log(`Folder with ID ${folderId} not found`);
                continue;
            }

            await Document.deleteMany({ folderId });
            await Folder.findByIdAndDelete(folderId);
        }

        return NextResponse.json({ message: "Folders and associated documents deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
