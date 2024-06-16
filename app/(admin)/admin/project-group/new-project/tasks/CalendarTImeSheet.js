'use client'

import {
    Box, Typography, Modal,
} from "@mui/material";


import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'react-calendar/dist/Calendar.css'

import { useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import Prompt from "@/Components/Prompt";

import { CalendarTimeSheet as StaffTimeSheet } from "@/Components/CalendarTImeSheet";

import { TImeSlots } from "./TimeSlots";

import { ProfileAvatar } from "@/Components/ProfileAvatar";
import { getTaskScheduleForTheDate } from "../../helper";

const CalendarHolder = '/images/CalendarPlaceholder.svg'


const calendar = [
    /*  {
         startDate: '2023-05-11',
         startTime: '9:40 am',
         endTime: '10:30 am',
         hours: '32',
         minutes: '',
         endDate: '2023-05-13',
         type: 'reminder',
         budget: 20001,
         label: 'Draft the design',
         state: 'toDo',
         description: 'Daniel davies will having his birthday today'
     },
     {
         startDate: '2023-05-10',
         startTime: '9:20 am',
         hours: '3',
         minutes: '20',
         endTime: '12:30 pm',
         endDate: '2023-05-13',
         type: 'event',
         budget: 3245,
         label: 'Submit the design',
         state: 'review',
         description: 'About UX Design'
     },
     {
         startDate: '2023-06-26',
         startTime: '11:00 am',
         endTime: '12:30 pm',
         hours: '112',
         minutes: '',
         endDate: '2023-07-10',
         state: 'inProgress',
         budget: 2197,
         type: 'event',
         label: 'Commence construction',
         description: 'Between Two teams'
     }, */
];

const Phours = [12];
Array.from({ length: 4 }, (_, index) => Phours.push(index + 1));

const availableHours = { am: ['8', '9', '10', '11'], pm: ['12', '1', '2', "3", '4'] }

const defaultHour = { am: '8', pm: '12' };
const defaultMinute = '00';
const defaultPeriod = 'am';

const minuteReEx = /^[0-5]?[0-9]?$/

export const buildScheduleTimes = (schedules) => {
    const daysEvents = [];

    schedules?.forEach(taskObject => {
        const end = moment(`${taskObject?.startDate} ${taskObject?.endTime}`, 'yyyy-MM-DD h:mm a').toDate()
        const start = moment(`${taskObject?.startDate} ${taskObject?.startTime}`, 'yyyy-MM-DD h:mma').toDate();

        daysEvents.push({
            ...taskObject, startTime: taskObject?.startTime, startDate: taskObject?.startDate, endTime: taskObject?.endTime,
            endDate: taskObject?.endDate, start: start, end: end, hours: taskObject?.hours, minutes: taskObject?.minutes,
            title: `${taskObject.taskName ?? taskObject?.label}`
        });
    })

    console.log('produced calendar', daysEvents);

    return daysEvents
}


function CalendarTimeSheet(prop) {
    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const currentHour = moment().format('h').toString();
    const currentMinute = moment().format('mm').toString();
    const currentPeriod = moment().format('a').toString();

    const goalData = useMemo(() => {
        return savedFormData.workPhases[prop.workPhaseKey].goals[prop.goalKey]
    }, [savedFormData.workPhases[prop.workPhaseKey].goals[prop.goalKey]])

    const [state, setState] = useState({
        calendar: calendar,
        startDate: prop?.startDate,
        endDate: prop?.endDate,
        fullStartDate: moment().startOf('week').format('MMM Do'),
        fullEndDate: moment().startOf('week').add(6, 'days').format('MMM Do'),
        scheduleView: 'week', openModal: false,
        selectedEvent: {
            id: '', title: '', details: '',
            startTime: '', endTime: '', date: '', type: '',
            notify: '', repeat: ''
        },
        openEdit: false,
        openEvent: false,
        showTimeSelectionMenu: false, taskId: prop?.id, minutes: prop?.minutes, staffEmail: prop?.staffEmail,
        selectedHour: availableHours[currentPeriod].includes(currentHour) ? currentHour : defaultHour[currentPeriod],
        selectedMinute: { value: currentMinute, errMsg: '' },
        selectedPeriod: currentPeriod,
        addedIds: [], hours: prop?.hours, budget: prop?.budget, taskName: prop?.taskName,
        timeSelectionError: '', promptType: '', constraints: [], constrainedTime: '',
        selectedStaffRecord: prop?.listOfSelectedStaff[0] ?? null,
        date: moment(prop?.startDate).toDate(), showPrompt: false, listOfSelectedStaff: prop?.listOfSelectedStaff ?? [],
        chosenDate: '',
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    }

    useEffect(() => {
        const selectedStaff = state?.selectedStaffRecord ?? prop?.listOfSelectedStaff[0] ?? null
        updateState({
            startDate: prop?.startDate, taskId: prop?.id, minutes: prop?.minutes,
            endDate: prop?.endDate, date: prop?.startDate, listOfSelectedStaff: prop?.listOfSelectedStaff,
            hours: prop?.hours, budget: prop?.budget, taskName: prop?.taskName,
            selectedStaffRecord: state?.selectedStaffRecord ?? prop?.listOfSelectedStaff[0] ?? null
        })

        console.log('selectedStaff', selectedStaff);

        if (selectedStaff)
            handleLoadSchedule(prop?.startDate, selectedStaff)
        /*  getTaskScheduleForTheDate({
             date: prop?.startDate, staffEmail: selectedStaff?.email,
             dataProcessor: (result) => {
                 console.log('calendar data from server', result);

                 if (result)
                     updateState({ calendar: buildScheduleTimes(result) })
             }
         }) */
    }, [prop]);

    const handleLoadSchedule = (date, selectedStaff) => {
        getTaskScheduleForTheDate({
            date: date, staffEmail: selectedStaff?.email,
            dataProcessor: (result) => {
                console.log('calendar data from server', result);

                if (result)
                    updateState({ calendar: buildScheduleTimes(result) })
            }
        })
    }


    useEffect(() => {
        /*  If the selected staff has been removed from the list of selected staff, replace with another staff */
        !state.listOfSelectedStaff.find(item => item.email === state.selectedStaffRecord?.email) &&
            updateState({ selectedStaffRecord: prop?.listOfSelectedStaff[0] ?? null })
    }, [state.listOfSelectedStaff])


    const generateTaskSchedule = (schedule) => {
        /* 
#set taskObject to the task parameters
#set remainingTime to the task duration
#set minutes to state.minutes
#set resumptionTime to 8:00 am
#set daysEvents=[]
#get the number of days from the start date and end dates
#create an array daysArray whose length is the number of days minus 1, starting from 1, not zero

#Add task for first day:
#do end=moment(startdate startTime, 'yyyy-MM-DD h:mm a').add((remainingTime>8)?remainingTime:8,'hours').add(minutes,'minutes').toDate()
#do start=moment(startdate startTime, 'yyyy-MM-DD h:mm a').toDate()
#do daysEvents.push({...taskObject,start:start,end:end,title:taskObject.label})

#if (remainingTime)>8:
######
#loop through the daysArray
####
#if a day is Sat or Sun:
##
# pass.
##
#else if weekday:
###
#if the remainingTime is less than or equal to 8 hours:
##
#do start=moment(startdate resumptionTime, 'yyyy-MM-DD h:mm a')
#do end=moment(startdate resumptionTime, 'yyyy-MM-DD h:mm a').add(remainingTime,'hours')
##
#else if remainingTime is greater than than 8 hours:
##
#do start=moment(startdate resumptionTime, 'yyyy-MM-DD h:mm a')
#do end=moment(startdate resumptionTime, 'yyyy-MM-DD h:mm a').add(8,'hours')
#do remainingTime-8
##
###
####
###### */

        const daysEvents = [];

        schedule.map(taskObject => {
            //     let remainingHours = Number(taskObject.hours);
            //  const lastDayEndTime=firstdayhours+otherdayshours+lastdayhours+minutes

            //    console.log('taskObject', taskObject?.id, taskObject);

            let hoursUsed = 0;
            let minutesUsed = 0;
            const workWeek = 8;
            const minutes = Number(taskObject.minutes);
            const resumptionTime = '8:00 am';
            const numberOfDays = moment(taskObject.endDate).diff(moment(taskObject.startDate), 'days');

            const daysArray = Array.from({ length: numberOfDays }, (_, index) => index + 1);

            let remainingHours = daysArray.map((day) => {
                const theday = moment(taskObject.startDate).add(day, 'days').day();
                //   console.log('end', theday);
                return ![0, 6].includes(theday) ? 8 : 0
            }).filter(item => item > 0).reduce((a, b) => a + b, 0)

            //let remainingHours = daysArray1.reduce((a, b) => a + b, 0)

            //difference between the resumption time and the starting time of the project.
            //This number of hours and minutes will be carried over to the last day
            const firstDayDeficitHours = moment(taskObject.startTime, 'h:mm a').diff(moment(resumptionTime, 'h:mm a'), 'hours');
            const firstDayDeficitMinutes = Math.floor(((moment(taskObject.startTime, 'h:mm a').diff(moment(resumptionTime, 'h:mm a'), 'minutes') / 60) - firstDayDeficitHours) * 60);

            const extraMinutes = firstDayDeficitMinutes ? 60 - firstDayDeficitMinutes : 0;
            //Full working day has 8 hours. The last day is not usually a full 8 hours.
            //This is how we find the number of hours for the last day. This is going to be added to the
            //last day along with the deficit hours.
            const extraHours = Math.ceil(Number(taskObject.hours) % workWeek);

            /* Another angle:
            last day time: get the remaining time by dividing the total hours by 8 and take the remainder
            */

            const lastDayEndTime = moment(`${taskObject.startDate} ${resumptionTime}`, 'yyyy-MM-DD h:mm a').add(firstDayDeficitHours, 'hours').add(extraMinutes, 'minutes').add(extraHours, 'hours').add(Number(state.minutes), 'minutes').format('h:mm a')

            /*      console.log('numberOfDays', numberOfDays, 'firstDayDeficitHours', firstDayDeficitHours, 'firstDayDeficitMinutes', firstDayDeficitMinutes, 'extraMinutes', extraMinutes, 'lastDayEndTime', lastDayEndTime, 'daysArray', daysArray, 'remainingHours', remainingHours, 'extraHours', extraHours, taskObject.startDate, taskObject.endDate)
      */
            const firstDayEndTime = (numberOfDays) ? '4:00 pm' : lastDayEndTime;

            const hoursAvailable = (remainingHours > workWeek) ? workWeek : remainingHours;

            const end = moment(`${taskObject.startDate} ${firstDayEndTime}`, 'yyyy-MM-DD h:mm a').toDate()

            const start = moment(`${taskObject.startDate} ${taskObject.startTime}`, 'yyyy-MM-DD h:mm a').toDate();

            const startTime = moment(start.toString()).format('h:mm a')
            const startDate = moment(start.toString()).format('yyyy-MM-DD')
            const endTime = moment(end.toString()).format('h:mm a')
            const endDate = moment(end.toString()).format('yyyy-MM-DD')
            const hours = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'hours').toString();
            const minutes1 = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'minutes').toString();

            //    console.

            hoursUsed += hoursAvailable;

            remainingHours = remainingHours - workWeek;

            daysEvents.push({
                ...taskObject, startTime: startTime, startDate: startDate, endTime: endTime,
                endDate: endDate, start: start, end: end, hours: hours, minutes: minutes1,
                title: `${taskObject.taskName ?? taskObject?.label}`
            });



            if (numberOfDays) {
                daysArray.map(((day, indx) => {
                    if ([0, 6].includes(moment(taskObject.startDate).add(day, 'days').day())) {
                        //    console.log('weekend')
                        return 0;
                    }
                    else if (daysArray.length === indx + 1) {
                        //  console.log('less than 8 hours last day')
                        const start = moment(`${taskObject.startDate} ${resumptionTime}`, 'yyyy-MM-DD h:mm a').add(day, 'days').toDate()

                        const end = moment(`${taskObject.startDate} ${lastDayEndTime}`, 'yyyy-MM-DD h:mm a').add(day, 'days').toDate()

                        const startTime = moment(start.toString()).format('h:mm a')
                        const startDate = moment(start.toString()).format('yyyy-MM-DD')
                        const endTime = moment(end.toString()).format('h:mm a')
                        const endDate = moment(end.toString()).format('yyyy-MM-DD')
                        const hours = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'hours').toString();
                        const minutes1 = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'minutes').toString();

                        hoursUsed += remainingHours

                        /* Add lost time */
                        /*    if (indx === daysArray.length - 1) {
                               end.add(fistDayDeficitHours, 'hours').add(fistDayDeficitMinutes).toDate()
                               hoursUsed += fistDayDeficitHours
                               minutesUsed += fistDayDeficitMinutes
                           }
                           else {
                               end.toDate()
   
                           } */

                        daysEvents.push({
                            ...taskObject, startTime: startTime, startDate: startDate, endTime: endTime,
                            endDate: endDate, start: start, end: end, hours: hours, minutes: minutes1,
                            title: `${taskObject.taskName ?? taskObject?.label}`
                        });
                    }
                    else if (daysArray.length > indx + 1) {
                        const start = moment(`${taskObject.startDate} ${resumptionTime}`, 'yyyy-MM-DD h:mm a').add(day, 'days').toDate()

                        const end = moment(`${taskObject.startDate} ${resumptionTime}`, 'yyyy-MM-DD h:mm a').add(day, 'days').add(workWeek, 'hours').toDate()

                        const startTime = moment(start.toString()).format('h:mm a')
                        const startDate = moment(start.toString()).format('yyyy-MM-DD')
                        const endTime = moment(end.toString()).format('h:mm a')
                        const endDate = moment(end.toString()).format('yyyy-MM-DD')
                        const hours = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'hours').toString();
                        const minutes1 = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'minutes').toString();

                        hoursUsed += workWeek;

                        /* Add lost time */
                        /*   if (indx === daysArray.length - 1) {
                              end.add(fistDayDeficitHours, 'hours').add(fistDayDeficitMinutes).toDate()
                              hoursUsed += fistDayDeficitHours
                              minutesUsed += fistDayDeficitMinutes
                          }
                          else {
                              end.toDate()
  
                          } */

                        daysEvents.push({
                            ...taskObject, startTime: startTime, startDate: startDate, endTime: endTime,
                            endDate: endDate, start: start, end: end, hours: hours, minutes: minutes1,
                            title: `${taskObject?.taskName ?? taskObject?.label}`
                        });
                    }
                    else {
                        //   console.log('free day')
                        return 0;
                    }
                    remainingHours = remainingHours - workWeek;
                }))
                /*  console.log('hours used ', hoursUsed, taskObject.startDate, taskObject.endDate,);
                 console.log('remaining hours ', remainingHours, taskObject.startDate, taskObject.endDate,); */
            }

        });

        //   console.log('daysEvent', moment().format('h:mm'), daysEvents);
        return daysEvents;
    }

    useMemo(() => {
        let newCalendar = goalData.tasks.filter(item => item?.staff.filter(obj => obj.email === state.staffEmail).length);

        newCalendar.map(task => {

            const endingDate = moment(`${task.startDate} ${task.startTime}`, 'yyyy-MM-DD h:mm a')
                .add(Number(task.hours), 'hours').add(Number(task.minutes), 'minutes').toDate();

            return {
                id: task.id,
                startDate: task.startDate,
                startTime: task.startTime,
                endTime: moment(endingDate).format('h:mm a').toString(),
                endDate: task.endDate,
                type: 'reminder',
                hours: task.hours,
                minutes: task.minutes,
                budget: Number(task.taskBudget),
                label: task.taskName,
                state: 'new',
                description: 'This is a new task'
            }
        });

        const calendar = [...state.calendar.filter(item => (!state.addedIds.includes(item.id) && item.state === 'new')), ...newCalendar];

        const staffTasks = state?.selectedStaffRecord?.tasks ?? [];
        calendar?.push(...staffTasks);

        updateState({
            addedIds: goalData.tasks.filter(item => item?.staff.filter(obj => obj.email === state.staffEmail).length)
                .map(item => item.id),
            calendar: buildScheduleTimes(calendar)
        })
    }, [goalData, state.selectedStaffRecord]);

    const showAddTimeButton = () => {
        const remainingMinutes = goalData.tasks.find(item => Number(item.id) === Number(state.taskId))?.remainingMinutes ?? null;
        let showAddTimeButton = true;

        if (remainingMinutes !== null) {
            //  const taskMinutes = savedFormData.tasks.find(item => Number(item.id) === Number(state.taskId))?.minutes;
            // const taskHours = savedFormData.tasks.find(item => Number(item.id) === Number(state.taskId))?.hours;

            //requiredMinutes = (Number(taskHours || 0) * 60) + Number(taskMinutes || 0)
            //  const minutesLeft = requiredMinutes - Number(remainingMinutes)
            showAddTimeButton = Number(remainingMinutes) > 0
            //showAddTimeButton = minutesLeft >= 0

            //   console.log('remainig time not null so', remainingMinutes)
        }

        return showAddTimeButton
    }

    const closePrompt = () => {
        updateState({ showPrompt: false, })
    }

    const openTimeSelectionMenu = (date) => {
        updateState({ showTimeSelectionMenu: true, chosenDate: date });
    }

    const closeTimeSelectionMenu = (event) => {
        updateState({ showTimeSelectionMenu: false, timeSelectionError: '', chosenDate: '' });
    }

    const isSelectedTimeEnough = (chosenTime) => {
        //calculate full task time using 8 hour work day and the number of work days available.
        const numberOfDays = moment(state.endDate).diff(moment(state.startDate), 'days') + 1
        /* Build array of weekdays. Exclude weekends */
        const daysArray = Array.from({ length: numberOfDays }).map((_, day) => {
            return ![0, 6].includes(moment(state.startDate).add(day, 'days').day()) ? 8 : 0
        })

        const maxDuration = daysArray.reduce((a, b) => a + b, 0) * 60

        //Then calculate the difference between the selected time and 8 hours.
        const gapTime = moment(chosenTime, 'h:mm a').diff(moment('8:00 am', 'h:mm a'), 'minutes')
        //Add that difference to the task hours.
        const taskDuration = (Number(state.hours) * 60) + (Number(state.minutes)) + gapTime;
        //If the sum exceeds the full task time, then the selected time should be rejected.
        //   console.log('taskDuration', taskDuration, 'maxDuration', maxDuration, "numberOfDays", numberOfDays, 'daysArray', daysArray);

        return maxDuration >= taskDuration
    }

    const canStaffFinishTask = ({ startDate, startTime, endDate, endTime }) => {
        //check if any task exists between the start date and end date 

        /*  console.log('startDate', startDate, 'startTime', startTime, 'endDate', endDate, 'endTime', endTime,
             'calendar', state.calendar) */

        /*   console.log('between', moment(`${state.calendar[0].endDate} ${state.calendar[0].endTime}`, 'yyyy-MM-DD h:mm a').format('yyyy-MM-DD h:mm a'), moment(`${state.calendar[0].startDate} ${state.calendar[0].startTime}`, 'yyyy-MM-DD h:mm a').format('yyyy-MM-DD h:mm a'),) */

        const clashingTasks = state.calendar.filter(task => moment(`${task.startDate} ${task.startTime}`, 'yyyy-MM-DD h:mm a')
            .isBetween(moment(`${startDate} ${startTime}`, 'yyyy-MM-DD h:mm a').format('yyyy-MM-DD h:mm a'), moment(`${endDate} ${endTime}`, 'yyyy-MM-DD h:mm a').format('yyyy-MM-DD h:mm a'), 'dates', '[]'));


        //  console.log('clashing', clashingTasks);

        return clashingTasks;
    }

    const assignTask = ({ override }) => {
        const selectedTime = `${state.selectedHour}:${state.selectedMinute.value} ${state.selectedPeriod}`;
        /* Lets use the hours and minutes to determine the end time*/
        const endingDate = moment(`${state.startDate} ${selectedTime}`, 'yyyy-MM-DD h:mm a')
            .add(Number(state.hours), 'hours').add(Number(state.minutes), 'minutes').toDate();

        const timeClashes = canStaffFinishTask({
            startDate: state.startDate, startTime: selectedTime,
            endDate: state.endDate, endTime: moment(endingDate).format('h:mm a').toString()
        }).map(item => {
            return { date: item.startDate, time: item.startTime, msg: `${moment(item.startDate).format('DD MMM yy').toString()}, ${item.startTime} - ${item.endTime}` }
        });

        //  console.log('can staff finish the task', timeClashes)

        if (!isSelectedTimeEnough(selectedTime)) {
            //  console.log('The time is too late')
            updateState({ timeSelectionError: 'Starting time is late. Choose an earlier time' })
        }
        else if (timeClashes.length && !override) {
            console.log('Time is clashing')
            closeTimeSelectionMenu();
            updateState({ constraints: [...state.constraints, ...timeClashes.map(item => item.msg)] })
        }
        else {
            prop.assignTask(selectedTime, state.listOfSelectedStaff.map(item => {
                return { email: item?.email, profilePicture: item?.profilePicture }
            }));

            /* The duration will not be used for calculations, instead the dates will be used. The start time will also be the end time. */
            const endTimeAddedTime = (state.startDate === state.endDate) ? Number(state.hours) : 1;



            //console.log('The ending date computed from the duration is', endingDate);

            const days = Number(state.hours) % 8;

            Array.from({ length: days }).map((day, index) => {
                const isWorkDay = moment(`${state.startDate} ${selectedTime}`, 'yyyy-MM-DD h:mm a').add(index, 'day')
            })

            const newTask = {
                id: state.taskId,
                startDate: state.startDate,
                startTime: selectedTime,
                /*   endTime: moment(selectedTime.toString(), 'h:mm a').add(1, 'hour').format('h:mm a').toString(), */
                endTime: moment(endingDate).format('h:mm a').toString(),
                //  endDate: moment(endingDate).format('yyyy-MM-DD').toString(),
                endDate: state.endDate,
                type: 'reminder',
                hours: state.hours,
                minutes: state.minutes,
                budget: Number(state.budget),
                label: state.taskName,
                state: 'new',
                description: 'This is a new task'
            }

            updateState({
                calendar: [...state.calendar, { ...newTask }],
                selectedHour: defaultHour[defaultPeriod], selectedMinute: { value: defaultMinute, errMsg: '' }, selectedPeriod: defaultPeriod, timeSelectionError: '',
                addedIds: [...state.addedIds, state.taskId]
            })

            closeTimeSelectionMenu();
        }

    }

    const closeConstraintPrompt = (event) => {
        updateState({ constraints: [] })
    }

    const unassignTask = () => {
        closePrompt();
        const id = state.taskId
        // console.log('unassigning task with id', id);
        /* remove the item with the task id from the calendar array */
        /* Also remove the id from the array of task ids that have been added */
        updateState({
            calendar: state.calendar.filter(item => item?.id !== id),
            addedIds: state.addedIds.filter(item => item !== id)
        })
        /* Call prop.unassignTask to remove the task from the parent */
        prop.unassignTask(id, state?.staffEmail);
    }

    const getTaskRequiredMinutes = () => {
        return goalData.tasks.find(item => Number(item.id) === Number(state.taskId))?.remainingMinutes ?? (Number(state.hours) * 60) + Number(state.minutes);
    }

    const timeSelectionMenu = (date) => {
        return <TImeSlots {...{
            profilePicture: state.selectedStaffRecord?.profilePicture, taskRequiredMinutes: getTaskRequiredMinutes(),
            fullName: state.selectedStaffRecord?.fullName, taskId: state.taskId, staffCalendar: state.calendar,
            taskStartDate: state.startDate, taskEndDate: state.endDate, staffEmail: state.selectedStaffRecord?.email,
            showAddTimeButton: showAddTimeButton(), closeTimeSelectionMenu: closeTimeSelectionMenu,
            workPhaseKey: prop.workPhaseKey, goalKey: prop.goalKey
        }} />
    }

    const switchStaff = (event) => {
        const email = event.currentTarget.id;
        //  console.log('selecting staff', email);
        updateState({
            selectedStaffRecord: state.listOfSelectedStaff?.find(item => item.email === email),
            staffEmail: email
        })
    }

    const calendarPlaceHolder = () => {
        return <Box sx={{ pt: 2, bgcolor: 'white', mx: 'auto', width: '100%', }}>
            <Typography sx={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 700, fontSize: { xs: 13, md: 16 }, mb: 4
            }}>
                Please select a staff to display their time-sheet
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <img src={CalendarHolder} alt='calendar-placeholder' />
            </Box>

        </Box>
    }

    const gotoDate = (date) => {
        console.log('loading date', date)
        handleLoadSchedule(moment(date).format('yyyy-MM-DD').toString(), state?.selectedStaffRecord)
    }


    console.log('state calendar pgroup', state)


    return (
        <Box className='timesheetClass' sx={{
            display: 'block', pb: 1, width: '50%',
            bgcolor: '#FBFBFB', borderRadius: '0', height: 'max-content',
            borderLeft: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            {/* Heading of timesheet */}
            <Box sx={{ bgcolor: 'rgba(28, 29, 34, 0.04)' }}>
                {/* Label */}
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', }}>
                    {/* Label */}
                    <Typography sx={{
                        fontSize: { xs: 13, md: 15 },
                        fontWeight: 700, px: 2, py: 2,
                    }}>
                        STAFF TIME SHEET
                    </Typography>
                    {/* Profile picture of the staff */}
                    {state.listOfSelectedStaff?.map(staffRecord =>
                        <Box onClick={switchStaff} id={staffRecord.email}>
                            <ProfileAvatar {...{
                                src: staffRecord?.profilePicture, fullName: staffRecord?.fullName, diameter: 30,
                                styleProp: { mx: .5, border: state.selectedStaffRecord?.email === staffRecord?.email ? '2px solid #BF0606' : 'inherit' }
                            }} />
                        </Box>

                    )}
                </Box>

            </Box>


            {/* TIme sheet of staff goes here */}
            {state.listOfSelectedStaff?.length ?
                <StaffTimeSheet {...{
                    calendar: state?.calendar, fullName: state.selectedStaffRecord?.fullName,
                    showAddTimeButton: Boolean(state.taskId),
                    calendarFor: 'projectGroup', profilePicture: state.selectedStaffRecord?.profilePicture,
                    gotoDate: gotoDate, assignTimeToStaff: openTimeSelectionMenu, startDate: state.startDate, endDate: state.endDate
                }} /> :
                calendarPlaceHolder()}

            {/* Time selection */}
            <Modal open={state.showTimeSelectionMenu} onClose={closeTimeSelectionMenu}>
                {timeSelectionMenu()}
            </Modal>

            {/* Confirm unassigning of task */}
            <Prompt open={state.showPrompt} onClose={closePrompt}
                message={'You are About to unassign this task from this staff'} onProceed={unassignTask} onCancel={closePrompt}
                proceedTooltip={'This will unassign this task from this staff'}
                cancelTooltip={'This will close this prompt, and change nothing'} />

        </Box>
    )
}

export default CalendarTimeSheet