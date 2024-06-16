'use client'

import { Box, Button, Typography } from "@mui/material";

import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from "react-redux";
/* import {
    stepOneAction, stepTwoAction, stepFourAction, subStepOneAction,  
    subStepTwoAction, stepfourAction, stepFiveAction
} from "./formActions"; */

import { useRouter } from "next/navigation";

/* const actions = {
    1: stepOneAction, 2: stepTwoAction, 3: subStepOneAction, 4: subStepTwoAction, 5: stepfourAction, 6: stepFiveAction
     
} */

export function SubHeading({ showBackButton, currentStep, infoBesideCurrentStep, infoUnderCurrentStep, showAddIcon,
    buttonVariant, buttonCaption, buttonFontSize, buttonFontWeight, buttonClickAction }) {

    const dispatch = useDispatch();

    const router = useRouter();

    const data = useSelector(state => state.newProjectGroup.subHeadingData);

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);

    const currentSubStep = useSelector(state => state.newProjectGroup.currentSubStep);


    const handleBackButton = () => {
        router.back();
    }

    /*   const handleButtonClick=()=>{
          actions[buttonClickAction]({state, savedFormData, gotoNext, dispatch, currentStep, currentSubStep})
      } */


    return <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'left',
        px: 2, py: 1.5, bgcolor: '#FAF0F0'
    }}>
        {/* Previous page button */}
        {showBackButton &&
            <LeftArrowIcon onClick={handleBackButton}
                sx={{ color: 'black', fontSize: 24, mr: 4, borderRadius: '26.6667px', bgcolor: 'white' }} />
        }

        <Box>
            <Typography sx={{
                fontWeight: 500, mb: .5,
                color: '#BF0606', fontSize: { xs: 13, md: 14 }
            }}>
                STEP - {currentStep} {infoBesideCurrentStep}
            </Typography>

            <Typography sx={{
                fontWeight: 500, color: '#8D8D8D',
                fontSize: { xs: 13, md: 14 }
            }}>
                {infoUnderCurrentStep}
            </Typography>

        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant={buttonVariant} sx={{
            mr: 1, py: 1, fontWeight: buttonFontWeight,
            fontSize: buttonFontSize
        }}
            onClick={buttonClickAction}
        >
            {showAddIcon && <AddIcon sx={{ fontSize: 16, mr: -.5 }} />}

            {buttonCaption}
        </Button>
    </Box>
}