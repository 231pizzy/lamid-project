'use client'

import { Box, OutlinedInput, Typography, } from "@mui/material";

import Close from '@mui/icons-material/Close';

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";

import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';

import { TaskForm } from "./TaskForm";

const optionalItems = ['taskBudget'];

const workWeek = 8;

function EditTask({ taskDetails, workPhaseKey, goalKey, taskId, cancelEdit, closeEditForm }) {
    const dispatch = useDispatch();
    const editObject = taskDetails;

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    console.log('global state', savedFormData)

    const goalData = useMemo(() => {
        return savedFormData.workPhases[workPhaseKey].goals[goalKey]
    }, [savedFormData.workPhases[workPhaseKey].goals[goalKey]])

    const [state, setState] = useState({
        taskName: { value: editObject?.taskName, errMsg: '' }, taskBudget: { value: editObject?.taskBudget, errMsg: '' },
        startDate: { value: editObject?.startDate, errMsg: '' },
        endDate: { value: editObject?.endDate, errMsg: '' },
        hours: { value: editObject?.hours, errMsg: '' }, minutes: { value: editObject?.minutes, errMsg: '' },
        maxHours: workWeek,
        allTasks: [], id: 1, editId: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    //calculate max hours
    useEffect(() => {
        if (state.startDate.value && state.endDate.value) {
            let numberOfDays = moment(state.endDate.value).diff(moment(state.startDate.value), 'days')
            console.log('numOfDays', numberOfDays);

            const sign = numberOfDays / Math.abs(numberOfDays);
            numberOfDays = Math.abs(numberOfDays) + 1;
            /* Build array of weekdays. Exclude weekends */
            const daysArray = Array.from({ length: numberOfDays }).map((_, day) => {
                const theday = moment(state.startDate.value, 'yyyy-MM-DD').add(day * sign, 'days').day();
                console.log('start', theday);
                return ![0, 6].includes(theday) ? 8 : 0
            })

            const maxHours = daysArray.reduce((a, b) => a + b, 0)
            updateState({ maxHours: maxHours })
            console.log('numberOfDays', numberOfDays, 'daysArray', daysArray, 'maxHours', maxHours)
        }
    }, [])

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const hasDatePassed = (date) => {
        return moment(date, 'yyyy-MM-DD').isBefore(moment().format('yyyy-MM-DD'))
    }

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
        /*   else if (hasDatePassed(startDate)) {
              const error = 'date has pass'
  
              updateState({
                  startDate: { value: startDate, errMsg: error },
              })
              return false
          }
          else if (hasDatePassed(endDate)) {
              const error = 'date has pass'
  
              updateState({
                  endDate: { value: endDate, errMsg: error }
              })
              return false
          } */
        return true

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

            value = value ? value : moment().format('yyyy-MM-DD');

            /*  If either of the dates is being set, reset hours and minutes */
            updateState({
                startDate: { errMsg: error, value: value }, minutes: { errMsg: '', value: '' },
                hours: { errMsg: '', value: '' }, maxHours: maxHours, endDate: { errMsg: '', value: state.endDate.value }
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
                value = state.startDate.value;
            }

            value = value ? value : moment().format('yyyy-MM-DD');

            /*  If either of the dates is being set, reset hours and minutes */
            updateState({
                endDate: { errMsg: error, value: value }, minutes: { errMsg: '', value: '' },
                hours: { errMsg: '', value: '' }, maxHours: maxHours, startDate: { errMsg: '', value: state.startDate.value },
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

    const saveEdit = (payload) => {
        /*   console.log('saving edit')
          if (filledWithData.hasNoData.length) {
              console.log('some fields are empty')
              filledWithData.hasNoData.map(item => updateState({ [item]: { ...state[item], errMsg: 'required' } }))
          }
          else if (isValidDate()) { */
        console.log('all fields filled', taskId);
        const timeBankDifference = ((Number(payload.hours.value || 0) * 60) + Number(payload.minutes.value || 0)) -
            ((Number(editObject.hours || 0) * 60) + Number(editObject.minutes || 0));

        const remainingMinutes = editObject?.remainingMinutes >= 0 && timeBankDifference >= 0 ? Number(editObject?.remainingMinutes ?? 0) + timeBankDifference : ((Number(payload.hours.value || 0) * 60) + Number(payload.minutes.value || 0))

        const taskObj = {
            ...editObject,
            taskName: payload.taskName.value, id: taskId, taskBudget: payload.taskBudget.value,
            startDate: payload.startDate.value, endDate: payload.endDate.value, hours: payload.hours.value,
            minutes: payload.minutes.value, staff: editObject?.staff ?? [], status: 'toDo',
            remainingMinutes: remainingMinutes,
            taskAssignmentMapping: timeBankDifference < 0 ? {} : editObject.taskAssignmentMapping
        };

        /*   console.log('after edit effect', (Number(state.hours.value || 0) * 60), Number(state.minutes.value || 0),
              (Number(editObject.hours || 0) * 60), editObject, timeBankDifference, remainingMinutes);
*/
        const taskIndex = goalData.tasks.findIndex(task => Number(task.id) === Number(taskId))

        const copy = [...goalData.tasks];
        copy[taskIndex] = taskObj;

        console.log('copy,taskObj', copy, taskObj);

        const record = {
            ...savedFormData.workPhases, [workPhaseKey]: {
                ...savedFormData.workPhases[workPhaseKey], goals: {
                    ...savedFormData.workPhases[workPhaseKey].goals, [goalKey]: {
                        ...goalData, tasks: [...copy]
                    }
                }
            }
        }

        dispatch(updateProjectGroupData({ update: { workPhases: record } }));

        closeEditForm()

        return 1
        //  }
    }

    const handleCancelEdit = (event) => {
        console.log('canceling edit')
        cancelEdit()
    }

    const filledWithData = useMemo(() => {
        const stateArray = ['endDate', 'hours', 'minutes', 'startDate', 'taskBudget', 'taskName']
        console.log('generating array of form fields that have been filled')
        const hasData = stateArray.map(key => state[key].value ? key : '').filter(item => Boolean(item))
        const hasNoData = stateArray.map(key => (state[key].value || optionalItems.includes(key) || ((key === 'hours' || key === 'minutes') && (state['hours'].value || state['minutes'].value))) ? '' : key).filter(item => Boolean(item))
        return { hasData: hasData, hasNoData: hasNoData }
    }, [state])

    console.log('filledWithData', filledWithData);


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
                        fontWeight: 600, fontSize: { xs: 8, md: 10 }
                    }}>
                        ** {state[stateKey].errMsg}
                        {(stateKey === 'hours' && state.maxHours && !state.hours.errMsg) && `max: ${state.maxHours} hrs`}
                    </Typography>
                </sup>}

                {(stateKey === 'hours' && state.maxHours && !state.hours.errMsg) && <sup>
                    <Typography sx={{
                        pl: 1, color: 'green', display: 'flex',
                        fontWeight: 600, fontSize: { xs: 8, md: 10 }
                    }}>
                        {`max: ${state.maxHours} hrs`}
                    </Typography>
                </sup>}

                {(stateKey === 'minutes' && !state.minutes.errMsg) && <sup>
                    <Typography sx={{
                        pl: 1, color: 'green', display: 'flex',
                        fontWeight: 600, fontSize: { xs: 8, md: 10 }
                    }}>
                        {`max: 59 mins`}
                    </Typography>
                </sup>}


            </Typography>
            <OutlinedInput id={stateKey}
                fullWidth
                type={type}
                multiline={multiline}
                name={nameValue}
                rows={3}
                value={value}
                onChange={handleText}
                placeholder={placeholder}
                sx={{
                    fontWeight: 600, lineHeight: '1.8em',
                    fontSize: 16, letterSpacing: 1, width: (stateKey === 'hours' || stateKey === 'minutes') ? 150 : '100%'
                }} />
        </Box>
    }


    console.log('state', state)

    return (
        <Box sx={{
            height: { xs: '80vh', lg: 'max-content' }, transform: 'translate(-50%,-50%)', bgcolor: 'white',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', lg: '75%' },
        }}>
            {/* Heading */}
            <Typography
                sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontWeight: 700, fontSize: { xs: 14, md: 15 },
                    bgcolor: 'rgba(0, 128, 0, 0.1)', px: { xs: 1.5, md: 3 }, py: 2
                }}>
                Edit Task -{taskId}
                <Close onClick={handleCancelEdit} />
            </Typography>

            {/* Content */}
            <Box sx={{
                width: '100%', overflowY: 'scroll', maxHeight: { xs: '90%', md: 'max-content' },
                display: 'flex', flexWrap: 'wrap', bgcolor: 'white',
            }}>
                <TaskForm {...{
                    submitAction: saveEdit, edit: true, showForm: true, editObject: editObject,
                    handleShowForm: ({ showForm }) => { updateState({ showForm: showForm }) }
                }} />

            </Box>

        </Box>)
}

export default EditTask;