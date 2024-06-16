import { Outlet, useLocation, useNavigate } from "react-router-dom";
//import AppBar from '@mui/material/AppBar';
import {
    Snackbar,
    Paper, Modal, CircularProgress, Box, Button, Card, Grid, Typography, CardContent, Container, LinearProgress,
} from "@mui/material";


import Back from "@mui/icons-material/WestOutlined";
import backgroundImage from '../images/image-1.png';
import lamidLogo from '../images/lamidLargeLogo.png';


import { closeSnackbar, toggleBlockView } from '../app/routeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { openSnackbar } from '../app/routeSlice';
import styled from "@emotion/styled";

function RootLayout() {
    const snackBarOpen = useSelector(state => state.route.showSnackbar);
    const message = useSelector(state => state.route.snackbarMessage);
    const severity = useSelector(state => state.route.snackbarSeverity);
    const blockView = useSelector(state => state.route.blockView)
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();


    const path = location.pathname;


    const [state, setState] = useState({
        openSettingMenu: false, menuAnchor: null, openInventoryMenu: false,
        snackbar: {
            open: false, message: '', severity: '', autoHideDuration: 6000,
        }
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }


    //Services all the snackbar need of the application
    const snackBar = (message, severity, dispatch) => {
        const handleClose = () => {
            dispatch(closeSnackbar());
        }
        return <Snackbar open={snackBarOpen}
            autoHideDuration={6000}
            message={message}
            severity={severity}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleClose}
        />
    }

    const Img = styled('img')(({ theme }) => ({
        [theme.breakpoints.up('xs')]: {
            width: '150', height: '80px',
        },
        [theme.breakpoints.up('md')]: {
            width: '250px', height: '200px'
        },
    }))
    const siteLogo = () => {
        return <Img alt='logo' src={lamidLogo} />
    }


    //Closes the circular progress indicator
    const handleBlockViewClose = (event) => {
        dispatch(toggleBlockView({ blockView: false }));
    }

    return (
        <>
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Card elevation={0}>

                    <Grid container>

                        {/* Company description */}
                        <Grid item xs={12} sm={6} sx={{
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                background: 'rgba(0,0,0,0.8)',
                                zIndex: 1
                            },
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat', height: { xs: '30vh', sm: '100vh' }
                        }} display='flex' justifyContent='center' alignItems='center'>

                            <Grid container sx={{ mx: { xs: 4, sm: 6, lg: 16, xl: 18 }, position: 'relative', zIndex: 2 }}>
                                <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                                    {/*  */}
                                    <Typography align='center' variant='h6' sx={{
                                        mb: 2, color: 'white', fontWeight: 700,
                                        fontSize: { xs: 24, sm: 26, md: 32, xl: 40 }
                                    }}>
                                        LAMID Consulting
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                                    {/*  */}
                                    <Typography align='center' variant='subtitle1'
                                        sx={{
                                            mb: 2, color: 'red', fontWeight: 700,
                                            fontSize: { xs: 12, sm: 16, xl: 18 }
                                        }}>
                                        Who we are
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                                    {/*  */}
                                    <Container>
                                        <Typography align="center" variant='body1'
                                            sx={{ color: 'white', fontSize: { xs: 12, sm: 16, xl: 18 } }}>
                                            LAMID Consulting is the leading business and management
                                            firm set up in 1089 to provide a suit of customized products and boutique
                                            services for growing organizations using cutting-edge management strategies
                                            and technology
                                        </Typography>
                                    </Container>

                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Page heading and content */}
                        <Grid item xs={12} sm={6} display='flex' direction={'column'} justifyContent='center'
                            alignItems='center' >

                            {/* Page heading */}
                            <CardContent sx={{ mt: 4, width: { xs: '100%', md: '100%' } }}>
                                <Grid item xs={12} sx={{ mb: 4 }} display='flex' justifyContent='center' alignItems='center'>
                                    <Box sx={{ width: '100%', direction: 'row' }}>
                                        {/* Back */}
                                        {path === '/input-otp' && <Button sx={{ color: 'black' }}
                                            onClick={(event) => {
                                                navigate('/receive-otp',
                                                    { replace: true })
                                            }}>

                                            <Back sx={{ fontSize: { xs: 20, sm: 20, md: 30 } }} />

                                            <Typography variant='body1' sx={{
                                                fontSize: { xs: 10, sm: 14 },
                                                pl: { xs: 0.5, sm: 0.5, md: 2 }
                                            }}>
                                                Back
                                            </Typography>

                                        </Button>}

                                        {/* logo */}
                                        <Container sx={{
                                            mt: -2,
                                            width: { xs: 100, md: '350px' }, height: { xs: 50, md: 150 }, display: 'flex',
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            {siteLogo()}
                                        </Container>
                                    </Box>
                                </Grid>
                            </CardContent>

                            {/* Site name and outlet for children views */}
                            <CardContent sx={{ mt: -4, width: { xs: '90%', md: '80%', lg: '65%', xl: '50%' } }}>
                                <Grid container rowSpacing={1} >

                                    {/* Child: Main content of the applicaion. More like
                                     the body of the application  */}

                                    <Outlet />
                                </Grid>
                            </CardContent>
                        </Grid>
                    </Grid>

                </Card>
            </Box>

            {/* Snackbar that services the whole application */}
            {openSnackbar && snackBar(message, severity, dispatch)}

            {/* Circular Progress Indicator that indicates ongoing 
            process that should not be interrupted */}
            <Modal hideBackdrop open={blockView} onClose={handleBlockViewClose}>
                <LinearProgress />
            </Modal>
        </>
    );
}

export default RootLayout;