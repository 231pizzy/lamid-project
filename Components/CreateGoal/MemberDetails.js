'use client'
import { Box, IconButton, Modal } from "@mui/material"
import Close from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { ProfileAvatar } from "@/Components/ProfileAvatar";
import { Padding } from "@mui/icons-material";

console.log('modal message opened');

export function MemberDetails({ open, onClose, member }) {
    const [realEducation, setRealEducation] = useState([]);
    const [realWorkExperience, setRealWorkExperience] = useState([]);

    useEffect(() => {
        // Function to extract real data from nested objects
        const extractRealData = () => {
            // Extract real education data
            const educationData = member.education.flatMap(edu => Object.values(edu));
            setRealEducation(educationData);

            // Extract real work experience data
            const workExperienceData = member.workExperience.flatMap(exp => Object.values(exp));
            setRealWorkExperience(workExperienceData);
        };

        extractRealData();
    }, [member]);
// Function to format date to "Month Year" format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
};

// Function to format date range
const formatDates = (startDate, endDate) => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    return `${formattedStartDate} - ${formattedEndDate}`;
};

    return <Modal open={open} onClose={onClose}>
        <Box sx={{
            height: '600px', width: "500px", transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 1, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%',
        }}>
            <Box sx={{ position: 'relative' }} style={{ display: "flex", height: "90px", flexDirection: 'column', justifyContent: 'space-between', Padding: "20px", margin: "10px" }} >
                {/* Close button */}
                <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
                    <div>
                        <ProfileAvatar src={member.avatar} fullName={member.fullName} style={{ height: '80px', width: '80px', border: `1px solid #0BC5EE1A` }} />
                    </div>
                    <div style={{ marginLeft: "25px" }}>
                        <h3>{member.fullName}</h3>
                        <p style={{ color: "#8D8D8D" }}>{member.email}</p>
                        <h5 style={{ color: "red" }}>{member.role}</h5>
                    </div>
                </div>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 0, top: 0, color: 'black' }}>
                    <Close sx={{ fontSize: 35, }} />
                </IconButton>
            </Box>

            {/* Qualification headind */}
            <div style={{ backgroundColor: "#FEE3E3" }}>
                <h1 style={{ color: "#BF0606", padding: "5px", marginLeft: "20px" }}>Qualification</h1>
            </div>

            {/* Scroll body */}
            <div style={{ maxHeight: "440px", overflowY: "auto" }}>
                {/* Qualifications body */}
                <div style={{ marginLeft: "20px", marginTop: "10px", marginBottom: "10px", color: "red" }}>
                    <h3>Experience</h3>
                </div>
                <div>
                    {/* Map user's work experience */}
                    {realWorkExperience.map((exp, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <div style={{ marginLeft: "20px" }}>
                                    <p style={{ font: "bold", marginBottom: "5px" }}>{exp.role}</p>
                                    <h5 style={{marginBottom: "5px"}}>{exp.organisation}</h5>
                                    <p style={{ color: "#8D8D8D", fontSize: "13px"  }}>{formatDates(exp.startDate, exp.endDate)}</p>
                                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <p style={{ fontSize: "14px" }}>{exp.summary}</p>
                                    </div>
                                </div>
                            </div>
                    ))}
    
                </div>


                {/* Education */}
                <div style={{ marginLeft: "20px", marginTop: "10px", marginBottom: "10px", color: "red" }}>
                    <h3>Education</h3>
                </div>
                <div>
                    {/* Map user's education */}
                    {realEducation.map((edu, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <div style={{ marginLeft: "20px" }}>
                                <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{edu.qualification} {edu.course}</p>
                                <h5 style={{marginBottom: "5px"}}>{edu.institution}</h5>
                                <p style={{ color: "#8D8D8D", fontSize: "13px"  }}>{formatDates(edu.startDate, edu.endDate)}</p>
                                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                    <p style={{ fontSize: "14px" }}>{edu.summary}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills and Languages */}
                <div style={{ display: "flex", marginLeft: "20px", marginTop: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "170px", border: "1px solid #8D8D8D", borderRadius: "10px", }}>
                        <div style={{ marginLeft: "10px", color: "red", margin: "7px" }}>
                            <h3>Skills</h3>
                        </div>
                        <div>
                            {member.skills && member.skills.map((exp, index) => (

                                <div key={index} style={{ marginLeft: "10px" }}>
                                    <h5>{exp.value} <span style={{color: "#8D8D8D", fontSize: "11px" }}>({exp.years}years)</span></h5>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: "170px", border: "1px solid #8D8D8D", borderRadius: "10px", marginLeft: "20px" }}>
                        <div style={{ marginLeft: "10px", color: "red", margin: "7px" }}>
                            <h3>Languages</h3>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                            <h5>Node</h5>
                            <h5>Node</h5>
                            <h5>Node</h5>
                            <h5>Node</h5>
                            <h5>Node</h5>
                        </div>
                    </div>

                </div>

            </div>

        </Box>
    </Modal>
}
