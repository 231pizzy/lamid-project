'use client'
import { Box, Modal, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useEffect, useState } from "react";
import { WorkphaseSteps } from "./WorkPhaseSteps";
import Prompt from "@/Components/Prompt";

export default function StepFour({ open, handleCancel, handleAddWorkPhase, handleDeleteWorkPhase, handleWorkPhaseNameChange, handleNext, handlePrev, workPhasesData, handleWorkPhaseGoalName }) {
    const [isInputVisible, setInputVisible] = useState(workPhasesData.map(() => false));
    const [goalInputVisible, setGoalInputVisible] = useState(workPhasesData.map(() => false));
    const [workPhaseNames, setWorkPhaseNames] = useState(workPhasesData.map(phase => phase.workPhaseName));
    const [goalNames, setGoalNames] = useState(workPhasesData.map(phase => phase.goalName));
    const [workPhaseSteps, setWorkPhasesteps] = useState(false);
    const [openPrompt, setOpenPrompt] = useState(false);
    const [deletePhaseName, setDeletePhaseName] = useState(null)
    console.log("names:", workPhasesData)

    const toggleInputVisibility = (index) => {
        setInputVisible((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const toggleGoalVisibility = (index) => {
        setGoalInputVisible((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleDeleteAndRefresh = () => {
        // Call handleDeleteWorkPhase
        handleDeleteWorkPhase(deletePhaseName);
        // Find the index of the deleted work phase
        const deletedIndex = workPhaseNames.findIndex(name => name === deletePhaseName);
        // Update both workPhaseNames and isInputVisible to remove the deleted work phase
        setWorkPhaseNames(prevNames => {
            const newNames = [...prevNames];
            newNames.splice(deletedIndex, 1);
            return newNames;
        });
        setGoalNames(prevNames => {
            const newNames = [...prevNames];
            newNames.splice(deletedIndex, 1);
            return newNames;
        });
        setInputVisible(prevState => {
            const newState = [...prevState];
            newState.splice(deletedIndex, 1);
            return newState;
        });
        setOpenPrompt(false)
    };

const validateNames = () => {
    // Check if any work phase name or goal name is empty
    return workPhasesData.every(phase => phase.workPhaseName.trim() !== "" && phase.goalName.trim() !== "");
};

    const handleNextClick = () => {
        if (validateNames()) {
            handleNext();
        } else {
            alert('Fill the names of all work phases and goals');
            console.log('invalid');
        }
    };

    const openWorkPhaseSteps = () => {
        setWorkPhasesteps(true)
    }

    const closeWorkPhasesteps = () => {
        setWorkPhasesteps(false)
    }

    const confirmDeleteWorkPhase = (phaseName) => {
        setOpenPrompt(true)
        setDeletePhaseName(phaseName)
    }
    const closePrompt = () => {
        setOpenPrompt(false)
    }

    return (
        <Modal open={open}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box sx={{ height: '100%', mt: 8, bgcolor: 'white', overflowY: 'hidden', pb: 4, position: 'absolute', top: '0%', right: '0%', width: "100%", left: 200 }}>
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
                    <div style={{ height: "92px", backgroundColor: "rgba(191, 6, 6, 0.08)", alignItems: "center", display: "flex", justifyContent: "space-between", }}>
                        <div style={{ display: "flex", marginLeft: "40px", alignItems: "center" }}>
                            <div>
                                <LeftArrowIcon onClick={handlePrev} sx={{ color: 'black', fontSize: 24, mr: 4, borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} />
                            </div>
                            <div>
                                <h2 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", marginBottom: "10px" }}>STEP-3  (Work Phase) <span style={{width: "20px", height: "20px", border: "2px solid rgba(191, 6, 6, 1)", borderRadius: "50px", display: "inline-block", verticalAlign: "middle", textAlign: "center", fontSize: "12px", lineHeight: "20px", cursor: "pointer", fontWeight: "700", marginLeft:"5px"}} onClick={() => openWorkPhaseSteps()}>i</span></h2>
                                <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px" }}>Creating a work phase for the project group.</p>
                            </div>
                            {workPhaseSteps && <WorkphaseSteps open={openWorkPhaseSteps} onClose={closeWorkPhasesteps} />}
                        </div>
                        <div>
                            <button style={{ height: "54px", width: "103px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 1)", padding: "16px 32px", gap: "10px", color: "rgba(255, 255, 255, 1)", marginRight: '220px' }} onClick={handleNextClick}>Next</button>

                        </div>
                    </div>

                    {/* Add workPhase */}
                    <div style={{maxHeight: "720px", overflowY: "auto"}}>
                    {workPhasesData.map((workPhase, index) => (
                        <div key={index}>
                            <div style={{ backgroundColor: "rgba(37, 122, 251, 0.1)", height: "64px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ fontWeight: "700", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)", marginLeft: "40px", marginRight: "20px" }}>
                                        Work - Phase ({index + 1})
                                    </h2>
                                    {index > 0 && (
                                        <CloseIcon
                                        onClick={() => confirmDeleteWorkPhase(workPhase.workPhaseName)}
                                            sx={{ cursor: 'pointer', color: 'rgba(191, 6, 6, 1)', fontSize: 24, mr: 4, borderRadius: '26.6667px', bgcolor: 'rgba(191, 6, 6, 0.1)' }}
                                        />
                                    )}
                                </div>
                                {isInputVisible[index] ?
                                    <ArrowDropUpIcon onClick={() => toggleInputVisibility(index)} style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }} sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} /> :
                                    <ArrowDropDownIcon onClick={() => toggleInputVisibility(index)} style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }} sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} />
                                }
                            </div>
                            {isInputVisible[index] && (
                                <div className="" style={{ height: '150px', gap: "10px" }}>
                                    <div>
                                        <div style={{ height: '143px', gap: "16px" }}>
                                            <p style={{ marginTop: "20px", marginBottom: "10px", marginLeft: "50px", color: "rgba(51, 51, 51, 1)", fontWeight: "500", lineHeight: "21.79px", fontSize: "16px" }}>Work Phase Name</p>
                                            <input
                                                type="text"
                                                value={workPhase.workPhaseName}
                                                onChange={(event) => {
                                                    const newValue = event.target.value;
                                                    setWorkPhaseNames(prevNames => {
                                                        const newNames = [...prevNames];
                                                        newNames[index] = newValue;
                                                        return newNames;
                                                    });
                                                    handleWorkPhaseNameChange(event, index);
                                                }}
                                                className="rounded-lg ml-2"
                                                style={{ height: '64px', width: '80%', borderRadius: "8px", border: "2px solid rgba(28, 29, 34, 0.1)", marginLeft: "50px", padding: "10px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div style={{ backgroundColor: "rgba(25, 211, 252, 0.1)", height: "64px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ fontWeight: "700", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)", marginLeft: "40px", marginRight: "20px" }}>
                                        Goal under work phase ({index + 1})
                                    </h2>
                                </div>
                                {goalInputVisible[index] ?
                                    <ArrowDropUpIcon onClick={() => toggleGoalVisibility(index)} style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }} sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} /> :
                                    <ArrowDropDownIcon onClick={() => toggleGoalVisibility(index)} style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }} sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} />
                                }
                            </div>
                            {goalInputVisible[index] && (
                                <div className="" style={{ height: '150px', gap: "10px", marginBottom: "30px", paddingBottom: '20px' }}>
                                    <div>
                                        <div style={{ height: '143px', gap: "16px" }}>
                                            <p style={{ marginTop: "20px", marginBottom: "10px", marginLeft: "50px", color: "rgba(51, 51, 51, 1)", fontWeight: "500", lineHeight: "21.79px", fontSize: "16px" }}>Goal Name</p>
                                            <input
                                                type="text"
                                                placeholder={workPhase.goalName}
                                                value={goalNames[index]}
                                                onChange={(event) => {
                                                    const newGoalValue = event.target.value;
                                                    setGoalNames(prevNames => {
                                                        const newGoalNames = [...prevNames];
                                                        newGoalNames[index] = newGoalValue;
                                                        return newGoalNames;
                                                    });
                                                    handleWorkPhaseGoalName(event, index);
                                                }}
                                                // onChange={(event) => handleWorkPhaseGoalName(event, index)}
                                                className="rounded-lg ml-2"
                                                style={{ height: '105px', width: '80%', borderRadius: "8px", border: "2px solid rgba(28, 29, 34, 0.1)", marginLeft: "50px", padding: "10px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    </div>
                    <Prompt
                    open={openPrompt}
                    message={`You Are About To delete This Work-Phase, Which will Include The Goal Under this Work-Phase`}
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
