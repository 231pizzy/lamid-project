import { NextResponse, NextRequest } from "next/server";
import mongoose from 'mongoose';
import Team from '../models/Teams';
import User from '../models/User';
import TeamGoal from '../models/TeamGoals';


export const GET = async (NextRequest) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to the database...');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }
        // Retrieve the search parameters from the NextRequest object
        const searchParams = new URLSearchParams(NextRequest.nextUrl.search);

        // Retrieve the teamId from the search parameters
        const teamId = searchParams.get("teamId");

        // Check if teamId is provided
        if (!teamId) {
            return new NextResponse("Missing teamId parameter", { status: 400 });
        }

        // Retrieve the team by ID
        const team = await Team.findById(teamId);

        // Fetch user data for each member
        const memberData = [];
        for (const memberId of team.members) {
            const user = await User.findById(memberId);
            if (user) {
                memberData.push(user);
            }
        }

        // Replace userIds with user data in the team object
        team.members = memberData;

        // Return the team with user data as a JSON response
        return NextResponse.json(team, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

// UPDATING GOAL STATUS
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
        const { goalId, newStatus } = await req.json();

        // Find the TeamGoal by ID
        const goal = await TeamGoal.findById(goalId);
        if (!goal) {
            return new NextResponse("Goal not found", { status: 404 });
        }

        // Update the goalStatus
        goal.goalStatus = newStatus;
        await goal.save();

        // Return a success response with the updated goal
        return new NextResponse(goal, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const DELETE = async (req) => {
    try {
        // Check if the MongoDB connection is ready
        if (mongoose.connection.readyState !== 1) {
            console.log('Connecting to the database...');
            const dbName = process.env.DB_NAME;
            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;
            await mongoose.connect(URI, { dbName: dbName });
        }

        // Retrieve the teamId and memberIdToDelete from the request body
        const { teamId, memberIdToDelete } = await req.json();
        console.log("delete:", memberIdToDelete);
        console.log("teamId:", teamId);

        // Check if teamId and memberIdToDelete are provided
        if (!teamId || !memberIdToDelete) {
            return new NextResponse("Missing teamId or memberIdToDelete parameter", { status: 400 });
        }

        // Find the team by ID
        const team = await Team.findById(teamId);
        const teamName = team.name


        // Check if the team exists
        if (!team) {
            return new NextResponse("Team not found", { status: 404 });
        }

        // Update the team members array
        team.members = team.members.filter(memberId => memberId !== memberIdToDelete);

        // Save the updated team
        await team.save();

        // Update the associated TeamGoals
        await TeamGoal.updateMany(
            { teamId: team._id },
            { $pull: { 'tasks.$[elem].taskMembers': { memberId: memberIdToDelete } } },
            { arrayFilters: [{ 'elem.taskMembers.memberId': memberIdToDelete }] }
        );

        // Update the user model to remove the team name from the user's team array
        const user = await User.findById(memberIdToDelete);
        if (user) {
            user.team = user.team.filter(team => team !== teamName);
            await user.save();
        }

        // Return a success response
        return new NextResponse("Member deleted successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
