'use client'

import { Avatar, Box, Grid, Paper, Radio, Tooltip, Typography, } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { unassignTask, assignTask as assignTaskToStaff } from "@/Components/redux/newProjectGroup";

import moment from "moment";

import CalendarTimeSheet from "./CalendarTImeSheet";

const singleFilters = ['education'];


function TimeSheet(prop) {
    //props are closeTimeSheet(),  

    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    useEffect(() => {
        console.log("already saved form data is ", savedFormData);
        console.log("already saved filter is", savedFilters);
    }, [savedFilters, savedFormData])


    const [state, setState] = useState({
        currentStep: null, color: '', purpose: '', name: '',
        filters: { ...savedFilters }, staffRecord: prop.staffRecord, allTasks: savedFormData?.tasks,
        selectedFilter: 'filters', suggestions: ['sugges1', 'sugges3sugges3sugges3sugges3sugges3sugges3sugges3sugges3'],
        textInputValue: '', suggestionAnchor: useRef(), showSuggestions: false,
        firstValue: '', filterType: '', secondValue: '', lastValue: false, thirdValue: "",
        taskAssignment: [], selectedTask: {}, assignedIds: []
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        const value = [...savedFormData?.tasks]
        updateState({
            assignedIds: savedFormData.tasks.filter(item => item?.staff?.length).map(task => task?.id),
            allTasks: value?.sort((a, b) => a.id - b.id),
            selectedTask: value?.find(item => item.id.toString() === state.selectedTask?.id?.toString())
        })
    }, [savedFormData])

    console.log('assigned ids from task column', state.assignedIds)


    //Update the task in redux store
    const saveAssignment = (taskId, startTime, staffObject) => {
        const taskRecord = savedFormData.tasks.filter(item => item.id === Number(taskId))[0]
        console.log('taskId', taskId, 'taskRecord', taskRecord, 'staffObject', staffObject)
        const newTaskRecord = { ...taskRecord, startTime: startTime, staff: [...taskRecord?.staff, staffObject] }
        dispatch(assignTaskToStaff({ taskId: taskId, valueObject: newTaskRecord }))
    }

    const assignTask = (time) => {
        if (state.taskAssignment.filter(item => item.task?.id === state.selectedTask?.id).length) {
            console.log('task has been assigned');
            const index = state.taskAssignment.findIndex(item => item.task?.id === state.selectedTask?.id);
            const taskArray = state.taskAssignment;

            taskArray[index] = { task: state.selectedTask, startTime: time, email: state.staffRecord?.email };
            updateState({ taskAssignment: taskArray });

            saveAssignment(state.selectedTask?.id, time, { email: state.staffRecord?.email, profilePicture: state.staffRecord?.profilePicture })
        }
        else {
            console.log('task has not been assigned');

            updateState({ taskAssignment: [...state.taskAssignment, { task: state.selectedTask, startTime: time, email: state.staffRecord?.email }] });

            saveAssignment(state.selectedTask?.id, time, { email: state.staffRecord?.email, profilePicture: state.staffRecord?.profilePicture })
        }
    }

    const unAssignTask = (taskId, staffEmail) => {
        console.log('unassigning the task', taskId, staffEmail)
        dispatch(unassignTask({ taskId: taskId, email: staffEmail }))
        updateState({ taskAssignment: state.taskAssignment.filter(item => item.task?.id !== taskId) })
    }

    const selectTask = (event) => {
        updateState({ selectedTask: state.allTasks?.find(item => item.id.toString() === event.currentTarget.id) })
    }


    const addedTaskCard = ({ id, }) => {
        const taskLabels = [
            { label: 'Date', stateKey1: 'startDate', stateKey2: 'endDate' },
            { label: 'Time - Bank', stateKey1: 'hours', stateKey2: 'minutes' },
            { label: 'Amount', stateKey1: 'taskBudget', stateKey2: null },
        ]

        const taskObject = state.allTasks[state.allTasks.findIndex(item => item.id === id)]

        console.log('selected', state.selectedTask, id, taskObject)

        return <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Paper sx={{
                border: '1px solid rgba(28, 29, 34, 0.1)', borderRadius: '10px',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', whiteSpace: 'break-spaces',
                my: 1.5, width: { xs: 'auto', md: '370px' }
            }}>
                {/* Heading */}
                <Box sx={{
                    flexWrap: 'wrap', alignItems: 'center',
                    pl: 2, pr: 1, py: .3, bgcolor: 'rgba(37, 122, 251, 0.07)',
                    display: 'flex',
                }}>
                    <Typography sx={{ pr: 2, fontWeight: 700, fontSize: { xs: 12, md: 14 } }}>
                        Task {id}
                    </Typography>
                    {state.assignedIds.includes(id) &&
                        <Box sx={{ display: 'flex' }}>
                            {taskObject?.staff?.map(staff =>
                                <Avatar id={staff?.email} sx={{ width: '30px', height: '30px' }} src={staff?.profilePicture} />
                            )}
                        </Box>
                    }
                    <Box sx={{ flexGrow: 1 }} />
                    <Radio id={id} checked={Boolean(state.selectedTask?.id === id)}
                        onChange={selectTask} />
                </Box>

                {/* Name of task */}
                <Box sx={{}}>
                    <Typography sx={{
                        color: '#8D8D8D', fontSize: { xs: 12, md: 14 },
                        bgcolor: 'rgba(28, 29, 34, 0.07)', px: 1, py: .5
                    }}>
                        Name
                    </Typography>
                    <Typography sx={{
                        fontWeight: 600, fontSize: { xs: 12, md: 14 },
                        width: '100%', px: 2, py: 1, display: 'flex',
                        whiteSpace: 'break-spaces', flexWrap: 'wrap'
                    }}>
                        {taskObject.taskName}
                    </Typography>
                </Box>

                {/* Schedule and budget of task */}
                <Box sx={{}}>
                    <Typography sx={{
                        color: '#8D8D8D', fontSize: { xs: 12, md: 14 },
                        bgcolor: 'rgba(28, 29, 34, 0.07)', px: 1, py: .5
                    }}>
                        Schedule and budget
                    </Typography>
                    <Box sx={{ py: 1.5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {taskLabels.map(item => {
                            const duration = () => {
                                const timeDivider = (Number(taskObject.hours) && Number(taskObject.minutes)) ? ':' : '';
                                const hours = Number(taskObject[item.stateKey1]) ? `${taskObject[item.stateKey1]}hrs` : ''
                                const minutes = Number(taskObject[item.stateKey2]) ? `${taskObject[item.stateKey2]}mins` : ''

                                return `${hours}${timeDivider}${minutes}`
                            }

                            const date = () => {
                                const sameDay = taskObject[item.stateKey1] === taskObject[item.stateKey2];

                                return sameDay ? moment(taskObject[item.stateKey1]).format('MMM Do') :
                                    `${moment(taskObject[item.stateKey1]).format('MMM Do')} - ${moment(taskObject[item.stateKey2]).format('Do')}`
                            }

                            return <Box sx={{
                                p: 1, mx: 1.5, my: .5,
                                bgcolor: 'rgba(28, 29, 34, 0.04)', borderRadius: '10px',
                                border: '1px solid rgba(28, 29, 34, 0.1)'
                            }}>
                                <Typography sx={{
                                    color: '#5D5D5D', fontSize: { xs: 12, md: 13 },
                                    fontWeight: 600
                                }}>
                                    {item.label}
                                </Typography>

                                <Typography sx={{
                                    display: 'flex', fontSize: { xs: 12, md: 14 },
                                    color: 'black', fontWeight: 600
                                }}>
                                    {item.stateKey1 === 'taskBudget' && (Number(taskObject[item.stateKey1]).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }).slice(0, -3) || "-")}

                                    {item.stateKey1 === 'startDate' && date()}

                                    {item.stateKey1 === 'hours' && duration(item)}
                                </Typography>
                            </Box>
                        })}
                    </Box>
                </Box>

            </Paper>
        </Box>

    }

    console.log('state for time sheet', state);

    return (
        <Box sx={{
            height: '80vh', transform: 'translate(-50%,-50%)', bgcolor: 'white',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', lg: '80%' },
        }}>
            <Grid container sx={{}}>
                {/* Task section */}
                <Grid item xs={12} md={4} sx={{ height: '80vh', }}>
                    {/* Heading */}
                    <Box sx={{
                        top: 0, bgcolor: 'rgba(28, 29, 34, 0.04)', width: '100%',
                        display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                        boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 3.1, px: { xs: 1.5, sm: 2 }
                    }}>
                        {/* Heading label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                            Tasks to be assigned
                        </Typography>
                    </Box>
                    {/* Content */}
                    <Box sx={{
                        bgcolor: 'white', px: 1.5, pt: 1,
                        height: '100%', maxHeight: '87%', overflowY: 'scroll'
                    }}>
                        {state.allTasks.map(task =>
                            addedTaskCard(task)
                        )}
                    </Box>
                </Grid>
                {/* Time sheet section */}
                <Grid item xs={12} md={8} sx={{ height: '80vh', }}>
                    {/* HEading */}
                    <Box sx={{
                        top: 0, bgcolor: 'rgba(28, 29, 34, 0.06)', borderLeft: '2px solid rgba(28, 29, 34, 0.1)',
                        display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                        boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 1.5, px: { xs: 1.5, sm: 4 }
                    }}>
                        {/* Heading label */}
                        <Avatar src={state.staffRecord.profilePicture} sx={{ width: '50px', height: '50px', mr: 2 }} />
                        <Box sx={{}} >
                            {/* Full name of staff */}
                            <Tooltip title={state.staffRecord.name}>
                                < Typography align="left" noWrap
                                    sx={{
                                        overflowX: 'clip',
                                        fontWeight: 600, fontSize: { xs: 13, md: 15 }
                                    }}>
                                    {state.staffRecord.name}
                                </Typography>
                            </Tooltip>

                            {/* label */}
                            <Typography align="left" noWrap
                                sx={{ py: .5, overflowX: 'clip', color: '#8D8D8D', fontWeight: 500, fontSize: { xs: 13, md: 15 } }}>
                                Time Sheet
                            </Typography>
                        </Box>
                    </Box>
                    {/* Content */}
                    <Box sx={{
                        bgcolor: 'white', px: 0, borderLeft: '2px solid rgba(28, 29, 34, 0.1)',
                        pt: 0, height: '100%', maxHeight: '87%', overflowY: 'scroll'
                    }}>
                        {state.allTasks.length && <CalendarTimeSheet startDate={state.selectedTask?.startDate}
                            hours={state.selectedTask?.hours} budget={state.selectedTask?.taskBudget} id={state.selectedTask?.id}
                            taskName={state.selectedTask?.taskName} minutes={state.selectedTask?.minutes} staffEmail={state.staffRecord?.email} startTime={state.selectedTask?.startTime} oldTasks={state.staffRecord?.tasks}
                            endDate={state.selectedTask?.endDate} assignTask={assignTask} unassignTask={unAssignTask} />}
                    </Box>
                </Grid>
            </Grid>

        </Box>)
}

export default TimeSheet;