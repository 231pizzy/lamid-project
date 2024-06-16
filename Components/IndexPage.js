'use client'

import { Box, Card, CardContent, CircularProgress, LinearProgress, Typography } from "@mui/material";

import { useState, useEffect } from "react";

import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";

export default function IndexPage() {
    const router = useRouter();

    const [state, setState] = useState({
        networkIssue: false, designation: null,
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        getUserDesignation()
    }, [])

    const getUserDesignation = () => {
        fetch('/api/check-status', { method: 'GET' }).then((response) => {
            response.json().then(body => {
                const result = body.result
                console.log('result', result)
                if (result) {
                    //User is logged in. Check their designation and send them to the appropriate view
                    result === 'staff' ? router.replace('/staff') : router.replace('/admin')
                }
                else {
                    //User is not logged in. Send them to login page
                    router.replace('/login')
                }
            }).catch(err => {
                console.log('err at JSON', err)
                updateState({ networkIssue: true })
            })
        }).catch(err => {
            console.log('err', err)
            updateState({ networkIssue: true })
        })
    }


    //if frontpage data exists, load home page, else, query the server for the frontpage data
    return (
        <>
            {<Box sx={{
                mt: 2, width: '100%', display: 'flex',
                justifyContent: 'center', alignItems: 'center'
            }}>
                {(state.networkIssue) ?
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        Network Error: Check your Internet connection
                    </Typography>
                    :
                    <CircularProgress />}
            </Box>
            }
        </>
    )
} 