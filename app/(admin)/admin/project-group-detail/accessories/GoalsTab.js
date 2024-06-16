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
import { getProjectGroupData } from "../helper.js";

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


export function GoalsTab({ projectId}) {
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGoalDetails, setShowGoalDetails] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectedGoalName, setSelectedGoalName] = useState(null);
    const [selectedWorkPhase, setSelectedWorkPhase] = useState(null);
    const [selectedWorkphaseIndex, setSelectedWorkphaseIndex] = useState(null);
    console.log("selected phase:", selectedWorkphaseIndex)

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

    const filteredProjectData = selectedWorkPhase
        ? projectData.map(project => ({
            ...project,
            workPhases: project.workPhases.filter(phase => phase.workPhaseName === selectedWorkPhase.workPhaseName)
        }))
        : projectData;

    return (
        <Box style={{maxHeight: "100vh", overflowY: "auto"}}>
            {showGoalDetails ?
                <GoalDetails projectId={projectId} goal={selectedGoal} setShowGoalDetails={setShowGoalDetails} selectedWorkphaseIndex={selectedWorkphaseIndex} selectedGoalName={selectedGoalName}/>
                :
                <div style={{maxHeight: '82vh', overflowY: 'auto'}}>
                    <div style={{ height: "70px", backgroundColor: "rgba(239, 246, 255, 1)", display: "flex", justifyContent: "start", alignItems: "center" }}>
                        {projectData[0]?.workPhases.map((workPhase, index) => (
                            <div key={index} onClick={() => handleWorkPhaseClick(workPhase, index)} style={{ width: "150x", height: "46px", top: "16px", marginLeft: "32px", borderRadius: "8px", padding: "12px 16px", gap: "10px",  backgroundColor: selectedWorkphaseIndex === index ? "rgba(37, 122, 251, 1)" : "rgba(255, 255, 255, 1)", cursor: "pointer", border: "1px solid rgba(37, 122, 251, 1)", color: selectedWorkphaseIndex === index ? "rgba(255, 255, 255, 1)" : "rgba(37, 122, 251, 1)"}}>
                                <h3 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", }}>{`Work Phase ${index + 1}`}</h3>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: "128px", top: "172px", left: "240px", border: "2px solid #F6F6F6", padding: "24px 32px", gap: "24px", alignContent: "center", justifyContent: "flex-end", alignItems: "center", display: "flex" }}>

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
                        <Todo projectId={projectId} projectData={filteredProjectData} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal} selectedWorkphaseIndex={selectedWorkphaseIndex} setSelectedGoalName={setSelectedGoalName} setProjectData={setProjectData}/>
                        <InProgress  projectData={filteredProjectData} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal} setSelectedGoalName={setSelectedGoalName}/>
                        <Review projectData={filteredProjectData} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal} setSelectedGoalName={setSelectedGoalName}/>
                        <Completed projectData={filteredProjectData} setShowGoalDetails={setShowGoalDetails} setSelectedGoal={setSelectedGoal} setSelectedGoalName={setSelectedGoalName}/> 
                    </Box>
                </div>
            }
        </Box>
    )
}
