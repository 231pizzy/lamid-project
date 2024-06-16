'use client'

import { Box, Button, Modal, TextField, Typography } from "@mui/material"

import { useEffect, useState, } from 'react';
//import JotFormEmbed from 'react-jotform-embed';

import { openSnackbar, } from "@/Components/redux//routeSlice";

import { useDispatch } from "react-redux";

import BackIcon from '@mui/icons-material/WestOutlined';


import './app.css';

import './formBuilder.css';

import { useRouter, useSearchParams } from "next/navigation";
import { createForm, editForm } from "./helper";
import dynamic from "next/dynamic";

const ReactFormBuilder = dynamic(() => import('react-form-builder2').then((data) => data.ReactFormBuilder), { ssr: false })
const ReactFormGenerator = dynamic(() => import('react-form-builder2').then((data) => data.ReactFormGenerator), { ssr: false })

function FormBuilder() {
    const dispatch = useDispatch();
    const router = useRouter();

    const searchParams = useSearchParams();

    const formId = searchParams.get('formId');
    const formData = searchParams.get('formJSON');
    const edit = searchParams.get('edit');

    const [state, setState] = useState({
        formTitle: '', getFormName: false, formData: [],
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const handleTextField = (event) => {
        updateState({ formTitle: event.currentTarget.value });
    }

    const handleCreateForm = (event) => {
        createForm({
            formTitle: state.formTitle, formData: state.formData, dataProcessor: (result) => {
                handleSaveForm()
                dispatch(openSnackbar({ message: 'Form saved', severity: 'success' }));
            }
        })
    }

    const handleEditForm = (event) => {
        editForm({
            formId: formId, formData: state.formData, dataProcessor: (result) => {
                dispatch(openSnackbar({ message: 'Form edit saved', severity: 'success' }));
            }
        })
    }

    const handleSubmit = (data) => {
        console.log('submitted', data);
        updateState({ formData: data?.task_data })
    }

    const handleSaveForm = (event) => {
        updateState({ getFormName: !state.getFormName })
    }


    const viewForm = () => {
        updateState({ viewForm: true })
    }

    const buildForm = () => {
        updateState({ viewForm: false })
    }


    const gotoPrevPage = () => {
        router.back();
    }

    console.log('form state ', state)

    return <Box sx={{}}>
        {/* Heading */}
        <Box sx={{ px: 3, py: 1, pb: 2, display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', zIndex: 11 }}>
            {/* Back button */}
            <BackIcon onClick={gotoPrevPage}
                sx={{ bgcolor: 'white', borderRadius: '26.6667px', mr: 2, cursor: 'pointer' }} />
            {/* Page label */}
            <Typography sx={{ fontWeight: 600, fontSize: 17 }}>
                {state.viewForm ? 'Form Preview' : 'Form Builder'}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {state.viewForm ? <Button variant="contained" onClick={buildForm} sx={{}}>
                Build Form
            </Button> :
                <Button variant="contained" onClick={viewForm} sx={{}}>
                    Preview Form
                </Button>}

            {Boolean(state.formData?.length) && Boolean(!edit) &&
                <Button variant="contained" onClick={handleSaveForm} sx={{ ml: 5 }}>
                    Finish </Button>}

            {Boolean(state.formData?.length) && Boolean(edit) &&
                <Button variant="contained" onClick={handleEditForm} sx={{ ml: 5 }}>
                    Save Edit </Button>}
        </Box>

        {/* Form */}
        <Box sx={{ height: '80vh', overflow: 'auto' }}>
            {/* Form Object */}
            {state.viewForm ?
                <Box sx={{ maxWidth: 'max-content', px: 4, py: 4, mx: 'auto' }}>
                    <ReactFormGenerator data={state.formData} actionName="Set this to change the default submit button text"
                        submitButton={<Button sx={{ mx: 'auto' }} variant="contained" type="submit"
                            className="btn btn-primary">Submit</Button>} />
                </Box>

                : <Box sx={{}}>
                    < ReactFormBuilder data={state.formData ?? []} onPost={handleSubmit}/*  toolbarItems={items}  */ />
                </Box>}
        </Box>

        <Modal open={state.getFormName} onClose={handleSaveForm}>
            <Box align='center' sx={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -50%)', width: 'max-content', px: 4, py: 2, bgcolor: 'white' }}>
                {/* Label */}
                <Typography sx={{ mb: 1 }}>
                    Name of form
                </Typography>

                <Box>
                    {/* Text field */}
                    <TextField value={state.formTitle} onChange={handleTextField} placeholder="Eg. Query Form" />
                </Box>

                {/* Save button */}
                <Button variant="contained" onClick={handleCreateForm} sx={{ mt: 2 }}>
                    Save Form
                </Button>
            </Box>
        </Modal>
    </Box>
}

export default FormBuilder