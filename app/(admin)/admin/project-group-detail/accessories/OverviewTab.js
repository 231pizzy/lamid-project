'use client'

import { Box, Typography } from "@mui/material";

import TodoIcon from "@mui/icons-material/ThumbUpTwoTone";
import InProgressIcon from "@mui/icons-material/NearMeOutlined";
import ReviewIcon from "@mui/icons-material/StarOutline";
import CompletedIcon from "@mui/icons-material/CheckOutlined";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setPageTitle } from "@/Components/redux/routeSlice.js";
import { DurationSvg, MoneyCase, TaskSvg, ThreePersonSvg, TimerSvg, WorkPhaseSvg, Budget, GoalSvg, JusticeSvg, Receipt, ProjectExpenseSvg } from "@/public/icons/icons";
// import IconElement from "@/Components/IconElement.js";
import { getProjectGroupData } from "../helper.js";
import { useRef } from "react";


export function OverviewTab({ projectId, gotoTab, }) {
    const [state, setState] = useState({
        projectObject: [], currentTab: 0, ref: null, loading: false
    });
    const dispatch = useDispatch();
    const ref = useRef(null);

    console.log('projct data:', state.projectObject)

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        setState(prevState => ({ ...prevState, loading: true })); // Set loading to true before fetching
        getProjectGroupData({
            projectId: projectId,
            dataProcessor: (result) => {
                console.log('Fetched result:', result); // Debugging line
                setState(prevState => ({
                    ...prevState,
                    projectObject: [result], // Initialize as an array with the first result if not already an array
                    workPhaseObject: Object.values(result?.workPhases)[0],
                    loading: false // Set loading to false after data is fetched
                }));
            }
        });
    }, [projectId, state.currentTab]);

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Project Group' }))
        updateState({ ref: ref })
    }, []);

    if (state.loading) {
        return <Typography align='center' sx={{ mt: 4, fontWeight: 700, fontSize: 18 }}>
            Fetching data...
        </Typography>
    }

    if (!state.projectObject.length) {
        return <Typography align='center' sx={{ mt: 4, fontWeight: 700, fontSize: 18 }}>
            Fetching data....
        </Typography>;
    }

    // Calculate time bank
    let timeBankHours = 0;
    let timeBankMinutes = 0;
    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
                const taskHours = parseInt(task.hours, 10) || 0;
                const taskMinutes = parseInt(task.minutes, 10) || 0;

                timeBankHours += taskHours;
                timeBankMinutes += taskMinutes;
            });
        });
    });

    // Convert excess minutes to hours
    timeBankHours += Math.floor(timeBankMinutes / 60);
    timeBankMinutes %= 60;

    // Calculate total used hours and minutes for tasks with taskStatus "Completed"
    let totalUsedHours = 0;
    let totalUsedMinutes = 0;

    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
                if (task.taskStatus === "Completed") {
                    const taskHours = parseInt(task.hours, 10) || 0;
                    const taskMinutes = parseInt(task.minutes, 10) || 0;

                    totalUsedHours += taskHours;
                    totalUsedMinutes += taskMinutes;
                }
            });
        });
    });

    // Convert excess minutes to hours
    totalUsedHours += Math.floor(totalUsedMinutes / 60);
    totalUsedMinutes %= 60;

    // Calculate total remaining hours and minutes
    let totalRemainingHours = timeBankHours - totalUsedHours;
    let totalRemainingMinutes = timeBankMinutes - totalUsedMinutes;

    // Adjust remaining minutes and hours if minutes are negative
    if (totalRemainingMinutes < 0) {
        totalRemainingHours -= 1;
        totalRemainingMinutes += 60;
    }

    // Calculate total budget
    let totalBudget = 0;
    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
                totalBudget += parseFloat(task.taskBudget) || 0;
            });
        });
    });


    // Calculate total expense for tasks with taskStatus "Completed"
    let totalExpense = 0;
    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
                if (task.taskStatus === "Completed") {
                    totalExpense += parseFloat(task.taskBudget) || 0;
                }
            });
        });
    });

    const totalRemaing = totalBudget - totalExpense

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

    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
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
    });

    const duration = calculateDuration(startDate, endDate);

    // Calculate number of people
    let numberOfPeople = 0;
    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
                numberOfPeople += task.taskMembers.length;
            });
        });
    });

    // Calculate number of tasks
    let numberOfTasks = 0;
    state.projectObject[0].workPhases?.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            numberOfTasks += goal.tasks.length;
        });
    });

    const project = state.projectObject[0];

    // Initialize task counts
    let toDoCount = 0;
    let inProgressCount = 0;
    let inReviewCount = 0;
    let completedCount = 0;

    // Count the tasks based on their status
    project.workPhases.forEach(workPhase => {
        workPhase.goals.forEach(goal => {
            goal.tasks.forEach(task => {
                switch (task.taskStatus) {
                    case 'to do':
                        toDoCount++;
                        break;
                    case 'In progress':
                        inProgressCount++;
                        break;
                    case 'In review':
                        inReviewCount++;
                        break;
                    case 'Completed':
                        completedCount++;
                        break;
                    default:
                        break;
                }
            });
        });
    });

    let totalGoals = 0;
    state.projectObject[0].workPhases.forEach(workPhase => {
        totalGoals += workPhase.goals.length;
    });

    const getBoxTop = () => {
        if (state.ref?.current) {
            return state.ref.current.getBoundingClientRect().top;
        }
    }
    return <Box ref={state.ref} sx={{ maxHeight: '82vh', overflowY: 'auto' }}>
        <div>
            <div style={{ height: "234px", gap: "40px" }}>
                <div style={{ height: "64px", backgroundColor: "rgba(37, 122, 251, 0.05)", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center" }}>
                    <h1 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(37, 122, 251, 1)", marginLeft: "32px", }}>Project Group Summary</h1>
                </div>
                <div style={{ display: "flex", alignContent: "center", alignItems: "center", height: "165px", gap: "40px" }}>
                    {/* workphase */}
                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "150px", borderRadius: "12px", padding: "12px", marginLeft: "24px", color: "white" }}>
                        <div style={{ height: "24px", alignItems: "center", display: "flex", }}>
                            <WorkPhaseSvg style={{ height: "18px", width: "15.49px" }} />
                            <h1 style={{ fontSize: "12px", lineHeight: "19px", fontWeight: "500", marginLeft: "10px" }}>WORK PHASE</h1>
                        </div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                            <h1>{state.projectObject[0].workPhases.length}</h1>
                        </div>
                    </div>

                    {/* goal */}
                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "99px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                        <div style={{ height: "24px", alignItems: "center", display: "flex", }}>
                            <GoalSvg style={{ height: "18px", width: "15.49px", marginLeft: "2px" }} />
                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "4px" }}>Goals</h1>
                        </div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                            <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{totalGoals}</h1>
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
                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "145px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                            <DurationSvg style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "10px" }}>DURATION</h1>
                        </div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500" }}>{duration}</h1>
                        </div>
                    </div>

                    {/* time bank */}
                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "135px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                            <TimerSvg style={{ height: "18px", width: "15.49px", }} />
                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>TIME BANK</h1>
                        </div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", height: "27px" }}>
                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", }}>{timeBankHours}hrs :{timeBankMinutes}mins</h1>
                        </div>
                    </div>

                    {/* budget */}
                    <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "165px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                        <div style={{ height: "24px", alignItems: "center", display: "flex" }}>
                            <MoneyCase style={{ height: "18px", width: "15.49px", marginLeft: "5px" }} />
                            <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "500", marginLeft: "5px" }}>BUDGET</h1>
                        </div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px" }}>
                            <h1 style={{marginLeft: "10px"}}>₦{totalBudget.toLocaleString()}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ gap: "24px", display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: "550px", alignContent: "center", alignItems: "center", padding: "30px" }}>

                {/* Goals card */}
                <div style={{ height: "550px", width: "586px", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", }}>
                    <div style={{ height: "59px", backgroundColor: "rgba(239, 246, 255, 1)", borderRadius: "16px 16px 0px 0px", borderBottom: "2px", display: 'flex', justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
                        <h1 style={{ fontWeight: "700", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>GOALS</h1>
                        <h2 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(191, 6, 6, 1)", cursor: "pointer" }} onClick={() => { gotoTab('', 1) }}>Go To Goals {'>'}</h2>
                    </div>
                    <div style={{ height: "36px", padding: "8px 28px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center", marginTop: "10px" }}>
                        <h1 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>PROJECT GROUP TOTAL GOALS</h1>
                    </div>

                    <div style={{ height: "123px", display: "flex", alignItems: "center", padding: "16px" }}>
                        <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "271px", borderRadius: "12px", padding: "12px", gap: "8px", color: "white" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600" }}>PROJECT GROUP TOTAL GOALS</h1>
                                <GoalSvg style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{state.projectObject[0].workPhases.length}</h1>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {state.projectObject[0].workPhases.map((workPhase, index) => {
                            // Initialize task status counts
                            let toDoCount = 0;
                            let inProgressCount = 0;
                            let inReviewCount = 0;
                            let completedCount = 0;
          

                            // Iterate through each goal within the work phase
                            workPhase.goals.forEach(goal => {
                                    switch (goal.goalStatus) {
                                        case 'To do':
                                            toDoCount++;
                                            break;
                                        case 'In progress':
                                            inProgressCount++;
                                            break;
                                        case 'In review':
                                            inReviewCount++;
                                            break;
                                        case 'Completed':
                                            completedCount++;
                                            break;
                                        default:
                                            break;
                                    }
                            });
                            console.log("to do count:", inReviewCount)
                            return (
                                <div key={index} style={{ height: "159px", paddingLeft: "16px", paddingRight: "16px" }}>
                                    <div style={{ height: "36px", padding: "8px 28px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center", marginTop: "10px" }}>
                                        <h1 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>WORKPHASE - {index + 1} GOALS</h1>
                                    </div>
                                    <div style={{ height: "123px", display: "flex", gap: "8px", alignItems: "center", alignContent: "center" }}>
                                        {/* To do */}
                                        <div style={{ width: "104px", height: "83px", borderRadius: "12px", border: "1px solid rgba(25, 211, 252, 1)", padding: "12px", backgroundColor: "rgba(23, 206, 246, 0.2)" }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(25, 211, 252, 1)" }}>TO DO</h1>
                                                <div style={{ border: `1px solid rgba(25, 211, 252, 1)`, borderRadius: '50%', height: "24px", width: "24px", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                                                    <TodoIcon style={{ color: '#19D3FC', fontSize: "14px" }} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(25, 211, 252, 1)" }}>{toDoCount}</h1>
                                            </div>
                                        </div>

                                        {/* In Progress */}
                                        <div style={{ width: "150px", height: "83px", borderRadius: "12px", border: "1px solid rgba(242, 147, 35, 1)", padding: "12px", backgroundColor: 'rgba(242, 147, 35, 0.1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(242, 147, 35, 1)" }}>IN PROGRESS</h1>
                                                <div style={{ border: `1px solid rgba(242, 147, 35, 1)`, borderRadius: '50%', height: "24px", width: "24px", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                                                    <InProgressIcon style={{ color: 'rgba(242, 147, 35, 1)', fontSize: "14px" }} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(242, 147, 35, 1)" }}>{inProgressCount}</h1>
                                            </div>
                                        </div>

                                        {/* In review */}
                                        <div style={{ width: "111px", height: "83px", borderRadius: "12px", border: "1px solid rgba(200, 9, 200, 1)", padding: "12px", backgroundColor: 'rgba(200, 90, 200, 0.1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(200, 9, 200, 1)" }}>REVIEW</h1>
                                                <div style={{ border: `1px solid rgba(200, 9, 200, 1)`, borderRadius: '50%', height: "24px", width: "24px", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                                                    <ReviewIcon style={{ color: 'rgba(200, 9, 200, 1)', fontSize: "14px" }} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(200, 9, 200, 1)" }}>{inReviewCount}</h1>
                                            </div>
                                        </div>

                                        {/* Completed */}
                                        <div style={{ width: "143px", height: "83px", borderRadius: "12px", border: "1px solid rgba(3, 178, 3, 1)", padding: "12px", backgroundColor: 'rgba(3, 178, 3, 0.1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(3, 178, 3, 1)" }}>COMPLETED</h1>
                                                <div style={{ border: `1px solid rgba(3, 178, 3, 1)`, borderRadius: '50%', height: "24px", width: "24px", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                                                    <CompletedIcon style={{ color: 'rgba(3, 178, 3, 1)', fontSize: "14px" }} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(3, 178, 3, 1)" }}>{completedCount}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Time tracker cards */}
                <div style={{ height: "550px", width: "543px", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", }}>
                    <div style={{ height: "59px", backgroundColor: "rgba(239, 246, 255, 1)", borderRadius: "16px 16px 0px 0px", borderBottom: "2px", display: 'flex', justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
                        <h1 style={{ fontWeight: "700", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>TIME TRACKER</h1>
                        <h2 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(191, 6, 6, 1)", cursor: "pointer" }} onClick={() => { gotoTab('', 2) }}>Go To To Time Tracker {'>'}</h2>
                    </div>
                    <div style={{ height: "36px", padding: "8px 28px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center", marginTop: "10px" }}>
                        <h1 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>PROJECT GROUP TIME BANK</h1>
                    </div>

                    <div style={{ height: "123px", display: "flex", alignItems: "center", padding: "16px", gap: "10px" }}>
                        {/* 1 */}
                        <div style={{ background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', height: "83px", width: "131px", borderRadius: "8px", padding: "12px", gap: "8px", color: "white" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600" }}>Time bank</h1>
                                <TimerSvg style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{timeBankHours}hrs {timeBankMinutes}mins</h1>
                            </div>
                        </div>
                        {/* 2 */}
                        <div style={{ backgroundColor: 'rgba(37, 122, 251, 0.1)', height: "83px", width: "170.43px", borderRadius: "8px", padding: "12px", gap: "8px", color: "rgba(37, 122, 251, 1)", border: "1px solid rgba(37, 122, 251, 0.5)" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Total time used</h1>
                                <DurationSvg style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{totalUsedHours}hrs {totalUsedMinutes}mins</h1>
                            </div>
                        </div>

                        {/* 3 */}
                        <div style={{ height: "83px", width: "177.29px", borderRadius: "8px", padding: "12px", gap: "8px", color: "rgba(37, 122, 251, 1)", border: "1px solid rgba(37, 122, 251, 0.5)" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Time remaining</h1>
                                <JusticeSvg style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>{totalRemainingHours}hrs {totalRemainingMinutes}mins</h1>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {project.workPhases.map((workPhase, index) => {
                            // Initialize workphase time variables
                            let workphaseTimeBankHours = 0;
                            let workphaseTimeBankMinutes = 0;
                            let workphaseTimeUsedHours = 0;
                            let workphaseTimeUsedMinutes = 0;

                            // Calculate task counts and workphase times
                            workPhase.goals.forEach(goal => {
                                goal.tasks.forEach(task => {
                                    const taskHours = parseInt(task.hours) || 0;
                                    const taskMinutes = parseInt(task.minutes) || 0;

                                    // Update workphase time bank
                                    workphaseTimeBankHours += taskHours;
                                    workphaseTimeBankMinutes += taskMinutes;

                                    // Update workphase time used if task is completed
                                    if (task.taskStatus === "Completed") {
                                        workphaseTimeUsedHours += taskHours;
                                        workphaseTimeUsedMinutes += taskMinutes;
                                    }
                                });
                            });

                            // Convert total minutes to hours if they exceed 60 for bank time
                            workphaseTimeBankHours += Math.floor(workphaseTimeBankMinutes / 60);
                            workphaseTimeBankMinutes = workphaseTimeBankMinutes % 60;

                            // Convert total minutes to hours if they exceed 60 for used time
                            workphaseTimeUsedHours += Math.floor(workphaseTimeUsedMinutes / 60);
                            workphaseTimeUsedMinutes = workphaseTimeUsedMinutes % 60;

                            // Calculate remaining hours and minutes
                            let workphaseTimeRemainingHours = workphaseTimeBankHours - workphaseTimeUsedHours;
                            let workphaseTimeRemainingMinutes = workphaseTimeBankMinutes - workphaseTimeUsedMinutes;

                            // Adjust if remaining minutes are negative
                            if (workphaseTimeRemainingMinutes < 0) {
                                workphaseTimeRemainingHours -= 1;
                                workphaseTimeRemainingMinutes += 60;
                            }

                            return (
                                <div key={index} style={{ height: "159px", paddingLeft: "16px", paddingRight: "16px" }}>
                                    <div style={{ height: "36px", padding: "8px 28px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center", marginTop: "10px" }}>
                                        <h1 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>WORKPHASE - {index + 1} TIME BANK</h1>
                                    </div>

                                    <div style={{ height: "122px", display: "flex", gap: "12px", alignItems: "center", alignContent: "center", padding: "16px" }}>
                                        <div style={{ width: "129px", height: "74px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.4)", padding: "12px 16px", backgroundColor: "rgba(37, 122, 251, 0.1)" }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Time bank</h1>
                                                <TimerSvg style={{ height: "20px", width: "20px", color: "rgba(37, 122, 251, 1)" }} />
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(37, 122, 251, 1)", fontSize: "14px" }}>{workphaseTimeBankHours}hrs {workphaseTimeBankMinutes}mins</h1>
                                            </div>
                                        </div>

                                        <div style={{ width: "140px", height: "74px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px 16px", backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Time - Used</h1>
                                                <DurationSvg style={{ height: "20px", width: "20px", color: "rgba(37, 122, 251, 1)" }} />
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(37, 122, 251, 1)", fontSize: "14px" }}>{workphaseTimeUsedHours}hrs {workphaseTimeUsedMinutes}mins</h1>
                                            </div>
                                        </div>

                                        <div style={{ width: "170px", height: "74px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px 16px", backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Time remaining</h1>
                                                <DurationSvg style={{ height: "20px", width: "20px", color: "rgba(37, 122, 251, 1)" }} />
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(37, 122, 251, 1)", fontSize: "14px" }}>{workphaseTimeRemainingHours}hrs {workphaseTimeRemainingMinutes}mins</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Expense & Invoice */}
                <div style={{ height: "550px", width: "455px", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", }}>
                    <div style={{ height: "59px", backgroundColor: "rgba(242, 255, 242, 1)", borderRadius: "16px 16px 0px 0px", borderBottom: "2px", display: 'flex', justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
                        <h1 style={{ fontWeight: "700", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>EXPENSE & INVOICE</h1>
                        <h2 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(191, 6, 6, 1)", cursor: "pointer" }} onClick={() => { gotoTab('', 3) }}>Go To Expense & Invoice {'>'}</h2>
                    </div>
                    <div style={{ height: "36px", padding: "8px 28px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center", marginTop: "10px" }}>
                        <h1 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>PROJECT GROUP BUDGET</h1>
                    </div>

                    <div style={{ height: "123px", display: "flex", alignItems: "center", padding: "16px", gap: "10px" }}>
                        {/* 1 */}
                        <div style={{ background: 'linear-gradient(90deg, #4E944F 0%, #225222 81.8%)', height: "83px", width: "111px", borderRadius: "8px", padding: "12px", gap: "8px", color: "white" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600" }}>Budget</h1>
                                <Budget style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", fontSize: "14px" }}>₦{totalBudget.toLocaleString()}</h1>
                            </div>
                        </div>
                        {/* 2 */}
                        <div style={{ backgroundColor: 'rgba(78, 148, 79, 0.1)', height: "83px", width: "158px", borderRadius: "8px", padding: "12px", gap: "8px", color: "rgba(78, 148, 79, 1)", border: "1px solid rgba(78, 148, 79, 0.5))" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Total Expense</h1>
                                <ProjectExpenseSvg style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>₦{totalExpense.toLocaleString()}</h1>
                            </div>
                        </div>

                        {/* 3 */}
                        <div style={{ height: "83px", width: "122px", borderRadius: "8px", padding: "12px", gap: "8px", color: "rgba(78, 148, 79, 1)", border: "1px solid rgba(78, 148, 79, 0.5)" }}>
                            <div style={{ height: "24px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Balance</h1>
                                <JusticeSvg style={{ height: "20px", width: "20px" }} />
                            </div>
                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px", }}>
                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}>₦{totalRemaing.toLocaleString()}</h1>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {project.workPhases.map((workPhase, index) => {
                            // Initialize workphase budget and expense variables
                            let workphaseBudget = 0;
                            let workphaseExpense = 0;

                            workPhase.goals.forEach(goal => {
                                goal.tasks.forEach(task => {
                                    const taskBudget = parseFloat(task.taskBudget) || 0;

                                    workphaseBudget += taskBudget;

                                    if (task.taskStatus === "Completed") {
                                        workphaseExpense += taskBudget;
                                    }
                                });
                            });

                            // Calculate workphase balance
                            const workphaseBalance = workphaseBudget - workphaseExpense;

                            return (
                                <div key={index} style={{ height: "159px", paddingLeft: "16px", paddingRight: "16px" }}>
                                    <div style={{ height: "36px", padding: "8px 28px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center", marginTop: "10px" }}>
                                        <h1 style={{ fontWeight: "600", fontSize: "13px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>WORKPHASE - {index + 1} BUDGET & EXPENSES</h1>
                                    </div>

                                    <div style={{ height: "122px", display: "flex", gap: "12px", alignItems: "center", alignContent: "center", padding: "16px" }}>
                                        <div style={{ width: "119px", height: "74px", borderRadius: "8px", border: "1px solid rgba(78, 148, 78, 0.4)", padding: "12px 16px", backgroundColor: "rgba(78, 148, 79, 0.1)" }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Budget</h1>
                                                <Budget style={{ height: "20px", width: "20px", color: "rgba(78, 148, 79, 1)" }} />
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)" }}>₦{workphaseBudget.toLocaleString()}</h1>
                                            </div>
                                        </div>

                                        <div style={{ width: "119px", height: "74px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px 16px", backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(51, 51, 51, 1)" }}>Expense</h1>
                                                <ProjectExpenseSvg style={{ height: "20px", width: "20px", color: "rgba(78, 148, 79, 1)" }} />
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)" }}>₦{workphaseExpense.toLocaleString()}</h1>
                                            </div>
                                        </div>

                                        <div style={{ width: "119px", height: "74px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px 16px", backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                                            <div style={{ height: "19px", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                                                <h1 style={{ fontSize: "14px", lineHeight: "19px", fontWeight: "600", color: "rgba(78, 148, 79, 1)" }}>Balance</h1>
                                                <JusticeSvg style={{ height: "20px", width: "20px", color: "rgba(78, 148, 79, 1)" }} />
                                            </div>
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "start", height: "27px", marginTop: "5px" }}>
                                                <h1 style={{ textAlign: "center", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)" }}>₦{workphaseBalance.toLocaleString()}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                </div>
                {/* end cards */}
            </div>
        </div>
        {/* // ))} */}
    </Box>
}
