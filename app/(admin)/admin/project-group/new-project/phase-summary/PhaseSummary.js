'use client'

import { Box, Button, } from "@mui/material";

import { useEffect, useState, } from "react";
import { useSelector } from "react-redux";

import WorkPhaseSummary from "@/Components/WorkPhaseSummary";
import { SubHeading } from "../SubHeading";
import Heading from "../Heading";
import { useRouter } from "next/navigation";

export default function PhaseSummary(prop) {
    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    const router = useRouter();

    useEffect(() => {
        console.log("already saved form data is ", savedFormData);
        console.log("already saved filter is", savedFilters);
    }, [savedFilters, savedFormData])

    const [state, setState] = useState({
        currentStep: null, workPhases: savedFormData
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        /* Send subheading to the parent: CreateProjectGroup */
        /*   const subHeading = {
              currentStep: 4, info: 'Summary',
              label: 'Summary of created work phases'
          };
          prop.setSubHeading(subHeading) */
    }, [])

    const gotoNext = () => {
        router.push('/admin/project-group/new-project/final-preview')
    }

    const handleAddNewPhase = () => {
        router.back();
    }

    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>

            <Box sx={{ maxHeight: 'max-content' }}>

                {/* Heading */}
                <Heading />

                {/* Sub heading */}
                <SubHeading {...{
                    currentStep: 4,
                    infoUnderCurrentStep: 'All the workphases that have been created',
                    infoBesideCurrentStep: '(Summary)',
                    buttonVariant: 'text',
                    buttonCaption: 'Add new work-phase',
                    buttonFontSize: { xs: 13, md: 14 }, buttonFontWeight: 600,
                    buttonClickAction: handleAddNewPhase, showBackButton: true, showAddIcon: true
                }} />

            </Box>


            <Box sx={{ maxWidth: '100%', px: 2, py: 3 }}>
                <Box sx={{ maxWidth: { xs: '100%', lg: '100%', xl: '80%' }, mx: 'auto', }}>
                    {/* Work phases */}
                    <WorkPhaseSummary {...{ headingBgcolor: 'rgba(28, 29, 34, 0.10)', contentBgcolor: 'white' }} />

                    {/* Next button */}
                    <Button align='right' variant='contained'
                        sx={{
                            fontSize: { xs: 12, md: 13 },
                            fontWeight: 700, mt: 4, float: 'right'
                        }}
                        onClick={gotoNext}>
                        Next
                    </Button>
                </Box>


            </Box>
        </Box>
    )
}
