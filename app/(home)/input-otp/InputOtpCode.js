'use client'

import { startAnimation, stopAnimation } from "@/Components/animateButton";
import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";
import { Box, Button, Card, CardContent, Grid, TextField, Typography, InputLabel, Stack, Container, IconButton, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useRef, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { v4 as uuid } from 'uuid';

function InputOtpCode() {
    const dispatch = useDispatch();
    const router = useRouter();

    const disabledButtons = useSelector(state => state.route.disabledButtons);

    const [state, setState] = useState({
        otp: {
            value: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' },
            refs: {
                0: useRef(null), 1: useRef(null), 2: useRef(null),
                3: useRef(null), 4: useRef(null), 5: useRef(null)
            },
            errMsg: ''
        },
        message: ''
        /*  email: location.state?.email */
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    useEffect(() => {
        router.prefetch('/new-password')
    }, [])

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const handleSubmit = (event) => {
        const value = Object.values(state.otp.value).join('');
        const buttonId = event.target.id;

        if (value.length < 6) {
            //incomplete
            updateState({ otp: { ...state.otp, errMsg: 'Incomplete OTP' } })
        }
        else {
            //Complete
            startAnimation(buttonId, dispatch);

            postRequestHandler({
                route: '/api/verify-otp',
                body: { otp: value },
                successCallback: body => {
                    const result = body.result;
                    let message = '';
                    if (result) {
                        console.log('valid', result)
                        message = 'OTP accepted'
                        router.replace('/new-password');
                    }
                    else {
                        console.log('invalid', result)
                        message = 'Invalid OTP'
                    }
                    updateState({ message: message })
                    stopAnimation(buttonId, dispatch);
                },
                errorCallback: err => {
                    console.log('something went wrong', err);
                    updateState({ message: 'Try again later' })
                    stopAnimation(buttonId, dispatch);
                }
            })
        }
        /*    verifyOtp(event, state, updateState, navigate,
               remoteRequest, openSnackbar, dispatch, toggleBlockView) */
    }

    const handleSendAgain = (event) => {
        const buttonId = event.target.id;
        startAnimation(buttonId, dispatch);

        getRequestHandler({
            route: '/api/resend-otp',
            successCallback: body => {
                const result = body.result;
                let message = '';
                if (result) {
                    console.log('email sent', result);
                    message = 'New OTP has been sent'
                }
                else {
                    console.log('email not sent', result)
                    message = 'Could not send the OTP again. Try again later'
                }
                updateState({ message: message })
                stopAnimation(buttonId, dispatch);
            },
            errorCallback: err => {
                console.log('something went wrong', err);
                updateState({ message: 'Try again later' })
                stopAnimation(buttonId, dispatch);
            }
        })

        /*   sendOtp(event, state, updateState, navigate,
              dispatch, openSnackbar, remoteRequest, toggleBlockView) */
    }

    const addDigit = (value, index) => {
        console.log('adding')
        updateState({
            otp: {
                ...state.otp, errMsg: '',
                value: { ...state.otp.value, [index]: value }
            }
        });
        /*  const ref = state.otp.refs[index + 1];
         ref[index + 1]?.current.disabled = false; */
        //go to next box
        state.otp.refs[index + 1]?.current.focus()
    }

    const disabled = (id) => {
        return !id ? false : state.otp.value[id - 1] ? false : true
    }



    const removeDigit = (index) => {
        console.log('removing')
        updateState({ otp: { ...state.otp, value: { ...state.otp.value, [index]: '' } } })
    }

    const onChange = (event) => {
        const value = event.currentTarget.value;
        console.log('state', state, 'value', value)
        const index = Number(event.currentTarget.id)
        if (!value) {
            removeDigit(index);
        }
        else {
            return (integerPattern.test(value)) ? addDigit(value, index)
                : updateState({ otp: { ...state.otp }, message: '' })
        }
    }

    const validate = (event) => {
        Object.values(state.otp.value).filter(item => Boolean(item) === true).length === 6 ?
            handleSubmit(event) : updateState({ otp: { ...state.otp, errMsg: 'Invalid' }, })
    }

    const integerPattern = /^\d$/;

    console.log('state', state.otp);

    return (
        <Box>
            <Box >
                <Typography sx={{
                    color: 'grey[500]', mb: 2, textAlign: 'center',
                    fontSize: { xs: 10, sm: 14 },
                }}>
                    Enter the 6-digit code sent to your initial email
                </Typography>

                {(state.otp.errMsg || state.message) &&
                    <Typography sx={{
                        color: '#BF0606', fontWeight: 700, fontSize: 12, lineHeight: '24.51px',
                        textAlign: 'center',
                    }}>
                        {state.otp.errMsg || state.message}
                    </Typography>}

                {/* Email */}
                <Typography variant='caption' sx={{
                    color: '#333333',
                    fontWeight: 700, fontSize: 12, lineHeight: '24.51px'
                }}>
                    One Time Password (OTP)
                </Typography>

                <Box sx={{ display: 'flex', }}>
                    {[0, 1, 2, 3, 4, 5].map(id =>
                        <TextField id={id.toString()} text sx={{ mr: 1, p: 0, }}
                            variant="outlined" type={'text'}
                            name={nameValue}
                            onChange={onChange} value={state.otp.value[id]}
                            inputRef={state.otp.refs[id]}
                        />
                    )}
                </Box>


            </Box>

            {/* Forgot password */}
            <Box display='flex' justifyContent='end' alignItems='center' >
                <Button id='resendOtp' variant="text" sx={{
                    mb: 4,
                    color: '#BF0606', right: 0, fontWeight: 600, fontSize: 12,
                    lineHeight: '24.51px'
                }} disabled={buttonActive('resendOtp')}
                    onClick={handleSendAgain}>
                    {buttonActive('resendOtp') && <CircularProgress id='resendOtp' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}
                    Send Again
                </Button>
            </Box>


            {/* Submit OTP */}
            <Button id='submitOtp' fullWidth variant="contained" size='large' sx={{
                bgcolor: '#BF0606', mb: 2,
                fontWeight: 700, fontSize: 16,
            }} disabled={buttonActive('submitOtp')}
                onClick={validate}>
                {buttonActive('submitOtp') && <CircularProgress id='submitOtp' size={20}
                    sx={{ mr: 2, color: '#08e8de' }} />}
                Proceed
            </Button>
        </Box >
    );
}

export default InputOtpCode;