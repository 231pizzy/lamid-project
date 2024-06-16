'use client'

import {
    Avatar, Box, Button, CircularProgress, OutlinedInput, Slide, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';


import AttachmentIcon from '@mui/icons-material/AttachFileOutlined';
import InsertLinkIcon from '@mui/icons-material/InsertLinkOutlined';
import UnderlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import BoldIcon from '@mui/icons-material/FormatBoldOutlined';
import ImageIcon from '@mui/icons-material/Image';
import ListIcon from '@mui/icons-material/FormatListBulletedOutlined';
import NumberListIcon from '@mui/icons-material/FormatListNumberedOutlined';


import { useState, useMemo } from "react";
import { useSelector } from "react-redux";


//import { CitySelect, StateSelect, CountrySelect } from 'react-country-state-city';

import { v4 as uuid } from 'uuid';

import { emailContact } from "./helper";

const footerIcons = [
    { icon: <AttachmentIcon sx={{ color: '#737373', rotate: '45deg' }} />, barAfter: false, clickKey: 'attachFile' },
    { icon: <InsertLinkIcon sx={{ color: '#737373', rotate: '135deg' }} />, barAfter: true, clickKey: 'insertLink' },
    { icon: <UnderlinedIcon sx={{ color: '#737373' }} />, barAfter: false, clickKey: 'underlineMsg' },
    { icon: <BoldIcon sx={{ color: '#737373' }} />, barAfter: true, clickKey: 'boldMsg' },
    { icon: <ImageIcon sx={{ color: '#737373' }} />, barAfter: true, clickKey: 'addImage' },
    { icon: <ListIcon sx={{ color: '#737373' }} />, barAfter: false, clickKey: 'listFormat' },
    { icon: <NumberListIcon sx={{ color: '#737373' }} />, barAfter: true, clickKey: 'numberListFormat' },
]
function EmailClient(prop) {
    const disabledButtons = useSelector(state => state.route.disabledButtons);

    console.log('email client view')
    const [state, setState] = useState({
        email: [...prop.email], fullName: prop.fullName, profilePicture: prop.profilePicture,
        subject: '', message: '', cc: [], bcc: [], activeField: 'email'
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }


    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, []);

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const handleTextInput = (event) => {

        updateState({ [event.target.id]: event.currentTarget.value })
    }

    const textInputElement = ({ disabled, width, bgcolor, value, multiline,
        placeholder, stateKey, type, adornment }) => {
        return <OutlinedInput
            disabled={disabled}
            value={value}
            multiline={multiline}
            rows={8}
            id={stateKey}

            type={type}
            name={nameValue}
            onChange={handleTextInput}
            placeholder={placeholder}
            sx={{ width: width, borderRadius: 0, bgcolor: bgcolor }}
        />
    }

    const closeForm = (event) => {
        prop.closeForm();
    }

    const sendEMail = (event) => {
        if (state.email.length && state.subject && state.message) {
            console.log('send email');

            emailContact({
                to: state.email, emailBody: state.message, subject: state.subject,
                dataProcessor: () => { closeForm() }
            })
            /* 
                        sendEmail(event, updateState, dispatch, closeForm, state.email, state.message,
                            state.subject, remoteRequest, openSnackbar, toggleBlockView); */
        }
    }


    return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            height: '100%', transform: 'translate(-0%,-50%)', bgcolor: 'white', overflowY: 'hidden',
            position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '80%', md: '60%', lg: '50%', xl: '42%' },
        }}>
            {/* Heading */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1,
                display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 2, px: { xs: 1.5, sm: 2 }
            }}>
                {/* Heading label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                    MESSAGE
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Close form */}
                <Close onClick={closeForm}
                    sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 36 }} />
            </Box>

            {/* Content */}
            <Box sx={{ mt: '90px', height: '85%', }}>
                {/* Name and profile picture */}
                <Box sx={{ pb: 1, px: 1.5, display: 'flex', alignItems: 'center' }}>
                    {/* Profile picture */}
                    <Avatar sx={{ mr: 2, width: '32px', height: '32px' }} src={state.profilePicture} />
                    {/* Full name */}
                    <Typography sx={{ fontWeight: 600 }}>
                        {state.fullName}
                    </Typography>
                </Box>

                {/* Email, cc, and bcc */}
                <Box>
                    <Box sx={{ px: 1.5, py: 1.5, border: '1px solid rgba(28, 29, 34, 0.1)', display: 'flex', alignItems: 'center' }}>
                        {/* To label */}
                        <Typography sx={{ pr: 2, fontWeight: 600 }}>
                            To:
                        </Typography>
                        {/* Email */}
                        <Typography sx={{ px: 1, py: .3, color: '#8D8D8D', fontWeight: 600, bgcolor: 'rgba(28, 29, 34, 0.08)', borderRadius: '22px' }}>
                            {state.email}
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                    </Box>
                </Box>


                {/* Subject*/}
                <Box sx={{}}>
                    {textInputElement({
                        width: '100%', value: state.subject, placeholder: 'Subject',
                        stateKey: 'subject', type: 'text'
                    })}
                </Box>

                {/* Message */}
                {textInputElement({
                    width: '100%', multiline: true, value: state.message, placeholder: 'Type message here',
                    stateKey: 'message', type: 'text', bgcolor: '#FBFBFB'
                })}

                {/* Footer */}
                <Box sx={{
                    mb: 4, px: 2, py: 2, bgcolor: '#F5F5F5', position: 'absolute', bottom: 0,
                    left: 0, right: 0, display: 'flex', justifyContent: 'center'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80 % ' }}>
                        {footerIcons.map(icon => {
                            return <Box sx={{ px: 1.5, display: 'flex', borderRight: icon.barAfter ? '1px solid black' : '' }}>
                                {icon.icon}
                            </Box>
                        })}
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button id='sendMessageToClient' variant="contained"
                        disabled={buttonActive('sendMessageToClient')}
                        sx={{ py: .5, fontSize: 12 }}
                        onClick={sendEMail}>
                        {buttonActive('sendMessageToClient') &&
                            <CircularProgress id='sendMessageToClient' size={20}
                                sx={{ mr: 2, color: '#08e8de' }} />}
                        Send
                    </Button>
                </Box>

            </Box>
        </Box >
    </Slide>)

}

export default EmailClient;