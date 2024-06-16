import React, { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Preview from './Preview';
// import StepThree from './StepThree';

export default function GoalForm({teamId, handleCloseGoal}) {
    const [step, setStep] = useState(1);
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        teamId: teamId,
        goalName: '',
        tasks: []
    });

    console.log("data:", formData)

    const handleNext = () => {
        // Check if the current step requires validation
        if (step === 1) {
            // Validate input fields for StepOne
            if (!formData.goalName) {
                alert('Please enter a goal name.'); 
                return; // Prevent further execution
            }
        } else if (step === 2) {
            // Validate input fields for StepTwo
            if (formData.tasks.length === 0) {
                alert('Please add at least one task.'); 
                return; // Prevent further execution
            }
        } else if (step === 3) {
            // Validate input fields for StepThree
            // Add validation logic for StepThree fields if needed
        }
    
        // Proceed to the next step if all validations pass
        setStep(step + 1);
    };
    

    const handleGoalNameChange = (value) => {
        setFormData({ ...formData, goalName: value });
    };

    const handleAddTask = () => {
        const newTask = {
            taskName: '',
            taskBudget: '',
            startDate: '',
            endDate: '',
            hours: '',
            minutes: '0',
            taskMembers: [],
            taskStatus: 'To do'
        };
        setFormData({ ...formData, tasks: [...formData.tasks, newTask] });
    };

    // Function to handle changes in task fields
    const handleTaskChange = (index, field, value) => {
        setFormData(prevFormData => {
            const updatedTasks = [...prevFormData.tasks];
            const updatedTask = { ...updatedTasks[index], [field]: value };
            updatedTasks[index] = updatedTask;
            return { ...prevFormData, tasks: updatedTasks };
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

    const addNewTask = () => {
        setFormData({
            ...formData,
            tasks: [...formData.tasks, {
                taskName: '',
                taskBudget: '',
                startDate: '',
                endDate: '',
                hours: '',
                minutes: '0',
                taskMembers: [],
                taskStatus: 'To do'
            }]
        });
    };

      // Handle save task button in ModalTask
      const handleSaveTask = (editedTask) => {
        const updatedTasks = formData.tasks.map(task => {
            if (task.taskName === editedTask.originalTaskName) {
                return { ...editedTask, taskStatus: task.taskStatus };
            }
            return task;
        });
        setFormData(prevData => ({
            ...prevData,
            tasks: updatedTasks
        }));
    };


 // Handle Add members to task
const handleAddMember = (activeTaskIndex, memberId, profilePicture, name, role) => {
    const updatedTasks = [...formData.tasks];

    const task = updatedTasks[activeTaskIndex];
    const memberIndex = task.taskMembers.findIndex(member => member.memberId === memberId); // Find member by memberId
    if (memberIndex === -1) {
        // If member is not in the task, add them
        task.taskMembers.push({ memberId, profilePicture, name, role });
    } else {
        // If member is already in the task, remove them
        task.taskMembers.splice(memberIndex, 1);
    }
    setFormData({ ...formData, tasks: updatedTasks });
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
                handleCancel={handleCloseGoal}
                handleNext={handleNext}
                goalName={formData.goalName}
                setGoalName={handleGoalNameChange}
            />
            <StepTwo
                open={open && step === 2}
                handleCancel={handleCloseGoal}
                handleNext={handleNext}
                formData={formData}
                handleAddTask={handleAddTask}
                handleTaskChange={handleTaskChange}
                handleTaskMemberChange={handleTaskMemberChange}
                handleRemoveTask={handleRemoveTask}
                addNewTask = {addNewTask}
                handleSaveTask = {handleSaveTask}
            />
            <StepThree
                open={open && step === 3}
                handleCancel={handleCloseGoal}
                formData={formData}
                handleSaveTask = {handleSaveTask}
                // handleNext={handleSubmit} // This will submit the form when in StepThree
                teamId={teamId}
                handleAddMember={handleAddMember} 
                handleNext={handleNext}
            />
              <Preview
                open={open && step === 4}
                handleCancel={handleCloseGoal}
                formData={formData}
                handleSaveTask = {handleSaveTask}
                handleSubmit={handleSubmit} 
                teamId={teamId}
                handleAddMember={handleAddMember} 
                handleNext={handleNext}
                loading={loading}
            />
        </>
    );
}
