'use client'

import Header from "@/Components/Header";
import HomeHeader from "@/Components/HomeHeader";
import HomeSideImage from "@/Components/HomeSideImage";
import LogOut from "@/Components/LogOut";
import SideBar from "@/Components/SideBar";
import SnackbarComponent from "@/Components/Snackbar";
import store from "@/Components/redux/store";
import { Box, CssBaseline, Modal, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import Landing from "./Landing";

export default function LandingLayout({ children }) {
    // const isMobile = typeof window !== 'undefined' ? window.innerWidth < 900 : 900;

    /* const message = useSelector(state => state.route.snackbarMessage);
    const severity = useSelector(state => state.route.snackbarSeverity);
    const snackBarOpen = useSelector(state => state.route.showSnackbar);
    const showLogOutPrompt = useSelector(state => state.route.logOut); */

    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, menuOpen: false
    });

    useEffect(() => {
        updateState({ isMobile: window.innerWidth < 900, darkMode: localStorage.getItem('theme') === 'dark' ? true : false })
    }, [])

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }


    let theme = useMemo(() => {
        return createTheme({
            typography: {
                button: {
                    textTransform: 'none',
                },
                fontFamily: 'Open Sans'
            },
            palette: {
                mode: state.darkMode ? 'dark' : 'light',
                primary: { main: '#BF0606' }
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        contained: {
                            backgroundColor: '#BF0606',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#970000'
                            }
                        },
                        text: {
                            color: '#BF0606',
                            '&:hover': {
                                backgroundColor: '#FAF0F0'
                            }

                        }
                    }
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            color: 'black',
                            '&.Mui-selected': {
                                borderRight: '2px solid #BF0606',
                                color: '#BF0606'
                            }
                        }
                    }
                }
            }
        })
    }, [])

    return <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Landing {...{ children: children }} />

            {/*   <Box sx={{
                display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' },
                overflowY: 'hidden', maxHeight: '100vh'
            }}>
                <HomeSideImage />

                <HomeHeader {...{ children }} />
 
                {snackBarOpen && <SnackbarComponent {...{ message: message, severity: severity }} />}
 
                <Modal open={showLogOutPrompt} onClose={handleLogOut}>
                    <LogOut />
                </Modal>

            </Box> */}

            {/*  <Footer /> */}

        </Provider>



    </ThemeProvider>
}