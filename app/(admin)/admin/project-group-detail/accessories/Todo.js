'use client'
import { Box, Button, IconButton, Typography, Modal, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/AddOutlined";
import TodoIcon from "@mui/icons-material/ThumbUpTwoTone";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import { useState } from "react";
import GoalForm from "@/Components/CreateGoal/GoalForm";
import Prompt from "@/Components/Prompt";
import { TimerSvg } from "@/public/icons/icons.js";
import ListIcon from "@mui/icons-material/ListOutlined";
import AddGoal from "./AddGoal";

export default function Todo({ projectId, projectData, setProjectData, setShowGoalDetails, setSelectedGoal, selectedWorkphaseIndex, setSelectedGoalName}) {
    const [AddingGoal, setAddingGoal] = useState(false);
    const [openPrompt, setOpenPrompt] = useState(false);
    console.log("projectData:", projectData)

    const handleCreateGoalClick = () => {
        setAddingGoal(true);
    };

    const confirmCancelGoalCreation = () => {
        setOpenPrompt(true);
    };

    const closeFolderPrompt = () => {
        setOpenPrompt(false);
    };

    const handleCloseGoal = () => {
        setAddingGoal(false);
        setOpenPrompt(false);
    };

    const handleTaskClick = (goal, goalName) => {
        setShowGoalDetails(true);
        setSelectedGoal(goal);
        setSelectedGoalName(goalName)
    };



    const todoGoalsCount = projectData.reduce((count, phase) => {
        return count + (phase.workPhases || []).flatMap(wp => wp.goals || []).filter(goal => goal.goalStatus === 'To do').length;
    }, 0);

    return (
        <div>
            <Box sx={{ maxWidth: { xs: '100%', md: '400px' }, minWidth: { xs: '100%', md: '400px' }, borderRadius: '16px', mt: 3, border: '2px dashed #1C1D221A' }}>
                <Box sx={{
                    px: 3, py: 2, bgcolor: '#0BC5EE1A', borderRadius: '16px 16px 0 0',
                    display: 'flex', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: '#0BC5EE1A', border: `1px solid #19D3FC`, borderRadius: '50%' }}>
                        <TodoIcon style={{ color: '#19D3FC', fontSize: 34 }} />
                    </div>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, ml: 4, textTransform: 'uppercase' }}>
                        To Do ({todoGoalsCount})
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        sx={{ bgcolor: '#BF0606', color: 'white' }}
                        style={{ backgroundColor: "#BF0606" }}
                        onClick={handleCreateGoalClick}
                    >
                        <AddIcon sx={{ fontSize: 30, color: "white" }} />
                    </IconButton>
                    {AddingGoal ? (
                        <AddGoal open={AddingGoal} projectId={projectId} handleCloseGoal={confirmCancelGoalCreation} selectedWorkphaseIndex={selectedWorkphaseIndex} closeFolderPrompt={handleCloseGoal} projectData={projectData} setProjectData={setProjectData}/>
                    ) : null}
                </Box>

                <Box sx={{ maxHeight: '40vh', overflowY: 'auto', bgcolor: 'rgba(28, 29, 34, 0.08)', p: 2 }}>
                    {projectData.map((phase, phaseIndex) => (
                        phase.workPhases && phase.workPhases.length > 0 && (
                            phase.workPhases.flatMap(wp => wp.goals || []).filter(goal => goal.goalStatus === 'To do').map((goal, goalIndex) => {

                                const uniqueTaskMembers = new Set();

                                goal.tasks.forEach(task => {
                                    task.taskMembers.forEach(member => {
                                        uniqueTaskMembers.add(JSON.stringify(member));
                                    });
                                });

                                const uniqueTaskMembersArray = Array.from(uniqueTaskMembers).map(member => JSON.parse(member));

                                const completedTasks = goal.tasks.filter(task => task.taskStatus === 'Completed');

                                let totalTimeBankHours = 0;
                                let totalTimeBankMinutes = 0;
                                goal.tasks.forEach(task => {
                                    totalTimeBankHours += parseInt(task.hours) || 0;
                                    totalTimeBankMinutes += parseInt(task.minutes) || 0;
                                });
                                totalTimeBankHours += Math.floor(totalTimeBankMinutes / 60);
                                totalTimeBankMinutes %= 60;

                                let totalHours = 0;
                                let totalMinutes = 0;
                                goal.tasks.forEach(task => {
                                    totalHours += parseInt(task.hours) || 0;
                                    totalMinutes += parseInt(task.minutes) || 0;
                                });
                                totalHours += Math.floor(totalMinutes / 60);
                                totalMinutes %= 60;

                                let totalCompletedHours = 0;
                                let totalCompletedMinutes = 0;
                                completedTasks.forEach(task => {
                                    totalCompletedHours += parseInt(task.hours) || 0;
                                    totalCompletedMinutes += parseInt(task.minutes) || 0;
                                });
                                totalCompletedHours += Math.floor(totalCompletedMinutes / 60);
                                totalCompletedMinutes %= 60;

                                let earliestStartDate = new Date('9999-12-31');
                                let latestEndDate = new Date('1970-01-01');
                                goal.tasks.forEach(task => {
                                    const startDate = new Date(task.startDate);
                                    const endDate = new Date(task.endDate);
                                    if (startDate < earliestStartDate) {
                                        earliestStartDate = startDate;
                                    }
                                    if (endDate > latestEndDate) {
                                        latestEndDate = endDate;
                                    }
                                });
                                const formattedStartDate = `${earliestStartDate.toLocaleString('default', { month: 'short' })} ${earliestStartDate.getDate()}`;
                                const formattedEndDate = `${latestEndDate.toLocaleString('default', { month: 'short' })} ${latestEndDate.getDate()}`;
                                const duration = `${formattedStartDate} - ${formattedEndDate}`;

                                return (
                                    <Box key={`${phaseIndex}-${goalIndex}`} style={{ backgroundColor: 'white' }} className="mb-6 rounded-lg cursor-pointer" onClick={() => handleTaskClick(goal, goal.goalName)}>
                                        <Box>
                                            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1, ml: 2, mt: 1 }}>
                                                {goal.goalName}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mb: 1 }}>
                                                {uniqueTaskMembersArray.slice(0, 7).map((member, index) => (
                                                    <img
                                                        key={index}
                                                        src={member.profilePicture}
                                                        alt={member.fullName}
                                                        className="rounded-full object-cover mt-2"
                                                        style={{
                                                            height: '35px',
                                                            width: '35px',
                                                            border: `1px solid #0BC5EE1A`,
                                                            marginLeft: index > 0 ? '-10px' : '0'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Typography sx={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280' }}>
                                            <ListIcon style={{ marginRight: "4px" }} />
                                            Goal duration
                                        </Typography>
                                        <Typography noWrap sx={{ bgcolor: '#FF00000D', color: '#FF0000', fontWeight: 600, fontSize: 13, maxWidth: 'max-content', display: 'flex', ml: 2, my: 1.5, px: 2, py: 1, alignItems: 'center', borderRadius: '8px' }}>
                                            <CalendarIcon sx={{ mr: 1 }} />
                                            Duration: {duration}
                                            <FlagIcon sx={{ ml: 1, color: '#FF0000' }} />
                                        </Typography>

                                        <Typography sx={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280' }}>
                                            <TimerSvg style={{ marginRight: "4px" }} />
                                            Time Bank: {totalTimeBankHours}hr {totalTimeBankMinutes}min
                                        </Typography>

                                        <Box sx={{ mx: 2, my: 1.5 }}>
                                            <Box sx={{ alignItems: 'center', justifyContent: 'space-between', color: "rgba(25, 211, 252, 1)", mb: 2 }}>
                                                <p sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, }}>
                                                    Time Spent:<span> {totalCompletedHours}hr {totalCompletedMinutes}mins out of {totalHours}hrs {totalMinutes}mins.</span>
                                                </p>
                                            </Box>
                                            <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                                <div style={{ width: `${(completedTasks.length / goal.tasks.length) * 100}%`, height: '100%', backgroundColor: 'rgba(25, 211, 252, 1)', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                            </div>
                                        </Box>

                                        <Box>
                                            <Typography sx={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280' }}>
                                                <ListIcon style={{ marginRight: "4px" }} />
                                                Progress
                                            </Typography>

                                            <Box sx={{ mx: 2, my: 1.5, padding: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: '#BF0606', }}>
                                                        Progress
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: 'black', }}>
                                                        {completedTasks.length}/{goal.tasks.length}
                                                    </Typography>
                                                </Box>
                                                <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                                    <div style={{ width: `${(completedTasks.length / goal.tasks.length) * 100}%`, height: '100%', backgroundColor: 'rgba(191, 6, 6, 1)', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                                </div>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })
                        )))}
                </Box>

                <Prompt
                    open={openPrompt}
                    message={`You are about to cancel the creation of this goal`}
                    proceedTooltip='Alright, cancel goal creation'
                    cancelTooltip='No, do not cancel goal creation'
                    onCancel={closeFolderPrompt}
                    onProceed={handleCloseGoal}
                    onClose={closeFolderPrompt}
                />
            </Box>
        </div>
    )
}
