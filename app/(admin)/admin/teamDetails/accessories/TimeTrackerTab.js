'use client'
import { LinearProgress } from "@mui/material";
import Loader from "@/Components/Loader";
import { DurationSvg, JusticeSvg, TimerSvg } from "@/public/icons/icons.js";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
export function TimeTrackerTab({ teamId }) {
    const [teamGoals, setTeamGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [leftClick, setLeftClick] = useState(false)
    const [timeSummary, setTimeSummary] = useState({ totalHours: 0, totalUsedHours: 0, totalRemainingHours: 0 });

    useEffect(() => {
        const fetchTeamGoals = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/teamGoal?teamId=${teamId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTeamGoals(data);
                    setSelectedGoalIndex(0);
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

    useEffect(() => {
        // Calculate total hours, total used hours, and total remaining hours
        let totalHoursSum = 0;
        let totalUsedHoursSum = 0;

        teamGoals.forEach((goal) => {
            goal.tasks.forEach((task) => {
                const taskTotalHours = parseInt(task.hours) + (task.minutes ? parseInt(task.minutes) / 60 : 0);
                totalHoursSum += taskTotalHours;

                if (task.taskStatus === "Completed") {
                    totalUsedHoursSum += taskTotalHours;
                }
            });
        });

        const totalRemainingHoursSum = totalHoursSum - totalUsedHoursSum;

        setTimeSummary({
            totalHours: totalHoursSum.toFixed(2),
            totalUsedHours: totalUsedHoursSum.toFixed(2),
            totalRemainingHours: totalRemainingHoursSum.toFixed(2)
        });
    }, [teamGoals]);

    // Function to handle next page click
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    // Function to handle previous page click
    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    if (loading) {
        return <div>
            <Loader />
        </div>;
    }

    if (teamGoals.length === 0) {
        return <div style={{ textAlign: "center", fontWeight: "700" }}>
            <div style={{ display: "inline-block", alignItems: "center", marginTop: "20px" }}>
                <p>NO GOAL CREATED FOR THIS TEAM YET.</p>
            </div>
        </div>
    }

    return (
        <div style={{ width: "1680px", height: "464px", top: "162px", left: "240px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", padding: "32px", gap: "40px", display: "flex" }}>
            <div style={{ width: "645px", height: "400px", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)" }}>
                <div style={{ width: "645px", height: "59px", borderRadius: "16px 16px 0px 0px", backgroundColor: "rgba(239, 246, 255, 1)", alignContent: "center" }}>
                    <h1 style={{ color: "rgba(51, 51, 51, 1)", fontSize: "18px", fontWeight: "700", lineHeight: "24.5px", marginLeft: "24px" }}>TIME TRACKER USAGE SUMMARY</h1>
                </div>

                <div style={{ maxWidth: "645px", height: "338px", top: "59px", display: "flex", overflowX: "auto" }}>
                    {/* Goal time bank */}
                    <div style={{ width: "225px", height: "338px", borderRight: "1px solid rgba(28, 29, 34, 0.1)" }}>
                        <div style={{ width: "225px", height: "36px", padding: "8px 28px 8px 16px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center" }}>
                            <h2 style={{ font: "open sans", fontWeight: "600", fontSize: "14px", lineHeight: "20.4px", color: "rgba(51, 51, 51, 1)" }}>GOAL TIME BANK</h2>
                        </div>

                        <div style={{ width: "225.29px", height: "308px", top: "36px", padding: "24px", gap: "16px", display: "flex", flexDirection: "column", }}>
                            <div style={{ width: "131.5px", height: "76px", borderRadius: "8px", padding: "12px", gap: "16px", background: "linear-gradient(90deg, #257AFB 0%, #234374 81.8%)" }}>
                                <div style={{ width: "107.49px", height: "52px", gap: "8px" }}>
                                    <div style={{ color: "rgba(255, 255, 255, 1)", display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", marginRight: "12px" }}>Time bank</h2>
                                        <TimerSvg style={{ height: "18px", width: "15.49px" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", fontFamily: "open sans", color: "rgba(255, 255, 255, 1)" }}>{timeSummary.totalHours}hours</h3>
                                </div>
                            </div>

                            <div style={{ width: "170.43px", height: "76px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.5)", padding: "12px", gap: "16px", backgroundColor: "rgba(37, 122, 251, 0.1)" }}>
                                <div style={{ width: "146.43px", height: "52px", gap: "8px" }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", marginRight: "12px", color: "rgba(51, 51, 51, 1)" }}>Total time used</h2>
                                        <DurationSvg style={{ height: "18px", width: "15.49px", color: "rgba(37, 122, 251, 1)" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", fontFamily: "open sans", color: "rgba(37, 122, 251, 1)" }}>{timeSummary.totalUsedHours} hours</h3>
                                </div>
                            </div>

                            <div style={{ width: "177.29px", height: "76px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.5)", padding: "12px", gap: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>

                                <div style={{ width: "146.43px", height: "52px", gap: "8px" }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                        <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", marginRight: "10px", color: "rgba(51, 51, 51, 1)" }}>Total remaining</h2>
                                        <JusticeSvg style={{ height: "18px", width: "22.29px", color: "rgba(37, 122, 251, 1)" }} />
                                    </div>
                                    <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", fontFamily: "open sans", color: "rgba(37, 122, 251, 1)" }}>{timeSummary.totalRemainingHours} hours</h3>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Goal 1 */}
                    {teamGoals.map((goal, index) => {
                        // Calculate total hours and minutes
                        const totalHours = goal.tasks.reduce((total, task) => total + parseInt(task.hours) + (task.minutes ? parseInt(task.minutes) / 60 : 0), 0).toFixed(2);

                        // Calculate total hours of completed tasks
                        const usedHours = goal.tasks.reduce((total, task) => {
                            if (task.taskStatus === "Completed") {
                                return total + parseInt(task.hours) + (task.minutes ? parseInt(task.minutes) / 60 : 0);
                            }
                            return total;
                        }, 0).toFixed(2);

                        // Calculate remaining hours
                        const remainingHours = (totalHours - usedHours).toFixed(2);


                        return (
                            <div key={index} style={{ width: "210px", height: "338px", borderRight: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                {/* heading */}
                                <div style={{ width: "210px", height: "36px", padding: "8px 28px 8px 16px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)", alignContent: "center" }}>
                                    <h2 style={{ font: "open sans", fontWeight: "600", fontSize: "14px", lineHeight: "20.4px", color: "rgba(51, 51, 51, 1)" }}>GOAL {index + 1}</h2>
                                </div>

                                {/* body */}
                                <div style={{ width: "225.29px", height: "308px", top: "36px", padding: "24px", gap: "16px", display: "flex", flexDirection: "column", }}>
                                    {/* Time bank */}
                                    <div style={{ width: "129px", height: "74px", borderRadius: "8px", padding: "12px 16px", gap: "16px", backgroundColor: "rgba(37, 122, 251, 0.1)", border: "1px solid rgba(37, 122, 251, 0.4)" }}>
                                        <div style={{ width: "107.49px", height: "52px", gap: "8px" }}>
                                            <div style={{ color: "rgba(255, 255, 255, 1)", display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                                <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", marginRight: "12px", color: "rgba(51, 51, 51, 1)" }}>Time bank</h2>
                                                <TimerSvg style={{ height: "18px", width: "15.49px", color: "rgba(37, 122, 251, 1)" }} />
                                            </div>
                                            <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", fontFamily: "open sans", color: "rgba(255, 255, 255, 1)", color: "rgba(37, 122, 251, 1)" }}>
                                                {totalHours} hours
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Total - used */}
                                    <div style={{ width: "134px", height: "74px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px 16px", gap: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                        <div style={{ width: "104px", height: "51px", gap: "12px" }}>
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                                <h2 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", marginRight: "6px", color: "rgba(51, 51, 51, 1)" }}>Total - used</h2>
                                                <DurationSvg style={{ height: "20px", width: "16.43px", color: "rgba(37, 122, 251, 1)" }} />
                                            </div>
                                            <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", fontFamily: "open sans", color: "rgba(37, 122, 251, 1)" }}>
                                                {usedHours} hours
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Total remaining */}
                                    <div style={{ width: "170px", height: "76px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.5)", padding: "12px", gap: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                        <div style={{ width: "138px", height: "50px", gap: "12px" }}>
                                            <div style={{ width: "138px", height: "19px", gap: "12px", display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                                <h2 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(51, 51, 51, 1)" }}>Total remaining</h2>
                                                <JusticeSvg style={{ height: "18px", width: "22.29px", color: "rgba(37, 122, 251, 1)" }} />
                                            </div>
                                            <h3 style={{ fontWeight: "700", fontSize: "14px", lineHeight: "19.07px", fontFamily: "open sans", color: "rgba(37, 122, 251, 1)" }}>
                                                {remainingHours} hours
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            <div style={{ width: "931px", height: "400px", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", gap: "4px" }}>
                <div style={{ width: "931px", height: "82px", borderRadius: "16px 16px 0px 0px", backgroundColor: "rgba(239, 246, 255, 1)", alignItems: "center", display: "flex" }}>
                    {teamGoals.map((goal, index) => (
                        <div key={index} style={{ width: "95px", height: "46px", top: "16px", marginLeft: "32px", borderRadius: "8px", padding: "12px 16px", gap: "10px", backgroundColor: selectedGoalIndex === index ? "rgba(37, 122, 251, 1)" : "rgba(255, 255, 255, 1)", cursor: "pointer", border: "1px solid rgba(37, 122, 251, 1)", color: selectedGoalIndex === index ? "rgba(255, 255, 255, 1)" : "rgba(37, 122, 251, 1)" }} onClick={() => setSelectedGoalIndex(index)}>
                            <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", }}>{`Goal - ${index + 1}`}</h3>
                        </div>
                    ))}
                </div>
                {/* <div style={{ width: "928px", height: "319px" }}> */}

                {/* Pagination */}
                {selectedGoalIndex !== null && (
                    <div style={{ width: "928px", height: "48px", padding: "8px 16px", gap: "416px", backgroundColor: "rgba(28, 29, 34, 0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <h3>TIME TRACKER UNDER GOAL- {selectedGoalIndex + 1} TASK</h3>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",  border: `1.5px solid rgba(141, 141, 141, 1)`, transition: 'border-color 0.3s ease',borderColor: leftClick ? 'rgba(191, 6, 6, 1)' : 'rgba(28, 29, 34, 0.1)'}} className={`bg-gray-100 cursor-pointer mr-4 ${currentPage === 0 ? 'pointer-events-none' : ''}`} onClick={prevPage} onMouseEnter={() => setLeftClick(true)} onMouseLeave={() => setLeftClick(false)}>
                                        <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: leftClick ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)"}} />
                                    </div>
                                    <p>{currentPage * 3 + 1} - {Math.min((currentPage + 1) * 3, teamGoals[selectedGoalIndex].tasks.length)} of {teamGoals[selectedGoalIndex].tasks.length}</p>
                                    <div style={{
                                        width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid rgba(141, 141, 141, 1)`,
                                        transition: 'border-color 0.3s ease',
                                        borderColor: isHovered ? 'rgba(191, 6, 6, 1)' : 'rgba(28, 29, 34, 0.1)'
                                    }} className={`bg-gray-100 cursor-pointer ml-4 ${currentPage === Math.ceil(teamGoals[selectedGoalIndex].tasks.length / 3) - 1 ? 'pointer-events-none' : ''}`} onClick={nextPage} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                        <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: isHovered ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)"}} />
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                )}
                {/* Body */}
                <div style={{ width: "928px", height: "271px", padding: "24px", gap: "20px", alignContent: "center", display: "flex", flexWrap: "wrap" }}>
                    {selectedGoalIndex !== null && teamGoals[selectedGoalIndex].tasks.slice(currentPage * 3, currentPage * 3 + 3).map((task, taskIndex) => {
                        let progressWidth;
                        switch (task.taskStatus) {
                            case "In progress":
                                progressWidth = '30%';
                                break;
                            case "In review":
                                progressWidth = '60%';
                                break;
                            case "Completed":
                                progressWidth = '100%';
                                break;
                            default:
                                progressWidth = '0%';
                        }
                        return (
                            <div key={taskIndex} style={{ width: "280px", height: "223px", borderRadius: "16px", border: "1.5px solid rgba(28, 29, 34, 0.1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                <div style={{ width: "248px", height: "44px", marginTop: "16px", marginLeft: "16px" }}>
                                    <p style={{ fontWeight: "600", fontSize: "16px", lineHeight: "21.79px", color: "rgba(93, 93, 93, 1)" }}>{task.taskName}</p>
                                </div>
                                {/* profile pictures */}
                                <div style={{ display: "flex", alignItems: "center", paddingLeft: "16px", marginBottom: "10px" }}>
                                    {task.taskMembers.slice(0, 8).map((member, index) => (
                                        <img key={index} src={member.profilePicture} alt={member.name} style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "8px", marginLeft: index > 0 ? '-10px' : '0', border: "2px solid rgba(37, 122, 251, 1)" }} />
                                    ))}
                                    {task.taskMembers.length > 8 && (
                                        <span style={{ marginLeft: '-10px' }}>+{task.taskMembers.length - 8}</span>
                                    )}
                                </div>

                                <div style={{ width: "278px", height: "27px", padding: "4px 8px", gap: "10px", top: "124px", backgroundColor: "rgba(242, 242, 242, 0.9)" }}>
                                    <div style={{ display: "flex", color: "rgba(141, 141, 141, 1)", alignItems: "center" }}>
                                        <TimerSvg style={{ height: "16px", width: "13.77px", marginRight: "5px" }} />
                                        <p style={{ fontWeight: "600", fontSize: "14px", lineHeight: "19.07px" }}>Time Bank - {task.hours}hrs {task.minutes !== "" ? task.minutes + "mins" : "0mins"}</p>
                                    </div>
                                </div>
                                <div style={{ width: "248px", height: "35px", marginLeft: "16px", borderRadius: "2px", top: "163px", gap: "5px" }}>
                                    <h3 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(37, 122, 251, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                        Time Spent: <span style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", color: "rgba(37, 122, 251, 1)", marginTop: "16px", marginBottom: "16px" }}>
                                            {task.taskStatus === "Completed" ? `${task.hours}hr out of ${task.hours}hrs` :
                                                task.taskStatus === "In progress" ? `${Math.round(task.hours * 0.3)}hr out of ${task.hours}hrs` :
                                                    task.taskStatus === "In review" ? `${Math.round(task.hours * 0.6)}hr out of ${task.hours}hrs` :
                                                        `0hr out of ${task.hours}hrs`
                                            }
                                        </span>
                                    </h3>

                                    {/* Progress Bar */}
                                    <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                        <div style={{ width: progressWidth, height: '100%', backgroundColor: '#257AEB', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
                {/* body ends */}
                {/* </div> */}

            </div>
        </div>
    )
}
