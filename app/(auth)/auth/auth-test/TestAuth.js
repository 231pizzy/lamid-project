'use client'

import { postRequestHandler } from "@/Components/requestHandler";
import Login from "@/app/(home)/login/Component";
import { Box, Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

export default function TestAuth() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const authType = searchParams.get('type');

    const closeWindow = () => {
        window.parent.postMessage({ success: true }, '*')
    }

    const handleTestAuth = () => {
        postRequestHandler({
            route: '/api/test-auth',
            body: {},
            successCallback: (body) => {
                console.log('result', body)
                if (body?.result?.authSuccess === true) {
                    console.log('auth is done');
                    closeWindow();
                }
                else {
                    console.log('auth failed');
                }
            },
            errorCallback: (err) => {
                console.log('something went wrong', err)
            }

        })
    }

    return <Box sx={{
        bgcolor: '#F5F5F5', width: '90vw', height: '90vh', mx: 'auto', mt: 2, overflowY: 'auto', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
    }}>
        {authType === 'login' && <Login />}
    </Box>

}