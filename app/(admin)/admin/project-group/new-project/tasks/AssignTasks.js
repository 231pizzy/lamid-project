'use client'

import { Box, FormControl, InputLabel, MenuItem, Select, Typography, } from "@mui/material";

import CaretUpIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CaretDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';


import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { unassignTask, assignTask as assignTaskToStaff, allocatedTimeToStaff } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';

import TaskList from "./TaskList";
import StaffList from "./StaffList";

import CalendarTimeSheet from "./CalendarTImeSheet";

export default function AssignTasks({ workPhaseKey, goalKey }) {
    console.log('substep 4 called');
    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const goalData = useMemo(() => {
        return savedFormData.workPhases[workPhaseKey].goals[goalKey]
    }, [savedFormData.workPhases[workPhaseKey].goals[goalKey]])


    const [state, setState] = useState({
        searchValue: '', showExplanation: true, showFilter: false, selectedTask: {}, showTimeSheet: false, staffArray: [],
        showProfile: false, staffProfile: {}, selectedStaffList: [], taskAssignment: [], showContent: true
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const setStaffArray = (dataArray) => {
        updateState({ staffArray: dataArray });
    }


    useEffect(() => {
        const taskId = state.selectedTask?.id;

        const taskAssignmentMapping = goalData.tasks
            .find(task => Number(task.id) === Number(taskId))?.taskAssignmentMapping;

        const membersOfTask = taskAssignmentMapping ? Object.keys(taskAssignmentMapping) : [];
        if (membersOfTask.length) {
            console.log('useeffect SELECTED TASK', membersOfTask)

            updateState({ selectedStaffList: state.staffArray.filter(item => membersOfTask.includes(item?.email)) })
        }

    }, [state.selectedTask])


    useEffect(() => {
        updateState({ selectedTask: { ...goalData.tasks?.find(task => task?.id === state.selectedTask?.id) } })
    }, [goalData.tasks])


    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const closeFilter = (event) => {
        updateState({ showFilter: false })
    };

    const openFilter = (event) => {
        updateState({ showFilter: true })
    }

    const closeProfile = (event) => {
        updateState({ showProfile: false, staffProfile: {} })
    };

    const openProfile = (event) => {

        // console.log('profile', event.currentTarget.id)
        const staffRecord = state.staffList.filter(item => item.email === event.currentTarget.id)

        updateState({ showProfile: true, staffProfile: staffRecord[0] })
    }

    //Update the task in redux store
    const saveAssignment = (taskId, startTime, staffList) => {
        const taskRecord = goalData.tasks.filter(item => item.id === Number(taskId))[0]

        //   console.log('taskId', taskId, 'taskRecord', taskRecord, 'staffList', staffList)

        const newTaskRecord = { ...taskRecord, startTime: startTime, staff: [...taskRecord?.staff, ...staffList] }

        dispatch(assignTaskToStaff({ taskId: taskId, valueObject: newTaskRecord }))
    }

    const assignTask = (time, staffList) => {
        if (state.taskAssignment.filter(item => item.task?.id === state.selectedTask?.id).length) {
            //  console.log('task has been assigned');
            const index = state.taskAssignment.findIndex(item => item.task?.id === state.selectedTask?.id);
            const taskArray = state.taskAssignment;

            taskArray[index] = { task: state.selectedTask, startTime: time, };
            updateState({ taskAssignment: taskArray });

            saveAssignment(state.selectedTask?.id, time, staffList)
        }
        else {
            //  console.log('task has not been assigned');

            updateState({ taskAssignment: [...state.taskAssignment, { task: state.selectedTask, startTime: time, }] });

            saveAssignment(state.selectedTask?.id, time, staffList)
        }
    }

    const unAssignTask = (taskId, staffEmail) => {
        // console.log('unassigning the task', taskId, staffEmail)

        dispatch(unassignTask({ taskId: taskId, email: staffEmail }))

        updateState({ taskAssignment: state.taskAssignment.filter(item => item.task?.id !== taskId) })
    }

    const openTimeSheet = (event) => {
        event.stopPropagation()
        const staffRecord = state.staffList.filter(item => item.email === event.currentTarget.id)
        updateState({ showTimeSheet: true, selectedStaff: staffRecord[0] })
    };

    const closeTimeSheet = (event) => {
        updateState({ showTimeSheet: false, selectedStaff: {} })
    }

    const closeExplanation = (event) => {
        updateState({ showExplanation: false })
    }

    const selectStaff = (staffRecord) => {
        updateState({ selectedStaffList: [...state.selectedStaffList, staffRecord] })
    }

    const unSelectStaff = (email) => {
        console.log('UNSELECTING STAFF', state,)
        updateState({ selectedStaffList: state.selectedStaffList.filter(staffRecord => staffRecord?.email !== email) })
        /* Remove the staff from the taskAssignmentMapping */
        const taskRecordIndex = goalData?.tasks.findIndex(item => Number(item.id) === Number(state.selectedTask?.id));

        const taskRecord = goalData?.tasks[taskRecordIndex];

        const taskAssignment = { ...taskRecord?.taskAssignmentMapping };

        /* Calculate how much time was assign to the staff and add it to the remainingMinutes */
        let remainingMinutes;
        let timeArray = []
        let totalTime = 0;

        if (taskRecord?.remainingMinutes) {
            try {
                timeArray = [...taskAssignment[email]]
                totalTime = timeArray?.length * 30
            } catch (error) {
                console.log(error);
            }
            remainingMinutes = Number(taskRecord?.remainingMinutes) + totalTime
        }

        // console.log('remaining minutes', remainingMinutes);

        taskAssignment ? Reflect.deleteProperty(taskAssignment, email) : false;

        const copy = { ...taskRecord, remainingMinutes: remainingMinutes, taskAssignmentMapping: taskAssignment }

        //   console.log('copy', copy);

        dispatch(allocatedTimeToStaff({
            index: taskRecordIndex, valueObject: copy,
            workPhaseKey: workPhaseKey, goalKey: goalKey
        }));
    }

    const selectTask = (taskRecord) => {
        updateState({ selectedTask: { ...taskRecord } })
    }

    /* const totalItems = useMemo(() => {
        return state.staffList.length
    }, [state.staffList]); */

    const setSearchValue = (event) => {
        updateState({ searchValue: event.currentTarget.value })
    }

    const handleText = (event) => {
        updateState({ textInputValue: event.currentTarget.value })
    }

    const buildSelectMenu = ({ bgcolor, itemList, value, onChangeHandle, stateKey }) => {
        return <Box sx={{
            display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <FormControl
                size='small'
                variant='outlined'
                sx={{ width: 'max-content', pr: 2, }}>
                <InputLabel  >   </InputLabel>
                <Select sx={{
                    fontSize: { xs: 12, md: 13 },
                    fontWeight: 500, border: '1px solid rgba(28, 29, 34, 0.1)',
                    color: '#333333', borderRadius: '16px', bgcolor: bgcolor
                }}
                    /*   startAdornment={<InputAdornment>
                          <Typography sx={{ fontSize: { xs: 12, md: 13 }, mr: 1 }}>
                              Staff Per Page:
                          </Typography>
                      </InputAdornment>} */
                    value={value}
                    //onChange={ (event)=>{addFilter(stateKey,item.name.toLowerCase())}}
                    onChange={onChangeHandle}
                    size='small' >
                    {itemList.map((item, indx) =>
                        <MenuItem key={indx}
                            value={item}
                            sx={{
                                fontSize: { xs: 12, md: 16 },
                                fontWeight: 500, color: '#333333',
                            }}>
                            <Typography sx={{
                                fontSize: { xs: 12, md: 13 }, fontWeight: 600,
                            }}>
                                {item}
                            </Typography>

                        </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    }

    const areAllTasksAssigned = () => {
        const tasksWithoutStaff = goalData.tasks.filter(task => !task.staff.length)
        //  console.log('tasksWithoutStaff', tasksWithoutStaff);

        return tasksWithoutStaff.length
    }

    const showContent = () => {
        updateState({ showContent: !state.showContent });
    }
    const caretStyle = { bgcolor: 'rgba(191, 6, 6, 0.06)', color: '#BF0606', borderRadius: '26.66667px' }


    console.log('state general', state)

    return (
        Boolean(goalData.tasks.length) && <Box sx={{ maxHeight: '100%', height: 'max-content', maxWidth: '100%', pb: 1 }}>
            {/* Heading */}
            <Box sx={{
                px: 3, py: 2, display: 'flex', flexGrow: 1, alignItems: 'center', bgcolor: '#C809C814', cursor: 'pointer'
            }} onClick={showContent}>
                <Typography sx={{
                    fontWeight: 700,
                    fontSize: { xs: 13, md: 15 }, display: 'flex', alignItems: 'center',
                }}>
                    Assign Task To Staff
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {state.showContent ? <CaretUpIcon sx={{ ...caretStyle }} /> : <CaretDownIcon sx={{ ...caretStyle }} />}
            </Box>

            {/* Content */}
            {state.showContent ?
                goalData.tasks.length ? <Box >
                    {/* Tasks */}
                    <TaskList staffRecord={state.selectedStaffList} selectTask={selectTask} goalKey={goalKey}
                        allTasks={goalData?.tasks} closeTimeSheet={closeTimeSheet} workPhaseKey={workPhaseKey} />

                    <Box sx={{
                        position: 'relative', pb: 2,
                        display: 'flex', flexDirection: { xs: 'column', lg: 'row' }
                    }}>

                        {/* Staffs available */}
                        <StaffList selectStaff={selectStaff} unSelectStaff={unSelectStaff} goalKey={goalKey}
                            listOfSelectedStaff={state.selectedStaffList} workPhaseKey={workPhaseKey}
                            setStaffArray={setStaffArray} />

                        {/* Time sheet of staff */}
                        <CalendarTimeSheet startDate={state.selectedTask?.startDate} goalKey={goalKey}
                            hours={state.selectedTask?.hours} budget={state.selectedTask?.taskBudget} id={state.selectedTask?.id}
                            taskName={state.selectedTask?.taskName} minutes={state.selectedTask?.minutes} workPhaseKey={workPhaseKey}
                            startTime={state.selectedTask?.startTime} listOfSelectedStaff={state.selectedStaffList}
                            endDate={state.selectedTask?.endDate} unSelectStaff={unSelectStaff} assignTask={assignTask} />
                    </Box>
                </Box>

                    : <Typography align="center">
                        No tasks to assign. Please add some tasks
                    </Typography> : null}

        </Box >)
}
