'use client'
import { Box, IconButton, Modal, Typography, Slide, TextField, Checkbox, InputBase, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Close from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import { MemberDetails } from "@/Components/CreateGoal/MemberDetails";
import { addNewGoalOrTask } from "../helper";
const ApprovedSvg = '/icons/ApprovedSvg.svg';
import IconElement from "@/Components/IconElement";

export default function AddGoal({ open, handleCloseGoal, projectId, selectedWorkphaseIndex, closeFolderPrompt, projectData, setProjectData}) {
    const [newGoal, setNewGoal] = useState([{ goalName: '', goalStatus: "To do", tasks: [{ taskName: '', taskBudget: '', startDate: '', endDate: '', hours: '', minutes: '0', taskMembers: [], taskStatus: 'To do' }] }]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showCongratulations, setshowCongratulations] = useState(false)
    
    // Calculate total pages
    const totalPages = Math.ceil(users.length / 12);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    // Function to handle previous page click
    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Calculate range of displayed users
    const startIndex = currentPage * 12 + 1;
    const endIndex = Math.min((currentPage + 1) * 12, users.length);

    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSearchClick = () => {
        setIsSearching(true);
    };

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

    const maxHours = calculateMaxHours(newGoal[0].tasks[0]?.startDate, newGoal[0].tasks[0]?.endDate);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const maxHours = calculateMaxHours(newGoal[0].tasks[0]?.startDate, newGoal[0].tasks[0]?.endDate);

        setNewGoal((prevState) => {
            const updatedTasks = prevState[0].tasks.map((task, index) => {

                if (index === 0) {
                    if (name === 'hours' && parseInt(value) > maxHours) {
                        return { ...task, [name]: maxHours.toString() };
                    }
                    return { ...task, [name]: value };
                }

                if (index === 0) {
                    if (name === 'minutes' && parseInt(newGoal[0].tasks[0].hours) === maxHours && parseInt(value) !== 0) {
                        return { ...task, [name]: '0' };
                    }
                    return { ...task, [name]: value };
                }

                return task;
            });

            return [{ ...prevState[0], tasks: updatedTasks }];
        });

        if (name === 'minutes' && parseInt(newGoal[0].tasks[0].hours) === maxHours && parseInt(value) !== 0) {
            alert("Minutes cannot be more than 0 when hours and max hours are equal.");
        }

        if (name === 'startDate' || name === 'endDate') {
            const start = new Date(name === 'startDate' ? value : newGoal[0].tasks[0].startDate);
            const end = new Date(name === 'endDate' ? value : newGoal[0].tasks[0].endDate);

            if (name === 'endDate' && end < start) {
                alert('End date cannot be earlier than start date.');
                return;
            }

            const difference = end - start;
            const hours = difference / (1000 * 60 * 60);
            const days = Math.ceil(hours / 24);
            const totalHours = days * 8;

            setNewGoal((prevState) => {
                const updatedTasks = prevState[0].tasks.map((task, index) => {
                    if (index === 0) {
                        return { ...task, totalHours: totalHours };
                    }
                    return task;
                });

                return [{ ...prevState[0], tasks: updatedTasks }];
            });
        }
    };

    const handleUserSelection = (user) => {
        setNewGoal((prevState) => {
            const taskMembers = prevState[0].tasks[0].taskMembers;
            const userIndex = taskMembers.findIndex((member) => member.memberId === user._id);

            if (userIndex > -1) {
                // User is already in taskMembers, so remove them
                taskMembers.splice(userIndex, 1);
            } else {
                // User is not in taskMembers, so add them
                taskMembers.push({
                    memberId: user._id,
                    profilePicture: user.profilePicture,
                    fullName: user.fullName,
                    role: user.role,
                });
            }

            const updatedTasks = prevState[0].tasks.map((task, index) => {
                if (index === 0) {
                    return { ...task, taskMembers };
                }
                return task;
            });

            return [{ ...prevState[0], tasks: updatedTasks }];
        });
    };

    const openMemberModal = (user) => {
        setSelectedMember(user);
        setMemberModalOpen(true);
    };

    const closeMemberModal = () => {
        setMemberModalOpen(false);
    };
        
        const showCongratulationsModal = () => {
            setshowCongratulations(true)
            }
            
            const closeCongratulations = () => {
                setshowCongratulations(false)
                closeFolderPrompt()
        // router.replace('/admin/project-group')
    }

    const handleCreateTeam = () => {
        if (newGoal) {
            addNewGoalOrTask({
                projectId: projectId,
                goal: newGoal,
                phaseIndex: selectedWorkphaseIndex,
                dataProcessor: (result) => {
                    if (result) {
                        showCongratulationsModal();
    
                        // Copy the first project data object
                        const project = { ...projectData[0] };
    
                        // Copy the workPhases array
                        const updatedWorkPhases = [...project.workPhases];
    
                        // Copy the goals array for the single work phase
                        const updatedGoals = [...updatedWorkPhases[0].goals, newGoal[0]];
    
                        // Update the goals array in the single work phase
                        updatedWorkPhases[0] = {
                            ...updatedWorkPhases[0],
                            goals: updatedGoals
                        };
    
                        // Update the project with the new work phases
                        const updatedProject = {
                            ...project,
                            workPhases: updatedWorkPhases
                        };
    
                        // Update the entire project data array
                        const updatedProjectData = [updatedProject];
    
                        // Set the new project data state
                        setProjectData(updatedProjectData);
                    }
                }
            });
        }
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
                        <CloseIcon onClick={handleCloseGoal} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 32, mr: 4 }} />

                        {/* Heading label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                            ADD GOAL TO WORK PHASE
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: '#BF0606', color: 'white' }}
                        onClick={handleCreateTeam}
                        >
                            DONE
                        </Button>
                    </Box>

                    {/* Body */}
                    <div style={{ width: '900px', overflowY: 'auto', maxHeight: '150vh', }}>
                        <div style={{ width: '900px', gap: '32px', top: "60px", padding: "0px 0px 64px 0px", backgroundColor: "FFFFFF" }}>
                            <div style={{ height: "64px", width: '900px', backgroundColor: "rgba(25, 211, 252, 0.1)", borderBottom: "1px solid #CCCCCC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)" }}>Goal under work phase ({selectedWorkphaseIndex + 1})</h2>
                            </div>

                            <div className="" style={{ height: '155px', width: '830px', gap: "10px" }}>
                                <div style={{ width: "735px", height: '143px', gap: "16px" }}>
                                    <p style={{ marginTop: "20px", marginBottom: "6px", marginLeft: "50px" }}>Goal Name</p>
                                    <input
                                        type="text"
                                        placeholder="goal Name"
                                        value={newGoal[0].goalName}
                                        onChange={(e) => setNewGoal([{ ...newGoal[0], goalName: e.target.value }])}
                                        className="rounded-lg ml-2"
                                        style={{ height: '90px', width: '735px', borderRadius: "8px", border: "1px solid #CCCCCC", marginLeft: "40px", padding: "10px" }}
                                    />
                                </div>
                            </div>

                            {/* Task under goal */}
                            {/* {formData.tasks.map((task, index) => ( */}
                            <div style={{ height: "454px", width: "900px", border: "0px 2px 0px 0px", marginTop: "10px" }}>

                                {/* Heading */}
                                <div style={{ height: "55px", width: "900px", border: "0px 0px 1px 0px", backgroundColor: "rgba(0, 128, 0, 0.1)", alignContent: "center", marginTop: "0px" }}>
                                    <h3 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)" }}>Task Under Goal</h3>
                                </div>

                                <div style={{ height: "201px", width: "900px", display: "flex", flexDirection: "row", alignContent: "center" }}>

                                    {/* Task Name section */}
                                    <div className="flex-1 mr-2" style={{ width: "520px", height: "143px", gap: "5px", left: "20px" }}>
                                        <h4 style={{ marginLeft: "40px", marginBottom: "10px", marginTop: "15px", color: "rgba(51, 51, 51, 1)" }}>
                                            Task Name
                                        </h4>
                                        <input
                                            type="text"
                                            placeholder="Write tast name here"
                                            value={newGoal[0].tasks[0]?.taskName || ''}
                                            onChange={handleChange}
                                            name="taskName"
                                            className="rounded-lg ml-2"
                                            style={{ height: '90px', width: '500px', top: "38px", borderRadius: "8px", border: "2px solid #CCCCCC", outline: "none", marginLeft: "40px", padding: "10px" }}
                                        />
                                    </div>
                                    {/* Budget section */}
                                    <div style={{ width: "259px", height: "153px", top: "24px", left: "520px" }}>
                                        <h4 className="mb-8 mt-6" style={{ marginBottom: "20px", marginTop: "15px", color: "rgba(51, 51, 51, 1)" }}>
                                            Task Budget<span style={{ color: "rgba(191, 6, 6, 1)" }}> (Optional)</span>
                                        </h4>
                                        <input
                                            type="text"
                                            placeholder="Eg #200,000"
                                            value={newGoal[0].tasks[0]?.taskBudget || ''}
                                            onChange={handleChange}
                                            name="taskBudget"
                                            className="rounded-lg ml-2"
                                            style={{ height: '58px', width: '201px', borderRadius: "8px", border: "2px solid #CCCCCC", outline: "none", padding: "10px" }}
                                        />
                                    </div>
                                </div>

                                {/* task schedule and duration */}
                                <div style={{ height: "201px", width: "900px", display: "flex", flexDirection: "row", alignContent: "center" }}>
                                    {/* Task schedule */}
                                    <div className="flex-1 mr-2" style={{ width: "428px", height: "178px", border: "0px 1px 0px 0px" }}>

                                        <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                                            <h4 style={{ color: "rgba(51, 51, 51, 1)", marginTop: "15px", marginBottom: "20px", marginLeft: "40px" }}>
                                                TASK SCHEDULE
                                            </h4>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: 'row', marginTop: '18px' }}>
                                            {/* Start Date */}
                                            <div className="flex-1" style={{ marginLeft: "20px", marginRight: "4px" }}>
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
                                                    value={newGoal[0].tasks[0]?.startDate || ''}
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
                                                    value={newGoal[0].tasks[0]?.endDate || ''}
                                                    name="endDate"
                                                    onChange={handleChange}
                                                    inputProps={{ min: newGoal[0].tasks[0]?.startDate }}
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
                                            <div className="flex-1" style={{ marginLeft: "20px", marginRight: "4px" }}>
                                                <h4 style={{ color: "rgba(141, 141, 141, 1)", marginBottom: "10px", marginLeft: "10px" }}>
                                                    Hours <span style={{ color: "rgba(0, 128, 0, 1)" }}>(max: {maxHours}hrs)</span>
                                                </h4>
                                                {/* Input field for Start Date */}
                                                <input
                                                    type="text"
                                                    placeholder="hours"
                                                    value={newGoal[0].tasks[0]?.hours || ''}
                                                    onChange={handleChange}
                                                    name="hours"
                                                    className="p-3 rounded-lg ml-2"
                                                    style={{ height: '56px', width: '170px', top: "34px", outline: "none", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                                />
                                            </div>
                                            {/* End Date */}
                                            {/* Minutes */}
                                            {/* Minutes */}
                                            <div className="flex-1" style={{ marginTop: "35px", marginLeft: "12px", marginRight: "6px" }}>
                                                <select
                                                    name="minutes"
                                                    className="rounded-lg ml-2"
                                                    style={{ height: '56px', width: '170px', outline: "none", top: "34px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                                    value={newGoal[0].tasks[0]?.minutes || ''} // Set the default value to "0" if task.minutes is falsy
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

                                {/* Staff Category */}
                                <div style={{ width: "900px", gap: "2px", }}>
                                    <div style={{ width: "900px", height: "140px" }}>
                                        <div style={{ height: "62px", width: "900px", gap: "10px", padding: "8px 24px 8px 24px" }} className="bg-gray-200 items-center flex justify-between">

                                            {/* staff and pagination */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <h2 style={{ fontWeight: "700", fontSize: "20px", lineHeight: "27.24px", color: "rgba(51, 51, 51, 1)" }}>Staff<span className="ml-2">({users.length})</span></h2>
                                                <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className={`bg-gray-100 cursor-pointer mr-4 ${currentPage === 0 ? 'pointer-events-none' : ''}`} onClick={prevPage}>
                                                        <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                                    </div>
                                                    <p style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>
                                                        {startIndex} - {endIndex} of {users.length}
                                                    </p>
                                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className={`bg-gray-100 cursor-pointer ml-4 ${currentPage === totalPages - 1 ? 'pointer-events-none' : ''}`} onClick={nextPage} >
                                                        <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Search bar */}
                                            <div>
                                                {isSearching ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: '8px', border: '1px solid #BF0606', padding: '4px 6px 7px 6px', backgroundColor: '#FBFBFB', marginRight: "20px" }}>
                                                        <IconButton onClick={handleSearchClick} sx={{ mr: { xs: 1, md: 2 } }}>
                                                            <SearchIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                                                        </IconButton>
                                                        <InputBase
                                                            value={searchText}
                                                            onChange={handleSearchInputChange}
                                                            placeholder="Search"
                                                            autoFocus
                                                        />
                                                        <IconButton onClick={handleCloseClick} sx={{ ml: { xs: 1, md: 2 } }}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <div style={{ backgroundColor: '#FBFBFB', width: "40px", height: "40px", padding: '17px 16px 17px 16px', borderRadius: '8px', marginRight: "30px", display: 'flex', justifyContent: 'center' }}>

                                                        <IconButton onClick={handleSearchClick} sx={{ mr: { xs: 1, md: 2 } }}>
                                                            <SearchIcon sx={{ fontSize: { xs: 20, md: 28 } }} className="ml-4" />
                                                        </IconButton>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                    {/* staff Array */}
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px", marginRight: "10px" }}>
                                        {users.slice(currentPage * 12, currentPage * 12 + 12).map(user => (
                                            <div key={user._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px", }}>
                                                <Checkbox size="medium"
                                                    // style={{ color: selectedUsers.some(selectedUser => selectedUser.userId === user._id)? 'rgba(191, 6, 6, 1)' : 'rgba(141, 141, 141, 1)', }}
                                                    onChange={() => handleUserSelection(user)}
                                                />
                                                <img src={user.profilePicture} alt="avatar" style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "5px" }} />
                                                <div>
                                                    <p style={{
                                                        fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px",
                                                        textAlign: "center", color: "#333333"
                                                    }}>{user.fullName}</p>
                                                    <p style={{
                                                        fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px",
                                                        textAlign: "center", color: "#8D8D8D"
                                                    }}>{user.role}</p>
                                                    <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "red" }} onClick={() => openMemberModal(user)}>see more...</p>
                                                </div>
                                                {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                                            </div>
                                        ))}

                                    </div>

                                </div>


                            </div>

                        </div>
                    </div>
                    <Modal open={showCongratulations} onClose={closeCongratulations} >

                        <Box sx={{ position: 'absolute', left: '50%', top: '40%', maxWidth: 'max-content' }}>

                            <Box align='center' sx={{
                                transform: 'translate(-50%,-50%)', bgcolor: 'white',
                                position: 'relative', maxWidth: 'max-content', px: 2, py: 3, borderRadius: '16px'
                            }}>

                                {/*Approved Icon */}
                                <IconElement  {...{ src: ApprovedSvg, style: { height: '60px', width: '60px' } }} />

                                {/* Message */}
                                <Typography align="center" sx={{
                                    mt: 4, fontSize: 24, fontWeight: 700, maxWidth: '80%',
                                    textTransform: 'capitalize'
                                }}>
                                    You have added a new goal to workPhase {selectedWorkphaseIndex + 1}
                                </Typography>

                                {/* Close icon */}
                                <Close sx={{
                                    position: 'absolute', cursor: 'pointer',
                                    fontSize: 34, right: '5%', top: '5%', color: '#8D8D8D'
                                }} onClick={closeCongratulations} />

                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </Slide>
        </Modal>
    );
}


