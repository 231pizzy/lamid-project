import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import MessageSummaryCard from "./MessageSummaryCard";
import { sampleData } from "./sampleData";
import { getRequestHandler } from "../requestHandler";
import { useRouter } from "next/navigation";

export default function FacebookMessages({ clientId, fullName, emailAddress }) {
    const [open, setOpen] = useState(true);
    const [currentTab, setCurrentTab] = useState('sent');
    const [messages, setMessages] = useState(null);

    const router = useRouter()

    useEffect(() => {
        /*  getRequestHandler({
             route: `/api/get-emails/?id=${clientId}`,
             successCallback: body => {
                 setEmails(body?.result)
             },
             errorCallback: err => {
                 console.log('Something went wrong', err)
                 setEmails([])
             }
         }) */
        setMessages(sampleData)
    }, [])

    const toggleRanking = () => {
        setOpen(!open)
    }

    const switchTab = (id) => {
        setCurrentTab(id)
    }

    const createFacebookMessage = () => {
        window.location.href = `/admin/send-email?id=${clientId}&&email=${encodeURIComponent(emailAddress)}&&fullName=${fullName}`
    }

    return <Box sx={{
        border: '1px solid #1C1D221A', boxShadow: '0px 6px 12px 0px #4F4F4F14', bgcolor: '#FBFBFB', overflow: 'hidden',
        borderRadius: '16px', width: '100%', mt: 2, height: '100%', display: 'flex', flexDirection: 'column'
    }}>
        {/* Heading */}
        <Box sx={{
            display: 'flex', alignItems: 'center', maxWidth: '100%', borderBottom: '1px solid #1C1D221A',
            pl: 2, pr: 1, py: 1
        }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                FACEBOOK ({(messages?.sentMessages?.length || 0) + (messages?.receivedMessages?.length || 0)})
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Button variant='text' sx={{ p: .5, mr: 2, fontSize: 11, fontWeight: 600 }}
                onClick={createFacebookMessage}>
                Create Facebook Message
            </Button>

            <Button variant='text' sx={{
                alignSelf: 'center', color: 'black', fontSize: 12, py: .5, px: .2,
            }}
                onClick={toggleRanking}>
                {open ? 'Close' : 'Open'} {open ? <ArrowDropDown /> : <ArrowDropUp />}
            </Button>
        </Box>

        {/* Content */}
        {open && <Box>
            {/* Tabs */}
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
                    Sent ({messages?.sentMessages?.length || 0/* filter(i => i?.status === 'sent')?.length || 0 */})
                </Button>

                {/*Received*/}
                <Button variant="text"
                    sx={{
                        fontSize: 11, textTransform: 'uppercase', py: 1,
                        bgcolor: 'white', fontWeight: 700,
                        color: currentTab === 'received' ? 'primary.main' : 'black', width: '100%',
                        borderBottom: currentTab === 'received' ? '4px solid #BF0606' : `none`
                    }} onClick={() => { switchTab('received') }}>
                    Received ({messages?.receivedMessages?.length || 0})
                </Button>
            </Box>

            {/* Tab body */}
            {messages ? <Box sx={{
                display: 'flex', flexDirection: 'column', maxHeight: '300px',
                overflowY: 'hidden', ":hover": { overflowY: 'auto' }
            }}>
                {messages[currentTab === 'sent' ? 'sentMessages' : 'receivedMessages'].map((email, index) => {
                    return <MessageSummaryCard key={index} email={email} />
                })}
            </Box> : <Loader />}
        </Box>}
    </Box>
}