import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from '../models/User'; // Import the User model

// Define the handler function for the GET method
export const GET = async (req) => {
    try {
        // Check if the MongoDB connection is ready
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to the database...');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        // Query all users from the database
        const users = await User.find({});

        // Return the list of users as a JSON response
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error(error);
        // Return an error response if an error occurs
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
