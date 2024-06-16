'use client'

import {
    Box, Button, ButtonGroup, CircularProgress, Modal, Typography,
} from "@mui/material";

const logoutImg = '/images/logout.png'

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeLogoutPrompt } from "./redux/routeSlice";
import { getRequestHandler } from "./requestHandler";
import { startAnimation, stopAnimation } from "./animateButton";
import { useRouter } from "next/navigation";

function LogOut() {
    const router = useRouter();

    const dispatch = useDispatch();
    const disabledButtons = useSelector(state => state.route.disabledButtons);
    const showLogOutPrompt = useSelector(state => state.route.logOut);

    const [state, setState] = useState({
        adminProfileData: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const handleCancel = () => {
        dispatch(closeLogoutPrompt());
    }

    const handleLogout = (event) => {
        const buttonId = event.target.id;

        startAnimation(buttonId, dispatch);

        getRequestHandler({
            route: '/api/log-out',
            successCallback: body => {
                const result = body.result;
                console.log('logged out', result);
                if (result) {
                    //user has been logged out. Close modal and send them to index page
                    router.replace('/login');
                    // router.refresh(); 

                    handleCancel();
                    stopAnimation(buttonId, dispatch);

                }
                else {
                    //Log out failed. Show error message
                    stopAnimation(buttonId, dispatch);
                    handleCancel()
                }
            },
            errorCallback: err => {
                console.log('something went wrong', err);
                stopAnimation(buttonId, dispatch);
            }

        })
    }




    return (
        <Modal open={showLogOutPrompt} onClose={handleCancel}>
            <Box sx={{
                width: '300px',
                bgcolor: 'white', p: 4, transform: 'translate(-50%,-50%)',
                position: 'absolute', top: '50%', left: '50%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', }}>
                    <img alt='logout' src={logoutImg} height='100px' />
                </Box>

                <Typography align='center' sx={{
                    my: 4, fontSize: 14, fontWeight: 600,
                    lineHeight: '30px', textTransform: 'uppercase'
                }}>
                    You are about to log out from Lamid group Ware
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button id='logoutProceed' variant='text'
                        sx={{ fontSize: 18, fontWeight: 700, }}
                        onClick={handleLogout}
                        disabled={buttonActive('logoutProceed')}>
                        {buttonActive('logoutProceed') && <CircularProgress id='logoutProceed' size={20}
                            sx={{ mr: 2, color: '#08e8de' }} />}
                        Proceed
                    </Button>

                    {!buttonActive('logoutProceed') && <Button variant='text' onClick={handleCancel}
                        sx={{ fontSize: 18, fontWeight: 700, color: '#646464' }}>
                        Cancel
                    </Button>}
                </Box>
            </Box>
        </Modal>)
}

export default LogOut;