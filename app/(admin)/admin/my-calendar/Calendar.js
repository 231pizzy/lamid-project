'use client'

import { Box, Typography, Grid, Modal, IconButton } from "@mui/material";

import Calendar from 'react-calendar';

import { v4 as uuid } from 'uuid';
import styles from './Calendar.scss';

import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'react-calendar/dist/Calendar.css'

import { lighten } from '@mui/material/styles';

import NextArrow from "@mui/icons-material/KeyboardArrowRight";

import TimerIcon from "@mui/icons-material/TimerOutlined";
import Flag from "@mui/icons-material/Flag";
import PrevArrow from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";

import Circle from "@mui/icons-material/Circle";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openSnackbar, setPageTitle, toggleBlockView } from "@/Components/redux/routeSlice";

import ScheduleDetailView from "./accessories/ScheduleDetailView";

import ScheduleForm from "./accessories/ScheduleForm";

import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";

import Prompt from "@/Components/Prompt";
import { deleteSchedule, getSchedule } from "./helper";

export default function CalendarView({ hideHeading }) {
    const dispatch = useDispatch();

    const disabledButtons = useSelector(state => state.route.disabledButtons);

    const [state, setState] = useState({
        calendar: [], dataUpdates: 0,
        startDate: moment().toDate(),
        fullStartDate: moment().startOf('week').format('MMM Do'),
        fullEndDate: moment().startOf('week').add(6, 'days').format('MMM Do'),
        scheduleView: 'week', openModal: false,
        selectedEvent: {
            id: '', title: '', details: '',
            startTime: '', endTime: '', date: '', type: '',
            notify: '', repeat: '',
        },
        openEdit: false,
        openEvent: false, openPrompt: false, deleteId: null, deleteButtonId: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    }

    const updateData = () => {
        getSchedule({
            dataProcessor: (result) => {
                updateState({
                    calendar: result?.map(item => {
                        return { ...item, id: item?._id }
                    })
                });
            }
        })
    }

    useEffect(() => {
        /* Set Page title */
        if (!hideHeading) {
            dispatch(setPageTitle({ pageTitle: 'Calendar' }));
        }

        //get the schedules from the backend
        updateData()
    }, []);

    useEffect(() => {
        updateData()
    }, [state.dataUpdates])

    console.log('state', state);

    const schedule = state.calendar;

    const todaySchedule = useMemo(() => {
        return schedule.filter(schedule =>
            moment(schedule.date).format('yyyy-MM-DD') === moment().format('yyyy-MM-DD'))
    }, [schedule, state.calendar])

    console.log('todaySchedule', todaySchedule);

    const openForm = () => {
        updateState({ openModal: true });
    };

    const closeForm = () => {
        updateState({ openModal: false });
    };

    const localiser = momentLocalizer(moment);

    const events = schedule.map((item, index) => {
        return {
            ...item,
            start: moment(`${item.date} ${item.startTime}`).toDate(),
            end: moment(`${item.date} ${item.endTime}`).toDate(),
            title: item.label
        }
    });

    const image = (filename) => {
        const path = (process.env.NODE_ENV === 'production') ?
            `/images/profile-pictures/${filename}` :
            `http://localhost:3422/images/profile-pictures/${filename}`

        console.log('path', path)
        return path
    }

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const imageKey = uuid();

    const calendarColor = {
        task: '#19D3FC', event: '#03B203', reminder: '#F29323', birthday: '#7745E1'
    };

    const openEventDetails = (event) => {
        console.log('open event', event);
        updateState({
            openEvent: true,
            selectedEvent: {
                id: event.id, title: event.title, details: event.description,
                startTime: event.start,
                endTime: event.end,
                date: event.date, type: event.type,
                notify: event.notify, repeat: event.repeat,
                selectedStaff: event.selectedStaff
            }
        });
    }

    const closeEventDetails = (event) => {
        console.log('close details')
        updateState({
            openEvent: false
        });
    }

    const openEdit = () => {
        updateState({ openEvent: false, openEdit: true });
    }

    const closeEdit = (changed) => {
        updateState({ openEdit: false, dataUpdates: changed ? state.dataUpdates + 1 : state.dataUpdates });

    }

    const eventLabelComponent = ({ event }) => {
        console.log('event STarts', event.start)
        const timeDiff = moment(event.end).diff(moment(event.start), 'hours');
        return (
            <Box sx={{ height: '100%', width: '100%', }}
                onClick={(ev) => { openEventDetails(event) }} >
                {/* Title */}
                <Typography align='center' sx={{
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', wordBreak: 'break-all',
                    fontSize: 12, fontWeight: 600, mb: .5, px: .2
                }}>
                    {event.title}
                </Typography>
                {/* summary */}
                {Boolean(timeDiff) && <Typography align='center' sx={{
                    display: 'flex', justifyContent: 'center',
                    fontSize: 12, fontWeight: 500, mb: .5, color: '#8D8D8D'
                }}>
                    {event.description}
                </Typography>}
                {/* Time*/}
                <Typography align='center' sx={{
                    display: 'flex', justifyContent: 'space-around',
                    fontSize: 9, fontWeight: 600, color: '#8D8D8D'
                }}>
                    {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                </Typography>

                {/* pictures of participants */}
                {Boolean(timeDiff) &&
                    <Box sx={{ display: 'flex', position: 'absolute', bottom: 0, py: .5 }}>
                        <ProfileAvatarGroup {...{
                            emailArray: event.selectedStaff,
                            diameter: 30, max: 2, color: calendarColor[event.type],
                            bgcolor: lighten(calendarColor[event.type], 0.9)
                        }} />
                        {/*   <AvatarGroup max={4}>
                            {event.selectedStaff.map(staff =>
                                <Avatar sx={{ height: 20, width: 20, }} />
                            )}
                        </AvatarGroup> */}
                    </Box>}
            </Box>
        )
    };


    const calendarTimeGutterHeader = () => {
        return <Box sx={{ py: '2px', }}>
            <Typography align='center' sx={{
                lineHeight: '20px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: 12, fontWeight: 600, color: '#8D8D8D'
            }}>
                Time
            </Typography>
            <Typography align='center' sx={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: 10, fontWeight: 600, color: 'black'
            }}>
                (15mins)
            </Typography>
        </Box>
    }

    const openPrompt = (id, buttonId) => {
        updateState({ openPrompt: true, deleteId: id, deleteButtonId: buttonId });
    }

    const closePrompt = () => {
        updateState({ openPrompt: false, deleteId: null, deleteButtonId: null });
    }

    const handleDelete = () => {
        //  console.log('delete event', buttonId, id);
        deleteSchedule({
            id: state.deleteId, dataProcessor: (result) => {
                if (result) {
                    closePrompt()
                    closeEventDetails()
                    updateState({
                        calendar: state.calendar.filter(item => item.id !== state.deleteId)
                    })
                    dispatch(openSnackbar({ message: '1 schedule has been deleted', severity: 'success' }))
                }
            }
        })
        /*    deleteSchedule(state, state.deleteId, state.deleteButtonId, navigate,
               updateState, dispatch, remoteRequest,
               openSnackbar, toggleBlockView, closePrompt, closeEventDetails) */
    }

    const handleEdit = (id) => {
        console.log('edit event');
        openEdit();
    }

    const format1 = {
        dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd D', culture),
    }

    const nextWeek = (event) => {
        updateState({
            startDate: moment(state.startDate).add(1, 'week').toDate(),
            fullStartDate: moment(state.startDate).startOf('week').add(7, 'days').format('MMM Do'),
            fullEndDate: moment(state.startDate).startOf('week').add(13, 'days').format('MMM Do'),
        })
    }

    const prevWeek = (event) => {
        updateState({
            startDate: moment(state.startDate).add(-1, 'week').toDate(),
            fullStartDate: moment(state.startDate).startOf('week').add(-7, 'days').format('MMM Do'),
            fullEndDate: moment(state.startDate).startOf('week').add(-1, 'days').format('MMM Do'),
        })
    }


    const customItem = (props) => {
        return (
            props.value.getMinutes() === 0 ?
                <div className="custom-timegroup" >
                    <div   >{props.children}</div>
                </div> :
                <div>&nbsp;</div>
        )
    }


    return (
        <Box className='calendarClass' sx={{ maxWidth: '100%', maxHeight: '85vh', overflowY: 'hidden' }}>
            {/* Toolbar */}
            {!hideHeading && <Box sx={{
                bgcolor: 'white', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                px: 2, py: 2, mb: 2, display: 'flex'
            }}>
                <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 15 } }}>
                    CALENDAR
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
            </Box>}

            <Box sx={{
                width: '100%', maxWidth: '100%', px: { xs: 1, lg: 0 }, pt: hideHeading ? 2 : 0
            }}>
                <Grid container justifyContent={'center'}>
                    {/* calendar and today's schedule section */}
                    <Grid item xs={12} lg={4} xl={3.5} sx={{ mr: { md: 1 }, mb: 2, }}>

                        <Box sx={{ bgcolor: '#FBFBFB', borderRadius: '16px', }}>
                            {/* Simple calendar */}
                            <Box sx={{
                                borderRadius: '16px 16px 0px 0px',
                                border: '1px solid rgba(28, 29, 34, 0.1)'
                            }}>
                                {/* Heading */}
                                <Typography sx={{
                                    p: 2, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontWeight: 700, fontSize: { xs: 13, sm: 14 },
                                    border: '1px solid rgba(28, 29, 34, 0.1)',
                                    borderRadius: '16px 16px 0px 0px', bgcolor: '#EBEBEB'
                                }}>
                                    DATE & SCHEDULE
                                </Typography>

                                {/* The calendar goes here */}
                                <Box sx={{
                                    p: 2,
                                    alignItems: 'center',
                                    display: 'flex', justifyContent: 'center'
                                }}>
                                    <Calendar nextLabel={<NextArrow />} prevLabel={<PrevArrow />}
                                        next2Label={null} prev2Label={null}
                                        formatShortWeekday={(locale, date) => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]}
                                        value={new Date()} calendarType='gregory'
                                    />
                                </Box>

                                {/* Heading for today's schedule*/}
                                <Box sx={{
                                    p: 2, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontWeight: 700, fontSize: { xs: 13, sm: 14 },
                                    border: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: '#EBEBEB'
                                }}>
                                    TODAY'S SCHEDULE
                                </Box>

                                {/* Today's schedule goes here */}
                                <Box sx={{ p: 2, pb: 6, maxHeight: '25vh', overflowY: 'auto' }}>
                                    {todaySchedule.map(item => {
                                        return <Box sx={{
                                            border: '1px solid rgba(28, 29, 34, 0.1)',
                                            bgcolor: lighten(calendarColor[item.type], 0.9),
                                            px: 2, py: 2, display: 'block', alignItems: 'center'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {/* Time */}
                                                <Typography noWrap
                                                    sx={{
                                                        fontWeight: 600,
                                                        p: 0, my: 0, mr: 2, color: '#8D8D8D',
                                                        mb: 0, display: 'flex', alignItems: 'center',
                                                        fontSize: {

                                                            xs: 10, sm: 12
                                                        }
                                                    }}>
                                                    <TimerIcon sx={{ width: 16, height: 16, mr: .5, p: 0, my: 0 }} />
                                                    {item.startTime} - {item.endTime}

                                                </Typography>

                                                {/* Show for only tasks */}
                                                {item.type === 'task' && <Typography noWrap
                                                    sx={{
                                                        fontWeight: 600,
                                                        p: 0, my: 0, mr: 2, color: '#FF0000',
                                                        mb: 0, display: 'flex', alignItems: 'center',
                                                        fontSize: {
                                                            xs: 10, sm: 12
                                                        }
                                                    }}>
                                                    <Flag sx={{ width: 16, height: 16, mr: .5, p: 0, my: 0 }} />
                                                    Task Due by
                                                </Typography>}

                                                <Box sx={{ flexGrow: 1 }} />

                                                {/* Type of schedule */}
                                                <Typography noWrap
                                                    sx={{
                                                        fontWeight: 600,
                                                        px: .5, py: .3, my: 0, bgcolor: calendarColor[item.type],
                                                        mb: 0, display: 'flex', alignItems: 'center', color: 'white',
                                                        fontSize: { xs: 10, sm: 12 }, borderRadius: '4px'
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
                                        </Box>
                                    })}

                                    {!todaySchedule.length &&
                                        <Typography sx={{
                                            display: 'flex', justifyContent: 'center',
                                            fontWeight: 600, fontSize: 12
                                        }}>
                                            No schedule for today
                                        </Typography>}
                                </Box>
                            </Box>


                        </Box>
                    </Grid>

                    {/* Time sheet section */}
                    <Grid item xs={12} lg={7.5} xl={8} sx={{
                        display: { xs: 'none', md: 'block' }, mr: { md: 1 }, mb: 2,

                    }}>
                        <Box sx={{
                            display: 'block',
                            bgcolor: '#FBFBFB', borderRadius: '16px',
                            border: '1px solid rgba(28, 29, 34, 0.1)',
                            maxHeight: '77vh', overflowY: 'hidden',
                        }}>
                            {/* Heading section*/}
                            <Box sx={{
                                p: 2, display: 'flex', alignItems: 'center',
                                border: '1px solid rgba(28, 29, 34, 0.1)',
                                borderRadius: '16px 16px 0px 0px', bgcolor: 'white'
                            }}>
                                {/* previous week button */}
                                <IconButton sx={{
                                    mr: 2, bgcolor: '#1C1D221A',
                                    height: '28px', width: '28px',
                                    border: '1.5px solid rgba(28, 29, 34, 0.1)'
                                }} onClick={prevWeek}>
                                    <PrevArrow fontSize="small" sx={{ color: '#8D8D8D', height: 24, width: 24 }} />
                                </IconButton>

                                {/* Week date range*/}
                                <Typography sx={{
                                    display: 'flex', alignItems: 'center',
                                    fontWeight: 600, fontSize: { xs: 13, sm: 14 }
                                }}>
                                    {state.fullStartDate} - {state.fullEndDate}
                                </Typography>

                                {/* next week button */}
                                <IconButton sx={{
                                    ml: 2, bgcolor: '#1C1D221A',
                                    height: '28px', width: '28px',
                                    border: '1.5px solid rgba(28, 29, 34, 0.1)'
                                }} onClick={nextWeek} >
                                    <NextArrow fontSize="small" sx={{ color: '#8D8D8D', height: 24, width: 24 }} />
                                </IconButton>

                                <Box sx={{ flexGrow: 1 }} />

                                {/* Reminder color */}
                                <Typography sx={{
                                    display: 'flex', alignItems: 'center', mr: 2,
                                    fontWeight: 600, fontSize: { xs: 11, sm: 13 }
                                }}>
                                    <Circle sx={{ height: '12px', width: '12px', color: calendarColor['reminder'] }} />
                                    Reminder
                                </Typography>

                                {/* Event color */}
                                <Typography sx={{
                                    display: 'flex', alignItems: 'center', mr: 2,
                                    fontWeight: 600, fontSize: { xs: 11, sm: 13 }
                                }}>
                                    <Circle sx={{ height: '12px', width: '12px', color: calendarColor['event'] }} />
                                    Event
                                </Typography>

                                {/* Birthday color */}
                                <Typography sx={{
                                    display: 'flex', alignItems: 'center', mr: 2,
                                    fontWeight: 600, fontSize: { xs: 11, sm: 13 }
                                }}>
                                    <Circle sx={{ height: '12px', width: '12px', color: calendarColor['birthday'] }} />
                                    Birthday
                                </Typography>

                                {/* Add new schedule button */}
                                <Typography sx={{
                                    color: '#BF0606', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center',
                                    fontWeight: 600, fontSize: { xs: 11, sm: 12 }
                                }} onClick={openForm}>
                                    <AddIcon sx={{ height: '20px', width: '20px', color: '#BF0606' }} />
                                    Add New Schedule
                                </Typography>
                            </Box>

                            {/* TIme sheet for this week goes here */}
                            <Box sx={{ maxHeight: '70vh', overflowY: 'auto', }}>
                                <BigCalendar localizer={localiser} defaultView={'week'}
                                    events={events} views={['week']} step={15}
                                    defaultDate={moment('2023-04-21')}
                                    min={moment('2023-04-21 12:00 am').toDate()}
                                    max={moment('2023-04-27 11:59 pm').toDate()}


                                    date={state.startDate}
                                    onNavigate={(date) => { updateState({ startDate: date }) }}
                                    value={state.startDate}

                                    toolbar={false}

                                    timeslots={1}

                                    components={{
                                        event: eventLabelComponent,
                                        timeGutterHeader: calendarTimeGutterHeader,
                                        timeSlotWrapper: customItem

                                    }}

                                    dayLayoutAlgorithm={'no-overlap'}
                                    formats={format1}
                                    eventPropGetter={(event) => ({
                                        style: {
                                            backgroundColor: lighten(calendarColor[event.type], 0.9),
                                            color: calendarColor[event.type],
                                            fontSize: '0px',
                                            border: '0px', borderLeft: `4px solid ${calendarColor[event.type]}`
                                        }
                                    })}

                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 600,

                                    }}


                                />
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Pop up Create schedule form */}
            <Modal open={state.openModal} onClose={closeForm}>
                {/*    <CreateSchedule
                    closeForm={closeForm} scheduleArr={state.calendar}
                    stateController={updateState} /> */}
                <ScheduleForm {...{
                    closeForm: closeForm, scheduleArr: state.calendar, stateController: updateState
                }} />
            </Modal>

            {/* Pop up Details of an event with delete and edit buttons */}
            <Modal open={state.openEvent} onClose={closeEventDetails}>
                {/*   {EventDetailView()} */}
                <ScheduleDetailView closeEventDetails={closeEventDetails} handleEdit={handleEdit}
                    handleDelete={openPrompt} selectedEvent={state.selectedEvent} calendarColor={calendarColor} />
            </Modal>

            {/* Pop up Edit schedule form */}
            {/*   <Modal open={state.openEdit} onClose={closeEdit}>
                <EditSchedule
                    closeForm={closeEdit} scheduleArr={state.calendar}
                    stateController={updateState} schedule={state.selectedEvent} />
            </Modal> */}
            <Modal open={state.openEdit} onClose={closeEdit}>
                <ScheduleForm {...{
                    closeForm: closeEdit, scheduleArr: state.calendar, scheduleRecord: state.selectedEvent,
                    stateController: updateState, editSchedule: true
                }} />
            </Modal>

            {state.openPrompt && <Prompt {...{
                open: state.openPrompt, onClose: closePrompt, message: 'You are About to delete this Schedule',
                onProceed: handleDelete, onCancel: closePrompt, proceedTooltip: 'This schedule will be permanently deleted',
                cancelTooltip: 'No changes will be made'
            }} />}
        </Box>
    )
}
