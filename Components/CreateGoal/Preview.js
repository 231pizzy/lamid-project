'use client'
import { Box, Button, Modal, Typography, Slide, CircularProgress, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import { ModalTask } from "./ModalTask";
import { MemberDetails } from "./MemberDetails";
import { PreviewModal } from "./PreviewModal";
import { ProfileAvatar } from "@/Components/ProfileAvatar";
import Loader from "../Loader";

export default function Preview({ open, handleCancel, formData, handleSubmit, loading }) {
    const [isInputVisible, setInputVisible] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeTaskIndex, setActiveTaskIndex] = useState(null);

    const openModal = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
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
                            <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: 'rgba(160, 160, 160, 1)', color: 'white' }} onClick={handleSubmit}  disabled={loading} >
                            {loading ? <CircularProgress size={20} style={{color: "white"}}/> : 'Done'}
                            </Button>
                    </Box>
                    {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-25 z-50">
                    <Loader /> 
                </div>
            )}
                    {/* Body */}
                    <div style={{ width: '900px', overflowY: 'auto', maxHeight: '150vh', }}>
                        <div style={{ width: '900px', gap: '32px', top: "60px", padding: "0px 0px 64px 0px", backgroundColor: "FFFFFF" }}>
                            <div style={{ height: "64px", width: '900px', backgroundColor: "rgba(25, 211, 252, 0.1)", borderBottom: "1px solid #CCCCCC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 className="ml-6">Goal</h2>
                                {isInputVisible ?
                                    <ArrowDropUpIcon onClick={() => setInputVisible(false)} style={{marginRight: "14px", color: "rgba(191, 6, 6, 1)"}}/> :
                                    <ArrowDropDownIcon onClick={() => setInputVisible(true)} style={{marginRight: "14px", color: "rgba(191, 6, 6, 1)"}}/>
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
                                <h3 style={{ marginLeft: "24px" }}>Assign Task</h3>
                            </div>
                            <div style={{ height: "250px", width: "auto", border: "0px 2px 0px 0px", gap: "44px", display: "flex", overflowX: "auto", maxWidth: '150vh' }}>

                                {/* Mapping formData.tasks */}
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
                                            <div key={index} style={{ height: "155px", minWidth: "250px", borderRadius: "8px", padding: "0px, 0px, 12px, 0px", marginLeft: "6px", marginBottom: "4px", marginTop: "30px", border: activeTaskIndex === index ? "2px solid #C809C8" : "1px solid black", }}>
                                                <div style={{ height: "40px", borderRadius: "8px, 8px, 0px, 0px", backgroundColor: "rgba(37, 122, 251, 0.07)" }} className="flex justify-between items-center">
                                                    <h3 style={{marginLeft: "16px", color: "rgba(51, 51, 51, 1)"}}>{`Task ${index + 1}`}</h3>
                                                    <p className="cursor-pointer" style={{color: "rgba(191, 6, 6, 1)", marginRight: "16px"}} onClick={() => openModal(task)}>see more...</p>
                                                </div>
                                                {isModalOpen && <PreviewModal task={selectedTask} open={isModalOpen} onClose={closeModal}/>}
                                                <div className="flex justify-between items-center">
                                                    <div className="bg-gray-100 rounded-md items-center justify-center mt-2 ml-2" style={{ width: "150px", height: "55px" }}>
                                                        <h4 className="text-sm font-bold text-center" style={{color: "rgba(93, 93, 93, 1)"}}>Date</h4>
                                                        <p className="ml-2 text-lg" style={{color: "rgba(51, 51, 51, 1)"}}>{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</p>
                                                    </div>
                                                    <div className="bg-gray-100 rounded-md items-center justify-center mt-2 mr-2" style={{ width: "70px", height: "55px" }}>
                                                        <h4 className="text-sm text-center font-bold" style={{color: "rgba(93, 93, 93, 1)"}}>Duration</h4>
                                                        <p className="ml-2 text-lg" style={{color: "rgba(51, 51, 51, 1)"}}>{`${task.hours}hrs`}</p>
                                                    </div>
                                                </div>
                                                {/* Team members Avatar */}
                                                <div>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <p className="ml-4 text-blue-600" style={{ color: 'rgba(37, 122, 251, 1)', marginRight: "2px" }}>Assigned to</p>
                                                        {/* Render avatars of team members */}
                                                        {task.taskMembers.slice(0, 5).map((member, index) => (
                                                            <img key={index} src={member.profilePicture} alt={member.fullName} className="rounded-full object-cover mt-2" style={{ height: '35px', width: '35px', border: `1px solid ${team.color}`, marginLeft: index > 0 ? '-10px' : '0' }} />
                                                            // <ProfileAvatar key={index} src={member.avatar} fullName={member.fullName} className="rounded-full object-cover mt-2" style={{ height: '35px', width: '35px', border: `1px solid ${team.color}`, marginLeft: index > 0 ? '-10px' : '0', marginTop: "2px" }} />
                                                        ))}
                                                    </Box>
                                                </div>

                                            </div>
                                        );
                                    } else {
                                        return null; // If taskName is empty, return null to exclude it from rendering
                                    }
                                })}

                            </div>

                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
}


