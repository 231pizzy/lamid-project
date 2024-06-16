import {
    Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, Select, Slide, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';
import Folder from '@mui/icons-material/DriveFolderUploadRounded';
import LinkIcon from '@mui/icons-material/LinkOutlined';

import Phone from "@mui/icons-material/PhoneOutlined";

import Clock from "@mui/icons-material/TimerOutlined";

/* import { InPersonSvg, MailSvg, LetterSvg, OnlineSvg } from "../icons/icons"; */


import { useEffect, useState, useMemo } from "react";

import { useDispatch, } from "react-redux";

import { v4 as uuid } from 'uuid';

import moment from "moment";
import IconElement from "@/Components/IconElement";

const InPersonSvg = '/icons/InpersonSvg.svg';
const LetterSvg = '/icons/LetterSvg.svg';
const MailSvg = '/icons/MailSvg.svg';
const OnlineSvg = '/icons/OnlineSvg.svg';

const iconStyle = { width: '20px', height: '20px', margin: '0 8px 0 8px' };

const modesOfContact = [
    {
        label: 'Phone', icon: <Phone sx={{
            borderRadius: '40px', bgcolor: 'rgba(93, 74, 208, 0.15)', color: '#5D4AD0',
            fontSize: 22, mx: 1
        }} />, value: 'phone'
    },
    /*  online: { icon: <IconElement {...{ src: OnlineSvg, style: iconStyle }} />, label: 'Online' },
     inPerson: { icon: <IconElement {...{ src: InPersonSvg, style: iconStyle }} />, label: 'In Person' },
     letter: { icon: <IconElement {...{ src: LetterSvg, style: iconStyle }} />, label: 'Letter' },
     email: { icon: <IconElement {...{ src: MailSvg, style: iconStyle }} />, label: 'Email' } */

    { label: 'In Person', icon: <IconElement {...{ src: InPersonSvg, style: iconStyle }} />, value: 'inPerson' },
    { label: 'Email', icon: <IconElement {...{ src: MailSvg, style: iconStyle }} />, value: 'email' },
    { label: 'Online', icon: <IconElement {...{ src: OnlineSvg, style: iconStyle }} />, value: 'online' },
    { label: 'Letter', icon: <IconElement {...{ src: LetterSvg, style: iconStyle }} />, value: 'letter' },
]

const ratings = [
    { number: 1, label: 'Poor' },
    { number: 2, label: 'Alright' },
    { number: 3, label: 'Good' },
    { number: 4, label: 'Very good' },
    { number: 5, label: 'Excellent' },
]

const hours = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
const minutes = Array.from({ length: 60 }, (_, index) => index.toString().length < 2 ? '0' + index : index.toString());
const periods = ['am', 'pm'];

const timeObject = { hour: hours, minute: minutes, period: periods };

function FollowUpForm(prop) {
    //props: closeForm

    const dispatch = useDispatch();


    const [state, setState] = useState({
        date: moment().format('yyyy-MM-DD'), time: moment().format('h : mma'),
        contactMode: '', topic: '', details: '', rating: '', emptyFields: [], openTimePicker: false,
        hour: '12', minute: '00', period: 'am'
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        updateState({ time: `${state.hour} : ${state.minute}${state.period}` })
    }, [state.hour, state.minute, state.period])

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, []);

    const handleTextInput = (event) => {
        updateState({ [event.target.id]: event.currentTarget.value })
    }

    const textInputElement = ({ disabled, height, fullWidth, value, color, width,
        placeholder, multiline, adornmentPosition, stateKey, type, onchange, adornment }) => {
        return <OutlinedInput
            disabled={disabled}
            value={value}
            fullWidth={fullWidth}
            id={stateKey}
            startAdornment={adornment && adornmentPosition === 'start' && <InputAdornment position={'start'}>
                {adornment}
            </InputAdornment>}
            endAdornment={adornment && adornmentPosition === 'end' && <InputAdornment position={'end'}>
                {adornment}
            </InputAdornment>}
            type={type}
            name={nameValue}
            multiline={multiline}
            rows={5}
            onChange={onchange}
            placeholder={placeholder}
            sx={{ height: height, bgcolor: color, width: width }} />
    }

    const openTimePicker = () => {
        updateState({ openTimePicker: true })
    }


    const closeTimePicker = () => {
        updateState({ openTimePicker: false })
    }

    const closeForm = (event) => {
        prop.closeForm();
    }

    const labelElement = ({ label }) => {
        return <Typography sx={{ mb: 1, fontSize: { xs: 13, md: 14, xl: 16 }, fontWeight: 600 }}>
            {label}
        </Typography>
    }

    const setModeOfContact = (event) => {
        updateState({ contactMode: event.target.value })
    }

    const rateClient = (event) => {
        updateState({ rating: event.currentTarget.id })
    }

    const setTime = (key, value) => {
        updateState({ [key]: value })
    }

    const dropdown = (valueArr, stateKey) => {
        console.log('values', valueArr, stateKey);
        return <FormControl id={stateKey}>
            <InputLabel></InputLabel>
            <Select id={stateKey} onChange={(event) => { setTime(stateKey, event.target.value) }}
                value={state[stateKey].toLowerCase()}>
                {valueArr.map((row, index) =>
                    <MenuItem id={stateKey} key={index} value={row}>
                        {row}
                    </MenuItem>)}
            </Select>
        </FormControl>
    }

    const saveFollowupData = () => {
        if (state.date && state.time && state.contactMode && state.topic && state.details && state.rating)
            prop.saveFormData({
                date: state.date, time: state.time,
                contactMode: state.contactMode, topic: state.topic, details: state.details,
                rating: state.rating, clientId: prop.clientId
            })
    }

    console.log('form state', state);

    return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            height: '100%', transform: 'translate(-0%,-50%)', bgcolor: 'white', overflowY: 'hidden',
            position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '80%', md: 'max-content' },
        }}>
            {/* Heading */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1,
                display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 2, px: { xs: 1.5, sm: 3 }
            }}>
                {/* Close form */}
                <Close onClick={closeForm}
                    sx={{ cursor: 'pointer', mr: 2, color: '#8D8D8D', fontSize: 36 }} />

                {/* Heading label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                    CREATE FOLLOW UP
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Apply button */}
                <Button onClick={saveFollowupData} variant='contained'
                    sx={{ borderRadius: '8px', py: .5, px: 3 }}>
                    Save
                </Button>
            </Box>

            {/* Content */}
            <Box sx={{ mt: '90px', px: 4, pb: 6, maxHeight: '85%', overflowY: 'scroll' }}>
                {/* Date and time section */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', pb: 1 }}>
                    {/* Date section */}
                    <Box sx={{ mr: 4, pb: 2 }}>
                        {labelElement({ label: 'Date' })}
                        {textInputElement({
                            stateKey: 'date', value: state.date, type: 'date', height: 40,
                            placeholder: moment().toDate().toLocaleDateString(), onchange: handleTextInput
                        })}
                    </Box>
                    {/* Time section */}
                    <Box sx={{ pb: 2 }} onClick={openTimePicker}>
                        {labelElement({ label: 'Time', })}
                        {textInputElement({
                            height: 40, placeholder: moment().format('h : mma').toString(), value: state.time, stateKey: 'time',
                            adornment: <Clock sx={{ color: '#AEAEAE' }} />, adornmentPosition: 'end', width: 140
                        })}
                    </Box>
                </Box>

                {/* Mode of contact section */}
                {/* Label */}
                {labelElement({ label: 'Mode of Contact' })}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', pb: 2, mr: -2, alignItems: 'center' }}>
                    {modesOfContact.map((mode) => {
                        return <Box sx={{ mr: 4, mb: 1.5, display: 'flex', alignItems: 'center' }}>
                            {/* Radio button */}
                            <Radio value={mode.value} checked={state.contactMode === mode.value} sx={{ p: 0 }}
                                onChange={setModeOfContact} />
                            {/* Icon */}
                            {mode.icon}
                            {/* Label */}
                            <Typography sx={{ fontSize: 14 }}>
                                {mode.label}
                            </Typography>
                        </Box>
                    })}
                </Box>

                {/* Follow up topic */}
                <Box sx={{ mb: 3 }}>
                    {labelElement({ label: 'Follow Up Topic' })}

                    {textInputElement({ onchange: handleTextInput, value: state.topic, stateKey: 'topic', fullWidth: true, height: 40, color: '#FBFBFB', placeholder: 'Write topic here' })}

                </Box>

                {/* Follow up details */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Label */}
                        {labelElement({ label: 'Follow Up Details' })}

                        <Box sx={{ ml: 1, flexGrow: 1 }} />
                        {/* File icon */}
                        <Folder sx={{ color: '#8D8D8D', mr: 2, mb: 1 }} />
                        {/* Link icon */}
                        <LinkIcon sx={{ mb: 1, color: '#8D8D8D' }} />
                    </Box>

                    {textInputElement({ fullWidth: true, onchange: handleTextInput, value: state.details, stateKey: 'details', multiline: true, color: '#FBFBFB', placeholder: 'Write details here' })}
                </Box>

                {/* Rate the contact's response */}
                <Box>
                    {labelElement({ label: "Rate The Contact's Response" })}
                    {/* Ratings */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {ratings.map(rating => {
                            return <Box sx={{ px: 2, mr: 1, cursor: 'pointer' }} id={rating.number} onClick={rateClient}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography align='center' sx={{
                                        fontSize: { xs: 16, md: 18 }, mb: .5, width: 40, height: 40,
                                        p: 2, boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: state.rating === rating.number.toString() ? '#BF0606' : '#FAFAFA', border: '1px solid rgba(28, 29, 34, 0.1)',
                                        ":hover": { bgcolor: 'rgba(191, 6, 6, 0.1)', color: 'black' }, color: state.rating === rating.number.toString() ? 'white' : 'black',
                                    }}>
                                        {rating.number}
                                    </Typography>
                                </Box>

                                <Typography sx={{ color: '#8D8D8D', fontSize: { xs: 12, md: 14 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {rating.label}
                                </Typography>
                            </Box>
                        })}
                    </Box>
                </Box>
            </Box>

            <Modal open={state.openTimePicker} onClose={closeTimePicker}>
                <Box sx={{ bgcolor: 'white', height: '80px', px: 4, width: 'max-content', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center' }}>
                    {['hour', 'minute', 'period'].map(key => {
                        return <Box id={key} sx={{ mr: 2 }}>
                            {dropdown(timeObject[key], key)}
                        </Box>
                    })}
                    <Close sx={{ cursor: 'pointer', fontSize: 30 }}
                        onClick={closeTimePicker} />
                </Box>
            </Modal>
        </Box >
    </Slide>
    )
}

export default FollowUpForm;