'use client'

import { Box, Modal, Paper, Tooltip, Typography } from "@mui/material";

/* import { DeleteSvg, EditSvg, TimerSvg } from "../icons/icons"; */

import NextIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useEffect, useMemo, useState } from "react";
import Prompt from "@/Components/Prompt";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectGroupData } from "@/Components/redux//newProjectGroup";


import { ProfileAvatar } from "@/Components/ProfileAvatar";

import EditTask from "./EditTask";

import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";
import IconElement from "@/Components/IconElement";

const DeleteSvg = '/icons/DeleteSvg.svg'
const EditSvg = '/icons/EditSvg.svg'
const TimerSvg = '/icons/timerSvg.svg'

const taskLabels = [
    { label: 'Date', stateKey1: 'startDate', stateKey2: 'endDate' },
    { label: 'Duration', stateKey1: 'hours', stateKey2: 'minutes' },
    { label: 'Amount', stateKey1: 'taskBudget', stateKey2: null },
]


export function TaskCard({ detailed, taskObject, deleteTask, closeTaskDetails,
    showTaskDetails, selectTask, selectable, selected, workPhaseKey, goalKey }) {

    const id = taskObject?.id;

    console.log('id', id, workPhaseKey, goalKey)

    //  const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const allTasks = useSelector(state => state.newProjectGroup.projectData);
    const dispatch = useDispatch()

    const goalData = useMemo(() => {
        return allTasks.workPhases[workPhaseKey].goals[goalKey]
    }, [allTasks.workPhases[workPhaseKey].goals[goalKey]])


    const [state, setState] = useState({
        deleteId: null, promptType: '', taskMembers: [], taskAssignmentMapping: {},
        editId: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        const membersObject = goalData.tasks?.find(task => Number(task.id) === Number(id))?.taskAssignmentMapping
        // console.log('members', membersObject)
        updateState({ taskMembers: membersObject ? Object.keys(membersObject) : [], taskAssignmentMapping: membersObject ?? {} })
    }, [goalData])


    const openDeletePrompt = ({ event, type, id }) => {
        event.stopPropagation();

        updateState({ deleteId: id, promptType: type })
    }

    const closeDeletePrompt = (event) => {
        updateState({ deleteId: '', promptType: '' })
    }

    const handleShowTaskDetails = (event) => {
        event.stopPropagation();
        showTaskDetails(Number(event.target.id))
        //updateState({ detailsId: Number(event.target.id) })
    }

    const closeTaskDetail = () => {
        closeTaskDetails()
    }

    const handleDeleteTask = () => {
        const tasksWithoutDeleted = goalData.tasks.filter(task => Number(task.id) !== Number(id)).map((item, index) => {
            return { ...item, id: index + 1 }
        });

        const record = {
            ...allTasks.workPhases, [workPhaseKey]: {
                ...allTasks.workPhases[workPhaseKey], goals: {
                    ...allTasks.workPhases[workPhaseKey].goals, [goalKey]: {
                        ...goalData, tasks: [...tasksWithoutDeleted], lastId: tasksWithoutDeleted?.length
                    }
                }
            }
        }

        dispatch(updateProjectGroupData({ update: { workPhases: record } }))
        closeDeletePrompt();
        closeTaskDetail()
    }

    const formatUsedTime = (timeInMinutes) => {
        const hours = Math.trunc(timeInMinutes / 60);
        const hourStr = hours ? hours > 1 ? `${hours}hrs` : `${hours}hrs` : '';
        const mins = timeInMinutes % 60;
        const minStr = mins ? mins > 1 ? `${mins}mins` : `${mins}min` : '';

        const time = `${hourStr} ${minStr}`

        return time;
    }


    const closePrompt = () => {
        updateState({ deleteId: null })
    }

    const handleEditTask = (event) => {
        console.log('id-edit', id)
        editTask(id)
    }

    const handleTaskClick = () => {
        console.log('selecting task', id)
        selectable && selectTask(id)
    }

    const calculateAssignedTime = (email) => {
        try {
            const assignedTimeArray = state.taskAssignmentMapping[email];
            return formatUsedTime(assignedTimeArray.length * 30);
        } catch (error) {
            console.log(error)
        }
    }

    const closeEditForm = () => {
        updateState({ editId: null });
    }

    const editTask = () => {
        updateState({ editId: id });
    }

    const fullyAssigned = taskObject?.remainingMinutes === 0;

    console.log('task card state', state);

    return <Box>
        {taskObject && <Paper id={id} sx={{
            border: selected ? '3px solid #BF0606' : '1px solid rgba(28, 29, 34, 0.1)', borderRadius: '10px',
            boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', whiteSpace: 'break-spaces',
            my: 2, mx: { xs: 1.5, md: 3 }, maxWidth: { xs: 'auto', md: '600px' }, pb: 1
        }} onClick={handleTaskClick}>
            {/* Heading */}
            <Box sx={{
                flexWrap: 'wrap',
                pl: 2, pr: 1, py: 1.5, bgcolor: fullyAssigned ? '#f8e2e2' : 'rgba(37, 122, 251, 0.07)',
                display: 'flex', alignItems: 'center'
            }}>
                <Typography sx={{ fontWeight: 700, fontSize: detailed ? { xs: 15, md: 17 } : { xs: 12, md: 14 }, textTransform: 'uppercase' }}>
                    Task {id} {detailed && 'Details'}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
                {detailed ? <Box>
                    <Tooltip id={id} onClick={handleEditTask}
                        title={`Edit details of task ${id}`}  >
                        <IconElement {...{
                            src: EditSvg, id: id, onclick: handleEditTask,
                            style: { color: '#040921', height: '32px', width: '32px', marginRight: '32px' }
                        }} />
                    </Tooltip>

                    <Tooltip id={id} /* onClick={(e) => { console.log('sd'); }} */
                        title={`Delete task ${id}`}  >
                        <IconElement {...{
                            src: DeleteSvg, id: id, onclick: (e) => { openDeletePrompt({ event: e, type: 'delete', id: id }) },
                            style: { bgcolor: 'white', color: '#040921', height: '32px', width: '32px' }
                        }} />
                    </Tooltip>
                </Box> :
                    <Typography id={id} sx={{
                        display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600,
                        color: '#BF0606', cursor: 'pointer'
                    }} onClick={handleShowTaskDetails}>
                        See details
                        <NextIcon />
                    </Typography>}
            </Box>

            {/* Name of task */}
            {detailed && <Box sx={{}}>
                <Typography sx={{
                    color: '#8D8D8D', fontSize: { xs: 12, md: 14 }, fontWeight: 600,
                    bgcolor: 'rgba(28, 29, 34, 0.07)', px: 2, py: 1
                }}>
                    Name
                </Typography>
                <Typography sx={{
                    fontWeight: 600, fontSize: { xs: 12, md: 14 },
                    width: '100%', px: 2, py: 1.5, display: 'flex',
                    whiteSpace: 'break-spaces', flexWrap: 'wrap'
                }}>
                    {taskObject.taskName}
                </Typography>
            </Box>}

            {/* Schedule and budget of task */}
            <Box sx={{}}>
                {detailed && <Typography sx={{
                    color: '#8D8D8D', fontSize: { xs: 12, md: 14 }, fontWeight: 600,
                    bgcolor: 'rgba(28, 29, 34, 0.07)', px: 1.5, py: 1
                }}>
                    Schedule and budget
                </Typography>}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {taskLabels.map(item => {
                        const duration = () => {
                            const timeDivider = (Number(taskObject.hours) && Number(taskObject.minutes)) ? ':' : '';
                            const hours = Number(taskObject[item.stateKey1]) ? `${taskObject[item.stateKey1]}hrs` : ''
                            const minutes = Number(taskObject[item.stateKey2]) ? `${taskObject[item.stateKey2]}mins` : ''

                            return `${hours}${timeDivider}${minutes}`
                        }

                        return (item.stateKey1 === 'taskBudget' && !detailed) ? null : <Box sx={{
                            px: 1, py: .5, mx: 1.5, my: 1,
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

                                {(item.stateKey1 === 'startDate' && taskObject[item.stateKey1] !== taskObject[item.stateKey2]) && `${moment(taskObject[item.stateKey1]).format('MMM Do')} - ${moment(taskObject[item.stateKey2]).format('Do')}`}

                                {(item.stateKey1 === 'startDate' && taskObject[item.stateKey1] === taskObject[item.stateKey2]) && `${moment(taskObject[item.stateKey1]).format('MMM Do')}`}

                                {item.stateKey1 === 'hours' && duration(item)}
                            </Typography>
                        </Box>
                    })}
                </Box>
            </Box>

            {Boolean(state.taskMembers?.length) && !detailed &&
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                    {/* Label: Assigned to */}
                    <Typography sx={{ mr: 2, color: '#257AFB', fontWeight: 600 }}>
                        Assigned to
                    </Typography>

                    {/* Members profile pictures */}
                    <ProfileAvatarGroup {...{ emailArray: state.taskMembers, color: '#257AFB', bgcolor: '#D3E4FF', diameter: 30, max: 2 }} />
                    {/*   <AvatarGroup max={3000} sx={{ display: 'flex', alignItems: 'center' }}>
                        {state.taskMembers.map((email, index) => {
                            const userData = staffArray.find(item => item.email === email)
                            return index < 2 && <ProfileAvatar {...{ diameter: 30, src: userData.profilePicture ,
                                 fullName: userData.name }} />
                        }
                        )}
                        {state.taskMembers.length - 2 > 0 &&
                            <ProfileAvatar {...{
                                diameter: 20, src: null, styleProp: {
                                    letterSpacing: 0, color: '#257AFB',
                                    bgcolor: '#D3E4FF'
                                }, fullName: `+${state.taskMembers.length - 2}`
                            }} />}

                    </AvatarGroup> */}
                </Box>}


            {/* Members of the task group */}
            {Boolean(detailed && state.taskMembers.length) && <Box>
                {/* Heading */}
                <Typography sx={{
                    color: '#8D8D8D', fontSize: { xs: 12, md: 14 }, fontWeight: 600,
                    bgcolor: 'rgba(28, 29, 34, 0.07)', px: 2, py: 1
                }}>
                    Assignees
                </Typography>

                {/* Members */}
                <Box sx={{
                    px: 2, py: 2, display: 'flex', flexWrap: 'wrap',
                    alignItems: 'center', maxHeight: '50vh', overflowY: 'auto'
                }}>
                    {state.taskMembers.map((email, index) => {
                        const userData = staffArray.find(item => item.email === email)
                        return <Box key={index} sx={{
                            display: 'flex', flexWrap: 'wrap', border: '1px solid rgba(28, 29, 34, 0.1)',
                            borderRadius: '12px', px: 1, py: 1, mx: 1, my: 1, flexGrow: 1
                        }}>
                            {/* Profile picture */}
                            <ProfileAvatar {...{
                                diameter: 60, fullName: userData?.name, src: { data: userData?.profilePicture },
                                styleProp: { mr: 2 }
                            }} />

                            {/* Name, role, and time */}
                            <Box>
                                {/* Full name */}
                                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                                    {userData?.name}
                                </Typography>
                                {/* Role */}
                                <Typography sx={{ color: '#8D8D8D', fontWeight: 600, fontSize: 13 }}>
                                    {userData?.role}
                                </Typography>
                                {/* Time allocated */}
                                <Typography sx={{
                                    display: 'flex', alignItems: 'center',
                                    color: '#BF0606', fontWeight: 600, fontSize: 14
                                }}>
                                    <IconElement {...{ src: TimerSvg, style: { height: '16px', width: '16px' } }} />
                                    {calculateAssignedTime(email)}
                                </Typography>
                            </Box>
                        </Box>
                    })}
                </Box>
            </Box>
            }

        </Paper>
        }

        <Modal open={Boolean(state.editId)} onClose={closeEditForm}>
            <EditTask taskId={id} taskDetails={taskObject} cancelEdit={closeEditForm} /* saveEdit={saveEdit} */
                workPhaseKey={workPhaseKey} goalKey={goalKey} closeEditForm={closeEditForm} />
        </Modal>

        {/* Confirm delete */}
        <Prompt open={state.deleteId} onClose={closeDeletePrompt}
            message={state.promptType === 'delete' ? 'You are About to delete this task' :
                'You are About to cancel the creation of this task'} onProceed={(state.promptType === 'delete') ? handleDeleteTask : closePrompt} onCancel={closeDeletePrompt}
            proceedTooltip={'This will clear all the text fields and close the form'}
            cancelTooltip={'This will close this prompt'} />


    </Box >

} 
