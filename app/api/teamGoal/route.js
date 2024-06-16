import { NextResponse, NextRequest } from "next/server";
import mongoose from 'mongoose';
import TeamGoal from '../models/TeamGoals';

export const POST = async (req) => {
    try {
        // Check if the MongoDB connection is ready
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to the database...');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        // Parse the request body to extract necessary data
        const { goalName, tasks, teamId } = await req.json();

        // Check if there is any other team goal with the same goal name
        const existingGoal = await TeamGoal.findOne({ goalName });

        if (existingGoal) {
            return new NextResponse("A team goal with the same name already exists", { status: 400 });
        }

        // Create a new team goal object
        const newTeamGoal = await TeamGoal.create({
            goalName,
            tasks,
            teamId
        });

        // Save the newly created team goal to the database
        await newTeamGoal.save();

        // Return a success response with the newly created team goal
        return NextResponse.json(newTeamGoal, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (NextRequest) => {
    try {
        // Check if the MongoDB connection is ready
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to the database...');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }
        const searchParams = new URLSearchParams(NextRequest.nextUrl.search);
        
        // Extract the teamId from the request query parameters
        const teamId  = searchParams.get("teamId");

         // Check if teamId is provided
         if (!teamId) {
            return new NextResponse("Missing teamId parameter", { status: 400 });
        }

        // Retrieve all team goals for the given teamId
        const teamGoals = await TeamGoal.find({ teamId });

        // Return the list of team goals as a response
        return NextResponse.json(teamGoals, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};