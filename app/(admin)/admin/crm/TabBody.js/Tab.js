'use client'

import {
    Box, Stack, Button, Card, Grid, TableContainer, Table, TableHead,
    TableRow, TableCell, Typography, TableBody, Checkbox, CardHeader,
    CardContent, IconButton, ButtonGroup, Paper, Container, Select,
    ListItem, ListItemText, ListItemButton, MenuItem, InputLabel, TextField,
    TableSortLabel, Avatar, AvatarGroup, LinearProgress, Divider, Toolbar, Modal
} from "@mui/material";

import { useDispatch } from "react-redux";

import { useState, useEffect } from "react";


//import backgroundImage from '../images/image-1.png';
import Phone from "@mui/icons-material/PhoneOutlined";
import CommentIcon from "@mui/icons-material/CommentOutlined";

import CalendarIcon from "@mui/icons-material/CalendarMonth";
import Email from "@mui/icons-material/EmailOutlined";
import More from "@mui/icons-material/MoreHorizOutlined";
import NextArrow from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/AddOutlined";


import { FigmaSvg, InPersonSvg, LetterSvg, MailSvg, OnlineSvg, PdfSvg } from "@/public/icons/icons";

import moment from "moment/moment";

import TabDetails from "./TabDetails";

import IconElement from "@/Components/IconElement";

import { getFollowupHistory } from "../helper";

/* const FigmaSvg = '/icons/FigmaSvg.svg';
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

function TabBody({ contactMode, changesInRecord, clientId }) {
    const dispatch = useDispatch();

    const [state, setState] = useState({
        records: [], selectedIndex: '',
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        //fetch updated data from server
        console.log('fetching fresh followups for', contactMode);
        updateState({ records: [] });

        refreshData();

    }, [changesInRecord, /* state.selectedIndex, */ contactMode])


    const refreshData = () => {
        console.log('fetching fresh followups for', contactMode)

        getFollowupHistory({
            contactId: clientId, contactMode: contactMode,
            dataProcessor: (result) => {
                updateState({ records: result });
            }
        });
    }

    const closeFollowUpDetails = () => {
        updateState({ selectedIndex: '' })
    }

    const openFollowUpDetails = (event) => {
        const index = event.currentTarget.id;
        console.log('index', index);
        updateState({ selectedIndex: `${index}` })
    }

    console.log('tab prop', 'state', state);


    return (
        <Box sx={{ maxWidth: '100%', }}>
            {/* Heading */}
            {state.records?.length ? <Typography sx={{ bgcolor: 'white', px: 3, py: 1.5, fontWeight: 700 }}>
                {contactModes[contactMode].label}({state.records?.length})
            </Typography> : null
            }
            {/* Content */}
            {state.records?.length ? <Box sx={{ px: 2, maxHeight: '50vh', overflowY: 'auto' }}>
                {state.records.map((data, index) => {
                    const date = moment(data.date, 'yyyy-MM-DD').format('DD/MM/yyyy');
                    return <Box key={index} id={index}
                        sx={{
                            cursor: 'pointer', border: '1px solid rgba(28, 29, 34, 0.1)',
                            borderRadius: '12px', my: 2, bgcolor: 'white'
                        }}
                        onClick={openFollowUpDetails}>
                        {/* Heading: Phone icon, phone-index label, date and time, more icon */}
                        <Box sx={{
                            py: 1, px: 2, display: 'flex', alignItems: 'center',
                            borderBottom: '1px solid rgba(28, 29, 34, 0.1)'
                        }}>
                            {/* Tab icon */}
                            {contactModes[contactMode].icon}

                            {/* Tab-index label */}
                            <Typography>
                                {contactModes[contactMode].label} - {index + 1}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* date at time */}
                            <Typography sx={{
                                mr: 2, px: 1, py: .5, display: 'flex', alignItems: 'center', fontWeight: 600,
                                color: '#8D8D8D', fontSize: 14, bgcolor: 'rgba(28, 29, 34, 0.04)', borderRadius: '10px',
                            }}>
                                <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                                {date} at {data.time}
                            </Typography>

                            {/* More icon */}
                            <Avatar sx={{
                                bgcolor: '#F5F5F5',
                                height: '28px', width: '28px',
                                border: '1.5px solid rgba(28, 29, 34, 0.1)'
                            }}>
                                <More fontSize="small"
                                    sx={{ height: 24, width: 24, color: '#5D5D5D' }} />
                            </Avatar>
                        </Box>

                        {/* Body:Topic label and topic content */}
                        <Box sx={{ px: 2, py: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                                {data.topic}
                            </Typography>
                            <Typography sx={{ fontSize: 14, color: '#8D8D8D' }}>
                                {data.details}
                            </Typography>
                        </Box>

                        {/* Footer: File icon, name, size and comments */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                            {/* File Icon */}
                            <Box sx={{ mr: 3, fontSize: 14 }}>
                                {fileIcons[data.files[0]?.fileExtension ?? '']}
                            </Box>
                            {/* File name */}
                            <Typography sx={{ mr: 2, fontSize: 14, fontWeight: 600 }}>
                                {data.files[0]?.filename ?? ''}
                            </Typography>
                            {/* File size */}
                            <Typography sx={{ fontSize: 14, color: '#8D8D8D' }}>
                                {data.files[0]?.fileSize ?? ''}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* Comments */}
                            <Typography sx={{ fontSize: 14, display: 'flex', alignItems: 'center', color: 'rgba(28, 29, 34, 0.5)' }}>
                                {/* Icon */}
                                <CommentIcon sx={{ fontSize: 16, mr: 1 }} />
                                {/* Number of comments */}
                                {data?.commentCount ?? 0} Comment
                            </Typography>
                        </Box>
                    </Box>
                }
                )}
            </Box> : null}

            <Modal open={state.selectedIndex} onClose={closeFollowUpDetails}>
                <TabDetails {...{
                    selectedFollowUp: state.records[Number(state.selectedIndex)],
                    contactMode: contactMode, closeFollowUpDetails: closeFollowUpDetails, index: Number(state.selectedIndex)
                }} />
            </Modal>

        </Box>
    )
}

export default TabBody;