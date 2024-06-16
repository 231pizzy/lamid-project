import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ReactFormGenerator } from "react-form-builder2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getForm } from "../Tools/toolsLogic";
import { remoteRequest } from "../app/model";
import { openSnackbar, setPageTitle, toggleBlockView } from "../app/routeSlice";

import BackIcon from '@mui/icons-material/WestOutlined';
import { saveData } from "./formLogic";

export default function FillForm(prop) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [state, setState] = useState({
        formTitle: location.state?.formTitle ?? '', formJSON: location.state?.formJSON ?? [],
        formId: location.state?.formId ?? window.location.pathname.split('/').slice(-1)[0]
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Fill Form' }));
        getForm({
            updateState: updateState, remoteRequest: remoteRequest,
            dispatch: dispatch, openSnackbar: openSnackbar,
            navigate: navigate, id: state.formId,
            gotoFormBuilder: (formJSON, formId, formTitle) => {
                updateState({ formTitle: formTitle, formJSON: formJSON })
            }
        })
    }, [])

    const handleUpdate = (data) => {
        console.log('change triggered', data);
    }

    const handleFinalSubmit = (data) => {
        console.log('data submited', data);
        saveData(state.formId, data, updateState,
            remoteRequest, dispatch, openSnackbar, navigate, toggleBlockView)
    }

    const gotoPrevPage = () => {
        navigate(-1);
    }

    console.log('fill form state', state);

    return <Box>
        {/* Toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 1, mt: -1, pb: 2, bgcolor: '#F5F5F5' }}>
            {/* Back button */}
            <BackIcon onClick={gotoPrevPage}
                sx={{ bgcolor: 'white', borderRadius: '26.6667px', mr: 2, cursor: 'pointer' }} />
            {/* Page label */}
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 18 } }}>
                {state?.formTitle}
            </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Form */}
            <Box sx={{ maxWidth: 'max-content', py: 3, px: 2, mx: 'auto' }}>
                {Boolean(state.formJSON?.length) && <ReactFormGenerator data={state.formJSON}
                    onChange={handleUpdate}
                    onSubmit={handleFinalSubmit}
                    actionName="Set this to change the default submit button text"
                    submitButton={<Button sx={{ mx: 'auto' }} variant="contained" type="submit" className="btn btn-primary">Submit</Button>} />}
            </Box>
        </Box>
    </Box>
}