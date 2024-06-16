'use client'

import {
    Box,
} from "@mui/material";


import { useState, useEffect } from "react";

import { CalendarTimeSheet } from "./CalendarTImeSheet";

import moment from "moment";

const calendar = [
    {
        startDate: '2023-06-14',
        startTime: '9:40 am',
        endTime: '10:30 am',
        hours: '32',
        minutes: '',
        endDate: '2023-06-17',
        type: 'reminder',
        budget: 20001,
        label: 'Draft the design',
        state: 'toDo',
        description: 'Daniel davies will having his birthday today'
    },
    {
        startDate: '2023-06-18',
        startTime: '9:20 am',
        hours: '3',
        minutes: '20',
        endTime: '12:30 pm',
        endDate: '2023-06-19',
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
    },
];


export default function TimeSheet(prop) {
    const [state, setState] = useState({
        email: prop.email, currentTab: 0, calendar: [], tasksToday: [],
        usedTimeToday: '', usedTimeThisWeek: '', date: moment().toDate()
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    const schedule = calendar;

    const generateTaskSchedule = (schedule) => {
        const daysEvents = [];

        schedule.map(taskObject => {
            console.log('taskObject', taskObject?.id, taskObject);

            let hoursUsed = 0;
            let minutesUsed = 0;
            const workWeek = 8;
            const minutes = Number(taskObject.minutes);
            const resumptionTime = '8:00 am';
            const numberOfDays = moment(taskObject.endDate).diff(moment(taskObject.startDate), 'days');

            const daysArray = Array.from({ length: numberOfDays }, (_, index) => index + 1);

            let remainingHours = daysArray.map((day) => {
                const theday = moment(taskObject.startDate).add(day, 'days').day();
                console.log('end', theday);
                return ![0, 6].includes(theday) ? 8 : 0
            }).filter(item => item > 0).reduce((a, b) => a + b, 0)

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

            console.

                hoursUsed += hoursAvailable;

            remainingHours = remainingHours - workWeek;

            daysEvents.push({
                ...taskObject, startTime: startTime, startDate: startDate, endTime: endTime,
                endDate: endDate, start: start, end: end, hours: hours, minutes: minutes1, title: `${taskObject.taskName}`
            });



            if (numberOfDays) {
                daysArray.map(((day, indx) => {
                    if ([0, 6].includes(moment(taskObject.startDate).add(day, 'days').day())) {
                        return 0;
                    }
                    else if (daysArray.length === indx + 1) {
                        const start = moment(`${taskObject.startDate} ${resumptionTime}`, 'yyyy-MM-DD h:mm a').add(day, 'days').toDate()

                        const end = moment(`${taskObject.startDate} ${lastDayEndTime}`, 'yyyy-MM-DD h:mm a').add(day, 'days').toDate()

                        const startTime = moment(start.toString()).format('h:mm a')
                        const startDate = moment(start.toString()).format('yyyy-MM-DD')
                        const endTime = moment(end.toString()).format('h:mm a')
                        const endDate = moment(end.toString()).format('yyyy-MM-DD')
                        const hours = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'hours').toString();
                        const minutes1 = moment(endTime, 'h:mm a').diff(moment(startTime, 'h:mm a'), 'minutes').toString();

                        hoursUsed += remainingHours
                        daysEvents.push({
                            ...taskObject, startTime: startTime, startDate: startDate, endTime: endTime,
                            endDate: endDate, start: start, end: end, hours: hours, minutes: minutes1,
                            title: `${taskObject.taskName}`
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

                        daysEvents.push({
                            ...taskObject, startTime: startTime, startDate: startDate, endTime: endTime,
                            endDate: endDate, start: start, end: end, hours: hours, minutes: minutes1,
                            title: `${taskObject.taskName}`
                        });
                    }
                    else {
                        return 0;
                    }
                    remainingHours = remainingHours - workWeek;
                }))
            }

        });

        console.log('daysEvent', daysEvents);
        return daysEvents;
    }

    useEffect(() => {
        updateState({ calendar: generateTaskSchedule(schedule) });
    }, []);

    useEffect(() => {
        //If selected date changes, then find all the tasks for today
        const date = moment(state.date);
        updateState({ tasksToday: state.calendar.filter(item => moment(item.startDate, 'yyyy-MM-DD').isSame(date, 'day')) })
    }, [state.date]);


    const switchTab = (event, index) => {
        updateState({ currentTab: index })
    }


    const gotoDate = (date) => {
        updateState({ date: date })
    }

    console.log('papa timesheet state', state)

    return (
        <Box sx={{
            display: 'flex', alignItems: 'flex-start',
            flexWrap: { xs: 'wrap', lg: 'inherit' }, overflowY: 'hidden'
        }}>
            {/* Timesheet */}
            <Box sx={{ width: { xs: '100%', md: '100%', lg: '95%', xl: '80%' }, borderRadius: '12px' }}>
                <CalendarTimeSheet calendar={state.calendar} gotoDate={gotoDate} startDate={state.date}
                    endDate={null} />
            </Box>
        </Box>
    )
}
