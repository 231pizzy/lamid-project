'use client'
import { Box, Modal, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';
import {useState } from "react";
import Prompt from "@/Components/Prompt";
import { DurationSvg, GoalSvg, MoneyCase, TaskSvg, ThreePersonSvg, TimerSvg, WorkPhaseSvg } from "@/public/icons/icons";

export default function Summary({ open, handleCancel, handleDeleteWorkPhase, handleNext, handlePrev, workPhasesData}) {
    const [openPrompt, setOpenPrompt] = useState(false);
    const [deletePhaseName, setDeletePhaseName] = useState(null)


    const handleDeleteAndRefresh = () => {

        handleDeleteWorkPhase(deletePhaseName);

        setOpenPrompt(false)
    };

    const confirmDeleteWorkPhase = (phaseName) => {
        setOpenPrompt(true)
        setDeletePhaseName(phaseName)
    }
    const closePrompt = () => {
        setOpenPrompt(false)
    }

    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('en-US', options);

        const [month, day] = formattedDate.split(' ');
        const dayWithSuffix = parseInt(day).toString() + getDaySuffix(parseInt(day));

        return `${month} ${dayWithSuffix}`;
    }

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // Special case for 11th-13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }


    return (
        <Modal open={open}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box sx={{ height: '100%', mt: 8, bgcolor: 'white', overflowY: 'hidden', pb: 4, position: 'absolute', top: '0%', right: '0%', width: "89%", left: 200, }}>
                    {/* Heading */}
                    <Box sx={{
                        display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                        py: 2, px: { xs: 1.5, sm: 4 },
                        borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'rgba(246, 246, 246, 1)',
                    }}>
                        {/* Close form */}
                        <CloseIcon onClick={handleCancel} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 32, mr: 4 }} />

                        {/* Heading label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                            CREATE NEW PROJECT GROUP
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                    </Box>
                    <div style={{ height: "92px", backgroundColor: "rgba(191, 6, 6, 0.08)", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", marginLeft: "40px", alignItems: "center" }}>
                            <div>
                                <LeftArrowIcon onClick={handlePrev} sx={{ color: 'black', fontSize: 24, mr: 4, borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} />
                            </div>
                            <div>
                                <h2 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", marginBottom: "10px" }}>STEP-3  (Summary) </h2>
                                <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px" }}>Creating a work phase for the project group.</p>
                            </div>
                        </div>
                    </div>

                    {/* body */}
                    <div>
                    <div style={{ height: "500px", width: "70%", justifyContent: "center", marginLeft: "auto", marginRight: "auto", alignItems: "center", display: "flex",  }}>
                        {/* srcoll View */}
                        <div style={{ maxHeight: "400px", overflowY: "auto", width: "100%", alignItems: "center" }}>
                            {workPhasesData.map((workPhase, index) => {

                                const uniqueTaskMembers = new Set();

                                // Iterate over tasks of the current goal
                                workPhase.tasks.forEach(task => {
                                    task.taskMembers.forEach(member => {
                                        // Add each task member to the Set
                                        uniqueTaskMembers.add(JSON.stringify(member)); // Convert to string to ensure uniqueness
                                    });
                                });

                                // Convert the Set back to an array of objects
                                const uniqueTaskMembersArray = Array.from(uniqueTaskMembers).map(member => JSON.parse(member));

                                const displayedMembers = uniqueTaskMembersArray.slice(0, 3);
                                const additionalMembersCount = uniqueTaskMembersArray.length - displayedMembers.length;


                                // Calculate Time Bank
                                const totalMinutes = workPhase.tasks.reduce((acc, task) => {
                                    return acc + parseInt(task.hours || 0, 10) * 60 + parseInt(task.minutes || 0, 10);
                                }, 0);
                                const totalHours = Math.floor(totalMinutes / 60);
                                const remainingMinutes = totalMinutes % 60;

                                // Calculate Duration
                                const startDates = workPhase.tasks.map(task => new Date(task.startDate));
                                const endDates = workPhase.tasks.map(task => new Date(task.endDate));
                                const earliestStartDate = new Date(Math.min(...startDates));
                                const latestEndDate = new Date(Math.max(...endDates));
                                const duration = `${formatDate(earliestStartDate)} to ${formatDate(latestEndDate)}`;

                                // Calculate Budget
                                const totalBudget = workPhase.tasks.reduce((acc, task) => acc + parseFloat(task.taskBudget || 0), 0);

                                return (
                                    <div key={index} style={{ height: "211px" }}>
                                        <div style={{ height: "64px", width: "100%", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(28, 29, 34, 0.1)", display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", borderRadius: "8px" }}>
                                            <h2 style={{ color: "rgba(93, 93, 93, 1)", fontWeight: "600", fontSize: "18px", lineHeight: "24.51px", marginLeft: "24px" }}>Work Phase {index + 1} Summary</h2>
                                            {index > 0 && (
                                                <CloseIcon  onClick={() => confirmDeleteWorkPhase(workPhase.workPhaseName)} sx={{ cursor: 'pointer', color: 'rgba(191, 6, 6, 1)', fontSize: 24, mr: 4, borderRadius: '26.6667px', bgcolor: 'rgba(191, 6, 6, 0.1)' }} />
                                            )}
                                        </div>

                                        <div style={{ height: "147px", display: "flex", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", padding: "32px", gap: "40px" }}>
                                            {/* workPhase */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "189px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <WorkPhaseSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Work-phase</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    <h1>{workPhase.workPhaseName}</h1>
                                                </div>
                                            </div>

                                            {/* goal */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "88px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <GoalSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Goals</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>1</h1>
                                                </div>
                                            </div>

                                            {/* task */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "88px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <TaskSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Tasks</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{workPhase.tasks.length}</h1>
                                                </div>
                                            </div>

                                            {/* time bank */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "119px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <TimerSvg style={{ height: "18px", width: "15.49px", marginLeft: "3px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "2px" }}>Time Bank</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    <h1>{totalHours}h {remainingMinutes}m</h1>
                                                </div>
                                            </div>

                                            {/* duration */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "191px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <DurationSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Duration</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    <h1>{duration}</h1>
                                                </div>
                                            </div>

                                            {/* budget */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "134px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <MoneyCase style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Budget</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    <h1>₦{totalBudget.toFixed(2)}</h1>
                                                </div>
                                            </div>

                                            {/* members */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "119px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <ThreePersonSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Members</h1>
                                                </div>
                                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "52px" }}>
                                                    {/* Render avatars of unique task members */}
                                                    {displayedMembers.map((member, index) => (
                                                        <img
                                                            key={index}
                                                            src={member.profilePicture}
                                                            alt={member.fullName}
                                                            className="rounded-full object-cover"
                                                            style={{
                                                                height: '32px',
                                                                width: '32px',
                                                                marginLeft: index > 0 ? '-10px' : '0'
                                                            }}
                                                        />
                                                    ))}
                                                    {additionalMembersCount > 0 && (
                                                        <div
                                                            className="rounded-full flex items-center justify-center"
                                                            style={{
                                                                height: '32px',
                                                                width: '32px',
                                                                backgroundColor: 'rgba(28, 29, 34, 0.1)',
                                                                color: 'rgba(37, 122, 251, 1)',
                                                                marginLeft: '-10px'
                                                            }}
                                                        >
                                                            +{additionalMembersCount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                        <div style={{ display: "flex", justifyContent: "flex-end"}}>
                            <button style={{ height: "54px", width: "103px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 1)", padding: "16px 32px", gap: "10px", color: "rgba(255, 255, 255, 1)", marginRight: '220px' }} onClick={handleNext}>Next</button>
                        </div>
                    </div>

                    <Prompt
                        open={openPrompt}
                        message={`You Are About To delete this  work phase, which will include the goals and tasks in the work phase`}
                        proceedTooltip='Alright, delete work-phase'
                        cancelTooltip='No, do not delete work-phase'
                        onCancel={closePrompt}
                        onProceed={handleDeleteAndRefresh}
                        onClose={closePrompt}
                    />
                </Box>
            </Slide>
        </Modal>

    );
}
