'use client'

import {
    Box, Stack, Button, Card, Grid, TableContainer, Table, TableHead,
    TableRow, TableCell, Typography, TableBody, Checkbox, CardHeader,
    CardContent, IconButton, ButtonGroup, Paper, Container, Select,
    ListItem, ListItemText, ListItemButton, MenuItem, InputLabel, TextField,
    TableSortLabel, Avatar, AvatarGroup, LinearProgress, Divider, Toolbar, OutlinedInput, Slide
} from "@mui/material";
import { useDispatch } from "react-redux";

//import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";


import Close from '@mui/icons-material/Close';

//import backgroundImage from '../images/image-1.png';
import Phone from "@mui/icons-material/PhoneOutlined";
import SendIcon from "@mui/icons-material/SendTwoTone";


import moment from "moment/moment";

import IconElement from "@/Components/IconElement";

import { createFollowUpComment, getFollowupComments } from "../helper";
import { FigmaSvg, InPersonSvg, LetterSvg, MailSvg, OnlineSvg, PdfSvg } from "@/public/icons/icons";
import { ProfileAvatar } from "@/Components/ProfileAvatar";


/* const FigmaSvg = '/icons/FigmaSvg.svg';
const DownloadSvg = '/icons/DownloadSvg.svg';
const InPersonSvg = '/icons/InpersonSvg.svg';
const LetterSvg = '/icons/LetterSvg.svg';
const MailSvg = '/icons/MailSvg.svg';
const OnlineSvg = '/icons/OnlineSvg.svg';
const PdfSvg = '/icons/pdfSvg.svg'; */


const fileIcons = {
    pdf: <PdfSvg />, figma: <FigmaSvg />
}

const iconStyle = { marginRight: '8px' }
const contactModes = {
    phone: {
        icon: <Avatar sx={{ height: 32, width: 32, mr: 2, bgcolor: 'rgba(93, 74, 208, 0.15)' }}>
            <Phone sx={{ fontSize: 22, color: '#5D4AD0' }} />
        </Avatar>, label: 'Phone'
    },
    online: { icon: <OnlineSvg style={{ ...iconStyle }} />, label: 'Online' },
    inPerson: { icon: <InPersonSvg style={{ ...iconStyle }} />, label: 'In Person' },
    letter: { icon: <LetterSvg style={{ ...iconStyle }} />, label: 'Letter' },
    email: { icon: <MailSvg style={{ ...iconStyle }} />, label: 'Email' }
}

function TabDetails({ selectedFollowUp, index, contactMode, closeFollowUpDetails }) {
    console.log('selectedFollowUp', selectedFollowUp);

    const dispatch = useDispatch();

    const [state, setState] = useState({
        index: index, comment: '', comments: [], fullName: '', contactMode: contactMode, email: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        //grab all the comments on initial render
        console.log('grabbing comments');
        getFollowupComments({
            followupId: selectedFollowUp._id, dataProcessor: (result) => {
                updateState({ comments: result });
            }
        })
    }, [])

    const getTimeAgo = (datetime) => {
        console.log('datetime', datetime);
        //Get minutes in an hour, day, week, month, and year
        const hour = 60;
        const day = 1440;
        const week = 10080;
        const month = 43800.048;
        const year = 525600;

        //get the difference between the current datetime and the datetime parameter
        const differenceInMinutes = Math.floor(moment().diff(moment(datetime, 'DD/MM/yyyy h:mma'), 'minutes'));

        if (!differenceInMinutes) return { value: differenceInMinutes, unit: 'sec' }
        else if (differenceInMinutes < hour) return { value: differenceInMinutes, unit: 'min' }
        else if ((differenceInMinutes < day)) return { value: Math.floor(differenceInMinutes / hour), unit: 'hour' }
        else if ((differenceInMinutes < week)) return { value: Math.floor(differenceInMinutes / day), unit: 'day' }
        else if ((differenceInMinutes < month)) return { value: Math.floor(differenceInMinutes / week), unit: 'week' }
        else if ((differenceInMinutes < year)) return { value: Math.floor(differenceInMinutes / month), unit: 'month' }
        else return { value: Math.floor(differenceInMinutes / year), unit: 'year' }
    }

    const handleCloseFollowUpDetails = () => {
        closeFollowUpDetails();
    }

    const handleTextInput = (event) => {
        updateState({ comment: event.currentTarget.value });
    }

    const postComment = () => {
        if (state.comment) {
            const date = moment().format('DD/MM/yyyy').toString()
            const time = moment().format('h:mma').toString();

            createFollowUpComment({
                date: date, time: time, followupId: selectedFollowUp._id, comment: state.comment,
                dataProcessor: (result) => {
                    if (result) {
                        const newCommentObject = {
                            _id: result.id, fullName: result.fullName, date: date, time: time,
                            comment: state.comment, email: result.email
                        }
                        updateState({ comments: [newCommentObject, ...state.comments], comment: '' })
                    }
                }
            });
        }
    }


    return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            width: { xs: '90%', md: '60%', lg: '30%' }, position: 'absolute', right: '0%', top: '0%',
            transform: 'translate(-0%,-0%)', bgcolor: 'white', height: '100vh',
            bgcolor: 'rgba(28, 29, 34, 0.06)', borderRadius: '12px 0 0 12px', overflowY: 'hidden'
        }}>
            {/* Heading: Phone icon, phone-index label, date and time, more icon */}
            <Box sx={{
                py: 2, px: 3, display: 'flex', alignItems: 'center', bgcolor: 'white',
                borderBottom: '12px solid rgba(28, 29, 34, 0.06)', borderRadius: '12px 0 0 0',
            }}>
                {/* Phone icon */}
                {contactModes[contactMode].icon}

                {/* Phone-index label */}
                <Typography sx={{ fontSize: { xs: 16, md: 17 }, fontWeight: 700 }}>
                    {contactModes[contactMode].label} - {index}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Close button */}
                <Close sx={{ fontSize: 32, cursor: 'pointer' }}
                    onClick={handleCloseFollowUpDetails} />
            </Box>

            {/* Content */}
            <Box sx={{
                bgcolor: 'white', height: '80%', pb: '60px', overflowY: 'auto', borderRadius: '0 0 0 12px'
            }}>
                {/* Body:Topic label and topic content */}
                <Box sx={{ px: 3, py: 2, }}>
                    <Typography sx={{ fontWeight: 700 }}>
                        {selectedFollowUp.topic}
                    </Typography>
                    <Typography sx={{ fontSize: 14, py: 1, color: '#8D8D8D' }}>
                        {selectedFollowUp.details}
                    </Typography>

                    {/* Body Footer: File icon, name, size and comments */}
                    <Box sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
                        {/* File Icon */}
                        <Box sx={{ mr: 3, fontSize: 14 }}>
                            {fileIcons[selectedFollowUp.files[0]?.fileExtension ?? '']}
                        </Box>
                        {/* File name */}
                        <Typography sx={{ mr: 2, fontSize: 14, fontWeight: 600 }}>
                            {selectedFollowUp.files[0]?.filename ?? ''}
                        </Typography>
                        {/* File size */}
                        <Typography sx={{ fontSize: 14, mr: 2, color: '#8D8D8D' }}>
                            {selectedFollowUp.files[0]?.fileSize ?? ''}
                        </Typography>

                        {/* Download file */}
                        {selectedFollowUp.files[0]?.filename ? <DownloadSvg style={{ cursor: 'pointer', width: '45px', height: '45px' }} /> : null}
                    </Box>
                </Box>

                {/* Comment section */}
                <Box sx={{}}>
                    {/* Comment heading */}
                    <Typography sx={{
                        fontSize: 14, display: 'flex', bgcolor: 'rgba(28, 29, 34, 0.06)', fontWeight: 600,
                        alignItems: 'center', color: 'black', px: 3, py: 1
                    }}>
                        {/* Number of comments */}
                        Comments ({state.comments.length})
                    </Typography>

                    {/* Comments */}
                    <Box sx={{ bgcolor: 'white', px: 3, py: 2, }}>
                        {state.comments?.map((data, index) => {
                            console.log('data', data);
                            const timeAgo = getTimeAgo(`${data.date} ${data.time}`);
                            return <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', pb: 2 }}>
                                {/* Profile picture, full name, time ago */}

                                {/* Profile picture */}
                                <ProfileAvatar {...{ src: data.email, byEmail: true, diameter: 30, styleProp: { mr: 1.5 } }} />

                                <Box>
                                    {/* Fullname and time taken */}
                                    <Box sx={{ mb: .5, display: 'flex', alignItems: 'flex-end' }}>
                                        {/* Fullname */}
                                        <Typography sx={{
                                            mr: 2, fontWeight: 700,
                                            fontSize: { xs: 12, md: 14 }
                                        }}>
                                            {data.fullName}
                                        </Typography>

                                        {/* Time ago */}
                                        <Typography sx={{
                                            fontWeight: 600,
                                            color: '#8D8D8D', fontSize: { xs: 11, md: 13 }
                                        }}>
                                            {timeAgo.value}{timeAgo.unit}{timeAgo.value - 1 ? 's' : ''} ago
                                        </Typography>
                                    </Box>


                                    {/* Comment */}
                                    <Typography sx={{ color: '#5D5D5D', fontSize: { xs: 13, md: 14 }, fontWeight: 400 }}>
                                        {data.comment}
                                    </Typography>
                                </Box>

                            </Box>
                        })}
                    </Box>
                </Box>


            </Box>

            {/* Footer */}
            <Box sx={{
                px: 2, py: 2, bgcolor: 'white', position: 'absolute', bottom: 0, left: 0,
                right: 0, borderTop: '1px solid rgba(28, 29, 34, 0.1)', display: 'flex', alignItems: 'center'
            }}>
                {/* Avatar */}
                <ProfileAvatar {...{ src: 'sd', thisUser: true, diameter: 40, styleProp: { mr: 2 } }} />
                {/*  <Avatar src='dsd' sx={{ mr: 2, width: 40, height: 40 }} /> */}

                {/* Textfield */}
                <OutlinedInput
                    value={state.comment}
                    onChange={handleTextInput}
                    placeholder="Write a comment"
                    fullWidth
                    sx={{ bgcolor: '#F5F5F5', height: 40 }}
                />

                {/* Send button */}
                <Avatar sx={{ ml: 2, bgcolor: 'rgba(191, 6, 6, 0.2)', p: 1 }}
                    onClick={postComment}>
                    <SendIcon sx={{ color: '#BF0606', fontSize: 18 }} />
                </Avatar>
            </Box>

        </Box ></Slide>

    )
}

export default TabDetails;