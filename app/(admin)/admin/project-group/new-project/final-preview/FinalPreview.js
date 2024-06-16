'use client'

import { Box, Modal, Typography, } from "@mui/material";

import Close from '@mui/icons-material/Close';

import { lighten } from '@mui/material/styles';
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetProjectGroupData, setSubHeading, } from "@/Components/redux/newProjectGroup";

import { ProfileAvatar } from "@/Components/ProfileAvatar";
import WorkPhaseSummary from "@/Components/WorkPhaseSummary";

import { SubHeading } from "../SubHeading";
import Heading from "../Heading";
import { createProjectGroup } from "../../helper";
import GroupSummary from "./GroupSummary";
import IconElement from "@/Components/IconElement";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const ApprovedSvg = '/icons/ApprovedSvg.svg';

function StepFiveForm(prop) {
    console.log('step 4 called')
    const dispatch = useDispatch();
    const router = useRouter()
    const ref = useRef(null);

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    /*    useEffect(() => {
           console.log("already saved form data is ", savedFormData);
       }, [savedFormData])
    */

    const workPhaseData = useMemo(() => {
        return savedFormData.workPhases
    }, [savedFormData.workPhases])

    const [state, setState] = useState({
        currentStep: null, workPhases: savedFormData, projectGroupCreated: false, showCongratulations: false,
        ref: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        /* Send subheading to the redux state for subheading*/
        /* const subHeading = {
            currentStep: 5, info: 'Preview', label: 'Preview the project group',
            requiredData: {}
        };
        dispatch(setSubHeading({ ...subHeading })) */
        updateState({ ref: ref })
        //   prop.setSubHeading(subHeading)
    }, [])


    const headingComponent = ({ label, uppercase, styles }) => {
        return <Typography sx={{
            bgcolor: '#1C1D220D', textTransform: uppercase ? 'uppercase' : 'capitalize',
            py: 1.5, px: 4, fontSize: uppercase ? { xs: 15, md: 17 } : { xs: 14, md: 15 }, fontWeight: 700, ...styles
        }}>
            {label}
        </Typography>
    }

    const showCongratulations = () => {
        updateState({ showCongratulations: true })
    }

    const closeCongratulations = () => {
        updateState({ showCongratulations: false });
        dispatch(resetProjectGroupData());
        router.replace('/admin/project-group')
    }


    const handleCreateProjectGroup = () => {
        const projectObject = { ...savedFormData }

        createProjectGroup({
            dataObject: projectObject, dataProcessor: () => {
                showCongratulations()
            }
        });
    }

    const getBoxTop = () => {
        if (state.ref?.current) {
            return state.ref.current.getBoundingClientRect().top;
        }
    }


    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>

            <Box sx={{ maxHeight: 'max-content' }}>

                {/* Heading */}
                <Heading />

                {/* Sub heading */}
                <SubHeading {...{
                    currentStep: 5,
                    infoUnderCurrentStep: 'Preview the project group',
                    infoBesideCurrentStep: '(Preview)',
                    buttonVariant: 'contained',
                    buttonCaption: 'create project group',
                    buttonFontSize: { xs: 12, md: 13 }, buttonFontWeight: 500,
                    buttonClickAction: handleCreateProjectGroup, showBackButton: true,
                }} />
            </Box>

            <Box ref={state.ref} sx={{
                maxHeight: `calc(100vh - 250px)`, overflowY: 'scroll', maxWidth: '100%', px: 2, py: 3
            }}>
                <Box sx={{
                    maxWidth: { xs: '100%', lg: '100%', xl: '80%' }, mx: 'auto', borderRadius: '12px',
                    border: '2px solid #1C1D221A', boxShadow: '0px 6px 12px 0px #4F4F4F14'
                }}>
                    {/* Heading: Project group preview */}
                    {headingComponent({ label: 'Project Group Preview', uppercase: true, styles: { mb: 2 } })}

                    {/* Group 1 heading: Profile Details */}
                    <Box sx={{}}>
                        {/* Heading */}
                        {headingComponent({ label: 'Profile Details', uppercase: false, styles: {} })}
                        {/* Content */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 4, my: 2, }}>
                            {/* Project name Avatar */}
                            <ProfileAvatar {...{
                                diameter: 60, src: null, fullName: savedFormData.projectName,
                                styleProp: { mr: 2, bgcolor: lighten(savedFormData?.color ?? '#4F4F4F14', 0.9), color: savedFormData.color }
                            }} />
                            {/* Name and purpose */}
                            <Box>
                                {/* Name */}
                                <Typography sx={{ fontSize: { xs: 16, md: 18 }, mb: 1, fontWeight: 700 }}>
                                    {savedFormData.projectName}
                                </Typography>
                                {/* Purpose*/}
                                <Typography sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 500 }}>
                                    {savedFormData.purpose}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/*  Group 2 heading: Project group summary */}
                    <GroupSummary {...{ workPhaseData: workPhaseData, bgcolor: '#1C1D220D', color: 'black' }} />


                    {/*  Group 3 heading: Project group work phases breakdown */}
                    <Box sx={{}}>
                        {/* Heading */}
                        {headingComponent({ label: 'Project group work phases breakdown', uppercase: false, styles: {} })}
                        {/* Content */}
                        <Box sx={{ mt: 2, borderTop: '1px solid  #1C1D220A' }}>
                            <WorkPhaseSummary {...{ contentBgcolor: '#1C1D220A', headingBgcolor: 'white' }} />
                        </Box>
                    </Box>

                </Box>


            </Box>

            <Modal open={state.showCongratulations} onClose={closeCongratulations} >

                <Box sx={{ position: 'absolute', left: '50%', top: '40%', maxWidth: 'max-content' }}>

                    <Box align='center' sx={{
                        transform: 'translate(-50%,-50%)', bgcolor: 'white',
                        position: 'relative', maxWidth: 'max-content', px: 4, py: 3, borderRadius: '16px'
                    }}>

                        {/*Approved Icon */}
                        <IconElement  {...{ src: ApprovedSvg, style: { height: '60px', width: '60px' } }} />

                        {/* Message */}
                        <Typography align="center" sx={{
                            mt: 4, fontSize: 24, fontWeight: 700, maxWidth: '80%',
                            textTransform: 'capitalize'
                        }}>
                            You just created a project group
                        </Typography>

                        {/* Close icon */}
                        <Close sx={{
                            position: 'absolute', cursor: 'pointer',
                            fontSize: 34, right: '5%', top: '5%', color: '#8D8D8D'
                        }} onClick={closeCongratulations} />

                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default StepFiveForm;