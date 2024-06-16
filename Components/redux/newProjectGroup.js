//This slice is used by both Login component and 
//Register Component. Hence the need to define
//it in a more central location

import { createSlice } from "@reduxjs/toolkit";

export const projectGroupSlice = createSlice({
    name: 'newProjectGroup',
    initialState: {
        projectGroupFilters: {},
        projectData: {},
        subHeadingData: {},
        currentSubStep: 1
    },
    reducers: {
        updateProjectGroupFilter: (state, action) => {
            console.log('REDUX updateProjectGroupFilter called', action.payload)
            return {
                ...state,
                projectGroupFilters: { ...state.projectGroupFilters, ...action.payload.update },
            }
        },
        resetProjectGroupFilter: (state) => {
            console.log('REDUX resetProjectGroupFilter called')
            return {
                ...state,
                projectGroupFilters: {},
            }
        },
        updateProjectGroupData: (state, action) => {
            console.log('REDUX updateProjectGroupData called', action.payload)
            return {
                ...state,
                projectData: { ...state.projectData, ...action.payload.update },
            }
        },
        assignTask: (state, action) => {
            console.log('REDUX assignTask called', action)
            const taskId = action.payload.taskId;
            const valueObject = action.payload.valueObject;
            const record = [...state.projectData?.tasks];
            record[record.findIndex(item => item.id === taskId)] = valueObject;

            return {
                ...state,
                projectData: { ...state.projectData, tasks: [...record] },
            }
        },
        unassignTask: (state, action) => {
            console.log('REDUX unassignTask called', action.payload)
            const staffEmail = action.payload.email;
            const record = { ...state.projectData.tasks.filter(item => item.id === action.payload.taskId)[0] };

            console.log('redx record 1', record)
            Reflect.deleteProperty(record, 'startTime');
            // Reflect.deleteProperty(record, 'staff');
            Reflect.deleteProperty(record, 'profilePicture');

            const arrayWithoutStaff = record?.staff?.filter(item => item.email !== staffEmail)

            record.staff = arrayWithoutStaff;

            const tasks = [...state.projectData.tasks.filter(item => item.id !== action.payload.taskId)]
            console.log('redx task', tasks)
            tasks.push(record);

            return {
                ...state,
                projectData: { ...state.projectData, tasks: tasks },
            }
        },
        resetProjectGroupData: (state) => {
            console.log('REDUX resetProjectGroupData called')
            return {
                ...state,
                projectData: {},
                subHeadingData: {},
                currentSubStep: 1,
                projectGroupFilters: {}
            }
        },
        allocatedTimeToStaff: (state, action) => {
            console.log('REDUX allocatedTimeToStaff called', action.payload)
            /* Allocate a 30 minute slot to the staff with the email */
            /*   const staffEmail = action.payload.staffEmail;
              const taskId = action.payload.taskId;
              const timeSlot = action.payload.timeSlot; */
            const index = action.payload.index;
            const valueObject = action.payload.valueObject;
            const workPhaseKey = action.payload.workPhaseKey;
            const goalKey = action.payload.goalKey;

            // const record = [...state.projectData?.workPhases[workPhaseKey].goals[goalKey].tasks];

            //   record[index] = valueObject;

            state.projectData.workPhases[workPhaseKey].goals[goalKey].tasks[index] = valueObject

            /*   return {
                  ...state,
                  projectData: { ...state.projectData, tasks: [...record] },
              } */
        },
        reAllocatedTimeSlot: (state, action) => {
            const { taskIndex, workPhaseKey, goalKey, staffEmail, valueObject } = action.payload;
            console.log('REDUX reallocate', taskIndex, workPhaseKey, goalKey, staffEmail, valueObject)
            if (state.projectData.workPhases[workPhaseKey].goals[goalKey].tasks[taskIndex].taskAssignmentMapping[staffEmail].length - 1) {
                state.projectData.workPhases[workPhaseKey].goals[goalKey].tasks[taskIndex].taskAssignmentMapping[staffEmail] = valueObject
            } else {
                //If the staff's record will be empty after delete, just delete the staff's key
                const data = { ...state.projectData.workPhases[workPhaseKey].goals[goalKey].tasks[taskIndex].taskAssignmentMapping }
                delete data[staffEmail]
                state.projectData.workPhases[workPhaseKey].goals[goalKey].tasks[taskIndex].taskAssignmentMapping = data
            }

            //increase the remainingMinutes of the task by 30
            state.projectData.workPhases[workPhaseKey].goals[goalKey].tasks[taskIndex].remainingMinutes += 30

        },
        unAllocatedTimeFromStaff: (state, action) => {
            /* UnAllocate a 30 minute slot to the staff with the email */
        },
        setSubHeading: (state, action) => {
            return { ...state, subHeadingData: { ...action.payload } }
        },
        updateSubheadingData: (state, action) => {
            return { ...state, subHeadingData: { ...state.subHeadingData, ...action.payload } }
        },
        increaseSubStep: (state, action) => {
            return { ...state, currentSubStep: state.currentSubStep + Number(action.payload.number) }
        }
    }
});

export const { updateProjectGroupFilter, resetProjectGroupFilter, unassignTask, assignTask,
    updateProjectGroupData, resetProjectGroupData, allocatedTimeToStaff, unAllocatedTimeFromStaff,
    setSubHeading, updateSubheadingData, increaseSubStep, reAllocatedTimeSlot } = projectGroupSlice.actions;
export default projectGroupSlice.reducer;