'use client'

import { Box, Button, IconButton, LinearProgress, Modal, Typography, } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import TodoIcon from "@mui/icons-material/ThumbUpTwoTone";
import InProgressIcon from "@mui/icons-material/NearMeOutlined";
import ReviewIcon from "@mui/icons-material/StarOutline";
import CompletedIcon from "@mui/icons-material/CheckOutlined";
import NextArrow from "@mui/icons-material/KeyboardArrowRight";
// import CalendarIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import Todo from "./Todo";
import InProgress from "./InProgress";
import Review from "./Review";
import Completed from "./Completed";
import { GoalDetails } from "./GoalDetails";

const status = [
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


export function GoalsTab({teamId }) {
    const [teamGoals, setTeamGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGoalDetails, setShowGoalDetails] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    useEffect(() => {
        const fetchTeamGoals = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/teamGoal?teamId=${teamId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTeamGoals(data);
                } else {
                    console.error('Failed to fetch team goals');
                }
            } catch (error) {
                console.error('Error fetching team goals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamGoals();
    }, [teamId]);


    return (
        <Box style={{maxHeight: "100vh", overflowY: "auto"}}>
               {showGoalDetails ?
                <GoalDetails goal={selectedGoal} setShowGoalDetails={setShowGoalDetails}/>
                : 
            <div style={{maxHeight: '82vh', overflowY: 'auto'}}>
            <div style={{ height: "128px", top: "172px", left: "240px", border: "2px solid #F6F6F6", padding: "24px 32px", gap: "24px", alignContent: "center" }}>

                {/* Goals running late*/}
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap',
                    py: 3, borderBottom: '1px solid #1C1D221A', px: 2
                }}>
                    {status.slice(0, 3).map((data, index) => {
                        return <Box key={index} sx={{
                            p: 1, mr: 3, border: '1px solid #1C1D221A', borderRadius: '16px',
                            boxShadow: '0px 6px 12px 0px #4F4F4F14'
                        }}>
                            {/* Label: goals running late and flag */}
                            <Typography sx={{
                                textTransform: 'uppercase', display: 'flex', fontSize: 15, fontWeight: 700,
                                alignItems: 'center', justifyContent: 'space-between', mb: 1
                            }}>
                                {/* Label */}
                                Goals Running Late
                                {/* Flag */}
                                <FlagIcon sx={{ ml: 4, color: '#FF0000' }} />
                            </Typography>

                            {/* Number of goals running late and status */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {/* Number of goals running late */}
                                <Typography sx={{ fontSize: 17, fontWeight: 700, mr: 3 }}>
                                    0
                                </Typography>
                                {/* Status of goals */}
                                <Typography sx={{ px: .5, py: .2, bgcolor: data.bgcolor, color: data.color, fontSize: 13, fontWeight: 600, borderRadius: '8px' }}>
                                    {data.label}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                {/* Goto task button */}
                                <Button variant="text" sx={{
                                    display: 'flex', alignItems: 'center',
                                    p: 0, fontSize: 13, fontWeight: 600,
                                }}>
                                    See tasks
                                    <NextArrow />
                                </Button>
                            </Box>
                        </Box>
                    })}
                </Box>
            </div>
               
            {/* Summary cards for todo, inprogress, review and completed goals */}
            <Box sx={{
                display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between',
                px: 2, maxHeight: '150vh', overflowY: 'auto'
            }}>
                <Todo teamId={teamId} teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal}/>
                <InProgress  teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal}/>
                <Review teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal} />
                <Completed teamGoals={teamGoals} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal} />
            </Box>
            </div>
}
        </Box>
    )
}
