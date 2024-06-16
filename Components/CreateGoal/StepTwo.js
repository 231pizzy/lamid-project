'use client'
import { Box, Button, Modal, Typography, Slide, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useState } from "react";
import { ModalTask } from "./ModalTask";

export default function StepTwo({ open, handleCancel, formData, handleTaskChange, handleSaveTask, handleNext }) {
    const [isInputVisible, setInputVisible] = useState(false);
    const [newTask, setNewTask] = useState({ taskName: '', taskBudget: '', startDate: '', endDate: '', hours: '', minutes: '', taskMembers: [], totalHours: 0, taskStatus: 'To do'});
    const [preview, setPreview] = useState(false)
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const openModal = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'hours' && parseInt(value) > newTask.totalHours) {
            alert(`Hours cannot exceed ${newTask.totalHours}hrs`);
            return;
        }

        if (name === 'minutes') {
            // If hours and totalHours are equal, prevent selecting minutes more than 0
            if (parseInt(newTask.hours) === newTask.totalHours && parseInt(value) !== 0) {
                alert("Minutes cannot be more than 0 when hours and totalHours are equal.");
                return;
            }
        }

        setNewTask(prevState => ({
            ...prevState,
            [name]: value
        }));

 // Calculate total hours based on start and end dates
 if (name === 'startDate' || name === 'endDate') {
    const start = new Date(name === 'startDate' ? value : newTask.startDate);
    const end = new Date(name === 'endDate' ? value : newTask.endDate);

    // Check if the endDate is not earlier than the startDate
    if (name === 'endDate' && end < start) {
        alert('End date cannot be earlier than start date.');
        return;
    }

    const difference = end - start;
    const hours = difference / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    const totalHours = days * 8;
    setNewTask(prevState => ({
        ...prevState,
        totalHours: totalHours
    }));
}

    };


    const handleAddAndSaveTask = () => {
        // Check if taskName, startDate, endDate, and hours are provided
        if (!newTask.taskName || !newTask.startDate || !newTask.endDate || !newTask.hours) {
            alert('Please fill in all task details.');
            return;
        }

        // Check if the endDate is not earlier than the startDate
        const startDate = new Date(newTask.startDate);
        const endDate = new Date(newTask.endDate);
        if (endDate < startDate) {
            alert('End date cannot be earlier than start date.');
            return;
        }
        // Determine the index for the new task
        const index = formData.tasks.length;
        console.log('Index:', index);
        // Push the newTask into formData
        handleTaskChange(index, 'taskName', newTask.taskName);
        handleTaskChange(index, 'taskBudget', newTask.taskBudget);
        handleTaskChange(index, 'startDate', newTask.startDate);
        handleTaskChange(index, 'endDate', newTask.endDate);
        handleTaskChange(index, 'hours', newTask.hours);
        handleTaskChange(index, 'minutes', newTask.minutes);
        handleTaskChange(index, 'taskMembers', newTask.taskMembers);
        handleTaskChange(index, 'taskStatus', newTask.taskStatus);
        // Clear the newTask state
        setNewTask({ taskName: '', taskBudget: '', startDate: '', endDate: '', hours: '', minutes: '', taskMembers: [], taskStatus: 'To do' });
        setPreview(true);
    };

    return (
        <Modal open={open}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box sx={{
                    height: '100%', bgcolor: 'white', overflowY: 'auto', pb: 4,
                    position: 'absolute', top: '0%', right: '0%', width: '900px',

                }}>
                    {/* Heading */}
                    <Box sx={{
                        display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                        py: 2, px: { xs: 1.5, sm: 4 }, mb: 3,
                        borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white',
                    }}>
                        {/* Close form */}
                        <CloseIcon onClick={handleCancel} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 32, mr: 4 }} />

                        {/* Heading label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                            ADD GOAL
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        {/* <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: '#BF0606', color: 'white' }} onClick={handleCreateTeam}>
                            DONE
                        </Button> */}
                    </Box>

                    {/* Body */}
                    <div style={{ width: '900px', overflowY: 'auto', maxHeight: '150vh', }}>
                        <div style={{ width: '900px', gap: '32px', top: "60px", padding: "0px 0px 64px 0px", backgroundColor: "FFFFFF" }}>
                            <div style={{ height: "64px", width: '900px',backgroundColor: "rgba(25, 211, 252, 0.1)", borderBottom: "1px solid #CCCCCC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{marginLeft: "50px", color: "rgba(51, 51, 51, 1)"}}>Goal</h2>
                                {isInputVisible ?
                                    <ArrowDropUpIcon onClick={() => setInputVisible(false)} style={{marginRight: "14px", color: "rgba(191, 6, 6, 1)"}} /> :
                                    <ArrowDropDownIcon onClick={() => setInputVisible(true)} style={{marginRight: "14px", color: "rgba(191, 6, 6, 1)"}}/>
                                }
                            </div>

                            {isInputVisible &&
                                <div className="" style={{ height: '155px', width: '830px', gap: "10px" }}>
                                    <div style={{ width: "735px", height: '143px', gap: "16px" }}>
                                        <p style={{marginTop: "20px", marginBottom: "6px", marginLeft: "50px"}}>Goal Name</p>
                                        <input
                                            type="text"
                                            placeholder={formData.goalName}
                                            value={formData.goalName}
                                            disabled
                                            className="rounded-lg ml-2"
                                            style={{ height: '90px', width: '735px', borderRadius: "8px", border: "1px solid #CCCCCC", marginLeft: "40px", padding: "10px" }}
                                        />
                                    </div>
                                </div>
                            }

                            {/* Task preview */}
                            {/* Heading */}
                            {preview &&
                                <>
                                    <div style={{ height: "55px", width: "900px", border: "0px 0px 1px 0px", backgroundColor: "rgba(0, 128, 0, 0.1)", alignContent: "center", marginTop: "0px" }}>
                                        <h3 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)" }}>Task Under Goal</h3>
                                    </div>
                                    <div style={{ height: "182px", width: "auto", border: "0px 2px 0px 0px", gap: "44px", display: "flex", overflowX: "auto", maxWidth: '150vh' }}>

                                        {/* Mapping formData.tasks */}
                                        {formData.tasks.map((task, index) => {
                                            // if (task.taskName !== '') {
                                            const startDate = new Date(task.startDate);
                                            const endDate = new Date(task.endDate);
                                            const startMonth = startDate.toLocaleString('default', { month: 'short' });
                                            const endMonth = endDate.toLocaleString('default', { month: 'short' });
                                            const startDay = startDate.getDate();
                                            const endDay = endDate.getDate();

                                            return (
                                                <div key={index} style={{ height: "118px", minWidth: "250px", borderRadius: "8px", padding: "0px, 0px, 12px, 0px", border: "1px solid black", marginLeft: "6px", marginBottom: "4px", marginTop: "30px" }}>
                                                    <div style={{ height: "40px", borderRadius: "8px, 8px, 0px, 0px", backgroundColor: "rgba(37, 122, 251, 0.07)" }} className="flex justify-between items-center">
                                                        <h3 style={{marginLeft: "16px", color: "rgba(51, 51, 51, 1)"}}>{`Task ${index + 1}`}</h3>
                                                        <p style={{color: "rgba(191, 6, 6, 1)", cursor: 'pointer', marginRight: "3px"}} onClick={() => openModal(task)}>see more...</p>
                                                    </div>
                                                    {isModalOpen && <ModalTask task={selectedTask} open={isModalOpen} onClose={closeModal} onSave={handleSaveTask} />}
                                                    <div className="flex justify-between items-center">
                                                        <div className="bg-gray-100 rounded-md items-center justify-center mt-2 ml-2" style={{ width: "150px", height: "55px" }}>
                                                            <h4 className="text-sm font-bold text-center" style={{color: "rgba(51, 51, 51, 1)"}}>Date</h4>
                                                            <p className="ml-2 text-lg" style={{color: "rgba(51, 51, 51, 1)"}}>{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</p>
                                                        </div>
                                                        <div className="bg-gray-100 rounded-md items-center justify-center mt-2 mr-2" style={{ width: "70px", height: "55px" }}>
                                                            <h4 className="text-sm text-center font-bold" style={{color: "rgba(51, 51, 51, 1)"}}>Duration</h4>
                                                            <p className="ml-2 text-lg" style={{color: "rgba(51, 51, 51, 1)"}}>{`${task.hours}hrs`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );

                                        })}
                                    </div>
                                </>
                            }


                            {/* Task under goal */}
                            {/* {formData.tasks.map((task, index) => ( */}
                            <div style={{ height: "454px", width: "900px", border: "0px 2px 0px 0px", marginTop: "10px" }}>

                                {/* Heading */}
                                <div style={{ height: "55px", width: "900px", border: "0px 0px 1px 0px", backgroundColor: "rgba(0, 128, 0, 0.1)", alignContent: "center", marginTop: "0px" }}>
                                    <h3 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)" }}>Add New Task Under Goal</h3>
                                </div>

                                <div style={{ height: "201px", width: "900px", display: "flex", flexDirection: "row", alignContent: "center" }}>

                                    {/* Task Name section */}
                                    <div className="flex-1 mr-2" style={{ width: "520px", height: "143px", gap: "5px", left: "20px"}}>
                                    <h4 style={{marginLeft: "40px", marginBottom: "10px", marginTop: "15px", color: "rgba(51, 51, 51, 1)" }}>
                                            Task Name
                                        </h4>
                                        <input
                                            type="text"
                                            placeholder="Write tast name here"
                                            value={newTask.taskName}
                                            onChange={handleChange}
                                            name="taskName"
                                            className="rounded-lg ml-2"
                                            style={{ height: '90px', width: '500px', top: "38px", borderRadius: "8px", border: "2px solid #CCCCCC", outline:"none", marginLeft: "40px", padding: "10px" }}
                                        />
                                    </div>
                                    {/* Budget section */}
                                    <div style={{ width: "259px", height: "153px", top: "24px", left: "520px" }}>
                                        <h4 className="mb-8 mt-6" style={{ marginBottom: "20px", marginTop: "15px", color: "rgba(51, 51, 51, 1)" }}>
                                            Task Budget<span style={{color: "rgba(191, 6, 6, 1)"}}> (Optional)</span>
                                        </h4>
                                        <input
                                            type="text"
                                            placeholder="Eg #200,000"
                                            value={newTask.taskBudget}
                                            onChange={handleChange}
                                            name="taskBudget"
                                            className="rounded-lg ml-2"
                                            style={{ height: '58px', width: '201px', borderRadius: "8px", border: "2px solid #CCCCCC",outline:"none", padding: "10px"}}
                                        />
                                    </div>
                                </div>

                                {/* task schedule and duration */}
                                <div style={{ height: "201px", width: "900px", display: "flex", flexDirection: "row", alignContent: "center" }}>
                                    {/* Task schedule */}
                                    <div className="flex-1 mr-2" style={{ width: "428px", height: "178px", border: "0px 1px 0px 0px" }}>

                                        <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                                            <h4 style={{ color: "rgba(51, 51, 51, 1)", marginTop: "15px", marginBottom: "20px", marginLeft: "40px"}}>
                                                TASK SCHEDULE
                                            </h4>
                                        </div>
                                        <div style={{display: "flex", flexDirection: 'row',  marginTop: '18px'}}>
                                            {/* Start Date */}
                                            <div className="flex-1" style={{marginLeft: "20px", marginRight: "4px"}}>
                                                <h4 style={{ color: "rgba(51, 51, 51, 1)", marginBottom: "10px", marginLeft: "10px" }} >
                                                    Start Date
                                                </h4>
                                                {/* Input field for Start Date */}
                                                <TextField
                                                    variant="outlined"
                                                    type="date"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ width: 174 }}
                                                    value={newTask.startDate}
                                                    name="startDate"
                                                    onChange={handleChange}
                                                    inputProps={{ min: new Date().toISOString().split('T')[0] }} // Set min attribute to today's date
                                                />
                                            </div>
                                            {/* End Date */}
                                            <div className="ml-4 mr-2 flex-1">
                                                <h4 style={{ color: "#8D8D8D", marginBottom: "10px", marginLeft: "10px" }}>
                                                    End Date
                                                </h4>
                                                <TextField
                                                    variant="outlined"
                                                    type="date"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ width: 174 }}
                                                    value={newTask.endDate}
                                                    name="endDate"
                                                    onChange={handleChange}
                                                    inputProps={{ min: newTask.startDate }}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    {/* task duration */}
                                    <div className="flex-1 mr-2" style={{ width: "428px", height: "178px", border: "0px 1px 0px 0px" }}>

                                        <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                                            <h4 style={{ color: "rgba(51, 51, 51, 1)", marginTop: "15px", marginBottom: "20px", marginLeft: "40px" }}>
                                                SET THE TASK DURATION
                                            </h4>
                                        </div>
                                        <div className="flex flex-row mt-4">
                                            {/* Start Date */}
                                            <div className="flex-1" style={{marginLeft: "20px", marginRight: "4px"}}>
                                                <h4 style={{ color: "rgba(141, 141, 141, 1)", marginBottom: "10px", marginLeft: "10px" }}>
                                                    Hours <span style={{color: "rgba(0, 128, 0, 1)"}}>(max: {newTask.totalHours}hrs)</span>
                                                </h4>
                                                {/* Input field for Start Date */}
                                                <input
                                                    type="text"
                                                    placeholder="hours"
                                                    value={newTask.hours}
                                                    onChange={handleChange}
                                                    name="hours"
                                                    className="p-3 rounded-lg ml-2"
                                                    style={{ height: '56px', width: '170px', top: "34px", outline: "none", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px"}}
                                                />
                                            </div>
                                            {/* End Date */}
                                            {/* Minutes */}
                                            {/* Minutes */}
                                            <div className="flex-1" style={{marginTop: "35px", marginLeft: "12px", marginRight: "6px"}}>
                                                <select
                                                    name="minutes"
                                                    className="rounded-lg ml-2"
                                                    style={{ height: '56px', width: '170px',outline: "none", top: "34px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                                    value={newTask.minutes} // Set the default value to "0" if task.minutes is falsy
                                                    onChange={handleChange}
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

                            </div>
                            {/* ))} */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "20px" }}>
                                <button style={{ height: "54px", width: "196px", borderRadius: "8px", border: "1px solid #BF0606", padding: "16px", gap: "10px", color: "rgba(191, 6, 6, 1)", marginLeft: "15px" }} onClick={handleAddAndSaveTask}>Save & Add Task</button>
                                <button style={{ height: "54px", width: "140px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 0.1)", padding: "16px", gap: "10px", color: "rgba(191, 6, 6, 1)", marginRight: '40px' }} onClick={handleNext}>Next</button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
}


