'use client'
import { Box, Button, Modal, Typography, Slide, Checkbox } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import { ModalTask } from "./ModalTask";
import { MemberDetails } from "./MemberDetails";
import { ProfileAvatar } from "@/Components/ProfileAvatar";

export default function StepThree({ open, handleCancel, formData, handleSaveTask, teamId, handleAddMember, handleNext }) {
    const [isInputVisible, setInputVisible] = useState(false);
    const [teamData, setTeamData] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [activeTaskIndex, setActiveTaskIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    // const usersPerPage = 10;
    console.log('data', teamData)

    // // Logic to get users for the current page
    // const indexOfLastUser = currentPage * usersPerPage;
    // const indexOfFirstUser = indexOfLastUser - usersPerPage;
    // const currentUsers = teamData.members ? teamData.members.slice(indexOfFirstUser, indexOfLastUser) : [];


    // // Logic to paginate between pages
    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = teamData.members ? Math.ceil(teamData.members.length / 12) : 0;

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    // Function to handle previous page click
    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Calculate range of displayed users
    const startIndex = currentPage * 12 + 1;
    const endIndex = Math.min((currentPage + 1) * 12, teamData.members?.length || 0);


    const openModal = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const openMemberModal = (member) => {
        setSelectedMember(member);
        setMemberModalOpen(true);
    };

    const closeMemberModal = () => {
        setMemberModalOpen(false);
    };

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/goals/?teamId=${teamId}`);
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
    }, [teamId]);

    // Function to handle setting active task index
    const handleTaskClick = (index) => {
        setActiveTaskIndex(index);
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
                        {/* Render the Preview button conditionally */}
                        {formData.tasks.every(task => task.taskMembers.length > 0) && (
                            <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: '#BF0606', color: 'white' }} onClick={handleNext}>
                                Preview
                            </Button>
                        )}
                    </Box>

                    {/* Body */}
                    <div style={{ width: '900px', overflowY: 'auto', maxHeight: '150vh', }}>
                        <div style={{ width: '900px', gap: '32px', top: "60px", padding: "0px 0px 64px 0px", backgroundColor: "FFFFFF" }}>
                            <div style={{ height: "64px", width: '900px', backgroundColor: "rgba(25, 211, 252, 0.1)", borderBottom: "1px solid #CCCCCC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ marginLeft: "50px", color: "rgba(51, 51, 51, 1)" }}>Goal</h2>
                                {isInputVisible ?
                                    <ArrowDropUpIcon onClick={() => setInputVisible(false)} style={{ marginRight: "14px", color: "rgba(191, 6, 6, 1)" }} /> :
                                    <ArrowDropDownIcon onClick={() => setInputVisible(true)} style={{ marginRight: "14px", color: "rgba(191, 6, 6, 1)" }} />
                                }
                            </div>

                            {isInputVisible &&
                                <div className="" style={{ height: '155px', width: '830px', gap: "10px" }}>
                                    <div style={{ width: "735px", height: '143px', gap: "16px" }}>
                                        <p className="mt-6 mb-2 ml-12">Goal Name</p>
                                        <input
                                            type="text"
                                            placeholder={formData.goalName}
                                            value={formData.goalName}
                                            disabled
                                            className="border p-2 rounded-lg ml-2"
                                            style={{ height: '90px', width: '735px', borderRadius: "8px", border: "1px solid #CCCCCC", marginLeft: "40px" }}
                                        />
                                    </div>
                                </div>
                            }

                            {/* Task preview */}
                            {/* Heading */}
                            <div style={{ height: "55px", width: "900px", border: "0px 0px 1px 0px", backgroundColor: "rgba(200, 9, 200, 0.08)", alignContent: "center", marginTop: "0px" }}>
                                <h3 style={{ marginLeft: "50px" }}>Assign Task</h3>
                            </div>
                            <div style={{
                                height: '25px', width: '300px', backgroundColor: 'rgba(191, 6, 6, 0.08)', alignContent: "center",
                            }}>
                                <p style={{ color: 'rgba(191, 6, 6, 0.7)', marginLeft: "24px" }}>Please select a task to be assigned</p>
                            </div>
                            <div style={{ height: "182px", width: "auto", border: "0px 2px 0px 0px", gap: "44px", display: "flex", overflowX: "auto", maxWidth: '150vh' }}>

                                {/* Mapping formData.tasks */}
                                {formData.tasks.map((task, index) => {
                                    if (task.taskName !== '') {
                                        const startDate = new Date(task.startDate);
                                        const endDate = new Date(task.endDate);
                                        const startMonth = startDate.toLocaleString('default', { month: 'short' });
                                        const endMonth = endDate.toLocaleString('default', { month: 'short' });
                                        const startDay = startDate.getDate();
                                        const endDay = endDate.getDate();

                                        return (
                                            <div key={index} style={{ height: "118px", minWidth: "250px", borderRadius: "8px", padding: "0px, 0px, 12px, 0px", marginLeft: "6px", marginBottom: "4px", marginTop: "30px", border: activeTaskIndex === index ? "2px solid rgba(191, 6, 6, 1)" : "1px solid black", }} onClick={!loading ? () => handleTaskClick(index) : null} className="cursor-pointer">
                                                <div style={{ height: "40px", borderRadius: "8px, 8px, 0px, 0px", backgroundColor: "rgba(37, 122, 251, 0.07)" }} className="flex justify-between items-center">
                                                    <h3 className="ml-4">{`Task ${index + 1}`}</h3>
                                                    <p style={{ color: "rgba(191, 6, 6, 1)", cursor: 'pointer', marginRight: "3px" }} onClick={() => openModal(task)}>see more...</p>
                                                </div>
                                                {isModalOpen && <ModalTask task={selectedTask} open={isModalOpen} onClose={closeModal} onSave={handleSaveTask} />}
                                                <div className="flex justify-between items-center">
                                                    <div className="bg-gray-100 rounded-md items-center justify-center mt-2 ml-2" style={{ width: "150px", height: "55px" }}>
                                                        <h4 className="text-sm text-center">Date</h4>
                                                        <p className="ml-2 text-lg">{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</p>
                                                    </div>
                                                    <div className="bg-gray-100 rounded-md items-center justify-center mt-2 mr-2" style={{ width: "70px", height: "55px" }}>
                                                        <h4 className="text-sm text-center">Duration</h4>
                                                        <p className="ml-2 text-lg">{`${task.hours}hrs`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return null; // If taskName is empty, return null to exclude it from rendering
                                    }
                                })}
                            </div>

                            {/* Member Array */}
                            {activeTaskIndex !== null && (
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px", marginRight: "10px" }}>
                                    <div style={{ height: "62px", width: "900px", gap: "10px", padding: "8px 24px 8px 24px" }} className="bg-gray-200 items-center flex justify-between">

                                        {/* staff and pagination */}
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <h2 style={{ textDecorationColor: "#333333" }}>MEMBERS<span className="ml-2">({teamData.members.length})</span></h2>
                                            <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className={`bg-gray-100 cursor-pointer mr-4 ${currentPage === 0 ? 'pointer-events-none' : ''}`} onClick={prevPage}>
                                                    <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                                </div>
                                                <p>{startIndex} - {endIndex} of {teamData.members.length}</p>
                                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className={`bg-gray-100 cursor-pointer ml-4 ${currentPage === totalPages - 1 ? 'pointer-events-none' : ''}`} onClick={nextPage} >
                                                    <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {(formData.tasks[activeTaskIndex].taskMembers && formData.tasks[activeTaskIndex].taskMembers.length === 0) ? (
                                        // Render checkboxes unchecked
                                        teamData.members.slice(currentPage * 12, (currentPage + 1) * 12).map(member => (
                                            // {users.slice(currentPage * 12, currentPage * 12 + 12).map(user => (
                                            <div key={member._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                            
                                                <Checkbox size="medium"
                                                    style={{ color: 'rgba(141, 141, 141, 1)', }}
                                                    onChange={() => handleAddMember(activeTaskIndex, member._id, member.profilePicture, member.fullName, member.role)}
                                                    checked={false}
                                                />
                                                {/* <img alt="avatar" src={member.avatar} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "10px" }} /> */}

                                                <img src={member.profilePicture} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "0px" }} />
                                                <div>
                                                    <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px", textAlign: "center", color: "#333333" }}>{member.fullName}</p>
                                                    <p style={{ fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px", textAlign: "center", color: "#8D8D8D" }}>{member.role}</p>
                                                    <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "red" }} onClick={() => openMemberModal(member)}>Details...</p>
                                                </div>
                                                {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                                            </div>

                                        ))
                                    ) : (
                                        // Render checkboxes with pre-checked members
                                        teamData.members.slice(currentPage * 12, (currentPage + 1) * 12).map(member => (
                                            <div key={member._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                                   
                                                <Checkbox size="medium"
                                                    style={{ color: formData.tasks[activeTaskIndex].taskMembers.some(taskMember => taskMember.memberId === member._id) ? 'rgba(191, 6, 6, 1)' : 'rgba(141, 141, 141, 1)', }}
                                                    onChange={() => handleAddMember(activeTaskIndex, member._id, member.profilePicture, member.fullName, member.role)}
                                                    checked={formData.tasks[activeTaskIndex].taskMembers.some(taskMember => taskMember.memberId === member._id)} 
                                                />
                                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white rounded-sm opacity-0 checked:opacity-100"></span>

                                                <img src={member.profilePicture} style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "5px" }} />
                                                <div>
                                                    <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px", textAlign: "center", color: "#333333" }}>{member.fullName}</p>
                                                    <p style={{ fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px", textAlign: "center", color: "#8D8D8D" }}>{member.role}</p>
                                                    <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "rgba(191, 6, 6, 1)" }} onClick={() => openMemberModal(member)}>Details...</p>
                                                </div>
                                                {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}


                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal >
    );
}


