'use client'
import { Box, IconButton, Modal, TextField } from "@mui/material"
import Close from '@mui/icons-material/Close';
import { ProfileAvatar } from "@/Components/ProfileAvatar";
import { useState } from "react";

console.log('modal message opened');

export function PreviewModal({ open, onClose, task }) {
    const [previewTask, setPreviewTask] = useState(task);

    // Format start date
    const startDate = new Date(previewTask.startDate);
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const startDay = startDate.getDate();

    // Format end date
    const endDate = new Date(previewTask.endDate);
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    const endDay = endDate.getDate();

    return <Modal open={open} onClose={onClose}>
        <Box sx={{
            height: '500px', width: "500px", transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 1, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%',
        }}>
            <Box sx={{ position: 'relative' }}>
                {/* Close button */}
                <div className="flex flex-wrap items-center justify-between">
                    <h2 className="ml-4 uppercase">Task Details</h2>
                    <IconButton onClick={onClose} sx={{ color: 'black' }}>
                        <Close sx={{ fontSize: 35 }} />
                    </IconButton>
                </div>

                <Box sx={{ p: 2 }} style={{ overflowY: "auto", }}>
                    <div style={{ alignContent: "center" }}>
                        {/* Task Name section */}
                        <div className="bg-gray-100" style={{ height: "35px", border: "1xp solid gray", alignContent: "center" }}>
                            <h4 className="mt-0 mb-2 ml-2">
                                Task Name
                            </h4>
                        </div>
                        <div className="ml-4 mt-2 mb-2 " style={{ gap: "5px" }}>
                            <p>{previewTask.taskName}</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="bg-gray-100" style={{ height: "35px", border: "1xp solid gray", alignContent: "center" }}>
                        <h4 className="mb-2 mt-1 ml-2">
                            Schedule and Budget
                        </h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", alignContent: "center", marginTop: "10px" }}>
                        <div className="flex-1 mr-1 ml-2 bg-gray-50" style={{ gap: "5px", border: "1px solid gray", alignContent: "center", borderRadius: "8px" }}>
                            <h2 className="text-center">Date</h2>
                            <p className="text-center">{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</p>
                        </div>

                        <div className="flex-1 mr-1 ml-4" style={{ gap: "5px", border: "1px solid gray", alignContent: "center", borderRadius: "8px" }}>
                            <h2 className="text-center">Time - Bank</h2>
                            <p className="text-center text-sm">{previewTask.hours}hrs : {previewTask.minutes === "" ? '0' : previewTask.minutes} minutes</p>
                        </div>

                        <div className="flex-1 mr-1 ml-4" style={{ gap: "5px", border: "1px solid gray", alignContent: "center", borderRadius: "8px" }}>
                            <h2 className="text-center">Amount</h2>
                            <p className="text-center">{previewTask.taskBudget}</p>
                        </div>
                    </div>

                    {/* Assignee */}
                    <div className="bg-gray-100 mt-4 mb-4" style={{ height: "35px", border: "1xp solid gray", alignContent: "center" }}>
                        <h4 className="mb-2 mt-1 ml-2">Assignee</h4>
                    </div>
                    <div className="ml-4" style={{ maxHeight: '170px', overflowY: 'auto' }}>
                        <div className="flex flex-wrap">
                            {previewTask.taskMembers.map((member, index) => (
                                <div key={index} className="flex items-center mb-2 mr-4" style={{ border: "1px solid gray", borderRadius: "8px", height: "60px", width: "200px", }}>
                                    {/* Avatar */}
            
                                    <img src={member.profilePicture} className="rounded-full object-cover ml-2" style={{ height: '45px', width: '45px', border: `1px solid ${team.color}`,}} />

                                    {/* Name and Role */}
                                    <div className="ml-6">
                                        <p className="font-bold">{member.name}</p>
                                        <p className="text-sm text-gray-500 text-center">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </Box>
            </Box>
        </Box>
    </Modal>
}
