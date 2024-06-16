'use client'

import { Box, Button, Card, CardContent, CircularProgress, Grid, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
/* import { openSnackbar, toggleBlockView } from "../app/routeSlice"; */
/* import { sendOtp, verifyOtp } from "./ReceiveOtpLogic"; */

import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { getRequestHandler } from "@/Components/requestHandler";
import { startAnimation, stopAnimation } from "@/Components/animateButton";

function ReceiveOtp() {
    const router = useRouter();

    //const navigate = useNavigate();

    //  const location = useLocation()
    const dispatch = useDispatch();

    const disabledButtons = useSelector(state => state.route.disabledButtons);

    const [state, setState] = useState({
        otpSent: false, email: { value: '', errMsg: '' }, message: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    useEffect(() => {
        router.prefetch('/input-otp')
    }, [])

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const buttonDisabled = (id) => {
        return disabledButtons.includes(id);
    }

    const goback = () => {
        router.replace('/login')
    }

    const handleSubmit = (event) => {
        const buttonId = event.target.id;

        startAnimation(buttonId, dispatch);
        updateState({ message: '' })

        getRequestHandler({
            route: `/api/otp-request/?email=${state.email.value}`,
            successCallback: body => {
                const result = body?.result;
                if (result === true) {
                    console.log('mail sent')
                    router.push('/input-otp');
                }
                else {
                    console.log('mail not sent')
                }
                stopAnimation(buttonId, dispatch);
            },
            errorCallback: err => {
                console.log('Something went wrong')
                stopAnimation(buttonId, dispatch);
            }
        })

        /*  sendOtp(event, state, updateState, navigate, dispatch,
             openSnackbar, remoteRequest, toggleBlockView, event.currentTarget.id) */
    }

    const handleEmail = (event) => {


        updateState({ email: { errMsg: '', value: event.target.value } })
    }

    const validate = (event) => {
        console.log('state', state)
        if (!state.email.value) {
            console.log('empty')
            updateState({ email: { value: '', errMsg: 'Required' }, message: 'Email is required' })
        }
        else {
            return (emailPattern.test(state.email.value)) ? handleSubmit(event)
                :
                updateState({ email: { ...state.email, errMsg: 'Invalid email' }, message: 'Your email is invalid' })
        }
    }

    console.log('state', state);

    const emailPattern = /^([\w|+|\-|_|~|\.])+[@]([\w])+\.[a-z]+$/i;

    const label = ({ label, fontWeight, fontSize, align, mb, color }) => {
        return <Typography sx={{
            color: color ?? '#333333', textAlign: align ?? 'left', mb: mb,
            fontWeight: fontWeight ?? 700, fontSize: fontSize ?? { xs: 12, md: 14 }, lineHeight: '24.51px'
        }}>
            {label}
        </Typography>
    }

    const textField = ({ nameValue, id, type, onchange, onblur, placeholder }) => {
        return <OutlinedInput name={nameValue} fullWidth variant="outlined" id={id}
            placeholder={placeholder} type={type} sx={{ fontSize: 14, fontWeight: 500 }}
            onChange={onchange} onBlur={onblur} helpertext={state[id].errMsg}
            error={Boolean(state[id].errMsg)} value={state[id].value}
        />
    }

    return (

        <Box align='center' sx={{ maxWidth: '100%', mx: 'auto' }}>

            <Box sx={{ mb: 3, }}>
                {label({
                    label: 'Enter your registered email address to reset your password',
                    fontSize: { xs: 14, md: 15, }, fontWeight: 400, mb: 2, align: 'center'
                })}
                {state.message && label({ label: state.message, color: 'primary.main', align: 'center' })}

                {label({ label: 'Email' })}

                {textField({
                    nameValue: nameValue, id: 'email', type: 'email',
                    onchange: handleEmail, placeholder: 'eg. bit@example.com'
                })}
            </Box>

            <Button disabled={buttonDisabled('receiveOtp')} id='receiveOtp' fullWidth variant="contained"
                size='large' sx={{
                    bgcolor: '#BF0606', mb: 2,
                    fontWeight: 700, fontSize: 16,
                }}
                onClick={validate}>
                {buttonDisabled('receiveOtp') && <CircularProgress id='receiveOtp' size={20}
                    sx={{ mr: 2, color: '#08e8de' }} />}
                Proceed
            </Button>


            <Button variant="text" sx={{
                color: '#BF0606', right: 0, fontWeight: 600, fontSize: 13,
                lineHeight: '24.51px'
            }}
                onClick={goback}>
                Back to Login
            </Button>



        </Box>


    );
}

export default ReceiveOtp;