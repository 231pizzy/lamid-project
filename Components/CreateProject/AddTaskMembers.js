'use client'
import { Box, Modal, Typography, Slide, Checkbox } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import { ModalTask } from "../CreateGoal/ModalTask";
import { WorkphaseSteps } from "./WorkPhaseSteps";
import { MemberDetails } from "../CreateGoal/MemberDetails";
import Prompt from "@/Components/Prompt";

export default function AddTaskMembers({ open, handleCancel, handleAddMember, handleDeleteWorkPhase, handleWorkPhaseNameChange, handleNext, handlePrev, workPhasesData, handleWorkPhaseGoalName, handleTaskChange, addNewTask, handleTaskFieldChange, handleSaveTask, deleteTask }) {
    const [isInputVisible, setInputVisible] = useState(workPhasesData.map(() => false));
    const [goalInputVisible, setGoalInputVisible] = useState(workPhasesData.map(() => false));
    const [taskInputVisible, setTaskInputVisible] = useState(workPhasesData.map(() => false));
    const [workPhaseNames, setWorkPhaseNames] = useState(workPhasesData.map(phase => phase.workPhaseName));
    const [goalNames, setGoalNames] = useState(workPhasesData.map(phase => phase.goalName));
    const [preview, setPreview] = useState(workPhasesData.map(() => true))
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [workPhaseSteps, setWorkPhasesteps] = useState(false);
    const [activePhaseIndex, setActivePhaseIndex] = useState(null);
    const [activeTaskIndex, setActiveTaskIndex] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [openPrompt, setOpenPrompt] = useState(false);
    const [deletePhaseName, setDeletePhaseName] = useState(null)

    // Calculate total pages
    const totalPages = users ? Math.ceil(users.length / 12) : 0;

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    // Function to handle previous page click
    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Calculate range of displayed users
    const startIndex = currentPage * 12 + 1;
    const endIndex = Math.min((currentPage + 1) * 12, users?.length || 0);

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
        setPreview((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState
        })
    }

    const handleDeleteAndRefresh = (workPhaseName) => {
        // Call handleDeleteWorkPhase
        handleDeleteWorkPhase(workPhaseName);
        // Find the index of the deleted work phase
        const deletedIndex = workPhaseNames.findIndex(name => name === workPhaseName);
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
    };

    const handleSave = (workPhase, index) => {
        const tasks = workPhase.tasks;
        const lastTask = tasks[tasks.length - 1];

        const allFieldsFilled = lastTask.taskName.trim() !== "" &&
            lastTask.taskBudget.trim() !== "" &&
            lastTask.startDate.trim() !== "" &&
            lastTask.endDate.trim() !== "" &&
            lastTask.hours.trim() !== "" &&
            lastTask.minutes.trim() !== "";

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


    useEffect(() => {
        // Fetch all users from the API when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    // Store the received users data in state
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const validateData = () => {
        return workPhasesData.every(phase => {
            // Validate work phase name and goal name
            const isPhaseValid = phase.workPhaseName.trim() !== "" && phase.goalName.trim() !== "";

            // Validate each task within the phase
            const areTasksValid = phase.tasks.every(task =>
                task.taskName.trim() !== "" &&
                task.startDate.trim() !== "" &&
                task.endDate.trim() !== "" &&
                task.hours.trim() !== "" &&
                task.taskMembers && task.taskMembers.length > 0
            );

            // Return true only if both phase and its tasks are valid
            return isPhaseValid && areTasksValid;
        });
    };

    const handleNextClick = () => {
        if (validateData()) {
            handleNext();
        } else {
            alert('Assign members to all tasks');
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

    const handleTaskClick = (phaseIndex, taskIndex) => {
        console.log("phase index add:", phaseIndex);
        console.log("task index add:", taskIndex);

        setActivePhaseIndex(phaseIndex);
        setActiveTaskIndex(taskIndex);
    };

    const openMemberModal = (member) => {
        setSelectedMember(member);
        setMemberModalOpen(true);
    };

    const closeMemberModal = () => {
        setMemberModalOpen(false);
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
                                <h2 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", marginBottom: "10px" }}>STEP-3  (Work Phase) <span style={{ width: "20px", height: "20px", border: "2px solid rgba(191, 6, 6, 1)", borderRadius: "50px", display: "inline-block", verticalAlign: "middle", textAlign: "center", fontSize: "12px", lineHeight: "20px", cursor: "pointer", fontWeight: "700", marginLeft: "5px" }} onClick={() => openWorkPhaseSteps()}>i</span></h2>
                                <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px" }}>Creating a work phase for the project group.</p>
                            </div>
                            <div>

                                {workPhaseSteps && <WorkphaseSteps open={openWorkPhaseSteps} onClose={closeWorkPhasesteps} />}
                            </div>
                        </div>
                        <div>
                            <button style={{ height: "54px", width: "103px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 1)", padding: "16px 32px", gap: "10px", color: "rgba(255, 255, 255, 1)", marginRight: '220px' }} onClick={handleNextClick}>Next</button>

                        </div>
                    </div>

                    {/* Add workPhase */}
                    <div style={{ maxHeight: "630px", overflowY: "auto" }}>
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
                                        <ArrowDropDownIcon onClick={() => toggleInputVisibility(index)} style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }} sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} /> :
                                        <ArrowDropUpIcon onClick={() => toggleInputVisibility(index)} style={{ marginRight: "40px", color: "rgba(191, 6, 6, 1)", marginRight: '220px' }} sx={{ borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} />

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
                                <div style={{ height: "55px", border: "0px 0px 1px 0px", backgroundColor: "rgba(200, 9, 200, 0.1)", alignItems: "center", marginTop: "0px", display: "flex", justifyContent: "space-between" }}>
                                    <h3 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)", fontWeight: "700", fontSize: "16px", lineHeight: "21.79px" }}>Assign Task</h3>
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
                                </div>
                                <div style={{
                                    height: '30px', width: '300px', backgroundColor: 'rgba(191, 6, 6, 0.08)', alignContent: "center", marginBottom: "10px"
                                }}>
                                    <p style={{ color: 'rgba(191, 6, 6, 0.7)', marginLeft: "24px" }}>Please select a task to be assigned</p>
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
                                                const isActive = activePhaseIndex === index && activeTaskIndex === taskIndex;

                                                return (
                                                    <div key={taskIndex} style={{ height: "118px", minWidth: "250px", borderRadius: "8px", padding: "0 0px 0 0", border: isActive ? "2px solid rgba(191, 6, 6, 1)" : "1px solid black", marginLeft: "40px", marginBottom: "4px", marginTop: "30px", cursor: "pointer" }} onClick={() => handleTaskClick(index, taskIndex)}>
                                                        <div style={{ height: "40px", borderRadius: "8px 8px 0 0", backgroundColor: "rgba(37, 122, 251, 0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <h3 style={{ marginLeft: "16px", color: "rgba(51, 51, 51, 1)" }}>{`Task ${taskIndex + 1}`}</h3>
                                                            <p style={{ color: "rgba(191, 6, 6, 1)", cursor: 'pointer', marginRight: "3px" }}
                                                                onClick={() => openModal(task)}>see more...</p>
                                                        </div>
                                                        {isModalOpen && <ModalTask task={selectedTask} open={isModalOpen} onClose={closeModal} onSave={handleSaveTask} phaseIndex={index} />}
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
                                        <div>
                                            {activePhaseIndex === index && activeTaskIndex !== null && (
                                                <div style={{ display: "flex", maxWidth: "87%", overflowX: "auto", marginBottom: "20px" }}>
                                                    {/* members */}
                                                    <div style={{ width: "830px", }}>

                                                        <div style={{ height: "80px", width: "830px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(28, 29, 34, 0.04)", display: "flex", alignContent: "center", alignItems: "center" }}>
                                                            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgba(51, 51, 51, 1)", lineHeight: "21.79px", marginLeft: "24px" }}>Staff</h2>

                                                            <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                                                <div style={{ width: "59px", height: "27px", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(28, 29, 34, 0.1)" }} className={`bg-gray-100 cursor-pointer mr-4 `} onClick={prevPage}>
                                                                    <p style={{ fontSize: "14px", fontWeight: "600", lineHeight: "19px", color: "rgba(141, 141, 141, 1)" }}>Prev</p>
                                                                </div>
                                                                <p>{startIndex} - {endIndex} of {users.length}</p>

                                                                <div style={{ width: "59px", height: "27px", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(28, 29, 34, 0.1)" }} className={`bg-gray-100 cursor-pointer ml-4 `} onClick={nextPage}>
                                                                    <p style={{ fontSize: "14px", fontWeight: "600", lineHeight: "19px", color: "rgba(141, 141, 141, 1)" }}>Next</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ height: "352px", width: "830px", display: "flex", flexWrap: 'wrap', marginTop: "20px" }}>
                                                            {(workPhasesData[activePhaseIndex]?.tasks[activeTaskIndex]?.taskMembers && workPhasesData[activePhaseIndex]?.tasks[activeTaskIndex]?.taskMembers.length === 0) ? (
                                                                // Render checkboxes unchecked
                                                                users.slice(currentPage * 12, (currentPage + 1) * 12).map(member => (
                                                                    // {users.slice(currentPage * 12, currentPage * 12 + 12).map(user => (
                                                                    <div key={member._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", margin: "12px" }}>

                                                                        <Checkbox size="medium"
                                                                            style={{ color: 'rgba(141, 141, 141, 1)', }}
                                                                            onChange={() => handleAddMember(activePhaseIndex, activeTaskIndex, member._id, member.profilePicture, member.fullName, member.role)}
                                                                            checked={false}
                                                                        />
                                                                        {/* <img alt="avatar" src={member.avatar} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "10px" }} /> */}

                                                                        <img src={member.profilePicture} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "0px" }} />
                                                                        <div>
                                                                            <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px", textAlign: "center", color: "#333333" }}>{member.fullName}</p>
                                                                            <p style={{ fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px", textAlign: "center", color: "#8D8D8D" }}>{member.role}</p>
                                                                            <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "red" }}
                                                                                onClick={() => openMemberModal(member)}>Details...</p>
                                                                        </div>
                                                                        <div>

                                                                            {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                                                                        </div>
                                                                    </div>

                                                                ))
                                                            ) : (
                                                                // <div>
                                                                // Render checkboxes with pre-checked members
                                                                users.slice(currentPage * 12, (currentPage + 1) * 12).map(member => (
                                                                    <div key={member._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>

                                                                        <Checkbox size="medium"
                                                                            style={{
                                                                                color: workPhasesData[activePhaseIndex]?.tasks[activeTaskIndex]?.taskMembers.some(
                                                                                    (taskMember) => taskMember.memberId === member._id
                                                                                ) ? 'rgba(191, 6, 6, 1)' : 'rgba(141, 141, 141, 1)',
                                                                            }}
                                                                            onChange={() => handleAddMember(activePhaseIndex, activeTaskIndex, member._id, member.profilePicture, member.fullName, member.role)}
                                                                            checked={workPhasesData[activePhaseIndex]?.tasks[activeTaskIndex]?.taskMembers.some(taskMember => taskMember.memberId === member._id)}
                                                                        />
                                                                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white rounded-sm opacity-0 checked:opacity-100"></span>

                                                                        <img src={member.profilePicture} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "5px" }} />
                                                                        <div>
                                                                            <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px", textAlign: "center", color: "#333333" }}>{member.fullName}</p>
                                                                            <p style={{ fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px", textAlign: "center", color: "#8D8D8D" }}>{member.role}</p>
                                                                            <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "rgba(191, 6, 6, 1)" }} onClick={() => openMemberModal(member)}>Details...</p>
                                                                        </div>
                                                                        <div>

                                                                            {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                                // </div>
                                                            )}

                                                        </div>
                                                    </div>

                                                    {/* Time sheet */}
                                                    <div style={{borderLeft: "1px solid rgba(28, 29, 34, 0.1)"}}>
                                                    <div style={{ height: "80px", width: "630px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(28, 29, 34, 0.04)",alignContent: "center", alignItems: "center"}}>
                                                        <h2 style={{fontWeight: "700", fontSize: "18px", lineHeight: "21.79px", color: "rgba(51, 51, 51, 1)", marginLeft: "32px"}}> STAFF TIME SHEET</h2>
                                                    </div>
                                                    <div className="mt-2 items-center justify-center ml-24" style={{height: "404px", width: "421px", alignContent: "center", alignItems: "center"}}>
                                                        <h1 style={{fontWeight: "700", fontSize: "18px", lineHeight: "36px", color: "rgba(51, 51, 51, 1)"}}>Please select a staff to display their time sheet</h1>
   
                                                            <img src="/images/uploadFile.png" alt="Upload File" />

                                                    </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                )}
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

