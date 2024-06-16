'use client'
import { Box, Modal, Typography, Slide, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useEffect, useState } from "react";
import { ModalTask } from "../CreateGoal/ModalTask";
import { WorkphaseSteps } from "./WorkPhaseSteps";
import Prompt from "@/Components/Prompt";
import { style } from "../CheckboxList/style";

export default function AddTasks({ open, handleCancel, handleAddWorkPhase, handleDeleteWorkPhase, handleWorkPhaseNameChange, handleNext, handlePrev, workPhasesData, handleWorkPhaseGoalName, handleTaskChange, addNewTask, handleTaskFieldChange, handleSaveTask, deleteTask, calculateMaxHours }) {
    const [isInputVisible, setInputVisible] = useState(workPhasesData.map(() => false));
    const [goalInputVisible, setGoalInputVisible] = useState(workPhasesData.map(() => false));
    const [taskInputVisible, setTaskInputVisible] = useState(workPhasesData.map(() => false));
    const [workPhaseNames, setWorkPhaseNames] = useState(workPhasesData.map(phase => phase.workPhaseName));
    const [goalNames, setGoalNames] = useState(workPhasesData.map(phase => phase.goalName));
    const [preview, setPreview] = useState(workPhasesData.map(() => false))
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [workPhaseSteps, setWorkPhasesteps] = useState(false);
    const [openPrompt, setOpenPrompt] = useState(false);
    const [deletePhaseName, setDeletePhaseName] = useState(null)
    

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

    const toggleTaskVisibility = (index) => {
        setTaskInputVisible((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState
        })
    }

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

    const handleSave = (workPhase, index) => {
        const tasks = workPhase.tasks;
        const lastTask = tasks[tasks.length - 1];

        const allFieldsFilled = lastTask.taskName.trim() !== "" &&
            lastTask.taskBudget.trim() !== "" &&
            lastTask.startDate.trim() !== "" &&
            lastTask.endDate.trim() !== "" &&
            lastTask.hours.trim() !== "";
            // lastTask.minutes.trim() !== "";

        if (allFieldsFilled) {
            console.log("handle save clicked")
            setTaskInputVisible(prevVisible => {
                const newVisible = [...prevVisible];
                newVisible[index] = false;
                return newVisible;
            });
            setPreview(prevPreview => {
                const newPreview = [...prevPreview];
                newPreview[index] = true;
                return newPreview;
            });

        } else {
            alert("Please fill all the fields before adding a new task.");
        }
    };

    const addNewTaskInPhase = (index) => {
        addNewTask(index);
        setTaskInputVisible(prevVisible => {
            const newVisible = [...prevVisible];
            newVisible[index] = true;
            return newVisible;
        });
    }

    const validateData = () => {
        return workPhasesData.every(phase => {
            // Validate work phase name and goal name
            const isPhaseValid = phase.workPhaseName.trim() !== "" && phase.goalName.trim() !== "";
    
            // Validate each task within the phase
            const areTasksValid = phase.tasks.every(task => 
                task.taskName.trim() !== "" &&
                task.startDate.trim() !== "" &&
                task.endDate.trim() !== "" &&
                task.hours.trim() !== ""
            );
    
            // Return true only if both phase and its tasks are valid
            return isPhaseValid && areTasksValid;
        });
    };

    const handleNextClick = () => {
        if (validateData()) {
            handleNext();
        } else {
            alert('Fill the names of all work phases, goals and ensure all task datas are filled');
            console.log('invalid');
        }
    };
    
    const openModal = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const openWorkPhaseSteps = () => {
        setWorkPhasesteps(true)
    }

    const closeWorkPhasesteps = () => {
        setWorkPhasesteps(false)
    }

    const validateTask = (workPhase) => {
        console.log("validate phase:", workPhase);
        const tasks = workPhase.tasks;
        const lastTask = tasks[tasks.length - 1];

        const allFieldsFilled = lastTask.taskName.trim() !== "" &&
            lastTask.taskBudget.trim() !== "" &&
            lastTask.startDate.trim() !== "" &&
            lastTask.endDate.trim() !== "" &&
            lastTask.hours.trim() !== "" &&
            lastTask.minutes.trim() !== "";

        if (allFieldsFilled) {
            // Find the index of workPhase within workPhases array
            const index = workPhasesData.findIndex(phase => phase === workPhase);
            // Call addNewTask with the extracted index
            addNewTask(index);
            setPreview(prevPreview => {
                const newPreview = [...prevPreview];
                newPreview[index] = true;
                return newPreview;
            });
        } else {
            alert("Please fill all the fields before adding a new task.");
        }
    };

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
                    <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                        {workPhasesData.map((workPhase, index) => (
                            <div key={index} style={{marginBottom: "20px"}}>
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
                                                    value={workPhaseNames[index]}
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
                                                        const newValue = event.target.value;
                                                        setGoalNames(prevNames => {
                                                            const newNames = [...prevNames];
                                                            newNames[index] = newValue;
                                                            return newNames;
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

                                {/* Task under Goal */}
                                {/* <div style={{ height: "454px", border: "0px 2px 0px 0px", marginTop: "10px" }}> */}
                                {/* Heading */}
                                <div style={{ height: "55px", border: "0px 0px 1px 0px", backgroundColor: "rgba(0, 128, 0, 0.1)", alignItems: "center", marginTop: "0px", display: "flex", justifyContent: "space-between" }}>
                                    <h3 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)", fontWeight: "700", fontSize: "16px", lineHeight: "21.79px" }}>Task Under Goal</h3>
                                    {/* {!preview[index] && (
                                        <> */}
                                            {taskInputVisible[index] ?
                                                <ArrowDropUpIcon
                                                    onClick={() => toggleTaskVisibility(index)}
                                                    style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }}
                                                    sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }}
                                                /> :
                                                <ArrowDropDownIcon
                                                    onClick={() => toggleTaskVisibility(index)}
                                                    style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }}
                                                    sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }}
                                                />
                                            }
                                        {/* </>
                                    )} */}

                                </div>
                                {/* preview */}
                                {/* {workPhasesData.map((workPhase, index) => ( */}
                                {preview[index] && (
                                    <div key={index}>
                                        <div style={{ height: "182px", width: "auto", border: "0px 2px 0px 0px", gap: "35px", display: "flex", overflowX: "auto", maxWidth: '150vh' }}>
                                            {workPhase.tasks.filter(task =>
                                                task.taskName.trim() !== "" &&
                                                task.startDate.trim() !== "" &&
                                                task.endDate.trim() !== "" &&
                                                task.hours.trim() !== ""
                                            ).map((task, taskIndex) => {
                                                const startDate = new Date(task.startDate);
                                                const endDate = new Date(task.endDate);
                                                const startMonth = startDate.toLocaleString('default', { month: 'short' });
                                                const endMonth = endDate.toLocaleString('default', { month: 'short' });
                                                const startDay = startDate.getDate();
                                                const endDay = endDate.getDate();

                                                return (
                                                    <div key={taskIndex} style={{ height: "118px", minWidth: "250px", borderRadius: "8px", padding: "0 0px 0 0", border: "1px solid black", marginLeft: "40px", marginBottom: "4px", marginTop: "30px" }}>
                                                        <div style={{ height: "40px", borderRadius: "8px 8px 0 0", backgroundColor: "rgba(37, 122, 251, 0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <h3 style={{ marginLeft: "16px", color: "rgba(51, 51, 51, 1)" }}>{`Task ${taskIndex + 1}`}</h3>
                                                            <p style={{ color: "rgba(191, 6, 6, 1)", cursor: 'pointer', marginRight: "3px" }}
                                                                onClick={() => openModal(task)}>see more...</p>
                                                        </div>
                                                        {isModalOpen && <ModalTask task={selectedTask} open={isModalOpen} onClose={closeModal} onSave={handleSaveTask} phaseIndex={index}/>}
                                                        <div className="flex justify-between items-center">
                                                            <div className="bg-gray-100 rounded-md items-center justify-center mt-2 ml-2" style={{ width: "150px", height: "55px" }}>
                                                                <h4 className="text-sm font-bold text-center" style={{ color: "rgba(51, 51, 51, 1)" }}>Date</h4>
                                                                <p className="ml-2 text-lg" style={{ color: "rgba(51, 51, 51, 1)" }}>{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</p>
                                                            </div>
                                                            <div className="bg-gray-100 rounded-md items-center justify-center mt-2 mr-2" style={{ width: "70px", height: "55px" }}>
                                                                <h4 className="text-sm text-center font-bold" style={{ color: "rgba(51, 51, 51, 1)" }}>Duration</h4>
                                                                <p className="ml-2 text-lg" style={{ color: "rgba(51, 51, 51, 1)" }}>{`${task.hours}hrs`}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {!taskInputVisible[index] && (
                                            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', marginRight: "280px" }}>
                                                <div style={{ height: "54px", width: "181px", alignItems: "center", display: "flex", alignContent: "center", justifyContent: "center", border: "1px solid rgba(191, 6, 6, 1)", color: "rgba(191, 6, 6, 1)", fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", borderRadius: "8px", cursor: "pointer" }} onClick={() => addNewTaskInPhase(index)}>
                                                    <p> + Add new task</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* // ))} */}


                                {/* Task input fields */}

                                {taskInputVisible[index] && (
                                    <div>
                                        {workPhase.tasks.slice(-1).map((task, taskIndex) => {
                                            const lastTaskIndex = workPhase.tasks.length - 1;
                                            const maxHours = calculateMaxHours(task.startDate, task.endDate);
                                    
                                            return (

                                                <div key={taskIndex}>
                                                    <div style={{ height: "54px", width: "100%", backgroundColor: "rgba(37, 122, 251, 0.07)", padding: "15px 32px", gap: "10px", alignContent: "center", display: "flex", alignItems: "center" }}>
                                                        <h2 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "23.39px", color: "rgba(51, 51, 51, 1)", marginLeft: "20px" }}>Task - {lastTaskIndex + 1}</h2>
                                                        {workPhase.tasks.length > 1 && (
                                                            <CloseIcon
                                                                onClick={() => deleteTask(index, lastTaskIndex)}
                                                                sx={{ cursor: 'pointer', color: 'rgba(191, 6, 6, 1)', fontSize: 20, mr: 4, borderRadius: '26.6667px', bgcolor: 'rgba(191, 6, 6, 0.1)', ml: 2 }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div style={{ height: "201px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        {/* Task Name section */}
                                                        <div className="flex-1 mr-2" style={{ width: "40%", height: "143px", gap: "5px", left: "20px" }}>
                                                            <h4 style={{ marginLeft: "40px", marginBottom: "10px", marginTop: "15px", color: "rgba(51, 51, 51, 1)" }}>
                                                                Task Name
                                                            </h4>
                                                            {/* Task name input field */}
                                                            <input
                                                                type="text"
                                                                value={task.taskName}
                                                                placeholder="Task Name"
                                                                onChange={(event) => handleTaskFieldChange(event, index, lastTaskIndex, 'taskName')}
                                                                className="rounded-lg ml-2"
                                                                style={{ height: '90px', width: '500px', top: "38px", borderRadius: "8px", border: "2px solid #CCCCCC", outline: "none", marginLeft: "40px", padding: "10px" }}
                                                            />
                                                        </div >
                                                        {/* Budget section */}
                                                        <div style={{ width: "40%", height: "153px", top: "24px", marginLeft: "40px" }}>
                                                            <h4 className="mb-8 mt-6" style={{ marginBottom: "20px", marginTop: "15px", color: "rgba(51, 51, 51, 1)" }}>
                                                                Task Budget<span style={{ color: "rgba(191, 6, 6, 1)" }}> (Optional)</span>
                                                            </h4>
                                                            {/* Task budget input field */}
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                placeholder="Eg #200,000"
                                                                value={task.taskBudget}
                                                                onChange={(event) => handleTaskFieldChange(event, index, lastTaskIndex, 'taskBudget')}
                                                                className="rounded-lg ml-2"
                                                                style={{ height: '58px', width: '210px', borderRadius: "8px", border: "2px solid #CCCCCC", outline: "none", padding: "10px" }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Task schedule and duration */}
                                                    <div style={{ height: "201px", display: "flex", flexDirection: "row", alignContent: "center" }}>
                                                        {/* Task schedule */}
                                                        <div className="flex-1 mr-1" style={{ height: "178px", border: "0px 1px 0px 0px" }}>
                                                            {/* Task schedule heading */}
                                                            <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                                                                <h4 style={{ color: "rgba(51, 51, 51, 1)", marginTop: "15px", marginBottom: "20px", marginLeft: "40px" }}>
                                                                    TASK SCHEDULE
                                                                </h4>
                                                            </div>
                                                            {/* Start Date and End Date input fields */}
                                                            <div style={{ display: "flex", flexDirection: 'row', marginTop: '18px' }}>
                                                                {/* Start Date */}
                                                                <div className="flex-1" style={{ marginLeft: "20px" }}>
                                                                    <h4 style={{ color: "rgba(51, 51, 51, 1)", marginBottom: "10px", marginLeft: "10px" }} >
                                                                        Start Date
                                                                    </h4>
                                                                    {/* Input field for Start Date */}
                                                                    <TextField
                                                                        variant="outlined"
                                                                        type="date"
                                                                        size="small"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        sx={{ width: 220 }}
                                                                        value={task.startDate}
                                                                        name="startDate"
                                                                        onChange={(event) => handleTaskFieldChange(event, index, lastTaskIndex, 'startDate')}
                                                                        inputProps={{ min: new Date().toISOString().split('T')[0] }} // Set min attribute to today's date
                                                                    />
                                                                </div>
                                                                {/* End Date */}
                                                                <div className="ml-4 mr-2 flex-1">
                                                                    <h4 style={{ color: "#8D8D8D", marginBottom: "10px" }}>
                                                                        End Date
                                                                    </h4>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        type="date"
                                                                        size="small"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        sx={{ width: 220 }}
                                                                        value={task.endDate}
                                                                        name="endDate"
                                                                        onChange={(event) => handleTaskFieldChange(event, index, lastTaskIndex, 'endDate')}
                                                                        inputProps={{ min: task.startDate }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Task duration */}
                                                        <div className="flex-1 mr-2" style={{ height: "178px", border: "0px 1px 0px 0px" }}>
                                                            {/* Task duration heading */}
                                                            <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                                                                <h4 style={{ color: "rgba(51, 51, 51, 1)", marginTop: "15px", marginBottom: "20px", marginLeft: "40px" }}>
                                                                    SET THE TASK DURATION
                                                                </h4>
                                                            </div>
                                                            {/* Task duration input fields */}
                                                            <div className="flex flex-row mt-4">
                                                                {/* Hours */}
                                                                <div className="flex-1" style={{ marginLeft: "20px" }}>
                                                                    <h4 style={{ color: "rgba(141, 141, 141, 1)", marginBottom: "10px", marginLeft: "10px" }}>
                                                                        Hours <span style={{ color: "rgba(0, 128, 0, 1)" }}>(max: {maxHours}hrs)</span>
                                                                    </h4>
                                                                    {/* Input field for hours */}
                                                                    <input
                                                                        type="text"
                                                                        placeholder="hours"
                                                                        value={task.hours}
                                                                        onChange={(event) => handleTaskFieldChange(event, index, lastTaskIndex, 'hours')}
                                                                        name="hours"
                                                                        className="p-3 rounded-lg ml-2"
                                                                        style={{ height: '56px', width: '200px', top: "34px", outline: "none", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                                                    />
                                                                </div>
                                                                {/* Minutes */}
                                                                <div className="flex-1" style={{ marginTop: "35px", marginLeft: "5px", marginRight: "80px" }}>
                                                                    {/* Select field for minutes */}
                                                                    <select
                                                                        name="minutes"
                                                                        className="rounded-lg ml-2"
                                                                        style={{ height: '56px', width: '170px', outline: "none", top: "34px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                                                        value={task.minutes} // Set the default value to "0" if task.minutes is falsy
                                                                        onChange={(event) => handleTaskFieldChange(event, index, lastTaskIndex, 'minutes')}
                                                                        disabled={parseInt(task.hours, 10) >= maxHours}
                                                                    >
                                                                        <option value="0">0 minutes</option>
                                                                        <option value="15">15 minutes</option>
                                                                        <option value="30">30 minutes</option>
                                                                        <option value="45">45 minutes</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Buttons */}
                                                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "280px", marginBottom: "20px" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", marginRight: "40px", width: "436px", alignItems: "center" }}>

                                                            <div style={{ height: "54px", width: "128px", alignItems: "center", display: "flex", alignContent: "center", justifyContent: "center", border: "1px solid rgba(191, 6, 6, 1)", color: "rgba(191, 6, 6, 1)", fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", borderRadius: "8px", cursor: "pointer" }} onClick={() => handleSave(workPhase, index)}>
                                                                <p>save</p>
                                                            </div>

                                                            <div style={{ height: "54px", width: "196px", alignItems: "center", display: "flex", alignContent: "center", justifyContent: "center", border: "1px solid rgba(191, 6, 6, 1)", color: "rgba(191, 6, 6, 1)", fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 0.1)", padding: "16px", cursor: "pointer" }} onClick={() => validateTask(workPhase)}>
                                                                <p>save & add new task</p>
                                                            </div>



                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        })}

                                    </div>
                                )}
                                {/* </div> */}

                                {/* </div> */}
                            </div>
                        ))}
                    </div>
                    <Prompt
                    open={openPrompt}
                    message={`You are about to delete this  work phase, which will include the goals and tasks in the work phase`}
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

