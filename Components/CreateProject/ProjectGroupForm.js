'use client'
import React, { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Preview from './Preview';
import StepFour from './StepFour';
import AddTasks from './AddTasks';
import AddTaskMembers from './AddTaskMembers';
import Summary from './Summary';
// import StepThree from './StepThree';

export default function ProjectGroupForm({ handleCloseProject, closePrompt, handleCancleProjectCreation }) {
    const [step, setStep] = useState(1);
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        // teamId: teamId,
        goalName: '',
        tasks: []
    });
    const [basicData, setBasicData] = useState({ name: '', purpose: '', color: '' });
    const [workPhasesData, setWorkPhasesData] = useState([{ workPhaseName: '', goalName: '', goalStatus: "To do", tasks: [{taskName: '',taskBudget: '',startDate: '', endDate: '', hours: '', minutes: '0', taskMembers: [], taskStatus: 'To do' }] }]);
    console.log("workPhasesData:", workPhasesData);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1)
    }

    const handleBasicDataChange = (fieldName, value) => {
        setBasicData({ ...basicData, [fieldName]: value });
    };

    // Function to handle adding a new work phase
    const handleAddWorkPhase = () => {
        setWorkPhasesData(prevData => [
            ...prevData,
            { workPhaseName: '', goalName: '', goalStatus: "To do", tasks: [{taskName: '', taskBudget: '', startDate: '', endDate: '', hours: '', minutes: '0',taskMembers: [], taskStatus: 'To do' }] }
        ]);
    };

    const addNewTask = (phaseIndex) => {
        console.log("phase index:", phaseIndex)
        setWorkPhasesData(prevData => {
            const updatedWorkPhasesData = [...prevData];
            updatedWorkPhasesData[phaseIndex].tasks.push({taskName: '',taskBudget: '',startDate: '',endDate: '',hours: '',minutes: '',taskMembers: [],taskStatus: 'To do'});
            return updatedWorkPhasesData;
        });
    };

    const deleteTask = (phaseIndex, taskIndex) => {
        console.log("phase index:", phaseIndex, "task index:", taskIndex);
        setWorkPhasesData(prevData => {
            const updatedWorkPhasesData = [...prevData];
            updatedWorkPhasesData[phaseIndex].tasks.splice(taskIndex, 1);
            return updatedWorkPhasesData;
        });
    };
    
    // const handleTaskFieldChange = (event, phaseIndex, taskIndex, field) => {
    //     const { value } = event.target;
    //     setWorkPhasesData(prevData => {
    //         const updatedWorkPhasesData = [...prevData];
    //         updatedWorkPhasesData[phaseIndex].tasks[taskIndex] = {
    //             ...updatedWorkPhasesData[phaseIndex].tasks[taskIndex],
    //             [field]: value
    //         };
    //         return updatedWorkPhasesData;
    //     });
    // };
    const calculateMaxHours = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        let totalHours = 0;
    
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const day = date.getDay();
            if (day !== 0 && day !== 6) { // Monday to Friday
                totalHours += 8;
            }
        }
    
        return totalHours;
    };
    
    const handleTaskFieldChange = (event, phaseIndex, taskIndex, field) => {
        const { value } = event.target;
        setWorkPhasesData(prevData => {
            const updatedWorkPhasesData = [...prevData];
            const updatedTask = { 
                ...updatedWorkPhasesData[phaseIndex].tasks[taskIndex], 
                [field]: value 
            };
    
            if (field === 'startDate' || field === 'endDate') {
                const startDate = field === 'startDate' ? value : updatedTask.startDate;
                const endDate = field === 'endDate' ? value : updatedTask.endDate;
    
                const maxHours = calculateMaxHours(startDate, endDate);
                updatedTask.totalHours = maxHours;
                
                if (parseInt(updatedTask.hours, 10) > maxHours) {
                    updatedTask.hours = maxHours.toString();
                }
                if (parseInt(updatedTask.hours, 10) === maxHours && parseInt(updatedTask.minutes, 10) > 0) {
                    updatedTask.minutes = '0';
                }
            } else if (field === 'hours') {
                const maxHours = calculateMaxHours(updatedTask.startDate, updatedTask.endDate);
                if (parseInt(value, 10) > maxHours) {
                    updatedTask.hours = maxHours.toString();
                }
                if (parseInt(value, 10) === maxHours && parseInt(updatedTask.minutes, 10) > 0) {
                    updatedTask.minutes = '0';
                }
            } else if (field === 'minutes') {
                const maxHours = calculateMaxHours(updatedTask.startDate, updatedTask.endDate);
                if (parseInt(updatedTask.hours, 10) === maxHours && value > 0) {
                    updatedTask.minutes = '0';
                } else {
                    updatedTask.minutes = value;
                }
            }
    
            updatedWorkPhasesData[phaseIndex].tasks[taskIndex] = updatedTask;
            return updatedWorkPhasesData;
        });
    };
    
    const handleDeleteWorkPhase = (workPhaseName) => {
        // Filter out the work phase with the specified workPhaseName
        const updatedWorkPhasesData = workPhasesData.filter(phase => phase.workPhaseName !== workPhaseName);

        // Update the state with the filtered array
        setWorkPhasesData(updatedWorkPhasesData);
    };

    // update workPhaseName
    const handleWorkPhaseNameChange = (event, index) => {
        // Map over the workPhasesData array
        const updatedWorkPhasesData = workPhasesData.map((phase, i) => {
            // Update the workPhaseName only for the phase being edited
            if (i === index) {
                return {
                    ...phase,
                    workPhaseName: event.target.value
                };
            }
            return phase;
        });

        // Update the state with the modified workPhasesData
        setWorkPhasesData(updatedWorkPhasesData);
    };

    // update goalName
    const handleWorkPhaseGoalName = (event, index) => {
        const updateWorkPhaseDate = workPhasesData.map((phase, i) => {
            if (i === index) {
                return {
                    ...phase,
                    goalName: event.target.value
                }
            }
            return phase
        })
        setWorkPhasesData(updateWorkPhaseDate)
    }

    const handleTaskChange = (phaseIndex, taskIndex, field, value) => {
        setWorkPhasesData(prevData => {
            const updatedWorkPhasesData = [...prevData];
            const updatedTasks = [...updatedWorkPhasesData[phaseIndex].tasks];
            const updatedTask = { ...updatedTasks[taskIndex], [field]: value };
            updatedTasks[taskIndex] = updatedTask;
            updatedWorkPhasesData[phaseIndex] = { ...updatedWorkPhasesData[phaseIndex], tasks: updatedTasks };
            return updatedWorkPhasesData;
        });
    };

    // Function to handle adding/removing task members
    const handleTaskMemberChange = (taskIndex, memberId) => {
        const updatedTasks = [...formData.tasks];
        const task = updatedTasks[taskIndex];
        const memberIndex = task.taskMembers.indexOf(memberId);
        if (memberIndex === -1) {
            // If member is not in the task, add them
            task.taskMembers.push(memberId);
        } else {
            // If member is already in the task, remove them
            task.taskMembers.splice(memberIndex, 1);
        }
        setFormData({ ...formData, tasks: updatedTasks });
    };

    // Function to remove a task
    const handleRemoveTask = (index) => {
        const updatedTasks = [...formData.tasks];
        updatedTasks.splice(index, 1);
        setFormData({ ...formData, tasks: updatedTasks });
    };

    // Handle save task button in ModalTask
    const handleSaveTask = (editedTask) => {
        setWorkPhasesData(prevData => {
            // Find the work phase using the phaseIndex
            const updatedWorkPhases = prevData.map((phase, index) => {
                if (index === editedTask.phaseIndex) {
                    // Update the tasks within the specific work phase
                    const updatedTasks = phase.tasks.map(task => {
                        if (task.taskName === editedTask.originalTaskName) {
                            return { ...editedTask, taskStatus: task.taskStatus };
                        }
                        return task;
                    });
    
                    // Return the updated work phase with modified tasks
                    return { ...phase, tasks: updatedTasks };
                }
                return phase;
            });
    
            // Return the updated workPhasesData
            return updatedWorkPhases;
        });
    };
    
    // Handle Add members to task
    const handleAddMember = (phaseIndex, taskIndex, memberId, profilePicture, fullName, role) => {
        setWorkPhasesData((prevData) => {
            // Clone the data to avoid direct state mutation
            const newWorkPhasesData = [...prevData];
            const taskMembers = [...newWorkPhasesData[phaseIndex].tasks[taskIndex].taskMembers];
    
            // Check if the member is already in the taskMembers array
            const memberIndex = taskMembers.findIndex((member) => member.memberId === memberId);
    
            if (memberIndex === -1) {
                // Add new member if not already present
                taskMembers.push({
                    memberId,
                    profilePicture,
                    fullName,
                    role,
                });
            } else {
                // Remove member if already present
                taskMembers.splice(memberIndex, 1);
            }
    
            // Update the specific task's taskMembers array
            newWorkPhasesData[phaseIndex].tasks[taskIndex].taskMembers = taskMembers;
    
            return newWorkPhasesData;
        });
    };
    


    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/teamGoal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to create goal. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating goal:', error);
            alert('An error occurred while creating the goal. Please try again later.');
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };

    return (
        <>
            <StepOne
                open={open && step === 1}
                handleCancel={handleCloseProject}
                handleNext={handleNext}
                basicData={basicData}
                setBasicData={handleBasicDataChange}
            />
            <StepTwo
                open={open && step === 2}
                handleCancel={handleCloseProject}
                handleNext={handleNext}
                handlePrev={handlePrev}
            />
            <StepThree
                open={open && step === 3}
                handleCancel={handleCloseProject}
                handleAddWorkPhase={handleAddWorkPhase}
                handleNext={handleNext}
                handlePrev={handlePrev}
                workphaseName={workPhasesData.workPhaseName}
                handleWorkPhaseNameChange={handleWorkPhaseNameChange}
                workPhasesData={workPhasesData}
                handleDeleteWorkPhase={handleDeleteWorkPhase}
            />
            <StepFour
                open={open && step === 4}
                handleCancel={handleCloseProject}
                handleAddWorkPhase={handleAddWorkPhase}
                handleNext={handleNext}
                handlePrev={handlePrev}
                workphaseName={workPhasesData.workPhaseName}
                handleWorkPhaseNameChange={handleWorkPhaseNameChange}
                workPhasesData={workPhasesData}
                handleDeleteWorkPhase={handleDeleteWorkPhase}
                handleWorkPhaseGoalName={handleWorkPhaseGoalName}
            />
            <AddTasks
                open={open && step === 5}
                handleCancel={handleCloseProject}
                handleAddWorkPhase={handleAddWorkPhase}
                handleNext={handleNext}
                handlePrev={handlePrev}
                workphaseName={workPhasesData.workPhaseName}
                handleWorkPhaseNameChange={handleWorkPhaseNameChange}
                workPhasesData={workPhasesData}
                handleDeleteWorkPhase={handleDeleteWorkPhase}
                handleWorkPhaseGoalName={handleWorkPhaseGoalName}
                handleTaskChange={handleTaskChange}
                addNewTask = {addNewTask}
                handleTaskFieldChange = {handleTaskFieldChange}
                deleteTask ={deleteTask}
                handleSaveTask = {handleSaveTask}
                calculateMaxHours={calculateMaxHours}
            />
             <AddTaskMembers
                open={open && step === 6}
                handleCancel={handleCloseProject}
                handleAddWorkPhase={handleAddWorkPhase}
                handleNext={handleNext}
                handlePrev={handlePrev}
                workphaseName={workPhasesData.workPhaseName}
                handleWorkPhaseNameChange={handleWorkPhaseNameChange}
                workPhasesData={workPhasesData}
                handleDeleteWorkPhase={handleDeleteWorkPhase}
                handleWorkPhaseGoalName={handleWorkPhaseGoalName}
                handleTaskChange={handleTaskChange}
                addNewTask = {addNewTask}
                handleTaskFieldChange = {handleTaskFieldChange}
                deleteTask ={deleteTask}
                handleSaveTask = {handleSaveTask}
                handleAddMember= {handleAddMember}
            />
             <Summary
                open={open && step === 7}
                handleCancel={handleCloseProject}
                handleDeleteWorkPhase={handleDeleteWorkPhase}
                handleNext={handleNext}
                handlePrev={handlePrev}
                workPhasesData={workPhasesData}
            />
           <Preview
                open={open && step === 8}
                handleCancel={handleCloseProject}
                closeForm={closePrompt}
                handleDeleteWorkPhase={handleDeleteWorkPhase}
                handlePrev={handlePrev}
                workPhasesData={workPhasesData}
                basicData = {basicData}
            />
        </>
    );
}
