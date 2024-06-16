import { Box, Button, Grid, Paper, Typography } from "@mui/material";

import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import { ProfileAvatar } from "@/Components/ProfileAvatar";

export default function Staff({ handleGoto, staffArray, handleViewProfile }) {
    const buildStaff = (label, data, lettercase) => {
        return <Typography noWrap
            sx={{ width: {}, mb: 2, color: '#8D8D8D', fontWeight: 600, fontSize: 13 }}>
            {label}:
            <Typography noWrap sx={{
                ml: .3, display: 'inline', color: '#333333', fontWeight: 600, fontSize: 13, textTransform: lettercase
            }}>
                {data}
            </Typography>
        </Typography>
    }

    return <Grid item xs={12} md={6} lg={4} xl={5} sx={{ mt: 4, pr: { sm: 2, xl: 2 } }} >
        <Box disableGutters sx={{
            borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
            width: { xs: '100%', md: '360px', xl: '600px' }, maxWidth: '100%', bgcolor: '#FFFFFF',
            border: '1px solid rgba(28, 29, 34, 0.1)',
        }}>
            {/* Heading */}
            <Box sx={{
                px: 2, py: 2, display: 'flex', borderBottom: '1px solid #1C1D221A',
                justifyContent: 'center', alignItems: 'center'
            }}>
                <Typography noWrap sx={{
                    alignItems: 'center', display: 'flex',
                    fontStyle: 'normal', fontWeight: 700
                }}>
                    STAFF
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                <Button id='/admin/staff' sx={{ p: 0, fontSize: { xs: 12, sm: 14 } }} onClick={handleGoto}>
                    Go to Staff
                    <NextArrow fontSize="small" sx={{ ml: -.5 }} />
                </Button>
            </Box>

            {/* Body */}
            <Paper sx={{
                height: '400px', overflowY: 'scroll', borderRadius: ' 0px 0px 16px 16px', '&::-webkit-scrollbar': { width: 0 },
            }}>
                <Grid container  >
                    {/* Items */}
                    {staffArray.map(profile => {
                        return <Grid item xs={12} xl={6}  >
                            <Box sx={{
                                my: 1, borderRadius: '16px', cursor: 'pointer', position: 'relative',
                                border: '1px solid rgba(28, 29, 34, 0.1)', m: 2,
                            }} onClick={() => { handleViewProfile(profile?.email) }}>
                                <Typography sx={{
                                    fontSize: 13, color: '#BF0606', bgcolor: '#FBEDED', position: 'absolute',
                                    left: 0, top: 0, width: 'max-content', borderRadius: '16px 0 0 0', py: .4, px: 1
                                }}>
                                    {profile?.role}
                                </Typography>

                                <Box sx={{
                                    display: 'block', justifyContent: 'center',
                                    px: 2, py: 2, alignItems: 'center'
                                }}>
                                    {/* profile picture */}
                                    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                                        <img src= {profile?.profilePicture} alt="" style={{height: '75px', width: '75px',}} className="rounded-full object-cover mt-2"/>
                                    </Box>

                                    {/* Name */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                                        <Typography noWrap sx={{
                                            width: '100%',
                                            display: 'flex', justifyContent: 'center',
                                            textTransform: 'uppercase', mb: 2, fontSize: 14,
                                            fontWeight: 600, maxWidth: '300px', overflowX: 'clip'
                                        }}>
                                            {profile?.fullName}
                                        </Typography>
                                    </Box>

                                    {/* Body */}
                                    <Box sx={{
                                        display: 'block',
                                        width: { xs: '100%', }, overflowX: 'clip'
                                    }}>
                                        {buildStaff('Team', profile?.team, 'capitalize')}
                                        {buildStaff('Project-Group', profile?.workGroups?.join(',') || 'None', 'capitalize')}
                                        {buildStaff('Email', profile?.email, 'lowercase')}
                                    </Box>
                                </Box>

                            </Box>
                        </Grid>
                    })}
                </Grid>
            </Paper>
        </Box>
    </Grid>
}