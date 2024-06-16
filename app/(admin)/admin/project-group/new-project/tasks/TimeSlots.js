'use client'

import { Box, Button, Checkbox, Typography } from "@mui/material";
import moment from "moment";
import { ProfileAvatar } from "@/Components/ProfileAvatar";

import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import PrevArrow from "@mui/icons-material/KeyboardArrowLeft";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allocatedTimeToStaff, reAllocatedTimeSlot } from "@/Components/redux/newProjectGroup";

import Prompt from "@/Components/Prompt";
import { buildScheduleTimes } from "./CalendarTImeSheet";
import { getTaskScheduleForTheDate } from "../../helper";

export function TImeSlots({ profilePicture, fullName, taskId, staffCalendar, workPhaseKey, goalKey,
    taskStartDate, taskEndDate, taskRequiredMinutes, staffEmail, closeTimeSelectionMenu }) {


    const dispatch = useDispatch();
    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    console.log("already saved form data is timeslot", staffCalendar, savedFormData);

    const goalData = useMemo(() => {
        return savedFormData.workPhases[workPhaseKey].goals[goalKey]
    }, [savedFormData.workPhases[workPhaseKey].goals[goalKey]])


    const taskObject = useMemo(() => {
        return goalData.tasks.find(item => Number(item.id) === Number(taskId))
    }, [goalData])

    const requiredMinutes = useMemo(() => {
        return taskObject?.remainingMinutes
    }, [taskObject])

    console.log('time slot required minutes', requiredMinutes);

    const [state, setState] = useState({
        date: taskStartDate ?? moment().toDate(), currentStart: taskStartDate ?? moment().toDate(),
        assignedTime: [], //[{date:'',time:''},{date:'',time:''}] 
        taskRequiredMinutes: requiredMinutes ?? Number(taskRequiredMinutes), unAvailableTimes: [], showAddTimeButton: true,
        taskAssignmentMapping: goalData.tasks.find(item => Number(item.id) === Number(taskId))?.taskAssignmentMapping ?? {},
        openContraintPrompt: false, disputedIimeSlot: null, staffCalendar: []
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        handleLoadSchedule(state.date, staffEmail)
    }, [state.date])

    useEffect(() => {
        console.log('working on new dates')
        updateState({
            unAvailableTimes: getUnAvailable30MinsIntervals(), assignedTime:
                state.taskAssignmentMapping[staffEmail] ?? []
        })
    }, [state.staffCalendar])


    const handleLoadSchedule = (date, selectedStaff) => {
        date = moment(date).format('yyyy-MM-DD').toString()
        console.log('handleLoadSchedule timeslot from server', selectedStaff);
        getTaskScheduleForTheDate({
            date: date, staffEmail: selectedStaff,
            dataProcessor: (result) => {
                console.log('calendar data from server', result);

                if (result)
                    updateState({ staffCalendar: buildScheduleTimes(result) })
            }
        })
    }

    const showAddTimeButton = () => {
        /* if the time requirement fot the task has been met, then hide the add time plus button  */
        const remainingMinutes = goalData.tasks.find(item => Number(item.id) === Number(taskId))?.remainingMinutes ?? null;
        let showAddTimeButton = true;

        if (remainingMinutes !== null) {
            showAddTimeButton = Number(remainingMinutes) > 0
        }
        return showAddTimeButton;
    }


    const getUnAvailable30MinsIntervals = () => {
        const tasksArray = state.staffCalendar.filter(task => {
            const day = moment(task.startDate, 'yyyy-MM-DD').day();
            if (moment(task.startDate, 'yyyy-MM-DD').isBetween(moment(taskStartDate), moment(taskEndDate), null, '[]')
                && day !== 0 && day !== 6) {
                return true
            }
            return false
        });

        //  console.log('taskarray', tasksArray);

        const tasksIntervalArray = tasksArray.map((task, indx) => {
            /* Divide the number of minutes by 30 */
            const numberOf30Minutes = Math.round(moment(task?.end).diff(task?.start, 'minutes') / 30);

            /* Create an array of 30 minutes intervals starting from the starttime */
            const intervalsArray = Array.from({ length: numberOf30Minutes }, (v, index) => {
                const time1 = moment(`${task.startDate} ${task.startTime}`, 'yyyy-MM-DD h:mma').add(index * 30, 'minutes').format('h:mma');
                const time2 = moment(`${task.startDate} ${task.startTime}`, 'yyyy-MM-DD h:mma').add((index + 1) * 30, 'minutes').format('h:mma');
                return `${time1} - ${time2}`
            })

            return { date: task?.startDate, times: intervalsArray }
        })

        return tasksIntervalArray;
    }



    console.log('getUnAvailable30MinsIntervals', getUnAvailable30MinsIntervals(),)

    const formatUsedTime = (timeInMinutes) => {
        const hours = Math.trunc(timeInMinutes / 60);
        const hourStr = hours ? hours > 1 ? `${hours}hrs` : `${hours}hrs` : '';
        const mins = timeInMinutes % 60;
        const minStr = mins ? mins > 1 ? `${mins}mins` : `${mins}min` : '';

        const time = `${hourStr} ${minStr}`
        //  console.log('used time is', timeInMinutes, time)

        return time;
    }

    const getAvailableTimeToday = (date) => {
        let timeInMinutes = 0
        state.staffCalendar.map(task => {
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

    const getAvailableTimeForProject = () => {
        let timeInMinutes = 0
        let numberOfAvailableDays = 5;

        let daysCount = moment(taskEndDate).diff(taskStartDate, 'day');
        numberOfAvailableDays = 0;

        /* Get number of days without weekends */
        while (daysCount >= 0) {
            const day = moment(taskStartDate, 'yyyy-MM-DD').add(daysCount, 'day').day();
            if (day !== 0 && day !== 6) {
                numberOfAvailableDays++
            }
            daysCount--
        }

        state.staffCalendar.map(task => {
            const day = moment(task.startDate, 'yyyy-MM-DD').day();
            if (moment(task.startDate, 'yyyy-MM-DD').isBetween(moment(taskStartDate), moment(taskEndDate), null, '[]')
                && day !== 0 && day !== 6) {
                const minutes = Number(task.minutes);
                //  console.log('time diff', minutes, task.startDate, task.endTime, task.startTime);
                timeInMinutes += minutes;
            }
            return false
        });


        const availableTime = (numberOfAvailableDays * 8 * 60) - timeInMinutes

        //console.log('available time week', timeInMinutes, availableTime);

        return formatUsedTime(availableTime);
    }

    const getDates = useMemo(() => {
        const workingDays = 5
        const numberOfAvailableDays = moment(taskEndDate).diff(moment(state.currentStart), 'days') + 1;
        const numberOfDays = Math.min(...[workingDays, numberOfAvailableDays]);

        // console.log('numberOfDays', numberOfAvailableDays, numberOfDays)

        const daysArray = Array.from({ length: numberOfDays }, (v, index) => {
            const date = moment(state.currentStart).add(index, 'days').toDate();
            return date;
        })

        //Filter out weekends
        return daysArray.filter(date => {
            const dayIndex = moment(date).day()
            return (dayIndex !== 0 && dayIndex !== 6)
        })
    }, [taskStartDate, taskEndDate, state.date, state.currentStart])

    const get30MinutesArray = useMemo(() => {
        const amPeriod = Array.from({ length: 48 }, ((v, index) => {
            const time1 = moment('2023-06-19 12:00am', 'yyyy-MM-DD h:mma').add(index * 30, 'minutes').format('h:mma');
            const time2 = moment('2023-06-19 12:00am', 'yyyy-MM-DD h:mma').add((index + 1) * 30, 'minutes').format('h:mma');
            return `${time1} - ${time2}`
        }))

        return amPeriod
    }, []);

    const dateControllerButton = (onClick, icon, disabled, marginRight) => {
        return <Box sx={{
            display: 'flex', alignItems: 'center', p: .5, cursor: disabled ? 'inherit' : 'pointer',
            ':hover': disabled ? 'inherit' : { bgcolor: 'rgba(191, 6, 6, 0.3)' }, mr: marginRight ?? 'inherit',
            bgcolor: disabled ? 'inherit' : 'rgba(28, 29, 34, 0.1)', borderRadius: '12px'
        }} onClick={!disabled ? onClick : () => { }}>
            {icon}
        </Box>
    }

    const gotoNextSetOfDays = () => {
        /* Add one week and go to first week day and add one day*/
        const date = moment(state.currentStart).add(1, 'week').startOf('week').add(1, 'day').toDate();
        /* Check if the day is before the end date */
        const chosenDate = moment(date).isSameOrBefore(moment(taskEndDate), 'day') ? date : taskEndDate
        updateState({ date: chosenDate, currentStart: chosenDate })
    }

    const gotoPrevSetOfDays = () => {
        /* Subtract one week and go to first week day and add one day*/
        const date = moment(state.currentStart).subtract(1, 'week').startOf('week').add(1, 'day').toDate();
        /* Check if the day is before the start date */
        const chosenDate = moment(date).isSameOrAfter(moment(taskStartDate), 'day') ? date : taskStartDate
        updateState({ date: chosenDate, currentStart: chosenDate })
    }

    const disablePrevButton = () => moment(taskStartDate).isSame(moment(state.currentStart), 'day')

    const disableNextButton = () => moment(taskEndDate).isSameOrBefore(moment(state.currentStart).add(5, 'days'), 'day')


    const startAndEndMonthsSame = useMemo(() => {
        return moment(taskStartDate, 'yyyy-MM-DD').format('MMM') === moment(taskEndDate, 'yyyy-MM-DD').format('MMM')
    }, [])

    const sameDay = useMemo(() => {
        return moment(taskStartDate, 'yyyy-MM-DD').format('MMM Do') === moment(taskEndDate, 'yyyy-MM-DD').format('MMM Do')
    }, [])

    const projectDaysRange = useMemo(() => {
        /*    const date1 = moment(state.startDate);
           const date2 = moment(state.endDate); */
        const sameMonth = startAndEndMonthsSame;
        const sameMonthDay = sameDay;

        return `${moment(taskStartDate).format('MMM Do')}${sameMonthDay ? '' : moment(taskEndDate).format(sameMonth ? ' - Do' : ' - MMM Do')}`
    }, [])


    const gotoDate = (date) => {
        updateState({ date: moment(date) })
    }

    const isTimeslotTaken = ({ date, time }) => {
        console.log('staffemail', staffEmail);
        let clashed = false;

        Object.values(savedFormData.workPhases).forEach(phaseObject => {
            if (clashed) return;
            Object.values(phaseObject.goals).forEach(goalObject => {
                if (clashed) return;
                goalObject.tasks.forEach(task => {
                    if (clashed) return;
                    clashed = task?.taskAssignmentMapping && Boolean(task?.taskAssignmentMapping[staffEmail]?.find((allocation) =>
                        allocation?.date?.toString() === date?.toString() && allocation?.time?.toString() === time?.toString()));

                })
            })
        })
        /*   const clashes = goalData.tasks.filter(task => task?.taskAssignmentMapping[staffEmail]?.find((allocation) =>
              allocation?.date?.toString() === date?.toString() && allocation?.time?.toString() === time?.toString()
          )); */

        console.log('clashed', clashed);

        return clashed
    }

    const releaseDisputedTimeslot = ({ date, time }) => {
        console.log('disputed data', date, time);

        let clashData = {};
        let tasksWithoutClash = {}

        Object.entries(savedFormData.workPhases).map(([phaseKey, phaseObject]) => {
            console.log('phaseKey,phaseObject', phaseKey, phaseObject)
            Object.entries(phaseObject.goals).map(([goalKey, goalObject]) => {
                goalObject.tasks.forEach((task, index) => {
                    if (!task?.taskAssignmentMapping) {
                        return
                    }
                    else if (Boolean(task?.taskAssignmentMapping[staffEmail]?.find((allocation) => allocation?.date?.toString() === date?.toString() && allocation?.time?.toString() === time?.toString()))) {
                        const matched = savedFormData.workPhases[phaseKey].goals[goalKey].tasks[index].taskAssignmentMapping[staffEmail].filter(item => `${item.time.trim()}${item.date.toString().trim()}` !=
                            `${time.trim()}${date.toString().trim()}`);

                        clashData = {
                            workPhaseKey: phaseKey, goalKey: goalKey, taskIndex: index, tasksWithoutClash:
                                matched /* 
                                savedFormData.workPhases[phaseKey].goals[goalKey].tasks[index].taskAssignmentMapping[staffEmail].filter((allocation) => allocation?.date?.toString() != date?.toString() && allocation?.time?.toString() != time?.toString()) */
                        }
                    }


                    /*   if (clashed) {
                         
                      } */

                })
            })
        })

        console.log('clashed data', clashData)

        dispatch(reAllocatedTimeSlot({
            staffEmail: staffEmail,
            workPhaseKey: clashData.workPhaseKey, goalKey: clashData.goalKey,
            taskIndex: clashData.taskIndex, valueObject: clashData.tasksWithoutClash
        }))

    }

    const handleAssignTime = (timeSlot) => {
        console.log('assigning time to staff')
        updateState({
            assignedTime: [...state.assignedTime,
            { date: moment(state.date).format('yyyy-MM-DD'), time: timeSlot.time }],
            taskRequiredMinutes: state.taskRequiredMinutes - 30
        });

        const taskRecordIndex = goalData.tasks.findIndex(item => Number(item.id) === Number(taskId))

        const taskRecord = { ...goalData.tasks[taskRecordIndex] }

        const assignmentRec = taskRecord?.taskAssignmentMapping ?? {}

        const staffRecord = assignmentRec[staffEmail] ?? []

        const copy = {
            ...taskRecord, remainingMinutes: state.taskRequiredMinutes - 30,
            taskAssignmentMapping: { ...taskRecord?.taskAssignmentMapping, [staffEmail]: [...staffRecord, timeSlot] }
        }

        dispatch(allocatedTimeToStaff({
            workPhaseKey: workPhaseKey, goalKey: goalKey,
            index: taskRecordIndex, valueObject: copy
        }))
    }

    const handleUnassignTIme = (timeSlot) => {
        console.log('unassigning time from staff', 'current redux state',)
        const taskRecordIndex = goalData.tasks.findIndex(item => Number(item.id) === Number(taskId))

        const taskRecord = { ...goalData.tasks[taskRecordIndex] }
        const timeSlotString = `${timeSlot.time.trim()}${timeSlot.date.toString().trim()}`

        const matched = taskRecord.taskAssignmentMapping[staffEmail]?.filter(item => `${item.time.trim()}${item.date.toString().trim()}` != timeSlotString);

        console.log('matched', timeSlot, taskRecord, taskRecord.taskAssignmentMapping[staffEmail], matched);
        const copy = {
            ...taskRecord, remainingMinutes: state.taskRequiredMinutes + 30,
            taskAssignmentMapping: { ...taskRecord?.taskAssignmentMapping, [staffEmail]: matched }
        }

        dispatch(allocatedTimeToStaff({ index: taskRecordIndex, valueObject: copy, workPhaseKey: workPhaseKey, goalKey: goalKey, }))

        updateState({
            assignedTime: state.assignedTime.filter(item =>
                (`${item.time}${item.date}` !== `${timeSlot.time}${moment(state.date).format('yyyy-MM-DD')}`)),
            taskRequiredMinutes: state.taskRequiredMinutes + 30
        })
    }

    const assignTimeToStaff = (event) => {
        const timeSlot = { date: moment(state.date).format('yyyy-MM-DD'), time: event.target.id };
        console.log('assignTimeToStaff timeslot', timeSlot);

        if (event.target.checked) {
            //check if the time slot has been occuupied by a different task
            if (isTimeslotTaken({ date: timeSlot.date.toString(), time: timeSlot.time.toString() })) {
                console.log('time slot is taken');
                updateState({ openContraintPrompt: true, disputedIimeSlot: timeSlot });
            }
            else {
                handleAssignTime(timeSlot)
            }
        }
        else {
            handleUnassignTIme(timeSlot)
        }
    }

    const closeView = () => {
        closeTimeSelectionMenu();
    }

    const closeContraintPrompt = () => {
        updateState({ openContraintPrompt: false, disputedIimeslotEvent: null })
    }

    const allocateDisputedTimeslot = () => {
        //const timeSlot = { date: moment(state.date).format('yyyy-MM-DD'), time: event.target.id };
        //vacate the disputed time slot to allow a new occupant
        releaseDisputedTimeslot({
            date: moment(state.date).format('yyyy-MM-DD').toString(),
            time: state.disputedIimeSlot.time
        })
        handleAssignTime(state.disputedIimeSlot)
        //assignTimeToStaff(state.disputedIimeSlot);
        closeContraintPrompt();
    }

    const taskHoursMinutes = useMemo(() => {
        const hours = Math.trunc(state?.taskRequiredMinutes / 60);
        const minutes = state?.taskRequiredMinutes % 60;
        return { hours: hours, minutes: minutes }
    }, [state.taskRequiredMinutes, taskRequiredMinutes])

    console.log('time slot state', 'calendar', state.staffCalendar, state);

    return <Box sx={{
        height: '90vh', transform: 'translate(-50%,-50%)', bgcolor: 'white', borderRadius: '12px',
        position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', md: '80%' }, overflowY: 'hidden',
    }}>
        {/* Toolbar */}
        <Box sx={{
            display: 'flex', alignItems: 'center', maxWidth: '100%', px: 3, py: 1.5, borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
            boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', borderRadius: '16px 16px 0px 0px',
        }}>
            {/* View label: SELECT TIME SLOT FOR TASK */}
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 17 } }}>
                SELECT TIME SLOT FOR TASK
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Available time in selected date */}
            <Box sx={{
                border: '1px solid #BF0606', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
                borderRadius: '8px', px: 1, py: .5, bgcolor: 'white', mr: 3
            }}>
                {/* Date */}
                <Typography align="center" sx={{ fontWeight: 600, fontSize: 13, color: '#BF0606' }}>
                    {moment(state.date).format('MMM Do')}
                </Typography>

                {/* Available time */}
                <Typography align="center" sx={{ fontWeight: 700, fontSize: 14, }}>
                    {getAvailableTimeToday(state.date).trim() || '0mins'}
                </Typography>
            </Box>

            {/* Availale time for duration of project */}
            <Box sx={{
                border: '1px solid #BF0606', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
                borderRadius: '8px', px: 1, py: .5, background: 'linear-gradient(90deg, #BF0606 0%, #450909 81.8%)'
            }}>
                {/* Date */}
                <Typography align="center" sx={{ fontWeight: 600, fontSize: 13, color: 'white' }}>
                    {projectDaysRange}
                </Typography>

                {/* Available time */}
                <Typography align="center" sx={{ fontWeight: 700, fontSize: 14, color: 'white' }}>
                    {getAvailableTimeForProject().trim() || '0mins'}
                </Typography>
            </Box>

            {/* Profile picture */}
            <ProfileAvatar {...{ diameter: 50, src: profilePicture, fullName: fullName, styleProp: { mx: 2 } }} />



            {/* Full name and timesheet label */}
            <Box>
                {/* Full name */}
                <Typography sx={{ fontWeight: 600, fontSize: { xs: 14, md: 15 }, mb: .5 }}>
                    {fullName ?? 'Full name'}
                </Typography>

                {/* Available TIme */}
                <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, md: 13 }, color: '#8D8D8D' }}>
                    Available Time
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            {/* Done button */}
            <Button variant="outlined" sx={{ fontWeight: 600, border: '2px solid #BF0606', borderRadius: '12px' }}
                onClick={closeView}>
                Done
            </Button>
        </Box>

        {/* Body */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 3, height: '90vh', overflowY: 'hidden' }}>
            {/* Task timebank */}
            <Box sx={{
                width: 'max-content', border: '1px solid rgba(28, 29, 34, 0.1)', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
                borderRadius: '8px', mr: 3,
            }}>
                {/* Heading */}
                <Box sx={{
                    display: 'flex', alignItems: 'centert', borderRadius: '8px 8px 0px 0px',
                    bgcolor: 'rgba(37, 122, 251, 0.07)', px: 1.5, py: 1
                }}>
                    {/* Task label */}
                    <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                        Task {taskId ?? 1}
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Edit button */}
                    <Typography sx={{
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', color: '#BF0606'
                    }}>
                        Edit
                        <NextArrow sx={{ ml: -.7, fontSize: 24 }} />
                    </Typography>
                </Box>

                {/* Time bank */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', px: 1, py: 2, borderRadius: '8px', justifyContent: 'center', mx: 'auto',
                    bgcolor: 'rgba(191, 6, 6, 0.1)', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)', my: 1.5, maxWidth: 'max-content'
                }}>
                    {/* Hour */}
                    <Box sx={{}}>
                        <Typography align='center' sx={{ px: 1, pb: 1, fontWeight: 600, fontSize: 13, color: '#BF0606' }}>
                            HH
                        </Typography>
                        <Typography sx={{ bgcolor: 'white', p: 1, fontWeight: 700, fontSize: { xs: 16, md: 18 } }}>
                            {taskHoursMinutes?.hours}
                        </Typography>
                    </Box>

                    {/* Time separator */}
                    <Typography sx={{
                        maxHeight: 20, width: 'min-content', mx: 1, fontWeight: 700, fontSize: 30,
                    }}>
                        :
                    </Typography>

                    {/* Minutes */}
                    <Box>
                        <Typography align='center' sx={{ px: 1, pb: 1, fontWeight: 600, fontSize: 13, color: '#BF0606' }}>
                            MM
                        </Typography>
                        <Typography align='center' sx={{ bgcolor: 'white', p: 1, fontWeight: 700, fontSize: { xs: 16, md: 18 } }}>
                            {taskHoursMinutes?.minutes}
                        </Typography>
                    </Box>
                </Box>

                {/* Date range of task */}
                <Box sx={{
                    bgcolor: 'rgba(28, 29, 34, 0.04)', px: 1, borderRadius: '10px', maxWidth: 'max-content',
                    py: .5, border: '1px solid rgba(28, 29, 34, 0.1)', display: 'flex', alignItems: 'center', mt: 1, mb: 2, mx: 2
                }}>
                    {/* Date label */}
                    <Typography sx={{ color: '#5D5D5D', fontWeight: 600, fontSize: 14, mr: .5 }}>
                        Date:
                    </Typography>

                    {/* Date range */}
                    <Typography noWrap sx={{ fontWeight: 600, fontSize: 14 }}>
                        {projectDaysRange}
                    </Typography>
                </Box>
            </Box>

            {/* Available times */}
            <Box sx={{ width: '100%' }}>
                {/* Heading */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', px: 3, py: 2, bgcolor: 'rgba(28, 29, 34, 0.06)',
                    border: '1px solid rgba(28, 29, 34, 0.1)', flexWrap: 'wrap'
                }}>
                    {/* Label: TIME AVAILABLE */}
                    <Typography sx={{ fontWeight: 700, fontSize: 15, pr: 3 }}>
                        TIME AVAILABLE
                    </Typography>

                    {/* Previous 5 or less days button */}
                    {dateControllerButton(gotoPrevSetOfDays, <PrevArrow sx={{ color: '#8D8D8D' }} />, disablePrevButton(), 2)}

                    {/* Dates */}
                    {getDates.map((date, index) => {
                        const isSelectedDate = moment(date).isSame(moment(state.date), 'day');
                        return <Typography key={index} onClick={() => { gotoDate(date) }}
                            sx={{
                                fontSize: 14, fontWeight: 600, px: 1.5, py: .5, boxShadow: '0px 6px 6px rgba(0, 0, 0, 0.04)',
                                bgcolor: isSelectedDate ? 'rgba(191, 6, 6, 0.08)' : 'white', mr: 2, my: 1,
                                color: isSelectedDate ? '#BF0606' : '#8D8D8D', borderRadius: '10px', cursor: 'pointer'
                            }}>
                            {moment(date).format('MMM Do')}
                        </Typography>
                    })}

                    {/* Next 5 or less days button */}
                    {dateControllerButton(gotoNextSetOfDays, <NextArrow sx={{ color: '#8D8D8D' }} />, disableNextButton())}

                </Box>

                {/* Body */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', pb: 4,
                    justifyContent: 'space-between', maxHeight: '65vh', overflowY: 'scroll'
                }}>
                    {get30MinutesArray.map((data, index) => {
                        const unAvailable =
                            state.unAvailableTimes
                                .find(item => item.date === moment(state.date).format('yyyy-MM-DD'))?.times.includes(data);
                        const checked = Boolean(state.assignedTime
                            .find(item => item?.time === data && item?.date === moment(state.date).format('yyyy-MM-DD')))

                        const blockChange = !showAddTimeButton() && !checked;

                        return <Typography align="center" noWrap key={index} id={data}
                            sx={{
                                border: '1px solid rgba(28, 29, 34, 0.1)', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
                                borderRadius: '12px', alignItems: 'center', px: 1.5, py: 1, fontWeight: 600,
                                fontSize: 14, mx: 1.5, mt: 2, width: '200px',
                                bgcolor: unAvailable || blockChange ? '#F5F5F5' : 'inherit'
                            }}>
                            {!unAvailable &&
                                <Checkbox id={data} sx={{ p: 0, mr: 1.5 }} onChange={assignTimeToStaff}
                                    value={checked}
                                    checked={checked}
                                    disabled={blockChange} />}
                            {data}
                        </Typography>
                    })}
                </Box>
            </Box>
        </Box>

        {state.openContraintPrompt && <Prompt open={state.openContraintPrompt} onClose={closeContraintPrompt}
            message={'This timeslot is currently allocated to a different task. However, the task has not been saved. Would you like to reallocate it to this task?'} onProceed={allocateDisputedTimeslot} onCancel={closeContraintPrompt}
            proceedTooltip={'This will replace the existing event with this one'}
            cancelTooltip={'This will close this prompt, and change nothing'} />}
    </Box>
}