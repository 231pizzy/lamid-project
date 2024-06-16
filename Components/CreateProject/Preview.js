'use client'
import { Box, Modal, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Close from '@mui/icons-material/Close';
import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useState } from "react";
import Prompt from "@/Components/Prompt";
import IconElement from "@/Components/IconElement";
const ApprovedSvg = '/icons/ApprovedSvg.svg';
import { DurationSvg, GoalSvg, MoneyCase, TaskSvg, ThreePersonSvg, TimerSvg, WorkPhaseSvg } from "@/public/icons/icons";
import { createProjectGroup } from "./helper";
import { useRouter } from "next/navigation";

export default function Preview({ open, handleCancel, handleDeleteWorkPhase, handlePrev, workPhasesData, basicData, closeForm, }) {
    const [openPrompt, setOpenPrompt] = useState(false);
    const [deletePhaseName, setDeletePhaseName] = useState(null)
    const [showCongratulations, setshowCongratulations] = useState(false)
    const router = useRouter()


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
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Calculate number of goals
    let numberOfTasks = 0;
    workPhasesData.forEach(workPhase => {
        numberOfTasks += workPhase.tasks.length;
        console.log("numberOfTasks:", numberOfTasks)
    });

    // Calculate number of tasks
    let numberOfPeople = 0;
    workPhasesData.forEach(workPhase => {
        workPhase.tasks.forEach(task => {
            numberOfPeople += task.taskMembers.length;
        });
    });

    // Function to calculate duration
    const calculateDuration = (start, end) => {
        // Calculate duration in days
        const durationInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        // Convert duration to months and days
        const months = Math.floor(durationInDays / 30);
        const remainingDays = durationInDays % 30;
        return `${months} months ${remainingDays} days`;
    };

    // Calculate duration
    let startDate = null;
    let endDate = null;
    workPhasesData.forEach(workPhase => {
        workPhase.tasks.forEach(task => {
            const taskStartDate = new Date(task.startDate);
            const taskEndDate = new Date(task.endDate);
            if (!startDate || taskStartDate < startDate) {
                startDate = taskStartDate;
            }
            if (!endDate || taskEndDate > endDate) {
                endDate = taskEndDate;
            }
        });
    });
    const duration = calculateDuration(startDate, endDate);

    // Calculate time bank
    let timeBankHours = 0;
    let timeBankMinutes = 0;
    workPhasesData.forEach(workPhase => {
        workPhase.tasks.forEach(task => {
            const taskHours = parseInt(task.hours, 10) || 0;
            const taskMinutes = parseInt(task.minutes, 10) || 0;

            timeBankHours += taskHours;
            timeBankMinutes += taskMinutes;
        });
    });

    // Convert excess minutes to hours
    timeBankHours += Math.floor(timeBankMinutes / 60);
    timeBankMinutes %= 60;

    // Calculate total budget
    let totalBudget = 0;
    workPhasesData.forEach(workPhase => {
        workPhase.tasks.forEach(task => {
            totalBudget += parseFloat(task.taskBudget);
        });
    });

    const showCongratulationsModal = () => {
        setshowCongratulations(true)
    }

    const closeCongratulations = () => {
        setshowCongratulations(false)
        router.replace('/admin/project-group')
    }

    const handleCreateProjectGroup = () => {
        const projectObject = [...workPhasesData ]
        const basicDataObject = { ...basicData }

        createProjectGroup({
            dataObject: projectObject, basicData: basicDataObject, dataProcessor: () => {
                showCongratulationsModal()
            }
        });
        closeForm()
        window.location.reload();
    }

    const getAbbreviation = (name) => {
        return name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase();
      };

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
                                <h2 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", marginBottom: "10px" }}>STEP-3  (Preview) </h2>
                                <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px" }}>Creating a work phase for the project group.</p>
                            </div>
                        </div>
                        <div>
                            <button style={{ height: "50px", width: "189px", borderRadius: "12px", backgroundColor: "rgba(191, 6, 6, 1)", padding: "12px 8px", gap: "10px", color: "rgba(255, 255, 255, 1)", marginRight: '80px', fontSize: "16px" }} onClick={handleCreateProjectGroup}>Create project group</button>

                        </div>
                    </div>

                    {/* body */}
                    <div style={{ justifyContent: "center", marginLeft: "auto", marginRight: "auto", alignItems: "center", display: "flex",}}>
                    <div style={{ height: "1125px", width: "85%", marginTop: "40px", justifyContent: "center", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)" }}>
                        <div style={{ height: "64px", borderRadius: "16px, 16px, 0px, 0px", border: "1px, 0px, 1px, 0px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(28, 29, 34, 0.05)", alignContent: "center", color: "rgba(51, 51, 51, 1)" }}>
                            <h1 style={{ fontWeight: "700", fontSize: "20px", lineHeight: "27.24px", marginLeft: "24px", color: "rgba(51, 51, 51, 1)" }}>Project group preview</h1>
                        </div>
                        {/* srcoll View */}
                        <div style={{ maxHeight: "470px", overflowY: "auto", width: "100%", marginTop: "20px" }}>

                            <div style={{ height: "233px" }}>
                                <div style={{ height: "64px", backgroundColor: "rgba(28, 29, 34, 0.05)", border: "1px, 0px, 1px, 0px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                    <h2 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", marginLeft: "24px", color: "rgba(51, 51, 51, 1)" }}>Profile Details</h2>
                                </div>
                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", height: "169px" }}>
                                    <div style={{ backgroundColor: "rgba(37, 122, 251, 0.2)", borderRadius: "40px", padding: "13px 11px", gap: "10px", height: "80px", width: "80px", display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", marginLeft: "24px", color: "rgba(37, 122, 251, 1)", fontWeight: "700", fontSize: "18px", lineHeight: "24.51px" }}>{getAbbreviation(basicData.name)}</div>
                                    <div style={{ marginLeft: "24px" }}>
                                        <h2 style={{fontWeight: "700", fontSize: "20px", lineHeight: "27.24px", marginBottom: "10px", color: "rgba(51, 51, 51, 1)"}}>{basicData.name}</h2>
                                        <p style={{fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)"}}>{basicData.purpose}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: "230px", gap: "40px" }}>
                                <div style={{ height: "60px", backgroundColor: "rgba(28, 29, 34, 0.05)", border: "1px, 0px, 1px, 0px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                    <h2 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", marginLeft: "24px", color: "rgba(51, 51, 51, 1)" }}>Project Group Summary</h2>
                                </div>
                                <div style={{ display: "flex", alignContent: "center", alignItems: "center", height: "165px", gap: "40px", padding: "0px 32px" }}>
                                    {/* workphase */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "150px", borderRadius: "12px", padding: "12px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex", }}>
                                            <WorkPhaseSvg style={{ height: "18px", width: "15.49px" }} />
                                            <h1 style={{ fontSize: "12px", lineHeight: "19px", fontWeight: "500", marginLeft: "3px" }}>WORK PHASE</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1>{workPhasesData.length}</h1>
                                        </div>
                                    </div>

                                    {/* goal */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "99px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex", }}>
                                            <GoalSvg style={{ height: "18px", width: "15.49px", marginLeft: "2px" }} />
                                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "4px" }}>Goals</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{workPhasesData.length}</h1>
                                        </div>
                                    </div>

                                    {/* tasks */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "90px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                                            <TaskSvg style={{ height: "18px", width: "15.49px", marginLeft: "2px" }} />
                                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Tasks</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{numberOfTasks}</h1>
                                        </div>
                                    </div>

                                    {/* people */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "112px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                                            <ThreePersonSvg style={{ height: "18px", width: "15.49px", marginLeft: "2px" }} />
                                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>PEOPLE</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{numberOfPeople}</h1>
                                        </div>
                                    </div>

                                    {/* duration */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "134px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                                            <DurationSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "10px" }}>DURATION</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1 style={{ fontSize: "12px", lineHeight: "19px", fontWeight: "500" }}>{duration}</h1>
                                        </div>
                                    </div>

                                    {/* time bank */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "135px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                                            <TimerSvg style={{ height: "18px", width: "15.49px", }} />
                                            <h1 style={{ fontSize: "12px", lineHeight: "19px", fontWeight: "500", marginLeft: "0px" }}>TIME BANK</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1 style={{ fontSize: "12px", lineHeight: "19px", fontWeight: "500", }}>{timeBankHours}hrs :{timeBankMinutes}mins</h1>
                                        </div>
                                    </div>

                                    {/* budget */}
                                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "165px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                                            <MoneyCase style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>BUDGET</h1>
                                        </div>
                                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                                            <h1>₦{totalBudget.toFixed(2)}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: "64px", backgroundColor: "rgba(28, 29, 34, 0.05)", border: "1px, 0px, 1px, 0px solid rgba(28, 29, 34, 0.1)", alignContent: "center", marginBottom: "20px" }}>
                                <h2 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", marginLeft: "24px", color: "rgba(51, 51, 51, 1)" }}>Project Group workPhase breakdown</h2>
                            </div>

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

                                        <div style={{ height: "64px", width: "100%", border: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", alignItems: "center" }}>
                                            <h2 style={{ color: "rgba(93, 93, 93, 1)", fontWeight: "600", fontSize: "18px", lineHeight: "24.51px", marginLeft: "24px" }}>Work Phase {index + 1}</h2>
                                        </div>

                                        <div style={{ height: "147px", display: "flex", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", padding: "32px", gap: "40px", backgroundColor: "rgba(28, 29, 34, 0.05)", }}>
                                            {/* workPhase */}
                                            <div style={{ boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", width: "189px", height: "83px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                                <div style={{ height: "31px", backgroundColor: "rgba(37, 122, 251, 0.07)", alignItems: "center", display: "flex", color: "rgba(37, 122, 251, 1)" }}>
                                                    <WorkPhaseSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                                                    <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>Title</h1>
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

                    <Modal open={showCongratulations} onClose={closeCongratulations} >

                        <Box sx={{ position: 'absolute', left: '50%', top: '40%', maxWidth: 'max-content' }}>

                            <Box align='center' sx={{
                                transform: 'translate(-50%,-50%)', bgcolor: 'white',
                                position: 'relative', maxWidth: 'max-content', px: 4, py: 3, borderRadius: '16px'
                            }}>

                                {/*Approved Icon */}
                                <IconElement  {...{ src: ApprovedSvg, style: { height: '60px', width: '60px' } }} />

                                {/* Message */}
                                <Typography align="center" sx={{
                                    mt: 4, fontSize: 24, fontWeight: 700, maxWidth: '80%',
                                    textTransform: 'capitalize'
                                }}>
                                    You just created a project group
                                </Typography>

                                {/* Close icon */}
                                <Close sx={{
                                    position: 'absolute', cursor: 'pointer',
                                    fontSize: 34, right: '5%', top: '5%', color: '#8D8D8D'
                                }} onClick={closeCongratulations} />

                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </Slide>
        </Modal>

    );
}
