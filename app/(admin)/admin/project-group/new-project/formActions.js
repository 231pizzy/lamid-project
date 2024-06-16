
import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";
import { openSnackbar } from "@/Components/redux/routeSlice";
import { validateName } from "../helper";

const handleValidateName = ({ value, category, dispatch, errMsg, successCallback }) => {
    validateName(remoteRequest, dispatch, openSnackbar, value, category,
        (value) => {
            if (value[0]) {
                dispatch(openSnackbar({ message: errMsg, severity: 'error' }))
            }
            else {
                successCallback()
            }
        })
}

export function stepOneAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {

    if (state.name && state.purpose && state.color) {
        handleValidateName({
            value: state.name, category: 'projectName', errMsg: `A project already has the name ${state.name}.
      Kindly choose a different project name`, dispatch: dispatch, successCallback: () => {
                const workPhases = savedFormData?.workPhases ?? { 1: { phaseName: '', goals: { 1: { goalName: '', tasks: [] } } } }

                dispatch(updateProjectGroupData({
                    update:
                        { color: state.color, purpose: state.purpose, projectName: state.name, workPhases: workPhases }
                }))

                gotoNext({ currentStep, currentSubStep });
            }
        })
    }
    else {
        dispatch(openSnackbar({ message: 'All the fields are Required', severity: 'error' }))
    }
}

export function stepTwoAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {
    gotoNext({ currentStep, currentSubStep });
}

export function subStepOneAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {
    //Find all the workphases in savedFormData that have empty or undefined phase name
    let entriesWithEmptyPhaseName = [];
    const keyValues = [];
    let duplicateExists = false;

    console.log('savedformdata', savedFormData);

    Object.entries(savedFormData.workPhases).forEach(([phaseKey, phaseObject]) => {
        !Boolean(phaseObject?.phaseName) && entriesWithEmptyPhaseName.push(phaseKey)
        if (!duplicateExists && keyValues.includes(phaseObject?.phaseName)) {
            duplicateExists = phaseObject?.phaseName
        }
        else if (!duplicateExists) {
            keyValues.push(phaseObject?.phaseName)
        }
    });

    if (entriesWithEmptyPhaseName.length) {
        dispatch(openSnackbar({ message: 'Fill the phase name of all workphases', severity: 'error' }))
        console.log('invalid')
    }
    else if (duplicateExists) {
        dispatch(openSnackbar({
            message: `A phase already exists with the name ${duplicateExists}. Kindly choose a different name`,
            severity: 'error'
        }))
    }
    else {
        gotoNext();
    }
}

// export function subStepTwoAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {
//     console.log('cross checking tasks in sub step 3 action')
//     //Check if there are any empty tasks 
//     let entriesWithoutValues = []
//     const goalNames = [];
//     let duplicateExists = false;
//     let phaseNameOfDuplicateGoalName = ''

//     Object.entries(savedFormData.workPhases).forEach(([phaseKey, phaseObject]) => {
//         //get empty work phases names
//         if (!Boolean(phaseObject?.phaseName)) {
//             entriesWithoutValues.push(phaseKey)
//         }
//         else {
//             //get empty goal names 
//             Object.entries(savedFormData.workPhases[phaseKey].goals).forEach(([goalKey, goalObject]) => {
//                 if (!Boolean(goalObject?.goalName)) {
//                     entriesWithoutValues.push(goalKey)
//                 }
//                 else {
//                     //get empty tasks
//                     if (!goalObject.tasks.length) {
//                         entriesWithoutValues.push(goalKey)
//                     }
//                     else {
//                         //Get tasks where remainingMinutes is greater than 0 or undefined
//                         const unassignedTasks = goalObject.tasks.filter(task => task?.remainingMinutes || task?.remainingMinutes === undefined);
//                         entriesWithoutValues.push(...unassignedTasks);

//                         if (!duplicateExists && goalNames.includes(goalObject?.goalName)) {
//                             duplicateExists = goalObject?.goalName
//                             phaseNameOfDuplicateGoalName = savedFormData.workPhases[phaseKey].phaseName
//                         }
//                         else if (!duplicateExists) {
//                             goalNames.push(goalObject?.goalName)
//                         }
//                     }
//                 }
//             })
//         }
//     });

//     if (entriesWithoutValues.length) {
//         dispatch(openSnackbar({ message: 'Phase name, goal name, or task should not be empty', severity: 'error' }))
//         console.log('invalid')
//         //   dispatch(updateProjectGroupData({ update: { phaseName: state.textInputValue } }));
//         // updateState({ errMsg: '' });
//         //prop.gotoNextSubStep();

//     }
//     else if (duplicateExists) {
//         dispatch(openSnackbar({
//             message: `There are 2 goals in ${phaseNameOfDuplicateGoalName} workphase with the name '${duplicateExists}'. Kindly choose a different name for either of them`,
//             severity: 'error'
//         }))
//     }
//     else {
//         // console.log('invalid')
//         //   updateState({ errMsg: 'required' });
//         gotoNext({ currentStep, currentSubStep });
//     }
// }

export function subStepTwoAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {
    let hasEmptyField = false;

    // Check for empty phase names, goal names, or tasks
    Object.entries(savedFormData.workPhases).forEach(([phaseKey, phaseObject]) => {
        if (!phaseObject?.phaseName || Object.keys(phaseObject.goals).length === 0) {
            hasEmptyField = true;
        } else {
            Object.entries(phaseObject.goals).forEach(([goalKey, goalObject]) => {
                if (!goalObject?.goalName || goalObject.tasks.length === 0) {
                    hasEmptyField = true;
                } else {
                    goalObject.tasks.forEach(task => {
                        if (!task.taskName) {
                            hasEmptyField = true;
                        }
                    });
                }
            });
        }
    });

    if (hasEmptyField) {
        dispatch(openSnackbar({ message: 'Phase name, goal name, or task should not be empty', severity: 'error' }));
    } else {
        gotoNext({ currentStep, currentSubStep });
    }
}


export function stepfourAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {
    //Check if all tasks minutes have been assigned in all the tasks. If true, then proceed to next step
    gotoNext({ currentSubStep: currentSubStep, currentStep: currentStep, addNewWorkPhase: true })
}


export function stepFiveAction({ state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep }) {
    //Check if all tasks minutes have been assigned in all the tasks. If true, then proceed to next step
    gotoNext({ currentSubStep: currentSubStep, currentStep: currentStep, submitAction: true })
}

