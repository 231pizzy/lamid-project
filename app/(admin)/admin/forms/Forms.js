'use client'

import {
    Box, Button, Typography,
} from "@mui/material";


import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/Components/redux/routeSlice";
import { useRouter } from "next/navigation";
import { getForm } from "./helper";


function Forms({ noToolbar }) {
    const router = useRouter();

    const dispatch = useDispatch();

    useEffect(() => {
        /* Set Page title */
        if (!noToolbar) {
            dispatch(setPageTitle({ pageTitle: 'Tools' }))
        }

        getForm({
            dataProcessor: (result) => {
                updateState({ existingForms: result })
            }
        })
    }, [])

    const [state, setState] = useState({
        existingForms: []
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const gotoFormBuilder = () => {
        router.push('/admin/form-builder/?create=true', /* { state: { create: true } } */)
    }

    const gotoFormDetails = (formId, formTitle) => {
        const formUrlEnd = formTitle.toLowerCase().split(' ').join('-');
        router.push(`/admin/forms/${formUrlEnd}/?formId=${formId}&&formTitle=${formTitle}`,/*  { state: { formId: formId, formTitle: formTitle } } */)
    }

    return (
        <Box sx={{ maxWidth: '100%', }}>
            {/* Toolbar */}
            {!noToolbar && <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1, bgcolor: '#F5F5F5' }}>
                {/* Page label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 1, md: 18 } }}>
                    Forms
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Create form button */}
                <Button variant="contained" onClick={gotoFormBuilder}>
                    Create form
                </Button>
            </Box>}

            {/* Body */}
            <Box sx={{ height: noToolbar ? '200px' : '80vh', overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', pl: 2, py: 2, }}>
                    {/* Existing Forms */}
                    {state.existingForms.map((form, index) => {
                        return <Typography key={index} id={form?._id}
                            onClick={() => { gotoFormDetails(form?._id, form?.formTitle) }}
                            sx={{
                                width: 'max-content', px: 2, fontWeight: 500, fontSize: { xs: 15, md: 17 },
                                pt: 1, pb: 4, mr: 4, border: '1px solid black', border: '1px solid rgba(28, 29, 34, 0.1)',
                                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', borderRadius: '16px', cursor: 'pointer',
                                height: '100px'
                            }}>
                            {form?.formTitle}
                        </Typography>
                    })}
                </Box>
            </Box>
        </Box>)
}

export default Forms;