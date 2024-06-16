'use client'

import {
    Avatar,
    Box, OutlinedInput, Typography,
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

//import { setSubHeading, updateSubheadingData } from "../app/newProjectGroup";


import { v4 as uuid } from 'uuid';

import Heading from "../Heading";

import { SubHeading } from "../SubHeading";

import { handleValidateName } from "../name-validator";

import { useRouter } from "next/navigation";

import { openSnackbar, setPageTitle } from "@/Components/redux/routeSlice";

import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";
import { useRef } from "react";

const formData = [
    { label1: 'NAME', label2: 'Project Group Name', stateKey: 'name', multiLine: false, text: true },
    { label1: 'PURPOSE', label2: 'Project Group Purpose', stateKey: 'purpose', multiLine: true, text: true },
    {
        label1: 'PROJECT GROUP COLOR', label2: 'Select color for the project group', stateKey: 'color',
        multiLine: false, text: false
    },
]

const colors = [
    '#FF0000', '#00FFFF', '#0000FF', '#0000BB', '#800080', '#FFFF00', '#00FF00', '#FF00FF',
    '#808080', '#FFA500', '#A52A2A', '#800000', '#008000', '#808000', '#7FFFD4'
]

function StepOneForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const ref = useRef(null);

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    //   const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    useEffect(() => {
        console.log("already saved form data is ", savedFormData);

    }, [savedFormData?.color, savedFormData?.purpose, savedFormData?.projectName])

    const [state, setState] = useState({
        currentStep: null, color: savedFormData?.color ?? '', ref: null,
        purpose: savedFormData?.purpose ?? '', name: savedFormData?.projectName ?? ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Project Group' }))

        updateState({ ref: ref })
    }, []);


    useEffect(() => {
        /* Send subheading to the redux state for subheading*/
        /*   const subHeading = {
              currentStep: 1, info: 'hello step 1', label: 'Add project name, purpose, and assign color',
              requiredData: { projectName: state.name, purpose: state.purpose, color: state.color }
          };
          dispatch(setSubHeading({ ...subHeading })) */
    }, [])

    /*  useEffect(() => {
         dispatch(updateSubheadingData({ requiredData: { name: state.name, purpose: state.purpose, color: state.color } }))
     }, [state.name, state.purpose, state.color]) */

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const getBoxTop = () => {
        if (state.ref?.current) {
            return state.ref.current.getBoundingClientRect().top;
        }
    }

    const selectColor = (event) => {
        console.log('color selected', event.currentTarget.id)
        updateState({ color: event.currentTarget.id })
    }

    const handleText = (event) => {
        console.log('text input', event.currentTarget.id, event.currentTarget.value)
        updateState({ [event.currentTarget.id]: event.currentTarget.value })
    }

    const gotoNext = () => {
        router.push('/admin/project-group/new-project/filters')
    }

    const handleNext = () => {
        console.log('state at next click', state)
        if (state.name && state.purpose && state.color) {

            handleValidateName({
                value: state.name, category: 'projectName', dispatch: dispatch,
                errMsg: `A project already has the name ${state.name}. Kindly choose a different project name`,
                successCallback: () => {
                    const workPhases = savedFormData?.workPhases ??
                        { 1: { phaseName: '', goals: { 1: { goalName: '', tasks: [] } } } }

                    dispatch(updateProjectGroupData({
                        update:
                            { color: state.color, purpose: state.purpose, projectName: state.name, workPhases: workPhases }
                    }))

                    gotoNext();
                }
            })
        }
        else {
            dispatch(openSnackbar({ message: 'All the fields are Required', severity: 'error' }))
        }
    }

    console.log(state);


    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>
            <Box sx={{ maxHeight: 'max-content' }}>
                {/* Heading */}
                <Heading />

                {/* Sub heading */}
                <SubHeading {...{
                    currentStep: 1, infoUnderCurrentStep: 'Add project name, purpose, and assign color',
                    buttonVariant: 'contained', buttonCaption: 'Next', buttonFontSize: { xs: 12, md: 13 }, buttonFontWeight: 600,
                    buttonClickAction: handleNext
                }} />
            </Box>


            <Box ref={state.ref} sx={{
                maxWidth: '100%', px: 2, py: 2,
                maxHeight: `calc(100vh - ${getBoxTop()}px  - 32px)`, overflowY: 'scroll'
            }}>
                {/* Form */}
                <Box sx={{ mx: 'auto', width: { xs: '100%', sm: '80%', md: '50%' } }}>
                    {formData.map(data =>
                        <Box sx={{}}>
                            <Typography sx={{
                                px: 2, py: .5, fontWeight: 600, color: '#8D8D8D',
                                fontSize: { xs: 12, md: 14 }, bgcolor: '#F5F5F5'
                            }}>
                                {data.label1}
                            </Typography>
                            <Box sx={{ height: 'max-content', px: { xs: 2, sm: 4 }, py: 2 }}>
                                <Typography sx={{
                                    pb: 2,
                                    fontSize: { xs: 12, md: 14 },
                                }}>
                                    {data.label2}
                                </Typography>
                                {data.text ?
                                    <OutlinedInput id={data.stateKey}
                                        fullWidth multiline={data?.multiLine}
                                        value={state[data.stateKey]}
                                        onChange={handleText} autoComplete="off" name={nameValue}
                                        rows={3} sx={{ fontWeight: 600, lineHeight: '1.8em', fontSize: 13, letterSpacing: 1 }} />
                                    :
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {/* Color grid */}
                                        {colors.map(color =>
                                            <Avatar onClick={selectColor}
                                                id={color} sx={{
                                                    mr: 2, mb: 2, p: 1, width: '20px',
                                                    height: '20px', bgcolor: color, border: `1px solid ${color}`
                                                }}>
                                                <CircleIcon id={color} sx={{
                                                    fontSize: '20px',
                                                    color: color, border: (state.color === color) ? "4px solid white" : `4px solid ${color}`,
                                                    borderRadius: '26.66667px'
                                                }} />
                                            </Avatar>)}
                                    </Box>
                                }

                            </Box>
                        </Box>
                    )}


                </Box>
            </Box>
        </Box>
    )
}

export default StepOneForm;