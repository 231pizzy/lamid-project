'use client'

import { Box, } from "@mui/material";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Heading from "../Heading";
import { SubHeading } from "../SubHeading";
import { useRef } from "react";

import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";

import { useEffect } from "react";

import PhaseName from "./PhaseName";
import GoalName from "./GoalName";
import Tasks from "./Tasks";
import AssignTasks from "./AssignTasks";
import { subStepOneAction, subStepTwoAction } from "../formActions";
import { useRouter } from "next/navigation";


export default function TaskStage(prop) {
    const ref = useRef(null);

    const dispatch = useDispatch();
    const router = useRouter();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const [state, setState] = useState({
        currentSubStep: 1, showWorkPhase: true, showGoals: true, ref: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        updateState({ ref: ref })
    }, [])

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
        prop.gotoNext()
    }

    const showBackButton = (value) => {
        prop.showBackButton(value)
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

    const getBoxTop = () => {
        if (state.ref?.current) {
            return state.ref.current.getBoundingClientRect().top;
        }
    }

    const handleNext = () => {
        if (state.currentSubStep === 1) {
            const gotoNext = () => {
                updateState({ currentSubStep: 2 })
            }
            subStepOneAction({ savedFormData: savedFormData, gotoNext: gotoNext, dispatch: dispatch, })
        }
        else if (state.currentSubStep >= 2) {
            const gotoNext = () => {
                router.push('/admin/project-group/new-project/phase-summary')
            }
            subStepTwoAction({ savedFormData: savedFormData, gotoNext: gotoNext, dispatch: dispatch, })
        }
        /*   else if (state.currentSubStep > 2) {
              const gotoNext = () => {
                  router.push('/admin/project-group/new-group/phase-summary')
              }
              subStepTwoAction({ savedFormData: savedFormData, gotoNext: gotoNext, dispatch: dispatch, })
          } */
    }

    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>

            <Box sx={{ maxHeight: 'max-content' }}>

                {/* Heading */}
                <Heading />

                {/* Sub heading */}
                <SubHeading {...{
                    currentStep: 3,
                    infoUnderCurrentStep: 'Creating a work phase for the project group',
                    infoBesideCurrentStep: '(Work Phases)',
                    buttonVariant: 'contained',
                    buttonCaption: 'Next',
                    buttonFontSize: { xs: 12, md: 13 }, buttonFontWeight: 600,
                    buttonClickAction: handleNext, showBackButton: true
                }} />

            </Box>

            <Box ref={state.ref} sx={{
                maxHeight: `calc(100vh - ${getBoxTop()}px)`, overflowY: 'scroll', maxWidth: '100%',
            }}>
                {/* Workphase parent */}
                {Object.keys(savedFormData.workPhases ?? {}).map((phaseKey, index) => {
                    return <Box key={index} sx={{/* width:'100%' */ }}>
                        {/* Phase name */}
                        {state.currentSubStep >= 1 && <PhaseName {...{ workPhaseKey: phaseKey }} />}

                        {/* Loop of goals */}
                        {Object?.keys(savedFormData?.workPhases[phaseKey]?.goals ?? {})?.map((goalKey, index) => {
                            return <Box key={index}>
                                {/* Goal name */}
                                {state.currentSubStep >= 2 && <GoalName {...{ workPhaseKey: phaseKey, goalKey: goalKey }} />}

                                {/* Tasks */}
                                {state.currentSubStep >= 2 && <Tasks {...{ workPhaseKey: phaseKey, goalKey: goalKey }} />}

                                {/* Assign tasks */}
                                {state.currentSubStep >= 2 && <AssignTasks {...{ workPhaseKey: phaseKey, goalKey: goalKey }} />}
                            </Box>
                        })}
                        {/* <StepThreeForm workPhaseKey={phaseKey} 
                        createNewWorkPhase={createNewWorkPhase} gotoNext={handleNext} /> */}
                    </Box>
                })}

            </Box>
        </Box>
    )
}
