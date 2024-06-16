'use client'

import { Box, OutlinedInput, Typography, } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import CaretUpIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CaretDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';

import { openSnackbar } from "@/Components/redux/routeSlice";


export default function GoalName({ workPhaseKey, goalKey, single }) {
    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const [state, setState] = useState({
        textInputValue: single ? '' : savedFormData.workPhases[workPhaseKey].goals[goalKey]?.goalName ?? '', errMsg: '', showContent: true
    });

    useEffect(() => {
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
                                goalName: state.textInputValue
                            }
                        }
                    }
                }
            }
        }));
    }, [state.textInputValue])


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    //generate unique name for text field
    let nameValue = uuid()


    const handleValidateName = ({ value, errMsg, successCallback }) => {
        if (Object.values(savedFormData.workPhases[workPhaseKey]?.goals).filter(data => data.goalName === value).length > 1) {
            dispatch(openSnackbar({ message: errMsg, severity: 'error' }))
        }
        else {
            successCallback()
        }
    }

    const createGoal = () => {
        dispatch(updateProjectGroupData({
            update: {
                workPhases: {
                    ...savedFormData.workPhases,
                    [workPhaseKey]: {
                        ...savedFormData.workPhases[workPhaseKey],
                        goals: {
                            ...savedFormData.workPhases[workPhaseKey].goals,
                            [Object.keys(savedFormData.workPhases[workPhaseKey].goals).length + 1]: {
                                goalName: '', tasks: []
                            }
                        }
                    }
                }
            }
        }));
    }


    const createNewGoal = () => {
        handleValidateName({
            value: state.textInputValue,
            errMsg: `A goal with the name ${state.textInputValue} already exists. Kindly choose a differnt name`,
            successCallback: () => { createGoal(); }
        })
    }

    const handleText = (event) => {
        updateState({ textInputValue: event.currentTarget.value, errMsg: '' })
    }

    const showContent = () => {
        updateState({ showContent: !state.showContent });
    }
    const caretStyle = { bgcolor: 'rgba(191, 6, 6, 0.06)', color: '#BF0606', borderRadius: '26.66667px' }

    const lastGoalKey = useMemo(() => {
        return Object.keys(savedFormData.workPhases[workPhaseKey].goals).length.toString();
    }, [savedFormData.workPhases[workPhaseKey]?.goals])

    return (
        <Box sx={{ maxHeight: 'max-content', maxWidth: '100%', pb: 1 }}>
            {/* Heading */}
            <Typography onClick={showContent}
                sx={{
                    fontWeight: 700, fontSize: { xs: 14, md: 15 }, display: 'flex', alignItems: 'center',
                    bgcolor: '#19D3FC1A', px: 3, py: 2, cursor: 'pointer'
                }}>
                Goal {!single && `- ${goalKey}`} Under Work Phase {!single && `- ${workPhaseKey}`}
                <Box sx={{ flexGrow: 1 }} />
                {state.showContent ? <CaretUpIcon sx={{ ...caretStyle }} /> : <CaretDownIcon sx={{ ...caretStyle }} />}
            </Typography>

            {/* Content */}
            {state.showContent && <Box sx={{ px: 3, py: 1 }}>
                <Typography
                    sx={{
                        color: '#8D8D8D', mb: 1, display: 'flex',
                        fontWeight: 600, fontSize: { xs: 13, md: 14 }
                    }}>
                    Goal Name
                    {state.errMsg && <sup>
                        <Typography sx={{
                            color: '#BF0606', ml: 1,
                            fontWeight: 600, fontSize: { xs: 10, md: 12 }
                        }}>
                            ** {state.errMsg}
                        </Typography>
                    </sup>}
                </Typography>
                <OutlinedInput
                    fullWidth
                    value={state.textInputValue}
                    onChange={handleText}
                    name={nameValue}
                    placeholder="Eg. Design the product"
                    sx={{
                        fontWeight: 600, lineHeight: '1.8em',
                        fontSize: 15, letterSpacing: 1
                    }} />

                {/* Add goal button */}
                {goalKey === lastGoalKey && <Typography sx={{
                    color: '#BF0606', fontSize: 14, cursor: 'pointer',
                    fontWeight: 600, mt: 2, display: 'flex', alignItems: 'center'
                }} onClick={createNewGoal}>
                    {/* Add icon */}
                    <AddIcon sx={{ fontSize: 16 }} />
                    Add new goal
                </Typography>}

            </Box>}


        </Box>)
}
