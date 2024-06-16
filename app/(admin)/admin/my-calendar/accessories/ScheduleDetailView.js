'use client'

import { Box, Slide, Typography, lighten } from "@mui/material";

import Close from '@mui/icons-material/Close';
import TimerIcon from "@mui/icons-material/TimerOutlined";
import CalendarIcon from "@mui/icons-material/CalendarMonth";

import moment from "moment";

import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";

import IconElement from "@/Components/IconElement";

const DeleteSvg = '/icons/DeleteSvg.svg'
const EditSvg = '/icons/EditSvg.svg'

function ScheduleDetailView(prop) {
    /* Props: closeEventDetails, handleEdit, handleDelete, selectedEvent,calendarColor */
    const closeEventDetails = () => {
        prop.closeEventDetails();
    }

    const handleEdit = (id) => {
        prop.handleEdit(id);
    }

    const handleDelete = (id, buttonId) => {
        prop.handleDelete(id, buttonId)
    }

    const eventColor = prop.calendarColor[prop.selectedEvent.type] ?? '#03B203';


    return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            width: { xs: '90%', sm: '70%', md: '50%', lg: '30%' },
            bgcolor: 'white', borderRadius: '16px 0 0 16px', height: '100vh',
            pb: 2, position: 'absolute', top: 0, right: 0,
        }}>
            <Box >
                {/* Title bar*/}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 4, py: 2 }}>
                    {/* Close button */}
                    <Close onClick={closeEventDetails} sx={{ cursor: 'pointer', fontSize: 24, color: 'black' }} />
                    {/* Label */}
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 }, ml: 4 }}>
                        SCHEDULE DETAILS
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Edit button */}
                    <IconElement {...{
                        src: EditSvg, onclick: (ev) => { handleEdit(prop.selectedEvent.id) },
                        style: { cursor: 'pointer', }
                    }} />

                    {/* Delete button */}
                    <IconElement {...{
                        src: DeleteSvg, onclick: (ev) => { handleDelete(prop.selectedEvent.id, 'deleteEvent') },
                        style: { cursor: 'pointer', marginLeft: '24px' }
                    }} />
                </Box>

                {/* Details */}
                {/* Heading */}
                <Typography sx={{
                    bgcolor: 'rgba(28, 29, 34, 0.04)', fontWeight: 600,
                    fontSize: { xs: 13, md: 14 }, px: 3, py: 1, display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between'
                }}>
                    Details

                    {/* Type of schedule */}
                    <Typography sx={{
                        fontWeight: 600, borderRadius: '8px',
                        bgcolor: lighten(eventColor, 0.9),
                        color: eventColor, ml: 2,
                        fontSize: { xs: 13, md: 14 }, px: 1.5, py: .75
                    }}>
                        {prop.selectedEvent.type}
                    </Typography>
                </Typography>

                {/* Content */}
                <Box sx={{ px: 3, py: 1.5 }}>
                    {/* Title  */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                        {/* Title */}
                        <Typography sx={{
                            fontWeight: 600, pb: 1,
                            fontSize: { xs: 15, md: 18 },
                        }}>
                            {prop.selectedEvent.title}
                        </Typography>
                    </Box>

                    {/* Details of schedule */}
                    <Typography sx={{
                        fontWeight: 400,
                        fontSize: { xs: 13, md: 14 },
                    }}>
                        {prop.selectedEvent.details}
                    </Typography>
                </Box>

                {/* Date and time */}
                <Box>
                    {/* Heading */}
                    <Typography sx={{
                        bgcolor: 'rgba(28, 29, 34, 0.04)', fontWeight: 600,
                        fontSize: { xs: 13, md: 14 }, px: 3, py: 1
                    }}>
                        Date & time
                    </Typography>

                    {/* Content */}
                    <Box sx={{ display: 'flex', px: 3, py: 2, alignItems: 'center' }}>
                        {/* Date */}
                        <Typography sx={{
                            display: 'flex', fontWeight: 600,
                            fontSize: { xs: 13, md: 14 }, mr: 4, alignItems: 'center'
                        }}>
                            <CalendarIcon sx={{ fontSize: 17, mr: 1 }} />
                            {moment(prop.selectedEvent.date).format('Do MMM yyyy')}
                        </Typography>

                        {/* Time */}
                        <Typography sx={{
                            display: 'flex', fontWeight: 600,
                            fontSize: { xs: 13, md: 14 }, alignItems: 'center'
                        }}>
                            <TimerIcon sx={{ fontSize: 17, mr: 1 }} />
                            {moment(prop.selectedEvent.startTime).format('h:mma')} - {moment(prop.selectedEvent.endTime).format('h:mma')}
                        </Typography>
                    </Box>
                </Box>

                {/* Participants */}
                <Box>
                    {/* Heading */}
                    <Typography sx={{
                        bgcolor: 'rgba(28, 29, 34, 0.04)', fontWeight: 600,
                        fontSize: { xs: 13, md: 14 }, px: 3, py: 1
                    }}>
                        Participants
                    </Typography>

                    <Box sx={{ display: 'flex', px: 3, py: 2 }}>
                        <ProfileAvatarGroup {...{
                            emailArray: prop.selectedEvent.selectedStaff,
                            diameter: 50, max: 2, color: eventColor,
                            bgcolor: lighten(eventColor, 0.9)
                        }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    </Slide>
    )
}

export default ScheduleDetailView;