import { NextResponse, NextRequest } from "next/server";
import mongoose from 'mongoose';
import Team from '../models/Teams';
import User from '../models/User';

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
        const { teamAvatar, name, color, members } = await req.json();

        // Check if the team with the given name already exists
        const existingTeam = await Team.findOne({ name });

        if (existingTeam) {
            return new NextResponse("Team already exists", { status: 400 });
        }

        // Create a new team object
        const newTeam = await Team.create({
            teamAvatar,
            name: name.toLowerCase(),
            color,
            members
        });

        // Save the newly created team to the database
        await newTeam.save();

        // Update the team field for each member in the user model
        for (const memberId of members) {
            const user = await User.findById(memberId);
            if (user) {
                user.team.push(name);
                await user.save();
            }
        }

        // Return a success response with the newly created team
        return NextResponse.json(newTeam, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async () => {
    try {
        // Retrieve all teams from the database
        const teams = await Team.find();

        // Iterate over each team and fetch user data for members
        for (const team of teams) {
            // Array to store user data for members
            const memberData = [];

            // Fetch user data for each member
            for (const memberId of team.members) {
                const user = await User.findById(memberId);
                if (user) {
                    memberData.push(user); // Push user data to array
                }
            }

            // Replace userIds with user data in the team object
            team.members = memberData;
        }

        // Return the list of teams with user data as a JSON response
        return NextResponse.json(teams, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const PUT = async (req) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();

        // Iterate over each user
        for (const user of users) {
            // Get teams associated with the user
            const teamsToUpdate = user.team;

            // Iterate over each team associated with the user
            for (const teamName of teamsToUpdate) {
                // Find the team by name
                const team = await Team.findOne({ name: teamName });
                if (team) {
                    // Convert userId to string
                    const userIdAsString = user._id.toString();
                    // Check if the user's ID is not already in the members array
                    if (!team.members.includes(userIdAsString)) {
                        // Add user's ID to members array
                        team.members.push(userIdAsString);
                        // Save the updated team
                        await team.save();
                    }
                }
            }
        }

        console.log('Team members updated successfully');

        // Return a success response
        return new NextResponse("Team members updated successfully", { status: 200 });
    } catch (error) {
        console.error('Error updating team members:', error);
        // Return an error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
