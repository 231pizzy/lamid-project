'use client'

import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/AddOutlined";
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import CreateTeamModal from "@/Components/CreateTeamModal/CreateTeamModal";
import Loader from "@/Components/Loader"; 
import { ProfileAvatar } from "@/Components/ProfileAvatar";

function Team() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true initially
    const [loadingTeamIndex, setLoadingTeamIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Update team members first
                const updateResponse = await fetch('/api/teams', {
                    method: 'PUT' 
                });
                if (!updateResponse.ok) {
                    throw new Error('Failed to update team members');
                }

                // Fetch teams after updating team members
                const teamsResponse = await fetch('/api/teams');
                if (teamsResponse.ok) {
                    const teamsData = await teamsResponse.json();
                    setTeams(teamsData); // Update the state with the fetched teams data
                } else {
                    throw new Error('Failed to fetch teams');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading to false after data fetching completes
            }
        };

        fetchData();
    }, []);
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleTeamClick = (index) => {
        setLoadingTeamIndex(index);
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            {/* Tool bar section */}
            <Box sx={{ px: 3, py: 2, display: 'flex', mb: 2, bgcolor: '#F5F5F5', borderBottom: '1px solid rgba(28, 29, 34, 0.1)' }}>
                <Typography sx={{ mr: 4, pb: .5, fontWeight: 700, fontSize: { xs: 15, md: 17 }, color: 'black' }}>
                    TEAMS
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton sx={{ height: 30, width: 30 }} onClick={openModal} style={{ backgroundColor: '#BF0606' }}>
                    <AddIcon sx={{ fontSize: 26, color: 'white' }} />
                </IconButton>
                <CreateTeamModal open={isModalOpen} handleCancel={closeModal} />
            </Box>

            {/* Body */}
            {loading ? (
                <Loader />
            ) : teams.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.5, md: 3 }, py: 2, flexWrap: 'wrap' }}>
                    {/* Mapping through teams */}
                    {teams.map((team, index) => (
                        <div key={index} onClick={() => handleTeamClick(index)}>        
                        <Link href={`/admin/teamDetails?id=${team._id}&name=${encodeURIComponent(team.name)}&color=${encodeURIComponent(team.color)}&avatar=${encodeURIComponent(team.teamAvatar)}`} key={index}>
                            <Box key={index} style={{ width: "380px", height: "176px", border: '1px solid #1C1D221A', borderRadius: "16px", gap: "24px" }} className="ml-4 cursor-pointer mb-6">
                                {/* Heading */}
                                <Box style={{ borderBottom: '1px solid #1C1D221A', height: "80px", Padding: "12px 24px", gap: "16px" }} className="flex px-2 py-1 items-center ml-4">
                                    {/* Avatar group */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2 }}>
                                        <img src={team.teamAvatar} alt="Team" className="rounded-full object-cover mt-2" style={{ height: '56px', width: '56px' }} />
                                    </Box>
                                    {/* Team name */}
                                    <Typography sx={{ fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>
                                        {team.name}
                                    </Typography>
                                </Box>
                                {/* Team members Avatar */}
                                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2 }}>
                                    {/* Render avatars of team members */}
                                    {team.members.map((member, index) => (
                                        <img key={index} src={member.profilePicture} alt={member.fullName} className="rounded-full object-cover mt-2" style={{ height: '48px', width: '48px', border: `1px solid ${team.color}`, marginLeft: index > 0 ? '-10px' : '0' }} />
                                        // <ProfileAvatar key={index} src={member.avatar} fullName={member.fullName} className="rounded-full object-cover mt-2" style={{ height: '48px', width: '48px', border: `1px solid ${team.color}`, marginLeft: index > 0 ? '-10px' : '0' }} />
                                    ))}
                                </Box>
                            </Box>
                        </Link>
                        </div>
                    ))}
                      {loadingTeamIndex !== null && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-25 z-50">
                    <Loader /> {/* Replace Loader with your loading component */}
                </div>
            )}
                </Box>
            ) : (
                <Typography align="center" sx={{ fontWeight: 700, mx: 5, my: 2, fontSize: 19, textTransform: 'uppercase' }}>
                    No teams at the moment.
                </Typography>
            )}
        </Box>
    );
}

export default Team;

