import mongoose from 'mongoose';
import { NextResponse, NextRequest } from "next/server";
import TeamGoal from '../models/TeamGoals';
import Team from '../models/Teams';

// UPDATING TASK STATUS
export const POST = async (req) => {
    try {
        console.log("Received Request Body:", req.body);

        // Check if the MongoDB connection is ready
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to the database...');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        // Parse the request body to extract necessary data
        const { goalId, taskName, newTaskStatus } = await req.json();
        console.log("Parsed Data - goalId:", goalId, "taskName:", taskName, "newTaskStatus:", newTaskStatus);

        // Find the TeamGoal by ID
        const goal = await TeamGoal.findById(goalId);
        if (!goal) {
            return new NextResponse("Goal not found", { status: 404 });
        }

        // Find the task by taskName within the goal's tasks array
        const taskToUpdate = goal.tasks.find(task => task.taskName === taskName);
        if (!taskToUpdate) {
            return new NextResponse("Task not found", { status: 404 });
        }

        // Update the taskStatus
        taskToUpdate.taskStatus = newTaskStatus;
        goal.markModified('tasks'); // Mark the 'tasks' array as modified
        await goal.save();

        // Return a success response with the updated task
        return new NextResponse(goal, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

// Get all team names
export const GET = async () => {
    try {
        // Retrieve all teams from the database
        const teams = await Team.find();

        // Extract names of all teams
        const teamNames = teams.map(team => team.name);

        // Return the list of team names as a JSON response
        return NextResponse.json(teamNames, { status: 200 });
    } catch (error) {
        console.error('Error fetching team names:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};