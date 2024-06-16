'use client'
import { Box, IconButton, Modal,TextField } from "@mui/material"
import Close from '@mui/icons-material/Close';
import { useState } from "react";

console.log('modal message opened');

export function ModalTask({ open, onClose, task, onSave, phaseIndex }) {
    const [editedTask, setEditedTask] = useState(task);
   
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        // Check if the input field is for hours and if the entered value is greater than totalHours
        if (name === 'hours' && parseInt(value) > editedTask.totalHours) {
            alert(`Hours cannot exceed ${editedTask.totalHours}hrs`);
            return;
        }
    
        // Disable minute selection if hours equal totalHours
        if (name === 'hours' && parseInt(value) === editedTask.totalHours && parseInt(editedTask.minutes) !== 0) {
            alert("Minutes cannot be more than 0 when hours and totalHours are equal.");
            return;
        }
    
        // Check if the input field is for minutes
        if (name === 'minutes') {
            // If hours and totalHours are equal, prevent selecting minutes more than 0
            if (parseInt(editedTask.hours) === editedTask.totalHours && parseInt(value) !== 0) {
                alert("Minutes cannot be more than 0 when hours and totalHours are equal.");
                return;
            }
        }
    
        setEditedTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));

        if (name === 'startDate' || name === 'endDate') {
            const start = new Date(name === 'startDate' ? value : editedTask.startDate);
            const end = new Date(name === 'endDate' ? value : editedTask.endDate);
        
            // Check if the endDate is not earlier than the startDate
            if (name === 'endDate' && end < start) {
                alert('End date cannot be earlier than start date.');
                return;
            }
        
            const difference = end - start;
            const hours = difference / (1000 * 60 * 60);
            const days = Math.ceil(hours / 24);
            const totalHours = days * 8;
            setEditedTask(prevState => ({
                ...prevState,
                totalHours: totalHours
            }));
        }
    };
    
    

    const handleSave = () => {

          // Check if the endDate is not earlier than the startDate
          const startDate = new Date(editedTask.startDate);
          const endDate = new Date(editedTask.endDate);
          if (endDate < startDate) {
              alert('End date cannot be earlier than start date.');
              return;
          }
  
        onSave({ ...editedTask, originalTaskName: task.taskName, phaseIndex: phaseIndex });
        onClose();
    };
    

    return <Modal open={open} onClose={onClose}>
        <Box sx={{
            height: '400px', width: "600px", transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 1, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%',
        }}>
            <Box sx={{ position: 'relative' }}>
                {/* Close button */}
                <div className="flex justify-between bg-gray-100 items-center">
                    <div className="flex justify-center items-center">
                <IconButton onClick={onClose} sx={{ color: 'black', right: 0, top: 0, }}>
                    <Close sx={{ fontSize: 25, }} />
                </IconButton>
                <h2 className="ml-4 uppercase">task 1</h2>
                    </div>
                <button onClick={handleSave} className="bg-red-700 text-white rounded-md mr-6" style={{width: "90px", height: "40px"}}>Save</button>
                </div>

                <Box sx={{ p: 2 }} style={{overflowY: "auto",}}>
                    <div style={{ display: "flex", flexDirection: "row", alignContent: "center" }}>
                        {/* Task Name section */}
                        <div className="flex-1 mr-2" style={{ gap: "5px" }}>
                            <h4 style={{marginTop: "5px", marginBottom: "10px", marginLeft: "35px", color: "rgba(51, 51, 51, 1)"}}>
                                Task Name
                            </h4>
                            <input
                                type="text"
                                placeholder="Write tast name here"
                                value={editedTask.taskName}
                                onChange={handleChange}
                                name="taskName"
                                className="rounded-lg ml-2"
                                style={{ height: '100px', width: '250px',outline: "none", top: "38px", borderRadius: "8px", border: "2px solid #CCCCCC", marginLeft: "20px", padding: "10px" }}
                            />
                        </div>
                        <div className="flex-1 mr-1 ml-10" style={{ gap: "5px" }}>
                            <h4 style={{marginTop: "5px", marginBottom: "10px", marginLeft: "10px", color: "rgba(51, 51, 51, 1)"}}>
                                Task Budget<span style={{color: "rgba(191, 6, 6, 1)"}}> (Optional)</span>
                            </h4>
                            <input
                                type="text"
                                placeholder="Eg #200,000"
                                value={editedTask.taskBudget}
                                onChange={handleChange}
                                name="taskBudget"
                                className="rounded-lg ml-2"
                                style={{ height: '40px', width: '200px', outline: "none", borderRadius: "8px", border: "2px solid #CCCCCC", marginTop: "30px", padding: "10px" }}
                            />
                        </div>
                    </div>

                    {/* task schedule and duration */}
                    <div style={{ height: "150px", display: "flex", flexDirection: "row", alignContent: "center", width: "600px", marginTop: "15px"}}>
                        {/* Task schedule */}
                        <div className="flex-1 mr-2 mt-2" style={{height: "120px",width: "250px", border: "0px 1px 0px 0px" }}>

                            <div style={{ height: "30px", alignContent: "center" }} className="bg-gray-100">
                                <h4 style={{ color: "#333333", marginBottom: "10px", marginTop: "10px", marginLeft: "10px" }}>
                                    TASK SCHEDULE
                                </h4>
                            </div>
                            <div style={{marginTop: "10px", display: 'flex', flexDirection: 'row',}}>
                                {/* Start Date */}
                                <div className="flex-1" style={{marginLeft: "12px", marginRight: "8px"}}>
                                    <h4 style={{ color: "#8D8D8D", marginBottom: "10px", marginLeft: "10px" }}>
                                        Start Date
                                    </h4>
                                    {/* Input field for Start Date */}
                                    <TextField
                                        variant="outlined"
                                        type="date"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ width: 130}}
                                        value={editedTask.startDate}
                                        name="startDate"
                                        onChange={handleChange}
                                        inputProps={{ min: new Date().toISOString().split('T')[0] }} // Set min attribute to today's date
                                    />
                                </div>
                                {/* End Date */}
                                <div className="flex-1" style={{marginLeft: "12px", marginRight: "8px"}}>
                                    <h4 style={{ color: "#8D8D8D", marginBottom: "10px", marginLeft: "10px" }}>
                                        End Date
                                    </h4>
                                    <TextField
                                        variant="outlined"
                                        type="date"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ width: 130 }}
                                        value={editedTask.endDate}
                                        name="endDate"
                                        onChange={handleChange}
                                        inputProps={{ min: editedTask.startDate }}
                                    />
                                </div>
                            </div>

                        </div>
                        {/* task duration */}
                        <div className="flex-1 mr-2 mt-2" style={{ height: "80px",width: "180px", border: "0px 1px 0px 0px" }}>

                            <div style={{ height: "30px",width: "250px", alignContent: "center" }} className="bg-gray-100">
                                <h4 style={{ color: "#333333", marginBottom: "10px", marginTop: "10px", marginLeft: "10px" }}>
                                    SET THE TASK DURATION
                                </h4>
                            </div>
                            <div style={{marginTop: "10px", marginLeft: "10px"}}>
                                <h4 style={{ color: "#8D8D8D", marginBottom: "10px", marginLeft: "10px" }}>
                                        Hours <span style={{color: "rgba(0, 128, 0, 1)"}}>(max: {editedTask.totalHours}hrs)</span>
                                    </h4>
                            </div>
                            <div className="flex flex-row mt-4">
                                {/* Start Date */}
                                <div className="flex-1" style={{marginLeft: "5px", marginTop: "5px"}}> 
                                    {/* Input field for Start Date */}
                                    <input
                                        type="text"
                                        placeholder="hours"
                                        value={editedTask.hours}
                                        onChange={handleChange}
                                        name="hours"
                                        className="rounded-lg ml-2"
                                        style={{ height: '30px', width: '90px', outline: "none", top: "34px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                    />
                                </div>
                                {/* End Date */}
                                {/* Minutes */}
                                {/* Minutes */}
                                <div className="flex-1" style={{marginRight: "30px", marginTop: "2px"}}>
                                    <select
                                        name="minutes"
                                        className="rounded-lg"
                                        style={{ height: '40px', width: '120px', top: "20px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "5px", marginRight: "12px" }}
                                        value={editedTask.minutes} // Set the default value to "0" if task.minutes is falsy
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
                </Box>

            </Box>
        </Box>
    </Modal>
}
