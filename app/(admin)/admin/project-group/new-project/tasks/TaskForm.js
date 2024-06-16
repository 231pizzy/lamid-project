'use client'

import { Box, Button, MenuItem, OutlinedInput, Select, Typography } from "@mui/material"
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

import { v4 as uuid } from 'uuid';

const minutes = ['0', '30'];
const theDay = moment().day();
const workWeek = 8;
const defaultDate = theDay === 0 ?
    moment().add(1, 'day').format('yyyy-MM-DD')
    : theDay === 6 ? moment().add(2, 'day').format('yyyy-MM-DD')
        : moment().format('yyyy-MM-DD')

const optionalItems = ['taskBudget'];

export function TaskForm({ showForm, edit, submitAction, editObject, handleShowForm }) {
    const [state, setState] = useState({
        taskName: { value: editObject?.taskName ?? '', errMsg: '' },
        taskBudget: { value: editObject?.taskBudget ?? null, errMsg: '' },
        startDate: { value: editObject?.startDate ?? defaultDate, errMsg: '' },
        endDate: { value: editObject?.endDate ?? defaultDate, errMsg: '' },
        hours: { value: editObject?.hours ?? null, errMsg: '' }, minutes: { value: editObject?.minutes ?? '0', errMsg: '' },
        maxHours: workWeek, emptyTask: false, showForm: showForm,
        editId: '', editObject: {}, promptType: '', detailsId: '', showContent: true
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        //If today is weekend, moved default date to the first working day
        const day = moment().day()
        const date = day === 0 ? moment().add(1, 'day').format('yyyy-MM-DD') : day === 6 ?
            moment().add(2, 'days').format('yyyy-MM-DD') : moment().format('yyyy-MM-DD');

        updateState({
            endDate: { value: date, errMsg: '' }, startDate: { value: date, errMsg: '' }
        });
        //   setTimeout(() => {
        //  prop.setGotoNextFunction(gotoNext);
        // prop.setGotoNextProps(state)
        // }, 100); 
    }, [])


    const hasDatePassed = (date) => {
        return moment(date, 'yyyy-MM-DD').isBefore(moment().format('yyyy-MM-DD'))
    }

    const buttonLabel = edit ? 'Save' : showForm ? 'Save & Add new task' : 'Add new task'

    const isValidDate = () => {
        const startDate = state.startDate.value;
        const endDate = state.endDate.value;

        if (moment(startDate).isAfter(moment(endDate))) {
            console.log('start date should always come before end date', startDate, endDate)
            /* Startdate must come before enddate */
            const startDateError = 'comes before end date';
            const endDateError = 'comes after starts date';

            updateState({
                startDate: { value: startDate, errMsg: startDateError },
                endDate: { value: endDate, errMsg: endDateError }
            })
            return false
        }

        return true

    }

    const handleMinutes = (event) => {
        const value = event.target.value;
        const currentHours = Number(state.hours.value);
        const hours = currentHours === state.maxHours ? currentHours - 1 : currentHours;
        updateState({ minutes: { value: value, errMsg: '' }, hours: { value: hours, errMsg: '' } });
    }

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const filledWithData = useMemo(() => {
        const stateArray = ['endDate', 'hours', 'minutes', 'startDate', 'taskBudget', 'taskName']
        console.log('generating array of form fields that have been filled');

        const hasData = stateArray.map(key => state[key].value ? key : '').filter(item => Boolean(item));

        const hasNoData = stateArray.map(key => (state[key].value || optionalItems.includes(key) || ((key === 'hours' || key === 'minutes') && (state['hours'].value || state['minutes'].value))) ? '' : key).filter(item => Boolean(item));

        return { hasData: hasData, hasNoData: hasNoData }
    }, [state])

    const handleSubmit = (event) => {
        /*  if (!state.showForm && type !== 'assign') {
             handleShowForm({ showForm: true })
         }
         else */
        if (filledWithData.hasNoData.length) {
            console.log('some fields are empty')
            filledWithData.hasNoData.map(item => updateState({ [item]: { ...state[item], errMsg: 'required' } }))
            return 0;
        }
        else if (isValidDate()) {
            submitAction(state)
            updateState({
                taskName: { value: '', errMsg: '' }, taskBudget: { value: '', errMsg: '' },
                startDate: { value: defaultDate, errMsg: '' },
                endDate: { value: defaultDate, errMsg: '' }, maxHours: 8,
                hours: { value: '', errMsg: '' }, minutes: { value: '', errMsg: '' }, emptyTask: false
            })
        }
    }

    const handleText = (event) => {
        const key = event.currentTarget.id;
        let value = event.currentTarget.value

        /* 
        if start and end dates are set, calculate the maxHours by 
        multiplying the number of days by 8.

        If minutes is set and hours=== maxHours, deduct 1 from the hour

        Do not allow hour to exceed maxHours.

        If date is set, reset hours and minutes
        */

        if (key === 'minutes') {
            /* Minute must not exceed 59
               If minutes is set and hours=== maxHours, deduct 1 from the hour
             */
            let error = '';
            let hours = state.hours.value;

            if (Number(value) > 59) {
                value = state.minutes.value;
                error = 'max of 59'
            }
            else if (Number(state.maxHours) === Number(state.hours.value) && Number(value)) {
                hours = Number(hours) - 1;
            }
            updateState({ minutes: { errMsg: error, value: value }, hours: { errMsg: '', value: hours } })
        }
        else if (key === 'startDate') {
            console.log('text handler called')
            let error = '';
            let maxHours = state.maxHours;
            const pastDate = hasDatePassed(value);
            const isWeekend = [0, 6].includes(moment(value, 'yyyy-MM-DD').day())

            /*   if (value && state.endDate.value && moment(value).isAfter(moment(state.endDate.value))) {
                  console.log('start date should always come before end date', value, state.endDate.value)
                 
                  error = 'comes before end date';
                  value = state.startDate.value;
              } */
            if (value && state.endDate.value && !pastDate) {
                console.log('computing max hours', value, state.endDate.value)
                /* If both start and end dates have been set, calculate the maxHours */
                let numberOfDays = moment(state.endDate.value).diff(moment(value), 'days')
                console.log('numOfDays', numberOfDays);

                const sign = numberOfDays / Math.abs(numberOfDays);
                numberOfDays = Math.abs(numberOfDays) + 1;
                /* Build array of weekdays. Exclude weekends */
                const daysArray = Array.from({ length: numberOfDays }).map((_, day) => {
                    const theday = moment(value, 'yyyy-MM-DD').add(day * sign, 'days').day();
                    console.log('start', theday);
                    return ![0, 6].includes(theday) ? 8 : 0
                })

                maxHours = daysArray.reduce((a, b) => a + b, 0)

                console.log('numberOfDays', numberOfDays, 'daysArray', daysArray, 'maxHours', maxHours)
            }
            if (pastDate) {
                error = ''
                value = state.startDate.value;
                /* 
                            updateState({
                                startDate: { value: startDate, errMsg: error },
                            })
                            return false */
            }
            if (isWeekend) {
                /* Do not allow user to choose a weekend day */
                error = 'no weekends'
                value = state.startDate.value;
            }
            value = value ? value : defaultDate;

            /*  If either of the dates is being set, reset hours and minutes */
            updateState({
                startDate: { errMsg: error, value: value }, minutes: { errMsg: '', value: '0' },
                hours: { errMsg: '', value: '' }, maxHours: maxHours
            })
        }
        else if (key === 'endDate') {
            let error = '';
            let maxHours = state.maxHours;
            const pastDate = hasDatePassed(value);
            const isWeekend = [0, 6].includes(moment(value, 'yyyy-MM-DD').day())

            /*    if (value && state.startDate.value && moment(state.startDate.value).isAfter(moment(value))) {
                    
                   error = 'comes after start date';
                   value = state.endDate.value;
               } */
            if (state.startDate.value && value && !pastDate) {
                /* If both start and end dates have been set, calculate the maxHours */
                let numberOfDays = moment(value).diff(moment(state.startDate.value), 'days')

                console.log('number of days', numberOfDays)

                const sign = numberOfDays / Math.abs(numberOfDays);
                numberOfDays = Math.abs(numberOfDays) + 1;
                /* Build array of weekdays. Exclude weekends */
                const daysArray = Array.from({ length: numberOfDays }).map((_, day) => {
                    const theday = moment(state.startDate.value).add(day * sign, 'days').day();
                    console.log('end', theday);
                    return ![0, 6].includes(theday) ? 8 : 0
                })

                maxHours = daysArray.reduce((a, b) => a + b, 0)

                console.log('numberOfDays', numberOfDays, 'daysArray', daysArray, 'maxHours', maxHours)
            }
            if (pastDate) {
                error = ''
                value = state.endDate.value;
                /* 
                            updateState({
                                startDate: { value: startDate, errMsg: error },
                            })
                            return false */
            }
            if (isWeekend) {
                /* Do not allow user to choose a weekend day */
                error = 'no weekends'
                value = state.endDate.value;
            }
            value = value ? value : defaultDate;

            /*  If either of the dates is being set, reset hours and minutes */
            updateState({
                endDate: { errMsg: error, value: value }, minutes: { errMsg: '', value: '0' },
                hours: { errMsg: '', value: '' }, maxHours: maxHours
            })
        }
        else if (key === 'hours') {
            let error = '';
            /* Value must not exceed maxHours */
            if (Number(value) > state.maxHours) {
                error = `Not exceed ${state.maxHours}`;
                value = state.hours.value;
            }
            else if (Number(value) === state.maxHours && Number(state.minutes.value)) {
                value = Number(value) - 1
            }
            updateState({ hours: { errMsg: error, value: value } })
        }
        else {
            updateState({ [key]: { errMsg: (value || optionalItems.includes(key)) ? '' : 'required', value: value } })
        }
    }

    const textInput = ({ label, value, stateKey, labelColor, type, placeholder, multiline, optional }) => {
        return <Box sx={{ pt: 2, pb: 1.5 }}>
            <Typography
                sx={{
                    color: labelColor, mb: 1, display: 'flex',
                    fontWeight: 600, fontSize: { xs: 13, md: 14 }
                }}>
                {label}
                {optional && <Typography sx={{
                    pl: 1, color: '#BF0606',
                    fontWeight: 600, fontSize: { xs: 13, md: 14 }
                }}>
                    (optional)
                </Typography>}

                {state[stateKey].errMsg && <sup>
                    <Typography sx={{
                        pl: 1, color: '#BF0606', display: 'flex',
                        fontWeight: 600, fontSize: { xs: 9, md: 12 }
                    }}>
                        ** {state[stateKey].errMsg}
                        {/*   {(stateKey === 'hours' && state.maxHours && !state.hours.errMsg) && `max: ${state.maxHours} hrs`} */}
                    </Typography>
                </sup>}

                {(stateKey === 'hours' && state.maxHours && !state.hours.errMsg) && <sup>
                    <Typography sx={{
                        pl: 1, color: 'green', display: 'flex',
                        fontWeight: 600, fontSize: { xs: 9, md: 12 }
                    }}>
                        ({`Max: ${state.maxHours} hrs`})
                    </Typography>
                </sup>}

                {(stateKey === 'minutes' && !state.minutes.errMsg) && <sup>
                    <Typography sx={{
                        pl: 1, color: 'green', display: 'flex',
                        fontWeight: 600, fontSize: { xs: 9, md: 12 }
                    }}>
                        ({`Max: 59 mins`})
                    </Typography>
                </sup>}


            </Typography>
            <OutlinedInput id={stateKey}
                fullWidth
                type={type}
                multiline={multiline}
                name={nameValue}
                rows={3}
                /*   onWheel={(e) => { e.preventDefault() }} */
                value={value}
                onChange={handleText}
                placeholder={placeholder}
                sx={{
                    fontWeight: 600, lineHeight: '1.8em',
                    fontSize: 16, letterSpacing: 1, width: (stateKey === 'hours' || stateKey === 'minutes') ? 150 : '100%'
                }} />
        </Box>
    }

    return <Box sx={{ width: '100%', pb: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, pb: 2 }}>
            {/* Name and budget */}
            {showForm && <Box sx={{ width: { xs: '100%', md: '60%' }, }}>
                {/* section Heading */}
                <Typography
                    sx={{
                        color: 'black', bgcolor: 'rgba(28, 29, 34, 0.04)', px: { xs: 1.5, md: 3 }, py: 2,
                        fontWeight: 700, fontSize: { xs: 12, md: 13 }
                    }}>
                    NAME & BUDGET
                </Typography>

                {/* Section content */}
                <Box sx={{ px: { xs: 1.5, md: 3 }, pb: 1 }}>
                    {/* Task name label and input */}
                    {textInput({
                        label: 'Task Name', value: state.taskName.value, stateKey: 'taskName',
                        labelColor: 'black', type: 'text', placeholder: 'Write task name here', multiline: true
                    })}

                    {/* Task budget label and input */}
                    {textInput({
                        label: 'Task Budget', value: state.taskBudget.value, stateKey: 'taskBudget', optional: true,
                        labelColor: 'black', type: 'number', placeholder: 'Eg. 800,000', multiline: false
                    })}
                </Box>

            </Box>}

            {/* Task schedule */}
            {showForm && <Box sx={{
                width: { xs: '100%', md: '40%' }, borderLeft: '2px solid rgba(28, 29, 34, 0.1)',
                borderBottom: '2px solid rgba(28, 29, 34, 0.1)'
            }}>
                {/* section Heading */}
                <Typography
                    sx={{
                        color: 'black', bgcolor: 'rgba(28, 29, 34, 0.04)', px: { xs: 1.5, md: 3 }, py: 2,
                        fontWeight: 700, fontSize: { xs: 12, md: 13 }, display: 'flex'
                    }}>
                    TASK SCHEDULE
                </Typography>

                {/* Date label and input section */}
                <Box sx={{ px: { xs: 1.5, md: 3 }, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {/* Start date */}
                    {textInput({
                        label: 'Start Date', value: state.startDate.value, stateKey: 'startDate', optional: false,
                        labelColor: '#8D8D8D', type: 'date', multiline: false
                    })}

                    {/* End date */}
                    {textInput({
                        label: 'End Date', value: state.endDate.value, stateKey: 'endDate', optional: false,
                        labelColor: '#8D8D8D', type: 'date', multiline: false
                    })}
                </Box>


                {/* Task duration section */}
                <Box>
                    {/* section Heading */}
                    <Typography
                        sx={{
                            color: 'black', bgcolor: 'rgba(28, 29, 34, 0.04)', px: { xs: 1.5, md: 3 }, py: 2,
                            fontWeight: 700, fontSize: { xs: 12, md: 13 }
                        }}>
                        Set the task duration
                    </Typography>
                    {/* Hours and minutes selection */}
                    <Box sx={{ px: { xs: 1.5, md: 3 }, px: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {/* Hours */}
                        {textInput({
                            label: 'Hours', value: state.hours.value, stateKey: 'hours', optional: false,
                            labelColor: '#8D8D8D', type: 'number', placeholder: 'Hours', multiline: false
                        })}

                        {/* Minutes */}
                        {<Box sx={{ flexGrow: 1, ml: 4 }}>
                            {/* Label */}
                            <Typography sx={{ color: '#8D8D8D', fontWeight: 600, fontSize: { xs: 13, md: 14 }, mb: 1, mt: 2 }}>
                                Minutes
                            </Typography>
                            {/* Dropdown menu */}
                            <Select value={state.minutes.value} onChange={handleMinutes} sx={{ minWidth: 100 }}
                        /* disabled={Number(state.hours.value) !== state.maxHours} */>
                                {minutes.map((minute, index) => <MenuItem key={index} value={minute}>
                                    {minute}
                                </MenuItem>)}
                            </Select>
                        </Box>}
                    </Box>
                </Box>
            </Box>}


        </Box>


        {/* Buttons */}
        <Box align='right' sx={{ px: 4, my: { xs: 2, lg: 2 } }}>
            {/* Button for adding new task */}
            {!state.editId && <Button variant='outlined' /* onClick={(event) => { addNewTask(event, state) }} */
                onClick={handleSubmit}
                sx={{ fontWeight: 700, fontSize: { xs: 12, md: 13 } }}>
                {buttonLabel}
            </Button>}

            {/* Button for assigning task to a staff */}
            {/*                     {!state.editId && <Button variant='contained' onClick={() => { gotoNext(state) }}
            sx={{ fontWeight: 700, ml: 4, fontSize: { xs: 12, md: 13 } }}>
            {state.showForm ? 'Save & Assign task' : 'Assign task'}
        </Button>} */}
        </Box>
    </Box>

}