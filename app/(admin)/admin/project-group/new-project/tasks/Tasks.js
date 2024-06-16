'use client'

import { Box, Modal, Tooltip, Typography, } from "@mui/material";

import CaretUpIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CaretDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import Close2Icon from '@mui/icons-material/CloseTwoTone';

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';
import Prompt from "@/Components/Prompt";

import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";

const optionalItems = ['taskBudget'];

const workWeek = 8;

const theDay = moment().day();

const defaultDate = theDay === 0 ?
    moment().add(1, 'day').format('yyyy-MM-DD')
    : theDay === 6 ? moment().add(2, 'day').format('yyyy-MM-DD')
        : moment().format('yyyy-MM-DD')


export default function Tasks({ workPhaseKey, goalKey, single }) {

    console.log('phasekey, goalkey', workPhaseKey, goalKey);
    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    console.log('substep 3 saved formdata', savedFormData);

    const goalData = useMemo(() => {
        return savedFormData.workPhases[workPhaseKey].goals[goalKey]
    }, [savedFormData.workPhases[workPhaseKey].goals[goalKey]])

    const [state, setState] = useState({
        emptyTask: false, showForm: false,
        allTasks: goalData.tasks,
        id: Number(goalData?.lastId ?? 0) + 1,
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
            showForm: !state.allTasks.length,
            endDate: { value: date, errMsg: '' }, startDate: { value: date, errMsg: '' }
        });

    }, [])

    useEffect(() => {
        console.log('las')
        updateState({ allTasks: [...goalData.tasks], id: Number(goalData.lastId ?? 0) + 1 })
    }, [goalData]);

    //generate unique name for text field
    let nameValue = uuid()

    const sendDataToRedux = (taskObject) => {
        dispatch(updateProjectGroupData({
            update: {
                workPhases: {
                    ...savedFormData.workPhases,
                    [workPhaseKey]: {
                        ...savedFormData.workPhases[workPhaseKey],
                        goals: {
                            ...savedFormData.workPhases[workPhaseKey].goals,
                            [goalKey]: {
                                ...savedFormData.workPhases[workPhaseKey].goals[goalKey],
                                tasks: [...goalData.tasks, taskObject], lastId: goalData.tasks.length + 1
                            }
                        }
                    }
                }
            }
        }))
    }

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
        /*     else if (hasDatePassed(startDate)) {
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

    const closeTaskForm = (id) => {
        updateState({
            showForm: false, taskName: { value: '', errMsg: '' }, taskBudget: { value: '', errMsg: '' },
            startDate: { value: moment().format('yyyy-MM-DD'), errMsg: '' },
            endDate: { value: moment().format('yyyy-MM-DD'), errMsg: '' },
            hours: { value: null, errMsg: '' }, minutes: { value: null, errMsg: '' },
            maxHours: workWeek, deleteId: ''
        })
    }


    const openDeletePrompt = ({ type, id }) => {
        updateState({ deleteId: id, promptType: type })
    }

    const closeDeletePrompt = (event) => {
        updateState({ deleteId: '', promptType: '' })
    }

    const showTaskDetails = (id) => {
        updateState({ detailsId: id })
    }

    const closeTaskDetails = () => {
        updateState({ detailsId: '' })
    }

    const deleteTask = (id) => {
        console.log('deleting task id', id);
        //  const id = state.deleteId;
        updateState({
            allTasks: state.allTasks?.filter(item => item.id.toString() !== id.toString()).map((item, indx) => {
                return { ...item, id: indx + 1 }
            }),/*  deleteId: '', */ detailsId: null,
            promptType: '', id: state.allTasks.length === 1 ? 1 : state.allTasks.length
        });
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

    const handleMinutes = (event) => {
        const value = event.target.value;
        const currentHours = Number(state.hours.value);
        const hours = currentHours === state.maxHours ? currentHours - 1 : currentHours;
        updateState({ minutes: { value: value, errMsg: '' }, hours: { value: hours, errMsg: '' } });
    }

    const addNewTask = (payload) => {
        console.log('add task called')
        /*   if (!state.showForm && type !== 'assign') {
              updateState({ showForm: true })
          }
          else if (filledWithData.hasNoData.length) {
              console.log('some fields are empty')
              filledWithData.hasNoData.map(item => updateState({ [item]: { ...state[item], errMsg: 'required' } }))
              return 0;
          }
          else if (isValidDate()) { */
        console.log('all fields filled', payload, state.id,)
        const data = {
            id: state.id, taskName: payload.taskName.value, taskBudget: payload.taskBudget.value,
            startDate: payload.startDate.value, endDate: payload.endDate.value, hours: payload.hours.value,
            minutes: Number(payload.minutes.value), state: 'new', status: 'toDo', staff: []
        };

        updateState({
            taskName: { value: '', errMsg: '' }, taskBudget: { value: '', errMsg: '' },
            startDate: { value: defaultDate, errMsg: '' },
            endDate: { value: defaultDate, errMsg: '' }, maxHours: 8,
            hours: { value: '', errMsg: '' }, minutes: { value: '', errMsg: '' }, emptyTask: false
        })

        //send data to global store
        sendDataToRedux(data)
        /*  dispatch(updateProjectGroupData({
             update: {
                 tasks: [...goalData.tasks, data],
                 lastId: goalData.tasks?.length + 1
             }
         })) */
        console.log('state after new task', state);
        return 1
        // }
    }

    const editTask = (taskId) => {
        const id = Number(taskId);
        const object = state.allTasks.find(item => item.id === id);
        console.log('editing', id, object);

        updateState({
            editId: id, editObject: object, taskName: { value: object.taskName, errMsg: '' }, taskBudget: { value: object.taskBudget, errMsg: '' }, startDate: { value: defaultDate, errMsg: '' },
            endDate: { value: defaultDate, errMsg: '' },
            hours: { value: object.hours, errMsg: '' }, minutes: { value: object.minutes, errMsg: '' },
        })
    }

    const saveEdit = ({ taskName, taskBudget, startDate, endDate, hours, minutes, staff }) => {

        const array = state.allTasks;
        const index = array.findIndex(item => item.id === state.editId);
        console.log('all fields filled... saving edit at index', index, array, staff);

        array[index] = {
            taskName: taskName, id: state.editId, taskBudget: taskBudget, startDate: startDate,
            endDate: endDate, hours: hours, minutes: minutes, staff: [...staff], state: 'new'
        };

        updateState({
            allTasks: array, taskName: { value: '', errMsg: '' }, taskBudget: { value: '', errMsg: '' },
            startDate: { value: defaultDate, errMsg: '' },
            endDate: { value: defaultDate, errMsg: '' },
            hours: { value: '', errMsg: '' }, minutes: { value: '', errMsg: '' }, editId: ''
        });

    }

    const cancelEdit = (event) => {
        console.log('canceling edit')
        updateState({
            editId: '', taskName: { value: '', errMsg: '' }, taskBudget: { value: '', errMsg: '' },
            startDate: { value: defaultDate, errMsg: '' },
            endDate: { value: defaultDate, errMsg: '' },
            hours: { value: '', errMsg: '' }, minutes: { value: '', errMsg: '' },
        })
    }

    const showContent = () => {
        updateState({ showContent: !state.showContent });
    }

    const caretStyle = { bgcolor: 'rgba(191, 6, 6, 0.06)', color: '#BF0606', borderRadius: '26.66667px' }

    console.log('state', state)

    return (
        <Box sx={{ maxHeight: 'max-content', maxWidth: '100%', pb: 1 }}>
            {/* Heading */}
            <Typography onClick={showContent}
                sx={{
                    display: 'flex', alignItems: 'center', cursor: 'pointer',
                    fontWeight: 700, fontSize: { xs: 14, md: 15 },
                    bgcolor: '#0080001A', px: { xs: 1.5, md: 3 }, py: 2
                }}>

                Task Under {!single && `Phase ${workPhaseKey}`} Goal {!single && `- ${goalKey}`}

                <Box sx={{ flexGrow: 1 }} />

                {state.showContent ? <CaretUpIcon sx={{ ...caretStyle }} /> : <CaretDownIcon sx={{ ...caretStyle }} />}

                {state.emptyTask && <Typography sx={{
                    color: 'red', alignItems: 'center', ml: 2,
                    display: 'flex', fontSize: { xs: 11, md: 12 }
                }}>
                    Add at least one task
                </Typography>}


            </Typography>

            {/* Saved Tasks */}
            {state.showContent && <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {state.allTasks.map(task =>
                    <TaskCard detailed={false} taskObject={task} cancelEdit={cancelEdit} saveEdit={saveEdit}
                        deleteTask={deleteTask} closeTaskForm={closeTaskForm} showTaskDetails={showTaskDetails}
                        workPhaseKey={workPhaseKey} goalKey={goalKey} />
                    /*    addedTaskCard({ id: task?.id, detailed: false }) */
                )}
            </Box>}

            {/* Task id */}
            {state.showForm && <Typography
                sx={{
                    color: 'black', bgcolor: 'rgba(37, 122, 251, 0.07)', px: { xs: 1.5, md: 3 }, py: 2,
                    fontWeight: 700, fontSize: { xs: 13, md: 14 }, display: 'flex'
                }}>
                TASK - {state.id}
                <Tooltip title='cancel this task' onClick={() => { openDeletePrompt({ type: 'cancel', id: state.id }) }}>
                    <Close2Icon onClick={() => { openDeletePrompt({ type: 'cancel', id: state.id }) }}
                        sx={{ cursor: 'pointer', ml: 1, bgcolor: 'rgba(191, 6, 6, 0.1)', borderRadius: '26.66667px', fontSize: '20px', color: '#BF0606' }} />
                </Tooltip>

            </Typography>}

            {/* Content */}
            {state.showContent &&
                <TaskForm {...{
                    showForm: state.showForm, edit: false, submitAction: addNewTask,
                    handleShowForm: ({ showForm }) => { updateState({ showForm: showForm }) }
                }} />
            }


            {/* Edit task modal */}
            {/*   <Modal open={Boolean(state.editId)} onClose={cancelEdit}>
                <EditTask taskId={state.editId} taskDetails={state.editObject} cancelEdit={cancelEdit} saveEdit={saveEdit}
                    workPhaseKey={workPhaseKey} goalKey={goalKey} />
            </Modal> */}

            {/* Task detail modal */}
            {Boolean(state.detailsId) && <Modal open={Boolean(state.detailsId)} onClose={closeTaskDetails}>
                <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                    <TaskCard detailed={true}
                        taskObject={state.allTasks[state.allTasks.findIndex(item => item.id === state?.detailsId)]}
                        cancelEdit={cancelEdit} saveEdit={saveEdit} deleteTask={deleteTask} closeTaskDetails={closeTaskDetails}
                        editTask={editTask} workPhaseKey={workPhaseKey} goalKey={goalKey} />
                    {/*   {addedTaskCard({ id: state.detailsId, detailed: true })} */}
                </Box>
            </Modal>}

            {/* Confirm delete */}
            <Prompt open={state.deleteId} onClose={closeDeletePrompt}
                message={state.promptType === 'delete' ? 'You are About to delete this task' :
                    'You are About to cancel the creation of this task'} onProceed={(state.promptType === 'delete') ? deleteTask : closeTaskForm} onCancel={closeDeletePrompt} proceedTooltip={'This will clear all the text fields and close the form'}
                cancelTooltip={'This will close this prompt'} />

        </Box>)
} 