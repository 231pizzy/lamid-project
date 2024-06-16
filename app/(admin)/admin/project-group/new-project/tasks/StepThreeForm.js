import { Box, } from "@mui/material";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SubStepOne from "./SubStepOne";
import SubStepThree from "./SubStepThree";
import SubStepFour from "./SubStepFour";
import GoalsParent from "./GoalsParent";


const subForms = [
    {
        label: 'Work phase name', color: '#257AFB', explanation: 'This the explanation of what this page is for ',
        component: (prop) => <SubStepOne gotoNext={prop.gotoNext} showAddPhaseButton={prop.showAddPhaseButton}
            showAddGoalButton={prop.showAddGoalButton} showFinishButton={prop.showFinishButton}
            setAllowGotoNext={prop.setAllowGotoNext} showBackButton={prop.showBackButton} gotoNextSubStep={prop.gotoNextSubStep}
            setGotoNextFunction={prop.setGotoNextFunction} setGotoNextProps={prop.setGotoNextProps}
            setShowWorkPhase={prop.setShowWorkPhase} workPhaseKey={prop.workPhaseKey} createNewWorkPhase={prop.createNewWorkPhase} />
    },
    {
        label: 'Create goal', color: '#257AFB', explanation: 'This the explanation of what this page is for ',
        component: (prop) => <GoalsParent gotoNext={prop.gotoNext} showAddPhaseButton={prop.showAddPhaseButton}
            showAddGoalButton={prop.showAddGoalButton} showFinishButton={prop.showFinishButton} gotoNextSubStep={prop.gotoNextSubStep}
            showBackButton={prop.showBackButton} setGotoNextFunction={prop.setGotoNextFunction} setGotoNextProps={prop.setGotoNextProps} showWorkPhase={prop.showWorkPhase} workPhaseKey={prop.workPhaseKey} />
    },
    {
        label: 'Create task for goal', color: '#008000', explanation: 'This the explanation of what this page is for ',
        component: (prop) => <SubStepThree gotoNext={prop.gotoNext} showAddPhaseButton={prop.showAddPhaseButton}
            showAddGoalButton={prop.showAddGoalButton} showFinishButton={prop.showFinishButton} showBackButton={prop.showBackButton}
            setGotoNextFunction={prop.setGotoNextFunction} setGotoNextProps={prop.setGotoNextProps}
            gotoNextSubStep={prop.gotoNextSubStep} showWorkPhase={prop.showWorkPhase} workPhaseKey={prop.workPhaseKey} />
    },
    {
        label: 'Assign task', color: '#C809C8', explanation: 'This the explanation of what this page is for ',
        component: (prop) => <SubStepFour gotoNext={prop.gotoNext} showAddPhaseButton={prop.showAddPhaseButton}
            showAddGoalButton={prop.showAddGoalButton} showFinishButton={prop.showFinishButton}
            setGotoNextFunction={prop.setGotoNextFunction} setGotoNextProps={prop.setGotoNextProps} workPhaseKey={prop.workPhaseKey}
            showBackButton={prop.showBackButton} showWorkPhase={prop.showWorkPhase} gotoNextStep={prop.gotoNextStep} />
    },
]


function StepThreeForm({ handleNext, workPhaseKey, createNewWorkPhase, currentSubStep }) {

    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const [state, setState] = useState({
        currentSubStep: 1, showWorkPhase: true, showGoals: true,
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }


    const setShowWorkPhase = () => {
        updateState({ showWorkPhase: !state.showWorkPhase });
    }

    const gotoNextSubStep = () => {
        console.log('going to next substep');
        updateState({ currentSubStep: state.currentSubStep + 1 })
    }

    const gotoNextStep = () => {
        console.log('goto next step called')
        //Check if all the required time in all the tasks has been assigned
        const arrayOfCompletedTasks = savedFormData.tasks.filter(task => task?.remainingMinutes === 0);
        console.log('completed tasks', arrayOfCompletedTasks);
        handleNext()
    }

    const showBackButton = (value) => {
        /*  prop.showBackButton(value) */
    }

    const setGotoNextFunction = (value) => {
        console.log('setting goto next function', value);
        updateState({ gotoNextFunction: value })
    }

    const setAllowGotoNext = (value) => {
        updateState({ allowGotoNext: value })
    }

    const setGotoNextProps = (value) => {
        updateState({ gotoNextProps: value })
    }

    // console.log('step 3 state', state);

    return (
        <Box sx={{ maxWidth: '100%', }}>
            <Box sx={{ mx: 'auto', width: { xs: '100%', pb: 2 } }}>

                {/* Work phase name */}

                {currentSubStep >= 1 && <Box>
                    {/* Heading */}
                    {/*   {heading({ label: 'WORK - PHASE' })} */}
                    {subForms[0].component({
                        setAllowGotoNext: setAllowGotoNext, setGotoNextFunction: setGotoNextFunction,
                        setGotoNextProps: setGotoNextProps, showWorkPhase: state.showWorkPhase, setShowWorkPhase: setShowWorkPhase,
                        workPhaseKey: workPhaseKey, createNewWorkPhase: createNewWorkPhase
                    })}
                </Box>}

                {/* Goal name */}
                {currentSubStep >= 2 && state.showWorkPhase && <Box>
                    {subForms[1].component({
                        gotoNextSubStep: gotoNextSubStep, gotoNextStep: gotoNextStep,
                        showBackButton: showBackButton, setAllowGotoNext: setAllowGotoNext, setGotoNextFunction: setGotoNextFunction,
                        setGotoNextProps: setGotoNextProps,
                        showWorkPhase: state.showWorkPhase, workPhaseKey: workPhaseKey, gotoNext: handleNext
                    })}
                </Box>}

            </Box>

        </Box>)
}

export default StepThreeForm;