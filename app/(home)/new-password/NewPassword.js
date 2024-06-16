'use client'

import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";

import VisibilityOn from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';


import styled from "@emotion/styled";

import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { postRequestHandler } from "@/Components/requestHandler";
import { startAnimation, stopAnimation } from "@/Components/animateButton";

function NewPasword() {
    const dispatch = useDispatch();
    const router = useRouter();

    const disabledButtons = useSelector(state => state.route.disabledButtons);

    const [state, setState] = useState({
        password: { value: '', errMsg: '' },
        showPassword: false, message: ''
    });

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const Img = styled('img')({
        display: 'block',
        margin: 'auto'
    });

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const handlePassword = (event) => {
        updateState({ password: { errMsg: '', value: event.target.value } })
    }

    const handlePasswordVisibility = (event) => {
        updateState({ showPassword: !state.showPassword })
    }

    const handleSubmit = (event) => {
        console.log('handle submit');
        if (state.password.value) {
            const buttonId = event.target.id;

            startAnimation(buttonId, dispatch);

            postRequestHandler({
                route: '/api/change-password',
                body: { password: state.password.value },
                successCallback: body => {
                    const result = body.result;
                    let message = ''
                    if (result) {
                        console.log('password changed');
                        message = 'Password changed'
                        router.replace('/login')
                    }
                    else {
                        console.log('password was not changed')
                        message = 'Password was not changed'
                    }
                    stopAnimation(buttonId, dispatch);
                    updateState({ message: message })
                },
                errorCallback: err => {
                    console.log('something went wrong', err)
                    updateState({ message: 'Try again later' })
                }
            })
        }

        else {
            updateState({ password: { ...state.password, errMsg: 'required' } })
        }

        /* changePassword(event, state, updateState, dispatch,
            remoteRequest, navigate, openSnackbar, toggleBlockView) */
    }

    const validate = (event) => {
        if (!event.currentTarget.value) {
            updateState({ password: { ...state.password, errMsg: 'Required' } })
        }
    }

    return (
        <>
            <Box sx={{ mb: 3, textAlign: 'center' }} >
                {/*  */}
                <Typography sx={{ color: 'grey[500]', fontSize: { xs: 10, sm: 14 } }}>
                    Your new password must be different from the previous
                </Typography>

                {(state.message) &&
                    <Typography sx={{
                        color: '#BF0606', fontWeight: 700, fontSize: 12, lineHeight: '24.51px',
                        textAlign: 'center',
                    }}>
                        {state.message}
                    </Typography>}
            </Box>

            {/* New Password Form*/}
            <Box sx={{ mb: 4 }}>
                <Typography variant='caption' sx={{
                    color: '#333333',
                    fontWeight: 700, fontSize: 14, lineHeight: '24.51px'
                }}>
                    Create new password
                </Typography>

                <OutlinedInput fullWidth variant="outlined" id='password'
                    placeholder='Password' type={state.showPassword ? 'text' : 'password'}
                    onChange={handlePassword} onBlur={validate} helperText={state.password.errMsg}
                    name={nameValue}
                    endAdornment={
                        <InputAdornment position="end" >
                            <IconButton end='edge'
                                onClick={handlePasswordVisibility} >
                                {state.showPassword ? <VisibilityOn /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    error={Boolean(state.password.errMsg)} value={state.password.value}
                />
                {state.password.errMsg && <InputLabel id='password-id' sx={{ mb: 0, }}>
                    <Typography variant='body1' sx={{
                        ml: 2,
                        color: '#BF0606',
                        fontSize: 12, lineHeight: '24.51px'
                    }}>
                        {state.password.errMsg}
                    </Typography>
                </InputLabel>}
            </Box>

            {/* Create Password Button */}
            <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                <Button id='newPaswd' fullWidth variant="contained" size='large' sx={{
                    bgcolor: '#BF0606',
                    fontWeight: 700, fontSize: 16,
                }} disabled={buttonActive('newPaswd')}
                    onClick={handleSubmit}>
                    {buttonActive('newPaswd') && <CircularProgress id='newPaswd' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}
                    Create Password
                </Button>
            </Grid>
        </>
    );
}

export default NewPasword;