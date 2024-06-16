'use client'

import { Box, Button, IconButton, Typography } from "@mui/material";
import { DocumentSvg, ImageSvg } from "@/public/icons/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import NextArrow from "@mui/icons-material/WestOutlined";
import { SubmitButton } from '@/Components/SubmitButton'
import { getRequestHandler, postRequestHandler } from '@/Components/requestHandler'
import FormTextArea from "@/Components/TextArea/TextArea";
import FormTextField from "@/Components/TextField/TextField";
import { useEffect, useState } from "react";
import { getFileSize } from "../../utils/getFileSize";
import { Close } from "@mui/icons-material";
import { generateFileUpload } from "../../utils/generateFileUpload";
import Loader from "../Loader";
import EmailSummaryCard from "./EmailSummaryCard";
import BasicEmailDetails from "./BasicEmailDetails";

export default function EmailList({ }) {
    const [emails, setEmails] = useState(null);
    const [currentTab, setCurrentTab] = useState('sent');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedEmail, setSelectedEmail] = useState(null);

    const router = useRouter();

    const goBack = () => {
        router.back()
    }

    const switchTab = (id) => {
        setCurrentTab(id)
    }

    useEffect(() => {
        getRequestHandler({
            route: `/api/get-emails/`,
            successCallback: body => {
                setEmails(body?.result)
                body?.result && setSelectedEmail(body?.result?.sentMessages[0])
            },
            errorCallback: err => {
                console.log('Something went wrong', err)
                setEmails([])
            }
        })
    }, [])

    useEffect(() => {
        const id = currentTab === 'sent' ? 'sentMessages' : 'receivedMessages'
        emails && emails[id] && setSelectedEmail(emails[id][0])
        setCurrentIndex(0)
    }, [currentTab])

    const handleClick = (data, index) => {
        setSelectedEmail(data)
        setCurrentIndex(index)
    }

    const createEmail = () => {
        window.location.href = `/admin/send-email`
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
        {/* Tool bar */}
        < Box sx={{ bgcolor: '#F5F5F5', py: 1, px: 2, display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
            {/* Back button */}
            < IconButton sx={{
                mr: 2, bgcolor: 'white', border: '1.5px solid rgba(28, 29, 34, 0.1)', p: .5
            }}
                onClick={goBack}>
                <NextArrow sx={{ color: '#5D5D5D', fontSize: 15 }} />
            </IconButton >

            {/* title */}
            < Typography sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 700, textTransform: 'uppercase' }}>
                EMAIL ({(emails?.sentMessages?.length || 0) + (emails?.receivedMessages?.length || 0)})
            </Typography >

            <Box sx={{ flexGrow: 1 }} />

            {/* Add follow up button */}
            <Button variant='contained' sx={{ fontSize: 11 }}
                onClick={createEmail}>
                Create New Email
            </Button>
        </Box >

        {/* Tab head */}
        <Box sx={{
            display: 'flex', alignItems: 'center', maxWidth: '100%', borderBottom: '1px solid #1C1D221A',
        }}>
            {/* Sent */}
            <Button variant="text"
                sx={{
                    fontSize: 11, textTransform: 'uppercase', py: 1,
                    bgcolor: 'white', fontWeight: 700, ":hover": { background: '#257AFB10' },
                    color: currentTab === 'sent' ? '#257AFB' : 'black', width: '100%',
                    borderBottom: currentTab === 'sent' ? '4px solid #257AFB' : `none`
                }} onClick={() => { switchTab('sent') }}>
                Sent ({emails?.sentMessages?.length || 0})
            </Button>

            {/*Received*/}
            <Button variant="text"
                sx={{
                    fontSize: 11, textTransform: 'uppercase', py: 1,
                    bgcolor: 'white', fontWeight: 700,
                    color: currentTab === 'received' ? 'primary.main' : 'black', width: '100%',
                    borderBottom: currentTab === 'received' ? '4px solid #BF0606' : `none`
                }} onClick={() => { switchTab('received') }}>
                Received ({emails?.receivedMessages?.length || 0})
            </Button>
        </Box>

        {/* Body */}
        {emails ? <Box sx={{ display: 'flex', maxWidth: '100%' }}>
            {/* Message Summary */}
            <Box sx={{
                display: 'flex', flexDirection: 'column', maxWidth: '30%', maxHeight: 'calc(100vh - 170px)',
                overflowY: 'hidden', ":hover": { overflowY: 'auto' }, borderRight: '1px solid #1C1D221A'
            }}>
                {emails[currentTab === 'sent' ? 'sentMessages' : 'receivedMessages'].map((email, index) => {
                    return <EmailSummaryCard category={currentTab} index={index} showSender={true} key={index} email={email}
                        selected={currentIndex === index} hoverBgcolor={'#BF06060A'} noReply={true}
                        handleClick={handleClick} />
                })}
            </Box>

            {/* Message content */}
            <Box sx={{
                width: '70%', maxHeight: 'calc(100vh - 170px)',
                overflowY: 'hidden', ":hover": { overflowY: 'auto' },
            }}>
                {selectedEmail && <BasicEmailDetails email={selectedEmail} />}
            </Box>
        </Box> : <Loader />}

    </Box>
}