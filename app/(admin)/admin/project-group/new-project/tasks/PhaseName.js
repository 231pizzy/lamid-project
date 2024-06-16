'use client'

import {
    Box, OutlinedInput, Typography,
} from "@mui/material";


import AddIcon from '@mui/icons-material/Add';
import CaretUpIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CaretDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProjectGroupData, } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';
import { openSnackbar } from "@/Components/redux/routeSlice";


export default function PhaseName({ workPhaseKey }) {
    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    /*     useEffect(() => {
        }, [savedFormData.workPhases[workPhaseKey]])
     */
    const [state, setState] = useState({
        textInputValue: savedFormData.workPhases[workPhaseKey].phaseName ?? '', errMsg: '', showContent: true
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        dispatch(updateProjectGroupData({
            update: {
                workPhases: {
                    ...savedFormData.workPhases,
                    [workPhaseKey]: {
                        ...savedFormData.workPhases[workPhaseKey],
                        phaseName: state.textInputValue
                    }
                }
            }
        }));
    }, [state.textInputValue])

    const handleValidateName = ({ value, errMsg, successCallback }) => {
        if (Object.values(savedFormData.workPhases).filter(data => data.phaseName === value).length > 1) {
            dispatch(openSnackbar({ message: errMsg, severity: 'error' }))
        }
        else {
            successCallback()
        }
    }

    const handleCreateNewWorkPhase = () => {
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

    const createNewWorkPhase = () => {
        handleValidateName({
            value: state.textInputValue, category: 'phaseName',
            errMsg: `A phase already exists with the name ${state.textInputValue}. Kindly choose a different name`,
            successCallback: () => { handleCreateNewWorkPhase() }
        })
    }

    //generate unique name for text field
    let nameValue = uuid()

    const handleText = (event) => {
        updateState({ textInputValue: event.currentTarget.value })
    }

    const showContent = () => {
        updateState({ showContent: !state.showContent });
    }
    const caretStyle = { bgcolor: 'rgba(191, 6, 6, 0.06)', color: '#BF0606', borderRadius: '26.66667px' }

    const lastWorkPhaseKey = useMemo(() => {
        return Object.keys(savedFormData.workPhases).length.toString();
    }, [savedFormData.workPhases])

    return (
        <Box sx={{ maxHeight: 'max-content', maxWidth: '100%', pb: 1 }}>
            {/* Haading */}
            <Typography onClick={showContent} sx={{
                fontWeight: 700, fontSize: { xs: 14, md: 15 }, display: 'flex', alignItems: 'center',
                bgcolor: 'rgba(37, 122, 251, 0.10)', px: 3, py: 2, cursor: 'pointer'
            }}>

                WORK - PHASE - {workPhaseKey}

                <Box sx={{ flexGrow: 1 }} />

                {state.showContent ? <CaretUpIcon sx={{ ...caretStyle }} /> : <CaretDownIcon sx={{ ...caretStyle }} />}

            </Typography>

            {/* Content */}
            {state.showContent && <Box sx={{ px: 3, py: 2 }}>
                <Typography
                    sx={{
                        color: '#8D8D8D', mb: 1, display: 'flex',
                        fontWeight: 600, fontSize: { xs: 13, md: 14 }
                    }}>
                    Work Phase Name

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
                    placeholder="Write workphase name here"
                    sx={{
                        fontWeight: 600, lineHeight: '1.8em',
                        fontSize: 15, letterSpacing: 1
                    }} />

                {/* Add workphase button */}
                {workPhaseKey === lastWorkPhaseKey && <Typography sx={{
                    color: '#BF0606', fontSize: 14, cursor: 'pointer', fontWeight: 600, mt: 2,
                    display: 'flex', alignItems: 'center'
                }} onClick={createNewWorkPhase}>

                    <AddIcon sx={{ fontSize: 16 }} />
                    Add new work-phase

                </Typography>}

            </Box>}
        </Box>)
} 