'use client'

import {
    Box, Button, Typography,
} from "@mui/material";


import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar, setDashboardView, setPageTitle } from "@/Components/redux/routeSlice";


import BackIcon from '@mui/icons-material/WestOutlined';

import CollectedData from "../CollectedData";

import { useRouter } from "next/navigation";

import { getForm } from "../helper";

export default function FormDetails({ params }) {
    const router = useRouter();

    console.log('params', params);

    const { formId, formTitle } = params.slug;

    const dispatch = useDispatch();
    // const location = useLocation();

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Tools' }))

        const baseUrl = window.location.origin;
        const userCategory = window.location.pathname.split('/')[1]
        const formLink = `${baseUrl}/${userCategory}/fill-form/${formId}`

        updateState({ formLink: formLink })
    }, [])

    const [state, setState] = useState({
        formTitle: formTitle, formId: formId, formLink: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const getFormJson = () => {
        getForm({
            formId: formId, dataProcessor: (result) => {
                router.push(`/admin/form-builder/?formId=${formId}&&edit=true&&formJSON=${formJSON}`)
            }
            /* updateState: updateState, remoteRequest: remoteRequest,
            dispatch: dispatch, openSnackbar: openSnackbar,
            navigate: navigate, id: formId,
            gotoFormBuilder: (formJSON, formId) => {
                router.push('/admin/form-builder/?',
                    { state: { edit: true, formJSON: formJSON, formId: formId } })
            } */
        })
    }


    const copyFormLink = () => {
        /*   const baseUrl = window.location.origin;
          const userCategory = window.location.pathname.split('/')[1]
          const formLink = `${baseUrl}/${userCategory}/fill-form/${state.formId}` */
        navigator.clipboard.writeText(state.formLink);  // Copy link
        dispatch(openSnackbar({ message: 'form link copied to clipboard', severity: 'success' }))
    }

    const gotoPrevPage = () => {
        router.back();
    }

    return (
        <Box sx={{ maxWidth: '100%', }}>
            {/* Toolbar */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 1, pb: 2, bgcolor: '#F5F5F5' }}>
                {/* Back button */}
                <BackIcon onClick={gotoPrevPage}
                    sx={{ bgcolor: 'white', borderRadius: '26.6667px', mr: 2, cursor: 'pointer' }} />
                {/* Page label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 1, md: 18 } }}>
                    Forms
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Create form button */}
                <Button variant="contained" onClick={getFormJson} sx={{ mr: 4 }}>
                    Edit form
                </Button>

                {/* View collected data button */}
                {/*  <Button variant="contained" onClick={viewCollectedData} sx={{ mx: 4 }}>
                    View Data
                </Button> */}

                {/* Copy Form URL button */}
                <Button variant="contained" onClick={copyFormLink} >
                    Copy Form Link
                </Button>
            </Box>

            {/* Body */}
            <Box sx={{ height: '80vh', overflowY: 'auto' }}>
                <CollectedData formId={formId} />
            </Box>
        </Box>)
}
