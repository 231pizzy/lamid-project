'use client'
import { DurationSvg, MoneyCase, TaskSvg, ThreePersonSvg, TimerSvg, WorkPhaseSvg, Budget, GoalSvg, JusticeSvg, Receipt, ProjectExpenseSvg, CalendarSvg, OnePersonSvg } from "@/public/icons/icons";
import { useEffect, useState } from "react";
import { getProjectGroupData } from "../helper";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function ExpenseTab({ projectId }) {
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkPhase, setSelectedWorkPhase] = useState([]);
    const [selectedWorkphaseIndex, setSelectedWorkphaseIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [leftClick, setLeftClick] = useState(false)
    const [selectedGoals, setSelectedGoal] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(null)
    console.log("selectedTask:", selectedTask)

    useEffect(() => {
        setLoading(true);
        getProjectGroupData({
            projectId: projectId,
            dataProcessor: (result) => {
                console.log('Fetched result:', result);
                setProjectData([result]);
                if (result.workPhases && result.workPhases.length > 0) {
                    setSelectedWorkPhase(result.workPhases[0]);
                    setSelectedWorkphaseIndex(0)
                }
                setLoading(false);
            }
        });
    }, [projectId]);

    useEffect(() => {
        const workPhases = projectData[0]?.workPhases[selectedWorkphaseIndex];
        const goals = workPhases?.goals;
        
        if (goals && goals.length > 0) {
            const firstGoal = goals[0];
            setSelectedGoal(firstGoal);
            
            if (firstGoal.tasks && firstGoal.tasks.length > 0) {
                setSelectedTask(firstGoal.tasks[0]);
            }
        }
    }, [selectedWorkphaseIndex, projectData]);


    const handleWorkPhaseClick = (workPhase, index) => {
        setSelectedWorkPhase(workPhase);
        setSelectedWorkphaseIndex(index)
    };

    // Function to handle next page click
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    // Function to handle previous page click
    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const filteredProjectData = selectedWorkPhase
        ? projectData.map(project => ({
            ...project,
            workPhases: project.workPhases.filter(phase => phase.workPhaseName === selectedWorkPhase.workPhaseName)
        }))
        : projectData;

    console.log("filteredProjectData:", filteredProjectData)

    const calculateBudget = (tasks) => {
        return tasks.reduce((acc, task) => acc + parseInt(task.taskBudget), 0);
    };

    const calculateBudgetSpent = (tasks) => {
        return tasks.reduce((acc, task) => {
            if (task.taskStatus === "Completed") {
                return acc + parseInt(task.taskBudget);
            } else if (task.taskStatus === "In progress") {
                return acc + Math.round(task.taskBudget * 0.3);
            } else if (task.taskStatus === "In review") {
                return acc + Math.round(task.taskBudget * 0.6);
            }
            return acc;
        }, 0);
    };

    const calculateTotalWorkPhaseBudget = (data) => {
        let totalBudget = 0;

        data.forEach(project => {
            project.workPhases.forEach(workPhase => {
                workPhase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        const taskBudget = parseInt(task.taskBudget);
                        if (!isNaN(taskBudget)) {
                            totalBudget += taskBudget;
                        } else {
                            console.error("Invalid task Budget:", task.taskBudget);
                        }
                    });
                });
            });
        });

        return { totalBudget };
    };

    const totalBudget = calculateTotalWorkPhaseBudget(filteredProjectData);

    const calculateTotalSpentWorkPhaseBudget = (data) => {
        let totalBudget = 0;

        data.forEach(project => {
            project.workPhases.forEach(workPhase => {
                workPhase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        if (task.taskStatus === "Completed") {
                            const taskBudget = parseInt(task.taskBudget);
                            if (!isNaN(taskBudget)) {
                                totalHours += taskBudget;
                            } else {
                                console.error("Invalid task taskBudget:", task.taskBudget);
                            }
                        }
                    });
                });
            });
        });

        return { totalBudget };
    };
    const totalSpentBudget = calculateTotalSpentWorkPhaseBudget(filteredProjectData);

    const balanceRemaining = {
        totalBudget: totalBudget.totalBudget - totalSpentBudget.totalBudget,
    };


    const calculateAllWorkPhaseTime = (projectData) => {
        let totalBudget = 0;
        let totalSpentBudget = 0;

        projectData.forEach(project => {
            project.workPhases.forEach(workPhase => {
                workPhase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        const taskBudget = parseInt(task.taskBudget);
                        if (!isNaN(taskBudget)) {
                            totalBudget += taskBudget;
                            if (task.taskStatus === "Completed") {
                                totalSpentBudget += taskBudget;
                            }
                        } else {
                            console.error("Invalid task hours or minutes:", task.taskBudget);
                        }
                    });
                });
            });
        });


        let remainingBudget = totalBudget - totalSpentBudget;


        return {
            totalBudget,
            totalSpentBudget,
            remainingBudget,
        };
    };

    const workPhaseTime = calculateAllWorkPhaseTime(projectData);
    console.log(workPhaseTime);

    const goalsPerPage = 4;

    const handleGoalClick = (goal) => {
        setSelectedGoal(goal)
    }

    const calculateCompletedTasksBudget = (task) => {
        if (!task || !Array.isArray(task)) {
            return 0; 
        }
    
        return task.reduce((total, task) => {
            return task.taskStatus === 'Completed' ? total + task.tasksBudget : total;
        }, 0);
    };
    

 const completedTaskBudget = calculateCompletedTasksBudget(selectedTask);

    const handleTaskClick = (task, taskIndex) => {
        setSelectedTask(task)
        setSelectedTaskIndex(taskIndex)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

  
    return (
        <div style={{ width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: "flex", justifyContent: "flex-end", height: "124px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", alignItems: "center", gap: "16px", padding: "12px" }}>
                <div style={{ height: "76px", background: 'linear-gradient(90deg, #4E944F 0%, #225222 81.8%)', width: "266px", borderRadius: "8px", padding: "12px", boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "white", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center' }}>Project Group Total Budget</h2>
                        <Budget style={{ height: "18px", width: "22.29px" }} />
                    </div>
                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "white", textAlign: "start", marginTop: "5px" }}>₦{workPhaseTime.totalBudget.toLocaleString()}</h3>
                </div>

                <div style={{ backgroundColor: "rgba(78, 148, 79, 0.1)", height: "76px", width: "174px", borderRadius: "8px", border: "1px solid rgba(78, 148, 79, 0.5)", padding: "12px", boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(78, 148, 79, 1)", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Total Expense</h2>
                        <Receipt style={{ height: "18px", width: "22.29px" }} />
                    </div>
                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>₦{workPhaseTime.totalSpentBudget.toLocaleString()}</h3>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", height: "76px", width: "134px", borderRadius: "8px", border: "1px solid rgba(78, 148, 79, 0.5)", padding: "12px", boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(78, 148, 79, 1)", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Balance</h2>
                        <JusticeSvg style={{ height: "18px", width: "22.29px" }} />
                    </div>
                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>₦{workPhaseTime.remainingBudget.toLocaleString()}</h3>
                </div>
            </div>


            <div style={{ border: "1px solid rgba(28, 29, 34, 0.1)", height: "378px" }}>
                <div style={{ backgroundColor: "rgba(242, 255, 242, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "82px", display: "flex", padding: "12px", gap: "16px" }}>
                    {projectData[0]?.workPhases.map((workPhase, index) => (
                        <div key={index} onClick={() => handleWorkPhaseClick(workPhase, index)} style={{ width: "150x", height: "46px", top: "16px", marginLeft: "32px", borderRadius: "8px", padding: "12px 16px", gap: "10px", backgroundColor: selectedWorkphaseIndex === index ? "rgba(78, 148, 79, 1)" : "rgba(255, 255, 255, 1)", cursor: "pointer", border: "1px solid rgba(78, 148, 79, 1)", color: selectedWorkphaseIndex === index ? "rgba(255, 255, 255, 1)" : "rgba(78, 148, 79, 1)" }}>
                            <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", }}>{`WORK PHASE ${index + 1}`}</h3>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", }}>
                    <div style={{ width: "70%", height: "296px" }}>
                        <div style={{ height: "55px", backgroundColor: "rgba(28, 29, 34, 0.06)", border: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                            <h2 style={{ marginLeft: "32px", fontWeight: "600", fontSize: "18px", lineHeight: "26.31px", color: "rgba(51, 51, 51, 1)" }}>GOALS UNDER WORKPHASE - {selectedWorkphaseIndex + 1}</h2>


                            <div style={{ marginRight: "32px" }}>
                                <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                    {/* Previous page button */}
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid rgba(141, 141, 141, 1)`, transition: 'border-color 0.3s ease', borderColor: leftClick ? 'rgba(191, 6, 6, 1)' : 'rgba(28, 29, 34, 0.1)' }} className={`bg-gray-100 cursor-pointer mr-4 ${currentPage === 0 ? 'pointer-events-none' : ''}`} onClick={prevPage} onMouseEnter={() => setLeftClick(true)} onMouseLeave={() => setLeftClick(false)}>
                                        <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: leftClick ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)" }} />
                                    </div>

                                    {/* Display current page range */}
                                    <p>{currentPage * goalsPerPage + 1} - {Math.min((currentPage + 1) * goalsPerPage, filteredProjectData.length)} of {filteredProjectData.length}</p>

                                    {/* Next page button */}
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid rgba(141, 141, 141, 1)`, transition: 'border-color 0.3s ease', borderColor: isHovered ? 'rgba(191, 6, 6, 1)' : 'rgba(28, 29, 34, 0.1)' }} className={`bg-gray-100 cursor-pointer ml-4 ${currentPage === Math.ceil(filteredProjectData.length / 4) - 1 ? 'pointer-events-none' : ''}`} onClick={nextPage} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                        <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: isHovered ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)" }} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div style={{ height: "241px", padding: "24px 32px", gap: "24px", display: "flex", maxWidth: "70%", overflowX: "auto" }}>
                            {filteredProjectData.map(project =>
                                project.workPhases.map(phase =>
                                    phase.goals.slice(currentPage * goalsPerPage, (currentPage + 1) * goalsPerPage).map((goal, goalIndex) => {
                                        const budget = calculateBudget(goal.tasks);
                                        const spent = calculateBudgetSpent(goal.tasks);
                                        const progressPercentage = (spent / budget) * 100;

                                        return (
                                            <div key={goalIndex} style={{ height: "200px", width: "280px", borderRadius: "16px", border: selectedGoals === goal ? "1.5px solid rgba(240, 135, 135, 1)" : "1.5px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)" }} onClick={() => handleGoalClick(goal)}>
                                                <div style={{ height: '36px', backgroundColor: "rgba(242, 255, 242, 1)", display: "flex", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)", borderRadius: "16px 16px 0px 0px" }}>
                                                    <GoalSvg style={{ marginLeft: "16px" }} />
                                                    <h2 style={{ marginLeft: "16px", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Goal - {goalIndex + 1}</h2>
                                                </div>

                                                <div style={{ width: "248px", height: "44px", marginTop: "16px", marginLeft: "16px" }}>
                                                    <p style={{ fontWeight: "600", fontSize: "16px", lineHeight: "21.79px", color: "rgba(93, 93, 93, 1)" }}>{goal.goalName}</p>
                                                </div>

                                                <div style={{ width: "278px", height: "27px", padding: "4px 8px", gap: "10px", top: "124px", backgroundColor: "rgba(242, 242, 242, 0.9)", marginTop: "10px" }}>
                                                    <div style={{ display: "flex", color: "rgba(141, 141, 141, 1)", alignItems: "center" }}>
                                                        <Budget style={{ height: "16px", width: "13.77px", marginRight: "5px" }} />
                                                        <p style={{ fontWeight: "600", fontSize: "14px", lineHeight: "19.07px" }}>Budget - ₦{budget.toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                <div style={{ width: "248px", height: "35px", marginLeft: "16px", borderRadius: "2px", top: "163px", gap: "5px" }}>
                                                    <h3 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(78, 148, 79, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                                        Time Spent: <span style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(78, 148, 79, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                                            {`₦${spent.toLocaleString()} from ₦${budget.toLocaleString()}`}
                                                        </span>
                                                    </h3>

                                                    <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                                        <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: 'rgba(78, 148, 79, 1)', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )
                            )}
                        </div>
                    </div>

                    <div style={{ width: "30%" }}>
                        <div style={{ height: "55px", backgroundColor: "rgba(28, 29, 34, 0.06)", border: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", alignItems: "center" }}>
                            <h2 style={{ marginLeft: "32px", fontWeight: "600", fontSize: "18px", lineHeight: "26.31px", color: "rgba(51, 51, 51, 1)" }}>Expense & Invoice for Work Phase {selectedWorkphaseIndex + 1}</h2>
                        </div>

                        {filteredProjectData.length > 0 && (
                            <div style={{ height: "241px", padding: "24px", gap: "40px", backgroundColor: "rgba(41, 156, 41, 0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

                                <div style={{ width: "139px", height: "74px", borderRadius: "8px", border: "1px solid rgba(41, 156, 41, 0.4)", padding: "12px 16px", color: "rgba(78, 148, 79, 1)", backgroundColor: "rgba(41, 156, 41, 0.1)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Budget</h2>
                                        <Budget style={{ height: "18px", width: "22.29px" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "15px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>₦{totalBudget.totalBudget.toLocaleString()}</h3>
                                </div>

                                <div style={{ display: "flex", gap: "12px" }}>

                                    <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "74px", width: "148px", borderRadius: "8px", padding: "12px 16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(78, 148, 79, 1)", alignItems: "center" }}>
                                            <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Expense</h2>
                                            <DurationSvg style={{ height: "18px", width: "22.29px" }} />
                                        </div>
                                        <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>₦{totalSpentBudget.totalBudget.toLocaleString()}</h3>
                                    </div>

                                    <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "74px", width: "127px", borderRadius: "8px", padding: "12px 16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(78, 148, 79, 1)", alignItems: "center" }}>
                                            <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Balance</h2>
                                            <JusticeSvg style={{ height: "18px", width: "22.29px" }} />
                                        </div>
                                        <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>₦{balanceRemaining.totalBudget.toLocaleString()}</h3>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Goals end */}

            {/* tasks begin */}
            <div style={{ display: "flex", height: "304px" }}>
                {selectedGoals && (
                    <div style={{ width: "60%" }}>
                        <div style={{ height: "55px", backgroundColor: "rgba(28, 29, 34, 0.06)", border: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                            <h2 style={{ marginLeft: "32px", fontWeight: "600", fontSize: "18px", lineHeight: "26.31px", color: "rgba(51, 51, 51, 1)" }}>TASK UNDER GOAL - {selectedWorkphaseIndex + 1}</h2>


                            <div style={{ marginRight: "32px" }}>
                                <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                    {/* Previous page button */}
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid rgba(141, 141, 141, 1)`, transition: 'border-color 0.3s ease', borderColor: leftClick ? 'rgba(191, 6, 6, 1)' : 'rgba(28, 29, 34, 0.1)' }} className={`bg-gray-100 cursor-pointer mr-4 ${currentPage === 0 ? 'pointer-events-none' : ''}`} onClick={prevPage} onMouseEnter={() => setLeftClick(true)} onMouseLeave={() => setLeftClick(false)}>
                                        <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: leftClick ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)" }} />
                                    </div>

                                    {/* Display current page range */}
                                    <p>{currentPage * goalsPerPage + 1} - {Math.min((currentPage + 1) * goalsPerPage, filteredProjectData.length)} of {filteredProjectData.length}</p>

                                    {/* Next page button */}
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid rgba(141, 141, 141, 1)`, transition: 'border-color 0.3s ease', borderColor: isHovered ? 'rgba(191, 6, 6, 1)' : 'rgba(28, 29, 34, 0.1)' }} className={`bg-gray-100 cursor-pointer ml-4 ${currentPage === Math.ceil(filteredProjectData.length / 4) - 1 ? 'pointer-events-none' : ''}`} onClick={nextPage} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                        <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: isHovered ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)" }} />
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div style={{ height: "252px", padding: "24px 32px", gap: "24px", display: "flex", maxWidth: "100%", overflowX: "auto" }}>
                            {selectedGoals.tasks.map((task, taskIndex) => (


                                <div key={taskIndex} style={{ height: "204px", width: "243px", borderRadius: "16px", border: selectedTask === task ? "1.5px solid rgba(240, 135, 135, 1)" : "1.5px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", cursor: 'pointer' }} onClick={() => handleTaskClick(task, taskIndex)}>
                                    <div style={{ height: '44px', backgroundColor: "rgba(242, 255, 242, 1)", display: "flex", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)", borderRadius: "16px 16px 0px 0px" }}>
                                        <TaskSvg style={{ marginLeft: "16px" }} />
                                        <h2 style={{ marginLeft: "16px", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Task - {taskIndex + 1}</h2>
                                    </div>

                                    <div style={{ height: "76px", display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                                        <div style={{ width: "140px", borderRight: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                            <div style={{ height: "27px", backgroundColor: "rgba(242, 242, 242, 0.9)", padding: "4px 8px", display: "flex", alignItems: "center", color: "rgba(141, 141, 141, 1)", fontSize: "14px", lineHeight: "19.07px", gap: "10px" }}>
                                                <CalendarSvg />
                                                <h3>Date</h3>
                                            </div>

                                            <div style={{ marginLeft: "14px", marginTop: "12px", fontSize: "12px", alignContent: "center", alignItems: "center", marginBottom: "10px", height: "26px", width: "107px", backgroundColor: "rgba(28, 29, 34, 0.04)", borderRadius: "10px", border: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                                <div className="ml-2">
                                                {formatDate(task.startDate)} - {formatDate(task.endDate)}
                                                </div>
                                            </div>


                                        </div>

                                        <div style={{ width: "103px" }}>
                                            <div style={{ height: "27px", backgroundColor: "rgba(242, 242, 242, 0.9)", padding: "4px 8px", display: "flex", alignItems: "center", color: "rgba(141, 141, 141, 1)", fontSize: "14px", lineHeight: "19.07px", gap: "10px" }}>
                                                <Budget />
                                                <h3>Budget</h3>
                                            </div>
                                            <div style={{ marginLeft: "14px", marginTop: "12px", fontSize: "12px", alignContent: "center", alignItems: "center", marginBottom: "10px", height: "26px", width: "66px", backgroundColor: "rgba(28, 29, 34, 0.04)", borderRadius: "10px", border: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                            <div className="ml-1">
                                            ₦{parseInt(task.taskBudget, 10).toLocaleString()}
                                            </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div style={{ height: "71px" }}>
                                        <div style={{ height: "27px", backgroundColor: "rgba(242, 242, 242, 0.9)", padding: "4px 8px", display: "flex", alignItems: "center", color: "rgba(141, 141, 141, 1)", fontSize: "14px", lineHeight: "19.07px", gap: "10px" }}>
                                            <ThreePersonSvg />
                                            <h3>Assignee</h3>
                                        </div>
                                        <div style={{display: "flex"}}>
                                        {task.taskMembers.slice(0,7).map((member, index) => (
                                            <img key={index} src={member.profilePicture} alt={member.fullName}className="rounded-full object-cover mt-2"
                                                style={{ height: '35px', width: '35px', border: '1px solid #0BC5EE1A',marginLeft: index > 0 ? '-10px' : '0'
                                                }}
                                            />
                                        ))}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ width: "40%" }}>
                    <div style={{ height: "55px", backgroundColor: "rgba(28, 29, 34, 0.06)", border: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", alignItems: "center" }}>
                        <h2 style={{ marginLeft: "32px", fontWeight: "600", fontSize: "18px", lineHeight: "26.31px", color: "rgba(51, 51, 51, 1)" }}>Expense & Invoice for Work Phase {selectedWorkphaseIndex + 1}</h2>
                    </div>

                    {filteredProjectData.length > 0 && (
                        <div style={{ height: "241px", padding: "24px", gap: "40px", backgroundColor: "rgba(41, 156, 41, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>

                            <div style={{ width: "139px", height: "74px", borderRadius: "8px", border: "1px solid rgba(41, 156, 41, 0.4)", padding: "12px 16px", color: "rgba(78, 148, 79, 1)", backgroundColor: "rgba(41, 156, 41, 0.1)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Budget</h2>
                                    <Budget style={{ height: "18px", width: "22.29px" }} />
                                </div>
                                <h3 style={{ fontWeight: "700", fontSize: "15px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>{totalBudget.totalBudget.toLocaleString()}</h3>
                            </div>

                            {/* <div style={{ display: "flex", gap: "12px" }}> */}

                                <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "74px", width: "148px", borderRadius: "8px", padding: "12px 16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(78, 148, 79, 1)", alignItems: "center" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Expense</h2>
                                        <DurationSvg style={{ height: "18px", width: "22.29px" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>{totalBudget.totalBudget.toLocaleString()}</h3>
                                </div>

                                <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "74px", width: "127px", borderRadius: "8px", padding: "12px 16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(78, 148, 79, 1)", alignItems: "center" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Balance</h2>
                                        <JusticeSvg style={{ height: "18px", width: "22.29px" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(78, 148, 79, 1)", textAlign: "start", marginTop: "5px" }}>{totalBudget.totalBudget.toLocaleString()}</h3>
                                </div>

                            {/* </div> */}
                        </div>
                    )}
                </div>
            </div>
            {/* tasks end */}

            {/* expense invoice breakdown begins*/}
            {selectedTask && (
            <div style={{ height: "855px" }}>
                <div style={{ backgroundColor: "rgba(255, 250, 250, 1)", alignContent: "center", alignItems: "center", justifyContent: "center", display: "flex", border: "1px 0px solid rgba(28, 29, 34, 0.1)", height: "70px" }}>
                    <h2 style={{ fontWeight: "700", fontSize: "18px", color: "rgba(51, 51, 51, 1)", lineHeight: "24.51px" }}>EXPENSE & INVOICE BREAKDOWN FOR TASK - {selectedTaskIndex + 1}</h2>
                </div>

                <div style={{ display: "flex", height: "782px" }}>
                    <div style={{ width: "47%" }}>
                        <div style={{ backgroundColor: "rgba(78, 148, 79, 0.1)", height: "48px", padding: "16px", borderBottom: "1px" }}>
                            <h3 style={{ fontWeight: "600", fontSize: "16px", lineHeight: "21.79px", color: "rgba(51, 51, 51, 1)" }}>TASK DETAILS</h3>
                        </div>

                        <div style={{ alignContent: "center", alignItems: "center", display: "flex", justifyContent: "center", marginTop: "15px" }}>
                            <div style={{ height: "246px", width: "512px", borderRadius: "16px", border: "1.5px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)" }}>
                                <div style={{ height: '36px', backgroundColor: "rgba(242, 255, 242, 1)", display: "flex", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)", borderRadius: "16px 16px 0px 0px" }}>
                                    <TaskSvg style={{ marginLeft: "16px" }} />
                                    <h2 style={{ marginLeft: "16px", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Task - {selectedTaskIndex + 1}</h2>
                                </div>
                                <div style={{ height: "97px", marginBottom: "10px", marginTop: "10px", marginLeft: "10px" }}>
                                  {selectedTask.taskName}
                                </div>

                                <div style={{ height: "76px", display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                                    <div style={{ width: "140px", height: "105px", borderRight: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                        <div style={{ height: "27px", backgroundColor: "rgba(242, 242, 242, 0.9)", padding: "4px 8px", display: "flex", alignItems: "center", color: "rgba(141, 141, 141, 1)", fontSize: "14px", lineHeight: "19.07px", gap: "10px" }}>
                                            <CalendarSvg />
                                            <h3>Date</h3>
                                        </div>
                                        <div style={{ marginLeft: "14px", marginTop: "12px", fontSize: "12px", alignContent: "center", alignItems: "center", marginBottom: "10px", height: "46px", width: "107px", backgroundColor: "rgba(28, 29, 34, 0.04)", borderRadius: "10px", border: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                        <h3 className="ml-2">Date</h3>
                                        <div className="ml-2">
                                        {formatDate(selectedTask.startDate)} - {formatDate(selectedTask.endDate)}
                                        </div>
                                        </div>

                                    </div>

                                    <div style={{ width: "372px", height: "105px" }}>
                                        <div style={{ height: "27px", backgroundColor: "rgba(242, 242, 242, 0.9)", padding: "4px 8px", display: "flex", alignItems: "center", color: "rgba(141, 141, 141, 1)", fontSize: "14px", lineHeight: "19.07px", gap: "10px" }}>
                                            <Budget />
                                            <h3>Budget</h3>
                                            ₦{parseInt(selectedTask.taskBudget, 10).toLocaleString()}
                                        </div>
                                        <div style={{ marginLeft: "16px", borderRadius: "2px", top: "163px", gap: "5px" }}>
                                            <h3 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(78, 148, 79, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                                Budget Spent: <span style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(78, 148, 79, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                                ₦{completedTaskBudget.toLocaleString()} out of ₦{parseInt(selectedTask.taskBudget, 10).toLocaleString()}
                                                </span>
                                            </h3>

                                            <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                                <div style={{ width: `60%`, height: '100%', backgroundColor: 'rgba(78, 148, 79, 1)', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <div style={{ height: "420px", marginTop: "15px" }}>
                            <div style={{ height: "42px", gap: "10px", backgroundColor: "rgba(248, 248, 248, 1)", padding: "24px 10px", alignItems: "center", alignContent: 'center', display: "flex" }}>
                                <h3 style={{ fontWeight: "600", fontSize: "16px", lineHeight: "21.79px", color: "rgba(51, 51, 51, 1)" }}>Assignee({selectedTask.taskMembers.length})</h3>
                            </div>

                            <div style={{ maxHeight: "340px", gap: "24px", padding: "24px", display: "flex", flexWrap: "wrap" }}>
                                {selectedTask.taskMembers.map((member, index) => (
                             <div key={index} style={{ height: "153px", width: "160px", borderRadius: '16px', border: '1.5px solid rgba(28, 29, 34, 0.1)', boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)" }}>
                                    <div style={{ height: "36px", backgroundColor: "rgba(242, 255, 242, 1)", borderRadius: "16px 16px 0px 0px", padding: "8px", gap: "10px", display: "flex", alignContent: "center", alignItems: "center", color: "rgba(78, 148, 79, 1)" }}>
                                        <OnePersonSvg />
                                        <h3 style={{ fontSize: "14px", fontWeight: "500", lineHeight: "19.07" }}>Assignee - {index + 1}</h3>
                                    </div>

                                    <div style={{ alignContent: "center", justifyContent: "center", display: "flex", }}>
                                        <div style={{ marginTop: "10px" }}>
                                            <img src={member.profilePicture} style={{ width: "40px", height: "40px", marginLeft: "20px", borderRadius: "50%", marginBottom: "10px" }} />
                                            <h3 style={{ fontWeight: "500", fontSize: "16px", textAlign: "center", color: "rgba(51, 51, 51, 1)" }}>{member.fullName}</h3>

                                            <p style={{ fontWeight: "500", fontSize: "14px", textAlign: "center", color: "rgba(141, 141, 141, 1)" }}>{member.role}</p>

                                        </div>
                                    </div>
                                </div>
                                ))}



                            </div>
                        </div>

                    </div>
                    

                    <div style={{ width: "53%", alignContent: "center", justifyContent: "center", display: "flex" }}>
                        <img src="/images/assignee.png" alt="Upload File" />
                    </div>

                </div>

            </div>
            )}
            {/* expense invoice breakdown ends*/}

        </div>
        // </div>
    )
}
