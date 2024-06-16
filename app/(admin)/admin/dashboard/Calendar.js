'use client'

import { Box, Button, Grid, Paper, Typography, lighten } from "@mui/material";

import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import Flag from "@mui/icons-material/Flag";
import TimerIcon from "@mui/icons-material/TimerOutlined";

const calendarColor = {
    task: '#19D3FC', event: '#03B203', reminder: '#F29323', birthday: '#7745E1'
};

export default function Calendar({ handleGoto, schedule }) {
    console.log('schedule', schedule)
    return <Grid item xs={12} md={6} lg={4} xl={3} sx={{ mt: 4, }} >
        <Box sx={{
            borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
            width: { xs: '100%', md: '360px' }, maxWidth: '100%', bgcolor: '#FFFFFF',
            border: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            {/* Heading */}
            <Box sx={{
                px: 2, py: 2, display: 'flex', justifyContent: 'center',
                borderBottom: '1px solid #1C1D221A', alignItems: 'center'
            }}>
                <Typography noWrap sx={{
                    alignItems: 'center', display: 'flex',
                    fontStyle: 'normal', fontWeight: 700,
                }}>
                    CALENDAR
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                <Button id='/admin/my-calendar' sx={{ p: 0, fontSize: { xs: 12, sm: 14 } }} onClick={handleGoto}>
                    Go to Calendar
                    <NextArrow fontSize="small" sx={{ ml: -.5 }} />
                </Button>
            </Box>

            {/* Body */}
            <Paper sx={{
                height: '400px', overflowY: 'scroll', borderRadius: ' 0px 0px 16px 16px', '&::-webkit-scrollbar': { width: 0 },
            }}>
                {/* Items */}
                {schedule?.map(item => {
                    console.log('item', item)
                    return <Box id='/admin/my-calendar' sx={{
                        border: '1px solid rgba(28, 29, 34, 0.1)', cursor: 'pointer',
                        bgcolor: lighten(calendarColor[item?.type], 0.9),
                        px: 2, py: 2, display: 'block', alignItems: 'center'
                    }} onClick={handleGoto}>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography noWrap
                                sx={{
                                    fontWeight: 600,
                                    p: 0, my: 0, mr: 2, color: '#8D8D8D',
                                    mb: 0, display: 'flex', alignItems: 'center',
                                    fontSize: { xs: 10, sm: 12 }
                                }}>
                                <TimerIcon sx={{ width: 16, height: 16, mr: .5, p: 0, my: 0 }} />
                                {item?.startTime}-{item?.endTime}

                            </Typography>

                            {item.type === 'task' && <Typography noWrap
                                sx={{
                                    fontWeight: 600,
                                    p: 0, my: 0, mr: 2, color: '#FF0000',
                                    mb: 0, display: 'flex', alignItems: 'center',
                                    fontSize: { xs: 10, sm: 12 }
                                }}>
                                <Flag sx={{ width: 16, height: 16, mr: .5, p: 0, my: 0 }} />
                                Task Due by
                            </Typography>}

                            <Box sx={{ flexGrow: 1 }} />

                            <Typography noWrap
                                sx={{
                                    fontWeight: 600,
                                    px: .5, py: .3, my: 0, bgcolor: calendarColor[item.type],
                                    mb: 0, display: 'flex', alignItems: 'center', color: 'white',
                                    fontSize: { xs: 10, sm: 12 }, borderRadius: '8px'
                                }}>
                                {item.type}
                            </Typography>
                        </Box>
                        <Typography sx={{
                            fontWeight: 600, mb: .4,
                            fontSize: { xs: 12, sm: 14 },
                            color: calendarColor[item.type]
                        }}>
                            {item.label}
                        </Typography>
                        <Typography noWrap sx={{
                            fontWeight: 500,
                            fontSize: { xs: 11, sm: 13 },
                            color: '#8D8D8D'
                        }}>
                            {item.description}
                        </Typography>

                        {!schedule?.length &&
                            <Typography sx={{
                                display: 'flex', justifyContent: 'center',
                                fontWeight: 600, fontSize: 12
                            }}>
                                No schedule for today
                            </Typography>}

                    </Box>
                })}

            </Paper>
        </Box>
    </Grid >
}