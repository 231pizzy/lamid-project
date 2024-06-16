'use client'

import { Box, Modal, Typography, } from "@mui/material";



import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignTask as assignTaskToStaff } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';


import { TaskCard } from "./TaskCard";


function TaskList(prop) {
    //props are closeTimeSheet(),  
    console.log('tasklist gokey, phj=key', prop.goalKey, prop.workPhaseKey);

    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    /*   useEffect(() => {
          console.log("already saved form data is ", savedFormData);
         // console.log("already saved filter is", savedFilters);
      }, [savedFilters, savedFormData]) */

    const goalData = useMemo(() => {
        return savedFormData.workPhases[prop.workPhaseKey].goals[prop.goalKey]
    }, [savedFormData.workPhases[prop.workPhaseKey].goals[prop.goalKey]])



    const [state, setState] = useState({
        currentStep: null, color: '', purpose: '', name: '',
        filters: { ...savedFilters }, staffRecord: prop.staffRecord, allTasks: goalData?.tasks,
        selectedFilter: 'filters', suggestions: ['sugges1', 'sugges3sugges3sugges3sugges3sugges3sugges3sugges3sugges3'],
        textInputValue: '', suggestionAnchor: useRef(), showSuggestions: false,
        firstValue: '', filterType: '', secondValue: '', lastValue: false, thirdValue: "",
        taskAssignment: [], selectedTask: {}, assignedIds: [], detailsId: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        const value = [...goalData?.tasks]
        updateState({
            assignedIds: goalData.tasks.filter(item => item?.staff?.length).map(task => task?.id),
            allTasks: value?.sort((a, b) => a.id - b.id)
        })
    }, [goalData])

    console.log('assigned ids from task column', state.assignedIds)

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, []);

    //Update the task in redux store
    const saveAssignment = (taskId, startTime, staffObject) => {
        const taskRecord = goalData.tasks.filter(item => item.id === Number(taskId))[0]
        console.log('taskId', taskId, 'taskRecord', taskRecord, 'staffObject', staffObject)
        const newTaskRecord = { ...taskRecord, startTime: startTime, staff: [...taskRecord?.staff, staffObject] }
        dispatch(assignTaskToStaff({ taskId: taskId, valueObject: newTaskRecord }))
    }

    const showTaskDetails = (id) => {
        updateState({ detailsId: Number(id) })
    }

    const closeTaskDetails = () => {
        updateState({ detailsId: '' })
    }



    const selectTask = (id) => {
        const taskObject = state.allTasks?.filter(item => item.id === id)[0]
        prop?.selectTask(taskObject)
        updateState({ selectedTask: taskObject })
    }

    const deleteTask = (id) => {

    }

    const editTask = (id) => {

    }

    const saveEdit = (id) => {

    }

    const cancelEdit = (id) => {

    }



    console.log('state task', state);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Heading */}
            <Box sx={{
                top: 0, bgcolor: 'rgba(28, 29, 34, 0.04)', maxWidth: '100%',
                display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 1, px: { xs: 1.5, sm: 3 }
            }}>
                {/* Heading label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, md: 13 } }}>
                    TASKS TO BE ASSIGNED ({state.allTasks?.length})
                </Typography>
            </Box>

            {/* Content */}
            <Box sx={{
                bgcolor: 'white', pb: 1.5, px: 1, display: 'flex', flexWrap: 'wrap',
                height: '100%', maxHeight: '235px', overflowY: 'scroll'
            }}>
                {state.allTasks.map(task =>
                    <TaskCard detailed={false} taskObject={task} cancelEdit={cancelEdit} saveEdit={saveEdit}
                        deleteTask={deleteTask} showTaskDetails={showTaskDetails} selectTask={selectTask}
                        selectable={true} selected={state.selectedTask?.id === task?.id}
                        workPhaseKey={prop.workPhaseKey} goalKey={prop.goalKey} />
                    /*    addedTaskCard({ id: task?.id, detailed: false }) */
                )}
            </Box>

            {/* Task detail modal */}
            {/* Task detail modal */}
            {Boolean(state.detailsId) && <Modal open={Boolean(state.detailsId)} onClose={closeTaskDetails}>
                <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                    <TaskCard detailed={true}
                        taskObject={state.allTasks[state.allTasks.findIndex(item => item.id === state?.detailsId)]}
                        cancelEdit={cancelEdit} saveEdit={saveEdit} editTask={editTask} closeTaskDetails={closeTaskDetails}
                        workPhaseKey={prop.workPhaseKey} goalKey={prop.goalKey} />
                    {/*   {addedTaskCard({ id: state.detailsId, detailed: true })} */}
                </Box>
            </Modal>}

        </Box>)
}

export default TaskList;