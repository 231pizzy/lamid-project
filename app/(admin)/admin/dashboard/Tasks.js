import { Box, Button, Card, Grid, IconButton, LinearProgress, Paper, Typography } from "@mui/material";

import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import TimerIcon from "@mui/icons-material/TimerOutlined";
import ListIcon from "@mui/icons-material/ListOutlined";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import TodoIcon from "@mui/icons-material/ThumbUpOutlined";
import InProgressIcon from "@mui/icons-material/NearMeOutlined";
import ReviewIcon from "@mui/icons-material/StarOutline";
import CompletedIcon from "@mui/icons-material/CheckOutlined";

import AddIcon from "@mui/icons-material/AddOutlined";
import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";
import moment from "moment";
import { useEffect, useState } from "react";
import ToDo from "./ToDo";
import InProgress from "./InProgress";
import InReview from "./InReview";
import Completed from "./Completed";
import { GoalDetails } from "../teamDetails/accessories/GoalDetails";
const statusData = [
    {
        label: 'To Do', bgcolor: '#0BC5EE1A', color: '#0BC5EE', valueKey: 'toDo',
        icon: (props) => <TodoIcon sx={{ ...props }} />
    },
    {
        label: 'In Progress', bgcolor: '#F293231A', color: '#F29323', valueKey: 'inProgress',
        icon: (props) => <InProgressIcon sx={{ ...props }} />
    },
    {
        label: 'Review', bgcolor: '#C809C81A', color: '#C809C8', valueKey: 'review',
        icon: (props) => <ReviewIcon sx={{ ...props }} />
    },
    {
        label: 'Completed', bgcolor: '#03B2031A', color: '#03B203', valueKey: 'completed',
        icon: (props) => <CompletedIcon sx={{ ...props }} />
    },
];

export default function Tasks({ gotoPage}) {
    const [teamGoals, setTeamGoals] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showGoalDetails, setShowGoalDetails] = useState(false);
    

    useEffect(() => {
        const fetchTeamGoals = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/get-all-team-goals`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.result && Array.isArray(data.data)) {
                        setTeamGoals(data.data); // Correctly set the project groups array
                    } else {
                        console.error('Data is not an array or result is false:', data);
                        setTeamGoals([]); // Set to empty array in case of incorrect data
                    }
                } else {
                    console.error('Failed to fetch project groups');
                }
            } catch (error) {
                console.error('Error fetching project groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamGoals();
    }, []);


    return <Grid item xs={12} sx={{ mt: 4, }}>
          {showGoalDetails ?
                <GoalDetails goal={selectedGoal} setShowGoalDetails={setShowGoalDetails}/>
                : 
        <Box sx={{
            borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
            width: '100%', maxWidth: '100%', bgcolor: '#FFFFFF',
            border: '1px solid rgba(28, 29, 34, 0.1)', pb: 1
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5, px: 2, alignItems: 'center' }}>
                <Typography noWrap sx={{ fontWeight: 700 }}>
                    MY TASKS ({teamGoals.length})
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                <Button id='/admin/team' sx={{ p: 0, fontSize: { xs: 12, sm: 14 } }} onClick={gotoPage}>
                    Go to Tasks
                    <NextArrow fontSize="small" sx={{ ml: -.5 }} />
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between',px: 2, maxHeight: '150vh', overflowY: 'auto',  borderTop: '1px solid rgba(28, 29, 34, 0.1)'}}>
                <ToDo teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal}/>
                <InProgress teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal}/>
                <InReview teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal}/>
                <Completed teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal}/>

               </Box>


        </Box>
}

    </Grid>
}