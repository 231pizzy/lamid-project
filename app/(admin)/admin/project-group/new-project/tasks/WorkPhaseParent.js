import { Box, } from "@mui/material";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StepThreeForm from "./StepThreeForm";
import { setSubHeading, updateProjectGroupData } from "../app/newProjectGroup";


function WorkPhaseParent(prop) {

    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const [state, setState] = useState({
        color: '', purpose: '', name: '', allowGotoNext: false,
        gotoNextFunction: null, gotoNextProps: {}, showWorkPhase: true, showGoals: true,
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        /* Send subheading to the redux state for subheading*/
        /* const subHeading = { currentStep: 3, info: 'Work Phase', label: 'Creating a work phase for the project group' };

        dispatch(setSubHeading({ ...subHeading })) */
        //   prop.setSubHeading(subHeading)
    }, [])


    const createNewWorkPhase = () => {
        dispatch(updateProjectGroupData({
            update: {
                workPhases: {
                    ...savedFormData.workPhases,
                    [Object.keys(savedFormData.workPhases).length + 1]: {
                        phaseName: '',
                        goals: { 1: { goalName: '', tasks: [] } }
                    }
                }
            }
        }));
    }

    console.log('step 3 state', state);

    return (
        <Box sx={{ maxWidth: '100%', /* display: 'flex', alignItems: 'flex-start' */ }}>
            {Object.keys(savedFormData.workPhases).map((phaseKey, index) => {
                return <Box key={index} sx={{/* width:'100%' */ }}>
                    <StepThreeForm workPhaseKey={phaseKey} createNewWorkPhase={createNewWorkPhase} gotoNext={gotoNext} />
                </Box>
            })}
        </Box>)
}

export default WorkPhaseParent;