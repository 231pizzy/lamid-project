'use client'
import { Box, Button, Card, Grid, Paper, Typography, lighten } from "@mui/material";
import Loader from "@/Components/Loader"; 
import Link from 'next/link';
import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import { ProfileAvatar } from "@/Components/ProfileAvatar";
import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Team({ handleGoto, projectGroups }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [loadingTeamIndex, setLoadingTeamIndex] = useState(null);
    const router = useRouter();

    const gotoProjectGroup = (data) => {
        //  const projectId = event.target.id;
        if (data?.id) {
            router.push(`/admin/project-group-detail/?projectId=${data?.id}&&projectName=${data?.name}&&projectColor=${data?.color}`,
             /*    { state: { projectId: data?.id, projectName: data?.name, projectColor: data?.color } } */)
        }
    }

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

    const handleTeamClick = (index) => {
        setLoadingTeamIndex(index);
    };

    return <Grid item xs={12} md={6} xl={3.5} sx={{ mt: 4, pr: { sm: 2, xl: 0 } }}>
        <Box disableGutters sx={{
            borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
            width: { xs: '100%', md: '360px' }, maxWidth: '100%', bgcolor: '#FFFFFF',
            border: '1px solid rgba(28, 29, 34, 0.1)',
        }}>
            {/* Heading */}
            <Card sx={{
                px: 2, py: 2, display: 'flex', justifyContent: 'center',
                alignItems: 'center', borderRadius: '16px 16px 0px 0px', borderBottom: '1px solid #1C1D221A'
            }}>
                <Typography noWrap sx={{
                    alignItems: 'center', display: 'flex',
                    fontSize: 15, fontWeight: 700
                }}>
                    TEAMS
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                <Button id='/admin/team' sx={{ p: 0, fontSize: { xs: 12, sm: 14 } }} onClick={handleGoto}>
                    Go to Team
                    <NextArrow fontSize="small" sx={{ ml: -.5 }} />
                </Button>
            </Card>

            {/* Body */}
            <Paper sx={{
                height: '400px', overflowY: 'auto', borderRadius: ' 0px 0px 16px 16px',
                '&::-webkit-scrollbar': { width: 0 },
            }}>
                {/* Items */}
                {loading ? (
                <Loader />
            ) : teams.length > 0 ? (
                <Box sx={{
                    height: '400px', overflowY: 'auto', borderRadius: ' 0px 0px 16px 16px',
                    '&::-webkit-scrollbar': { width: 0 },
                }}>
                    {/* Mapping through teams */}
                    {teams.map((team, index) => (
                        <div key={index} onClick={() => handleTeamClick(index)}>        
                        <Link href={`/admin/teamDetails?id=${team._id}&name=${encodeURIComponent(team.name)}&color=${encodeURIComponent(team.color)}&avatar=${encodeURIComponent(team.teamAvatar)}`} key={index}>
                            <Box key={index} style={{ width: "320px", height: "140px", border: '1px solid #1C1D221A', borderRadius: "16px", gap: "24px" }} className="ml-4 cursor-pointer mb-6">
                                {/* Heading */}
                                <Box style={{ borderBottom: '1px solid #1C1D221A', height: "80px", Padding: "12px 24px", gap: "16px" }} className="flex px-2 py-1 items-center ml-4">
                                    {/* Avatar group */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 2 }}>
                                        <img src={team.teamAvatar} alt="Team" className="rounded-full object-cover mt-2" style={{ height: '36px', width: '36px' }} />
                                    </Box>
                                    {/* Team name */}
                                    <Typography sx={{ fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>
                                        {team.name}
                                    </Typography>
                                </Box>
                                {/* Team members Avatar */}
                                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                                    {/* Render avatars of team members */}
                                    {team.members.map((member, index) => (
                                        <img key={index} src={member.profilePicture} alt={member.fullName} className="rounded-full object-cover mt-2" style={{ height: '35px', width: '35px', border: `1px solid ${team.color}`, marginLeft: index > 0 ? '-10px' : '0' }} />
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

            </Paper>
        </Box>
    </Grid>
}