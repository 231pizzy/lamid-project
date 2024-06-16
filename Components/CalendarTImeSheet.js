'use client'

import { Box, Typography, Avatar, } from "@mui/material";

import { lighten } from '@mui/material/styles';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';


import styles from './Calendar.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'react-calendar/dist/Calendar.css'

import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import PrevArrow from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import TimerIcon from "@mui/icons-material/TimerOutlined";
import TodoIcon from "@mui/icons-material/ThumbUpOutlined";
import InProgressIcon from "@mui/icons-material/NearMeOutlined";

import NewAdd from "@mui/icons-material/LoupeOutlined";
import ReviewIcon from "@mui/icons-material/StarOutline";

import { useEffect, useMemo, useState } from "react";

import { ProfileAvatar } from "./ProfileAvatar";


const stateLabels = {
    'toDo': {
        label: 'To Do', color: '#19D3FC', icon: <TodoIcon fontSize="small" sx={{ height: 16, width: 16, color: '#19D3FC' }} />,
        iconBgColor: 'rgba(25, 211, 252, 0.2)', border: '0.675px solid #19D3FC'
    },
    'inProgress': {
        label: 'In Progress', color: '#19D3FC', icon: <InProgressIcon fontSize="small"
            sx={{ height: 16, width: 16, color: '#F29323' }} />,
        iconBgColor: 'rgba(242, 147, 35, 0.2)',
        border: '0.675px solid #F29323'
    },
    'review': {
        label: 'Review', color: '#C809C8', icon: <ReviewIcon fontSize="small"
            sx={{ height: 16, width: 16, color: '#C809C8' }} />,
        iconBgColor: 'rgba(200, 9, 200, 0.2)',
        border: '0.675px solid #C809C8'
    },
    'new': {
        label: 'New', color: '#BF0606', icon: <NewAdd fontSize="small"
            sx={{ height: 16, width: 16, color: '#BF0606' }} />,
        iconBgColor: '#ffb5b5',
        border: '0.675px solid #BF0606'
    },
}

const Phours = [12];
Array.from({ length: 4 }, (_, index) => Phours.push(index + 1));

export function CalendarTimeSheet(prop) {

    const [state, setState] = useState({
        calendar: prop.calendar, fullName: prop?.fullName, calendarFor: prop?.calendarFor,
        startDate: prop?.startDate ?? moment().toDate(), profilePicture: prop?.profilePicture,
        endDate: prop?.endDate, usedTimeToday: '0', selectedDate: moment(prop?.date).format('yyyy-MM-DD').toString(),
        usedTimeThisWeek: '0', fullStartDate: moment().startOf('week').format('MMM Do'),
        fullEndDate: moment().startOf('week').add(6, 'days').format('MMM Do'),
        scheduleView: 'week', openModal: false, openEdit: false,
        openEvent: false, addedIds: [], timeSelectionError: '', promptType: '',
        constraints: [], constrainedTime: '', date: prop?.startDate ?? moment().toDate(),
        currentStart: prop?.startDate, showAddTimeButton: prop?.showAddTimeButton
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    }

    useEffect(() => {
        updateState({
            calendar: prop.calendar, usedTimeToday: getUsedTimeToday(state.startDate),
            usedTimeThisWeek: getUsedTimeThisWeek(state.date), fullName: prop?.fullName,
            calendarFor: prop?.calendarFor, profilePicture: prop?.profilePicture, startDate: prop?.startDate,
            endDate: prop?.endDate, currentStart: prop?.startDate, date: prop?.startDate,
            showAddTimeButton: prop?.showAddTimeButton
        })
    }, [prop])

    useEffect(() => {
        updateState({ usedTimeToday: getUsedTimeToday(state.startDate), usedTimeThisWeek: getUsedTimeThisWeek(state.date) })
    }, [state.date])

    //const schedule = state.calendar;

    const localiser = momentLocalizer(moment);

    const openEventDetails = (event) => {
        console.log('open event', event);
        updateState({
            openEvent: true,
            selectedEvent: {
                id: event.id, title: event.title, details: event.description,
                startTime: event.start,
                endTime: event.end,
                date: event.date, type: event.type,
                notify: event.notify, repeat: event.repeat
            }
        });
    }

    const eventLabelComponent = ({ event }) => {
        const stateData = stateLabels[event.state];
        const minutes = (Number(event.hours) * 60) + Number(event.minutes)
        return (
            (Number(event.hours) === 0 && Number(event.minutes)) ?
                <Box sx={{
                    height: '100%', width: '100%', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(28, 29, 34, 0.1)', borderRadius: '16px'
                }}
                    onClick={(ev) => { openEventDetails(event) }} >
                    <Typography align='center' sx={{
                        fontWeight: 600, color: 'black',
                        fontSize: { xs: 11, md: 14 }, p: 1,
                    }}>
                        {event.title}
                    </Typography>
                </Box>
                :
                <Box sx={{
                    display: (!Number(event.hours) && !Number(event.minutes)) ? 'none' : 'block',
                    height: '100%', width: '100%', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(28, 29, 34, 0.1)', borderRadius: '16px'
                }}
                    onClick={(ev) => { openEventDetails(event) }} >
                    {/* Heading */}
                    <Box sx={{
                        /* display: 'flex',  */borderRadius: '16px 16px 0px 0px', px: 1, py: .5,
                        justifyContent: 'space-between', bgcolor: 'rgba(28, 29, 34, 0.1)'
                    }}>
                        {/* State of the task */}
                        <Typography sx={{
                            color: 'black', p: .5, fontWeight: 600, fontSize: { xs: 11, md: 11 }, justifyContent: 'center',
                            display: 'flex', borderRadius: '8px', alignItems: 'center', bgcolor: lighten(stateData.iconBgColor, 0.3)
                        }}>
                            {/* <Avatar sx={{
                                mr: 1,
                                height: '16px', width: '16px',
                                background: stateData.iconBgColor, border: stateData.border
                            }}>
                                {stateData.icon}
                            </Avatar> */}
                            {stateData.label}
                        </Typography>

                        {/* Time */}
                        <Typography sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, textAlign: 'center',
                            fontSize: { xs: 11, md: 11 }, borderRadius: '10px', p: .5,
                            color: '#8D8D8D', display: 'flex', alignItems: 'center',
                        }}>
                            {/*   <TimerIcon sx={{ fontSize: 13, mr: .5 }} /> */}
                            {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')} ({formatUsedTime(minutes)})
                        </Typography>
                    </Box>

                    {/* Task name/label */}
                    <Typography align={(Number(event.hours) <= 1) ? 'center' : 'inherit'} sx={{
                        fontWeight: 600, color: 'black',
                        fontSize: { xs: 11, md: 14 }, p: 1,
                    }}>
                        {event?.title}
                    </Typography>

                    {/* Footer: date and budget */}
                    <Box sx={{
                        display: 'flex', px: 1, position: 'absolute', right: 0, left: 0,
                        justifyContent: 'space-between', bottom: 0, mx: .5, zIndex: 1
                    }}>

                        {/* Budget */}
                        <Typography sx={{
                            fontWeight: 600, px: .5,
                            fontSize: { xs: 11, md: 13 }, borderRadius: '10px', border: '1px solid rgba(28, 29, 34, 0.1)',
                            bgcolor: '#F5F5F5', color: 'black', display: 'flex'
                        }}>
                            {(Number(event.budget).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }).slice(0, -3) || "")}
                        </Typography>

                    </Box>
                </Box>
        )
    };

    const calendarTimeGutterHeader = () => {
        return <Box sx={{ py: '2px', px: 10 }}>
            <Typography align='center' sx={{
                lineHeight: '20px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: 14, fontWeight: 600, color: 'black'
            }}>
                Time
            </Typography>
        </Box>
    }

    const format1 = {
        dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd, MMM Do', culture),
    }

    const formatUsedTime = (timeInMinutes) => {
        const hours = Math.trunc(timeInMinutes / 60);
        const hourStr = hours ? hours > 1 ? `${hours}hrs` : `${hours}hrs` : '';
        const mins = timeInMinutes % 60;
        const minStr = mins ? mins > 1 ? `${mins}mins` : `${mins}min` : '';

        const time = `${hourStr} ${minStr}`
        // console.log('used time is', timeInMinutes, time)

        return time;
    }

    const getUsedTimeToday = (date) => {
        let timeInMinutes = 0
        prop.calendar.map(task => {
            if (moment(task.startDate, 'yyyy-MM-DD').isSame(moment(date), 'day')) {
                const minutes = Number(task.minutes);
                //console.log('time diff', timeDiff, task.endTime, task.startTime);
                timeInMinutes += minutes;
            }
            return false
        });

        const availableTime = (8 * 60) - timeInMinutes

        return formatUsedTime(availableTime);
    }

    const getUsedTimeThisWeek = (date) => {
        let timeInMinutes = 0
        let numberOfAvailableDays = 5;

        if (state.calendarFor === 'projectGroup') {
            let daysCount = moment(state.endDate).diff(state.startDate, 'day');
            console.log('days count', daysCount);
            numberOfAvailableDays = 0;
            while (daysCount >= 0) {
                const day = moment(state.startDate, 'yyyy-MM-DD').add(daysCount, 'day').day();
                //  console.log('day', day);
                if (day !== 0 && day !== 6) {
                    numberOfAvailableDays++
                }
                daysCount--
            }

            prop.calendar.map(task => {
                const day = moment(task.startDate, 'yyyy-MM-DD').day();
                if (moment(task.startDate, 'yyyy-MM-DD').isBetween(moment(state.startDate), moment(state.endDate), null, '[]')
                    && day !== 0 && day !== 6) {
                    const minutes = Number(task.minutes);
                    console.log('time diff', minutes, task.startDate, task.endTime, task.startTime);
                    timeInMinutes += minutes;
                }
                return false
            });
        } else {
            prop.calendar.map(task => {
                const day = moment(task.startDate, 'yyyy-MM-DD').day();
                if (moment(task.startDate, 'yyyy-MM-DD').isSame(moment(date), 'week') && day !== 0 && day !== 6) {
                    const minutes = Number(task.minutes);
                    console.log('time diff', minutes, task.startDate, task.endTime, task.startTime);
                    timeInMinutes += minutes;
                }
                return false
            });
        }


        const availableTime = (numberOfAvailableDays * 8 * 60) - timeInMinutes

        // console.log('available time week', numberOfAvailableDays, timeInMinutes, availableTime);

        return formatUsedTime(availableTime);
    }

    const nextWeek = (event) => {
        console.log('goto next week')
        const date = moment(state.date).add(1, 'week')
        const startDate = date.startOf('week').add(1, 'day').toDate();
        updateState({
            date: date.toDate(),
            startDate: startDate
        })
        prop.gotoDate(startDate)
        updateState({ usedTimeThisWeek: getUsedTimeThisWeek(date) })
    }

    const prevWeek = (event) => {
        console.log('goto previous week')
        const date = moment(state.date).subtract(1, 'week')
        const startDate = date.startOf('week').add(1, 'day').toDate();
        updateState({
            date: date.toDate(),
            startDate: startDate
        })
        prop.gotoDate(startDate)
        updateState({ usedTimeThisWeek: getUsedTimeThisWeek(date) })
    }

    const gotoDate = (date) => {
        console.log('goto date', date)
        updateState({ date: date, selectedDate: moment(date).format('yyyy-MM-DD').toString() })
        prop.gotoDate(date)
    }

    const customItem = (props) => {
        return (
            props.value.getMinutes() === 0 ?
                <Box sx={{ px: 4 }} className="custom-timegroup" >
                    <Box>{props.children}</Box>
                </Box> :
                <Box sx={{ px: 4 }}>{props.children}</Box>
        )
    };

    const assignTimeToStaff = () => {
        prop.assignTimeToStaff(state.date)
    }

    const bioDataComponent = () => {
        return <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Profile picture */}
            <ProfileAvatar {...{ diameter: 60, src: state.profilePicture, fullName: state.fullName, styleProp: { mr: 2 } }} />

            {/* Full name and time sheet label */}
            <Box>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: 14, md: 16 }, mb: .5 }}>
                    {state.fullName}
                </Typography>
                <Typography sx={{ color: '#8D8D8D', fontWeight: 600, fontSize: { xs: 14, md: 16 } }}>
                    Time sheet
                </Typography>
            </Box>
        </Box>
    }

    const dateControllerButton = (onClick, icon, disabled, marginRight) => {
        return <Box sx={{
            display: 'flex', alignItems: 'center', p: .5, cursor: disabled ? 'inherit' : 'pointer',
            ':hover': disabled ? 'inherit' : { bgcolor: 'rgba(191, 6, 6, 0.3)' }, mr: marginRight ?? 'inherit',
            bgcolor: disabled ? 'inherit' : 'rgba(28, 29, 34, 0.1)', borderRadius: '12px'
        }} onClick={!disabled ? onClick : () => { }}>
            {icon}
        </Box>
    }

    const weekControllerComponent = () => {
        return <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Prev week */}
            {dateControllerButton(prevWeek, <PrevArrow sx={{ color: '#8D8D8D' }} />)}

            {/* This week's days */}
            <Typography sx={{ mx: 2, fontWeight: 600, fontSize: 16 }}>
                {weekDaysRangeForStaff}
            </Typography>

            {/* Next week */}
            {dateControllerButton(nextWeek, <NextArrow sx={{ color: '#8D8D8D' }} />)}
        </Box>
    }

    const startAndEndMonthsSame = (startDate, endDate) => {
        return startDate.format('MMM') === endDate.format('MMM')
    }

    const sameDay = (startDate, endDate) => {
        return startDate.format('MMM Do') === endDate.format('MMM Do')
    }

    const gotoNextSetOfDays = () => {
        /* Add one week and go to first week day and add one day*/
        const date = moment(state.currentStart).add(1, 'week').startOf('week').add(1, 'day').toDate();
        /* Check if the day is before the end date */
        const chosenDate = moment(date).isSameOrBefore(moment(state.endDate), 'day') ? date : state.endDate
        updateState({ date: chosenDate, currentStart: chosenDate })
    }

    const gotoPrevSetOfDays = () => {
        /* Subtract one week and go to first week day and add one day*/
        const date = moment(state.currentStart).subtract(1, 'week').startOf('week').add(1, 'day').toDate();
        /* Check if the day is before the start date */
        const chosenDate = moment(date).isSameOrAfter(moment(state.startDate), 'day') ? date : state.startDate
        updateState({ date: chosenDate, currentStart: chosenDate })

        /*     const date = moment(state.currentStart).subtract(5, 'day').toDate();
            updateState({ date: date, currentStart: date }) */
    }

    const weekDaysRangeForStaff = useMemo(() => {
        const date1 = moment(state.date).startOf('week').add(1, 'day');
        const date2 = moment(state.date).endOf('week').subtract(1, 'day');
        const same = startAndEndMonthsSame(date1, date2);

        return `${date1.format('MMM Do')} -  ${date2.format(same ? 'Do' : 'MMM Do')}`
    }, [state.date])

    const weekDaysRangeForProjectGroup = useMemo(() => {
        const date1 = moment(state.startDate);
        const date2 = moment(state.endDate);
        const sameMonth = startAndEndMonthsSame(date1, date2);
        const sameMonthDay = sameDay(date1, date2);

        return `${date1.format('MMM Do')}${sameMonthDay ? '' : date2.format(sameMonth ? ' - Do' : ' - MMM Do')}`
    }, [state.startDate, state.endDate])

    const includeDate = (date) => {
        const day = moment(date).day();

        return state.calendarFor === 'projectGroup' ?
            (moment(date).isSameOrBefore(moment(state.endDate), 'day') && day !== 0 && day !== 6) : true;
    }

    const disablePrevButton = () => moment(state.startDate).isSame(moment(state.currentStart), 'day')

    const disableNextButton = () => moment(state.endDate).isSameOrBefore(moment(state.currentStart).add(5, 'days'), 'day')

    const getDate = (index) => state.calendarFor === 'projectGroup' ? moment(state.currentStart).add(index, 'days') :
        moment(state.date).startOf('week').add(index + 1, 'days')


    console.log('timesheet state', state)


    return (
        <Box className='timesheetClass' sx={{
            display: 'block', pb: 1, borderRadius: state.calendarFor === 'projectGroup' ? '0' : '16px',
            bgcolor: '#FBFBFB', overflowY: 'hidden',
            border: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            <Box sx={{ pb: .5 }}>
                {/* Row 1 */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', px: 2, py: 1,
                    mb: .5, bgcolor: state.calendarFor === 'projectGroup' ? 'rgba(191, 6, 6, 0.04)' : '#FBFBFB'
                }}>
                    {/* Week controller or biodata*/}
                    {state.calendarFor === 'projectGroup' ? bioDataComponent() : weekControllerComponent()}

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Today's booked time */}
                    <Box sx={{
                        border: '1px solid #BF0606', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
                        borderRadius: '8px', px: 1, py: .5, bgcolor: 'white', mr: 2
                    }}>
                        {/* Date */}
                        <Typography align="center" sx={{ fontWeight: 600, fontSize: 13, color: '#BF0606' }}>
                            {moment(state.date).format('MMM Do')}
                        </Typography>

                        {/* Used time */}
                        <Typography align="center" sx={{ fontWeight: 700, fontSize: 14, }}>
                            {getUsedTimeToday(state.date).trim() || '0mins'}
                        </Typography>
                    </Box>

                    {/* This week's booked time */}
                    <Box sx={{
                        border: '1px solid #BF0606', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
                        borderRadius: '8px', px: 1, py: .5, background: 'linear-gradient(90deg, #BF0606 0%, #450909 81.8%)'
                    }}>
                        {/* Date */}
                        <Typography align="center" sx={{ fontWeight: 600, fontSize: 13, color: 'white' }}>
                            {state.calendarFor === 'projectGroup' ? weekDaysRangeForProjectGroup : weekDaysRangeForStaff}
                        </Typography>

                        {/* Used time */}
                        <Typography align="center" sx={{ fontWeight: 700, fontSize: 14, color: 'white' }}>
                            {getUsedTimeThisWeek(state.date).trim() || '0mins'}
                        </Typography>
                    </Box>
                </Box>

                {/* Row 2 */}
                <Box sx={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: state.calendarFor === 'projectGroup' ? 'inherit' : 'space-between',
                    flexWrap: 'wrap', py: 1, px: 2, bgcolor: state.calendarFor === 'projectGroup' ? 'white' : 'inherit'
                }}>
                    {/* Previous set of 5 dates button */}
                    {state.calendarFor === 'projectGroup' &&
                        dateControllerButton(gotoPrevSetOfDays, <PrevArrow sx={{ color: '#8D8D8D' }} />, disablePrevButton(), 2)}

                    {/* Array of dates */}
                    {Array.from({ length: 5 }, (v, index) => {
                        const date = getDate(index);
                        const isSelectedDate = moment(date).isSame(moment(state.selectedDate, 'yyyy-MM-DD'), 'date'); //check if it's the selected date

                        //   console.log('date', date, 'include date', includeDate);

                        return includeDate(date) && <Typography key={index} sx={{
                            bgcolor: isSelectedDate ? 'rgba(191, 6, 6, 0.1)' : '#EDEDED',
                            color: isSelectedDate ? '#BF0606' : '#8D8D8D',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0px 6px 6px rgba(0, 0, 0, 0.04)',
                            borderRadius: '12px', px: { xs: .5, md: 1, lg: 1.5 }, py: .5,
                            mr: state.calendarFor === 'projectGroup' ? 2 : 0
                        }} onClick={() => { gotoDate(date/* .format('yyyy-MM-DD').toString() */) }}>
                            {date.format('MMM Do')}
                        </Typography>
                    })}

                    {/* Next set of 5 days button */}
                    {state.calendarFor === 'projectGroup' &&
                        dateControllerButton(gotoNextSetOfDays, <NextArrow sx={{ color: '#8D8D8D' }} />, disableNextButton())}

                    {state.calendarFor === 'projectGroup' && <Box sx={{ flexGrow: 1 }} />}

                    {/* Assign time to staff: add button */}
                    {state.calendarFor === 'projectGroup' && state.showAddTimeButton &&
                        <Avatar sx={{ bgcolor: '#BF0606', width: 28, height: 28, cursor: 'pointer' }}
                            onClick={assignTimeToStaff}>
                            <AddIcon fontSize="small"
                                sx={{
                                    borderRadius: '26.6667px', fontSize: '25px',
                                    bgcolor: 'white', color: '#BF0606'
                                }} />
                        </Avatar>}
                </Box>
            </Box>

            {/* TIme sheet for this week goes here */}
            <Box sx={{ height: '60vh', }} >
                <BigCalendar localizer={localiser} defaultView='day'
                    events={state.calendar} views={['day']} step={30}
                    defaultDate={moment(state.selectedDate, 'yyyy-MM-DD')}
                    min={moment('2023-04-21 12:00 am').toDate()}
                    max={moment('2023-04-27 11:59 pm').toDate()}

                    date={moment(state.selectedDate, 'yyyy-MM-DD')}

                    value={moment(state.selectedDate, 'yyyy-MM-DD')}

                    toolbar={false}

                    timeslots={1}

                    components={{
                        event: eventLabelComponent,
                        timeGutterHeader: calendarTimeGutterHeader,
                        timeSlotWrapper: customItem,
                    }}
                    showMultiDayTimes
                    dayLayoutAlgorithm={'no-overlap'}
                    formats={format1}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: 'white',
                            fontSize: '0px',
                            border: '0px',
                        }
                    })}

                    style={{
                        fontSize: '14px',
                        fontWeight: 600
                    }} />
            </Box>

        </Box>
    )
}

//export default CalendarTimeSheet