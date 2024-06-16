'use client'

import { Box, Button, Slide, Typography, TextField, Checkbox } from "@mui/material";


import { useEffect, useState } from "react";

import Close from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { addNewTask } from "../helper";
import { MemberDetails } from "@/Components/CreateGoal/MemberDetails";
import { openSnackbar } from "@/Components/redux/routeSlice";
import { useDispatch, } from "react-redux";


export function AddTask({ viewTitle, closeView, goal, updateGoal }) {
    const [teamData, setTeamData] = useState({});
    const [loading, setLoading] = useState(true)
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [formData, setFormData] = useState({ taskName: "", taskBudget: "", startDate: "", endDate: "", hours: "", minutes: "", taskStatus: "To do", taskMembers: [] });
    const [totalHours, setTotalHours] = useState(0)
    const dispatch = useDispatch();

    // Logic to get users for the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = teamData.members ? teamData.members.slice(indexOfFirstUser, indexOfLastUser) : [];


    // Logic to paginate between pages
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // setLoading(true)
                const response = await fetch(`/api/goals/?teamId=${goal.teamId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTeamData(data);
                    setLoading(false)
                } else {
                    console.error('Failed to fetch team data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };

        fetchTeamData();
    }, [goal.teamId]);

    const saveData = () => {

        addNewTask({
            goalId: goal._id, formData: formData, dataProcessor: (result) => {
                closeView()
                dispatch(openSnackbar({ message: '! new task created', severity: 'success' }))
                updateGoal(result);
            }
        })
    }

    const handleSave = () => {
        if (!formData.taskName || !formData.startDate || !formData.endDate || !formData.hours) {
            alert("Please fill all fields");
        } else if (formData.taskMembers.length === 0) {
            alert("Please asign task to at least one member");
        } else {
            saveData();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'hours' && parseInt(value) > totalHours) {
            alert(`Hours cannot exceed ${totalHours}hrs`);
            return;
        }

        if (name === 'minutes') {
            // If hours and totalHours are equal, prevent selecting minutes more than 0
            if (parseInt(formData.hours) === totalHours && parseInt(value) !== 0) {
                alert("Minutes cannot be more than 0 when hours and totalHours are equal.");
                return;
            }
        }

        // Calculate total hours based on start and end dates
        if (name === 'startDate' || name === 'endDate') {
            const start = new Date(name === 'startDate' ? value : formData.startDate);
            const end = new Date(name === 'endDate' ? value : formData.endDate);

            const difference = end - start;
            const hours = difference / (1000 * 60 * 60);
            const days = Math.ceil(hours / 24);
            const totalHours = days * 8;
            setTotalHours(totalHours);
        }
    };

    const toggleMemberSelection = (memberId, profilePicture, fullName, role) => {
        // Check if the member is already selected
        const isSelected = formData.taskMembers.some(member => member.memberId === memberId);

        // Create a new member object
        const newMember = { memberId, profilePicture, fullName, role };

        // If selected, remove it; otherwise, add it
        if (isSelected) {
            const updatedMembers = formData.taskMembers.filter(member => member.memberId !== memberId);
            setFormData(prevState => ({ ...prevState, taskMembers: updatedMembers }));
        } else {
            const updatedMembers = [...formData.taskMembers, newMember];
            setFormData(prevState => ({ ...prevState, taskMembers: updatedMembers }));
        }
    };


    const openMemberModal = (member) => {
        setSelectedMember(member);
        setMemberModalOpen(true);
    };

    const closeMemberModal = () => {
        setMemberModalOpen(false);
    };


    return <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
            position: 'absolute', top: '0%', right: '0%', width: { xs: '70%', md: '70%', lg: '46%', },
        }}>
            {/* Toolbar */}
            <Box sx={{
                display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', mb: 2,
                py: 3, px: { xs: 1.5, sm: 4 }, flexWrap: 'nowrap', borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white'
            }}>
                {/* Close form */}
                <Close onClick={closeView}
                    sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 35, }} />

                {/* Heading label */}
                <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, }, mx: 3 }}>
                    {viewTitle}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button variant="contained" sx={{
                }} onClick={handleSave} >
                    Done
                </Button>
            </Box>


            {/* Body */}
            <div style={{ maxHeight: "700px", overflowY: 'auto', }}>
                <div style={{ height: "201px", width: "900px", display: "flex", flexDirection: "row", alignContent: "center" }}>

                    {/* Task Name section */}
                    <div className="flex-1 mr-2" style={{ width: "520px", height: "143px", gap: "5px", left: "20px" }}>
                        <h4 style={{ marginLeft: "40px", marginBottom: "10px", marginTop: "15px" }}>
                            Task Name
                        </h4>
                        <input
                            type="text"
                            placeholder="Write tast name here"
                            value={formData.taskName}
                            onChange={handleInputChange}
                            name="taskName"
                            className="rounded-lg ml-2"
                            style={{ height: '90px', outline: "none", width: '500px', top: "38px", borderRadius: "8px", border: "2px solid #CCCCCC", marginLeft: "40px", padding: "10px" }}
                        />
                    </div>
                    {/* Budget section */}
                    <div style={{ width: "259px", height: "153px", top: "24px", left: "520px" }}>
                        <h4 className="mb-8 mt-6" style={{ marginBottom: "20px", marginTop: "15px" }}>
                            Task Budget<span style={{ color: "red" }}> (Optional)</span>
                        </h4>
                        <input
                            type="text"
                            placeholder="Eg #200,000"
                            value={formData.taskBudget}
                            onChange={handleInputChange}
                            name="taskBudget"
                            className="rounded-lg ml-2"
                            style={{ height: '58px', width: '201px', outline: "none", borderRadius: "8px", border: "2px solid #CCCCCC", padding: "10px" }}
                        />
                    </div>
                </div>

                <div style={{ height: "201px", width: "900px", display: "flex", flexDirection: "row", alignContent: "center" }}>
                    {/* Task schedule */}
                    <div className="flex-1 mr-2" style={{ width: "428px", height: "178px", border: "0px 1px 0px 0px" }}>

                        <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                            <h4 style={{ color: "#333333", marginTop: "15px", marginBottom: "20px", marginLeft: "40px" }}>
                                TASK SCHEDULE
                            </h4>
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', marginTop: '18px' }}>
                            {/* Start Date */}
                            <div className="flex-1" style={{ marginLeft: "20px", marginRight: "4px" }}>
                                <h4 style={{ color: "#8D8D8D", marginBottom: "10px", marginLeft: "10px" }} >
                                    Start Date
                                </h4>
                                {/* Input field for Start Date */}
                                <TextField
                                    variant="outlined"
                                    type="date"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 174 }}
                                    value={formData.startDate}
                                    name="startDate"
                                    onChange={handleInputChange}
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
                                    value={formData.endDate}
                                    name="endDate"
                                    onChange={handleInputChange}
                                    inputProps={{ min: formData.startDate }}
                                />
                            </div>
                        </div>

                    </div>
                    {/* task duration */}
                    <div className="flex-1 mr-2" style={{ width: "428px", height: "178px", border: "0px 1px 0px 0px" }}>

                        <div style={{ height: "56px", alignContent: "center" }} className="bg-gray-100">
                            <h4 style={{ color: "#333333", marginTop: "15px", marginBottom: "20px", marginLeft: "40px" }}>
                                SET THE TASK DURATION
                            </h4>
                        </div>
                        <div className="flex flex-row mt-4">
                            {/* Start Date */}
                            <div className="flex-1" style={{ marginLeft: "20px", marginRight: "4px" }}>
                                <h4 style={{ color: "#8D8D8D", marginBottom: "10px", marginLeft: "10px" }}>
                                    Hours <span style={{ color: "green" }}>(max: {totalHours}hrs)</span>
                                </h4>
                                {/* Input field for Start Date */}
                                <input
                                    type="text"
                                    placeholder="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    name="hours"
                                    className="p-3 rounded-lg ml-2"
                                    style={{ height: '56px', outline: "none", width: '170px', top: "34px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                />
                            </div>
                            {/* End Date */}
                            {/* Minutes */}
                            {/* Minutes */}
                            <div className="flex-1" style={{ marginTop: "35px", marginLeft: "12px", marginRight: "6px" }}>
                                <select
                                    name="minutes"
                                    className="rounded-lg ml-2"
                                    style={{ height: '56px', width: '170px', top: "34px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: "10px" }}
                                    value={formData.minutes}
                                    onChange={handleInputChange}
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

                {!loading && (
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px", marginRight: "10px" }}>
                        <div style={{ height: "62px", width: "900px", gap: "10px", padding: "8px 24px 8px 24px" }} className="bg-gray-200 items-center flex justify-between">
                            {/* staff and pagination */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h2 style={{ textDecorationColor: "#333333" }}>MEMBERS<span className="ml-2">({teamData.members.length})</span></h2>
                                <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className="bg-gray-100 cursor-pointer mr-4" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                        <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                    </div>
                                    <p>{indexOfFirstUser + 1} - {Math.min(indexOfLastUser, teamData.members.length)} of {teamData.members.length}</p>
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className="bg-gray-100 cursor-pointer ml-4" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastUser >= teamData.members.length}>
                                        <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {teamData.members.map(member => (
                            <div key={member._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "16px", marginLeft: "12px" }}>
    
                                <Checkbox size="medium"
                                    style={{ color: formData.taskMembers.some(taskMember => taskMember.memberId === member._id) ? 'rgba(191, 6, 6, 1)' : 'rgba(141, 141, 141, 1)', }}
                                    onChange={() => toggleMemberSelection(member._id, member.profilePicture, member.fullName, member.role)} checked={formData.taskMembers.some(taskMember => taskMember.memberId === member._id)}
                                />

                                <img src={member.profilePicture} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "10px" }} />
                                <div>
                                    <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px", textAlign: "center", color: "#333333" }}>{member.fullName}</p>
                                    <p style={{ fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px", textAlign: "center", color: "#8D8D8D" }}>{member.role}</p>
                                    <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "red" }} onClick={() => openMemberModal(member)}>Details...</p>
                                </div>
                                {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Box>
    </Slide>

}