'use client'
import { DurationSvg, MoneyCase, TaskSvg, ThreePersonSvg, TimerSvg, WorkPhaseSvg, Budget, GoalSvg, JusticeSvg, Receipt, ProjectExpenseSvg } from "@/public/icons/icons";
import { useEffect, useState } from "react";
import { getProjectGroupData } from "../helper";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function TimeTrackerTab({ projectId }) {
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkPhase, setSelectedWorkPhase] = useState([]);
    const [selectedWorkphaseIndex, setSelectedWorkphaseIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [leftClick, setLeftClick] = useState(false)
    console.log("projectData:", projectData)

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

    const calculateTimeBank = (tasks) => {
        return tasks.reduce((acc, task) => acc + parseInt(task.hours), 0);
    };

    const calculateTimeSpent = (tasks) => {
        return tasks.reduce((acc, task) => {
            if (task.taskStatus === "Completed") {
                return acc + parseInt(task.hours);
            } else if (task.taskStatus === "In progress") {
                return acc + Math.round(task.hours * 0.3);
            } else if (task.taskStatus === "In review") {
                return acc + Math.round(task.hours * 0.6);
            }
            return acc;
        }, 0);
    };

    const calculateTotalWorkPhaseTime = (data) => {
        let totalHours = 0;
        let totalMinutes = 0;

        data.forEach(project => {
            project.workPhases.forEach(workPhase => {
                workPhase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        const taskHours = parseInt(task.hours);
                        const taskMinutes = task.minutes === "" ? 0 : parseInt(task.minutes);
                        if (!isNaN(taskHours) && !isNaN(taskMinutes)) {
                            totalHours += taskHours;
                            totalMinutes += taskMinutes;
                        } else {
                            console.error("Invalid task hours or minutes:", task.hours, task.minutes);
                        }
                    });
                });
            });
        });

        // Convert minutes to hours
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        return { totalHours, totalMinutes };
    };

    const totalTime = calculateTotalWorkPhaseTime(filteredProjectData);

    const calculateTotalCompletedWorkPhaseTime = (data) => {
        let totalHours = 0;
        let totalMinutes = 0;

        data.forEach(project => {
            project.workPhases.forEach(workPhase => {
                workPhase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        if (task.taskStatus === "Completed") {
                            const taskHours = parseInt(task.hours);
                            const taskMinutes = task.minutes === "" ? 0 : parseInt(task.minutes);
                            if (!isNaN(taskHours) && !isNaN(taskMinutes)) {
                                totalHours += taskHours;
                                totalMinutes += taskMinutes;
                            } else {
                                console.error("Invalid task hours or minutes:", task.hours, task.minutes);
                            }
                        }
                    });
                });
            });
        });

        // Convert minutes to hours
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        return { totalHours, totalMinutes };
    };
    const totalCompletedTime = calculateTotalCompletedWorkPhaseTime(filteredProjectData);

    const timeRemaining = {
        totalHours: totalTime.totalHours - totalCompletedTime.totalHours,
        totalMinutes: totalTime.totalMinutes - totalCompletedTime.totalMinutes
    };

    // If totalMinutes becomes negative, adjust totalHours
    if (timeRemaining.totalMinutes < 0) {
        timeRemaining.totalMinutes += 60;
        timeRemaining.totalHours--;
    }

    const calculateAllWorkPhaseTime = (projectData) => {
        let totalHours = 0;
        let totalMinutes = 0;
        let totalSpentHours = 0;
        let totalSpentMinutes = 0;

        projectData.forEach(project => {
            project.workPhases.forEach(workPhase => {
                workPhase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        const taskHours = parseInt(task.hours);
                        const taskMinutes = task.minutes === "" ? 0 : parseInt(task.minutes);
                        if (!isNaN(taskHours) && !isNaN(taskMinutes)) {
                            totalHours += taskHours;
                            totalMinutes += taskMinutes;
                            if (task.taskStatus === "Completed") {
                                totalSpentHours += taskHours;
                                totalSpentMinutes += taskMinutes;
                            }
                        } else {
                            console.error("Invalid task hours or minutes:", task.hours, task.minutes);
                        }
                    });
                });
            });
        });

        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        totalSpentHours += Math.floor(totalSpentMinutes / 60);
        totalSpentMinutes = totalSpentMinutes % 60;

        let remainingHours = totalHours - totalSpentHours;
        let remainingMinutes = totalMinutes - totalSpentMinutes;

        if (remainingMinutes < 0) {
            remainingHours -= 1;
            remainingMinutes += 60;
        }

        remainingHours = Math.max(0, remainingHours);

        return {
            totalHours,
            totalMinutes,
            totalSpentHours,
            totalSpentMinutes,
            remainingHours,
            remainingMinutes
        };
    };

    const workPhaseTime = calculateAllWorkPhaseTime(projectData);
    console.log(workPhaseTime);




    const goalsPerPage = 4;

    return (
        <div sx={{ maxWidth: '100%', overflowY: 'auto', maxHeight: '80vh', }} >
            <div style={{ display: "flex", justifyContent: "flex-end", height: "124px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", alignItems: "center", gap: "16px", padding: "12px" }}>
                <div style={{ height: "76px", background: 'linear-gradient(90deg, #257AFB 0%, #234374 81.8%)', width: "235.49px", borderRadius: "8px", padding: "12px", boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "white", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center' }}>Project group time bank</h2>
                        <TimerSvg style={{ height: "18px", width: "22.29px" }} />
                    </div>
                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "white", textAlign: "start", marginTop: "5px" }}>{workPhaseTime.totalHours} hours {workPhaseTime.totalMinutes} mins</h3>
                </div>

                <div style={{ backgroundColor: "rgba(37, 122, 251, 0.1)", height: "76px", width: "170.43px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.5)", padding: "12px", boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(37, 122, 251, 1)", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Total time used</h2>
                        <DurationSvg style={{ height: "18px", width: "22.29px" }} />
                    </div>
                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(37, 122, 251, 1)", textAlign: "start", marginTop: "5px" }}>{workPhaseTime.totalSpentHours} hours {workPhaseTime.totalSpentMinutes} mins</h3>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", height: "76px", width: "177.29px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.5)", padding: "12px", boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(37, 122, 251, 1)", alignItems: "center" }}>
                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Time remaining</h2>
                        <JusticeSvg style={{ height: "18px", width: "22.29px" }} />
                    </div>
                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(37, 122, 251, 1)", textAlign: "start", marginTop: "5px" }}>{workPhaseTime.remainingHours} hours {workPhaseTime.remainingMinutes} mins</h3>
                </div>
            </div>


            <div style={{ height: "378px", border: "1px solid rgba(28, 29, 34, 0.1)" }}>
                <div style={{ backgroundColor: "rgba(239, 246, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "82px", display: "flex", padding: "12px", gap: "16px" }}>
                    {projectData[0]?.workPhases.map((workPhase, index) => (
                        <div key={index} onClick={() => handleWorkPhaseClick(workPhase, index)} style={{ width: "150x", height: "46px", top: "16px", marginLeft: "32px", borderRadius: "8px", padding: "12px 16px", gap: "10px", backgroundColor: selectedWorkphaseIndex === index ? "rgba(37, 122, 251, 1)" : "rgba(255, 255, 255, 1)", cursor: "pointer", border: "1px solid rgba(37, 122, 251, 1)", color: selectedWorkphaseIndex === index ? "rgba(255, 255, 255, 1)" : "rgba(37, 122, 251, 1)" }}>
                            <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", }}>{`Work Phase ${index + 1}`}</h3>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", }}>
                    <div style={{ width: "70%" }}>
                        <div style={{ height: "55px", backgroundColor: "rgba(28, 29, 34, 0.06)", border: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                            <h2 style={{ marginLeft: "32px", fontWeight: "600", fontSize: "18px", lineHeight: "26.31px", color: "rgba(51, 51, 51, 1)" }}>Goals under workphase - {selectedWorkphaseIndex + 1}</h2>


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
                                        const timeBank = calculateTimeBank(goal.tasks);
                                        const timeSpent = calculateTimeSpent(goal.tasks);
                                        const progressPercentage = (timeSpent / timeBank) * 100;

                                        return (
                                            <div key={goalIndex} style={{ height: "200px", width: "280px", borderRadius: "16px", border: "1.5px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)" }}>
                                                <div style={{ height: '36px', backgroundColor: "rgba(239, 246, 255, 1)", display: "flex", alignContent: "center", alignItems: "center", color: "rgba(37, 122, 251, 1)" }}>
                                                    <GoalSvg style={{ marginLeft: "16px" }} />
                                                    <h2 style={{ marginLeft: "16px", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Goal - {goalIndex + 1}</h2>
                                                </div>

                                                <div style={{ width: "248px", height: "44px", marginTop: "16px", marginLeft: "16px" }}>
                                                    <p style={{ fontWeight: "600", fontSize: "16px", lineHeight: "21.79px", color: "rgba(93, 93, 93, 1)" }}>{goal.goalName}</p>
                                                </div>

                                                <div style={{ width: "278px", height: "27px", padding: "4px 8px", gap: "10px", top: "124px", backgroundColor: "rgba(242, 242, 242, 0.9)", marginTop: "10px" }}>
                                                    <div style={{ display: "flex", color: "rgba(141, 141, 141, 1)", alignItems: "center" }}>
                                                        <TimerSvg style={{ height: "16px", width: "13.77px", marginRight: "5px" }} />
                                                        <p style={{ fontWeight: "600", fontSize: "14px", lineHeight: "19.07px" }}>Time Bank - {`${timeBank}hrs`}</p>
                                                    </div>
                                                </div>

                                                <div style={{ width: "248px", height: "35px", marginLeft: "16px", borderRadius: "2px", top: "163px", gap: "5px" }}>
                                                    <h3 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(37, 122, 251, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                                        Time Spent: <span style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(37, 122, 251, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                                            {`${timeSpent}hr out of ${timeBank}hrs`}
                                                        </span>
                                                    </h3>

                                                    <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                                        <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: '#257AEB', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
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
                            <h2 style={{ marginLeft: "32px", fontWeight: "600", fontSize: "18px", lineHeight: "26.31px", color: "rgba(51, 51, 51, 1)" }}>work phase {selectedWorkphaseIndex + 1} time - bank usage</h2>
                        </div>

                        {filteredProjectData.length > 0 && (
                            <div style={{ height: "241px", padding: "24px", gap: "40px", backgroundColor: "rgba(37, 122, 251, 0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

                                <div style={{ width: "139px", height: "74px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.4)", padding: "12px 16px", color: "rgba(37, 122, 251, 1)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Time bank</h2>
                                        <TimerSvg style={{ height: "18px", width: "22.29px" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "15px", lineHeight: "21.79px", color: "rgba(37, 122, 251, 1)", textAlign: "start", marginTop: "5px" }}>{totalTime.totalHours}hrs {totalTime.totalMinutes}mins</h3>
                                </div>

                                <div style={{ display: "flex", gap: "12px" }}>

                                    <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "74px", width: "148px", borderRadius: "8px", padding: "12px 16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(37, 122, 251, 1)", alignItems: "center" }}>
                                            <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Time used</h2>
                                            <DurationSvg style={{ height: "18px", width: "22.29px" }} />
                                        </div>
                                        <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(37, 122, 251, 1)", textAlign: "start", marginTop: "5px" }}>{totalCompletedTime.totalHours}hrs {totalCompletedTime.totalMinutes}mins</h3>
                                    </div>

                                    <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", border: "1px solid rgba(28, 29, 34, 0.1)", height: "74px", width: "186px", borderRadius: "8px", padding: "12px 16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(37, 122, 251, 1)", alignItems: "center" }}>
                                            <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: 'center', color: "rgba(51, 51, 51, 1)" }}>Time remaining</h2>
                                            <JusticeSvg style={{ height: "18px", width: "22.29px" }} />
                                        </div>
                                        <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(37, 122, 251, 1)", textAlign: "start", marginTop: "5px" }}>{timeRemaining.totalHours}hrs {timeRemaining.totalMinutes}mins</h3>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>)
}
