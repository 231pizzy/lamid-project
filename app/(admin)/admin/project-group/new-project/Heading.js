'use client'

import { Box, IconButton, Typography } from "@mui/material";

import Close from '@mui/icons-material/Close';
import Prompt from "@/Components/Prompt";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetProjectGroupData } from "@/Components/redux/newProjectGroup";

export default function Heading() {
    const router = useRouter();
    const dispatch = useDispatch()

    const [state, setState] = useState({
        showPrompt: false
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const openTerminatePrompt = (event) => {
        updateState({ showPrompt: true })
    }

    const closeTerminatePrompt = (event) => {
        updateState({ showPrompt: false })
    }

    const handleCloseForm = () => {
        dispatch(resetProjectGroupData());
        router.push('/admin/project-group')
    }

    return <Box sx={{
        display: 'flex', px: { xs: 1.5, md: 2 }, py: 1,
        alignItems: 'center', bgcolor: '#F5F5F5', position: ''
    }}>
        {/* Close button */}
        <IconButton sx={{
            mr: 3, bgcolor: 'white',
            height: '24px', width: '24px'
        }}>
            <Close onClick={openTerminatePrompt}
                sx={{ color: 'black', height: '24px', width: '24px' }} />
        </IconButton>

        {/* Label */}
        <Typography sx={{
            fontWeight: 700,
            color: 'black', fontSize: { xs: 13, md: 14 }
        }}>
            CREATE NEW PROJECT GROUP
        </Typography>

        {/* Confirm termination of project group creation */}
        <Prompt open={state.showPrompt} onClose={closeTerminatePrompt}
            message={'You are About to cancel the creation of this project group'}
            onProceed={handleCloseForm} onCancel={closeTerminatePrompt}
            proceedTooltip={'This will clear all saved data and close this form'}
            cancelTooltip={'This will close this prompt, and change nothing'} />
    </Box>
}