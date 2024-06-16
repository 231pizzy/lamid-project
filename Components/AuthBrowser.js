'use client';

import { Box, Modal } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endAuthSession } from "./redux/authSlice";

export default function AuthBrowser() {
    const searchParams = useSearchParams();
    const iframeRef = useRef(null);

    const dispatch = useDispatch();
    const authStarted = useSelector(state => state.authData.authStarted)
    const authUrl = useSelector(state => state.authData.authUrl)
    const type = useSelector(state => state.authData.type)

    console.log('authbrowser', authStarted, authUrl)

    const [open, setOpen] = useState(false)
    const [ref, setRef] = useState(null)

    const handleCloseWindow = () => {
        console.log('closing window')
        dispatch(endAuthSession())
        setOpen(false)
    }

    const handleMessageFromIframe = (event) => {
        if (event.origin !== window.origin) return
        const message = event.data;
        console.log('message received', event.data)
        if (message?.success) {
            dispatch(endAuthSession({ success: true }))
            setOpen(false)
        }
    }

    useEffect(() => {
        console.log('setting ref')
        window.addEventListener('message', handleMessageFromIframe, false)

        return () => {
            window.removeEventListener('message', handleMessageFromIframe)
        }

    }, [])

    const handleIframeClose = (event) => {
        //  event.preventDefault()
        console.log('called')
        handleCloseWindow();
    }

    useEffect(() => {
        console.log('authStarted, searchParamschanged', authStarted, searchParams)
        if (searchParams.get('success')) {
            //Auth has been completed successfully. End the auth session
            handleCloseWindow();
        }
        else if (authStarted) {
            setOpen(true)
            setTimeout(() => {
                setRef(iframeRef)
            }, 2000)
        }
    }, [authStarted, searchParams])

    return open && <Modal open={open} onClose={handleCloseWindow} sx={{}}>
        <Box sx={{
            bgcolor: 'white', m: 'auto',
            position: 'absolute', left: '50px', right: '50px', top: '50px', bottom: '50px',
        }}>
            <iframe
                ref={ref}
                src={authUrl}
                title="Quickbook Auth 2.0"
                height='100%'
                width='100%'
                style={{ backgroundColor: 'white', }}
            />
        </Box>

    </Modal>
}