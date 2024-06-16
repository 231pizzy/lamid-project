'use client'
import React, { useState } from 'react';
import Slide from '@mui/material/Slide';
import Close from '@mui/icons-material/Close';
import {
    Box, Button, Checkbox, Typography,
} from "@mui/material";
import { ProfileAvatar } from "@/Components/ProfileAvatar";

export function TaskDetails({ goal, task, open, onClose, renderTaskButton }) {
    // const [taskStatus, setTaskStatus] = useState(task.taskStatus);
    // Format start date
    const startDate = new Date(task.startDate);
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const startDay = startDate.getDate();

    // Format end date
    const endDate = new Date(task.endDate);
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    const endDay = endDate.getDate();


    const getTaskStyles = () => {
        let backgroundColor, color, border;
        switch (task.taskStatus) {
            case 'To do':
                backgroundColor = '#0BC5EE1A';
                color = '#0BC5EE';
                border = `1px solid #0BC5EE`;
                break;
            case 'In progress':
                backgroundColor = '#F293231A';
                color = '#F29323';
                border = `1px solid #F29323`;
                break;
            case 'In review':
                backgroundColor = '#C809C81A';
                color = '#C809C8';
                border = `1px solid #C809C8`;
                break;
            case 'Completed':
                backgroundColor = '#03B2031A';
                color = '#03B203';
                border = `1px solid #03B203`;
                break;
            default:
                backgroundColor = 'transparent';
                color = 'black';
        }
        return { backgroundColor, color, border };
    };

    return (
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
            <Box sx={{
                height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
                position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '70%', md: '60%', lg: '45%', xl: '42%' },
            }}>
                {/* Toolbar */}
                <Box sx={{
                    display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', mb: 2,
                    py: 3, px: { xs: 1.5, sm: 4 }, flexWrap: 'nowrap', borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white'
                }}>
                    {/* Close form */}
                    <Close onClick={onClose} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 35 }} />

                    {/* Heading label */}
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, }, mx: 3 }}>
                        TASK PROGRESS
                    </Typography>

                    {/* Status tag */}
                    <Typography sx={{
                        fontWeight: 600, fontSize: 13, mr: 14,
                        maxWidth: 'max-content', px: 1, py: .2, borderRadius: '8px',whiteSpace: 'nowrap', ...getTaskStyles()
                    }}>
                        {task.taskStatus}
                    </Typography>
                    {/* Goto next stage button */}
                    {renderTaskButton()}

                    <Box sx={{ flexGrow: 1 }} />
                </Box>

                {/* Body */}
                <Box sx={{ height: '86vh', overflowY: 'auto' }}>
                    {/* Name section */}
                    <Box>
                        {/* Heading */}
                        <Typography sx={{ bgcolor: '#1C1D2212', color: '#5D5D5D', px: 3, py: 1, fontSize: 14, fontWeight: 600 }}>
                            Name
                        </Typography>

                        {/* Value */}
                        <Typography sx={{ fontSize: 15, px: 3, py: 1 }}>
                            {task.taskName}
                        </Typography>
                    </Box>

                    {/* Schedule and budget section */}
                    <Box>
                        {/* Heading */}
                        <Typography sx={{ bgcolor: '#1C1D2212', color: '#5D5D5D', px: 3, py: 1, fontSize: 14, fontWeight: 600 }}>
                            Schedule and budget
                        </Typography>

                        {/* Date, time bank, and budget */}
                        <div style={{ display: "flex", flexDirection: "row", alignContent: "center", marginTop: "10px", marginBottom: "20px" }}>
                            <div className="flex-1 mr-1 ml-2 bg-gray-50" style={{ gap: "5px", border: "1px solid gray", alignContent: "center", borderRadius: "8px" }}>
                                <h2 className="text-center">Date</h2>
                                <p className="text-center">{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</p>
                            </div>

                            <div className="flex-1 mr-1 ml-4" style={{ gap: "5px", border: "1px solid gray", alignContent: "center", borderRadius: "8px" }}>
                                <h2 className="text-center">Time - Bank</h2>
                                <p className="text-center text-sm">{task.hours}hrs : {task.minutes === "" ? '0' : task.minutes} minutes</p>
                            </div>

                            <div className="flex-1 mr-1 ml-4" style={{ gap: "5px", border: "1px solid gray", alignContent: "center", borderRadius: "8px" }}>
                                <h2 className="text-center">Amount</h2>
                                <p className="text-center">₦{task.taskBudget}</p>
                            </div>
                        </div>
                    </Box>


                    {/* Task assignee section */}
                    <Box sx={{}}>
                        {/* Heading */}
                        <Typography sx={{ bgcolor: '#1C1D2212', color: '#5D5D5D', px: 3, py: 1, fontSize: 14, fontWeight: 600 }}>
                            Task Assignee
                        </Typography>

                        {/* Profile pictures */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2 }}>
                            {task.taskMembers.map((member, index) => (
                                <div key={index}>
                                    {/* Avatar */}
                                    {/* <img src={member.avatar} alt={member.name} className="rounded-full object-cover" style={{ height: '50px', width: '50px', border: `1px solid ${team.color}` }} /> */}

                                    <img src={member.profilePicture} className="rounded-full object-cover" style={{ height: '50px', width: '50px', border: `1px solid ${team.color}` }} />
                                </div>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Slide>
    );
};

