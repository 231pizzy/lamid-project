'use client'

import AuthBrowser from "@/Components/AuthBrowser";
import Header from "@/Components/Header";
import SideBar from "@/Components/SideBar";
import NotificationChannel from "@/Components/notification";
import store from "@/Components/redux/store";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Provider, } from "react-redux";

export default function LandingLayout({ children }) {
    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, menuOpen: false,
    });

    useEffect(() => {
        updateState({
            isMobile: window.innerWidth < 900,
            darkMode: localStorage.getItem('theme') === 'dark' ? true : false
        })


    }, [])

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    const changeTheme = () => {
        const darkMode = !state.darkMode
        updateState({ darkMode: darkMode })
        localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }

    const closeMenu = () => {
        updateState({ menuOpen: false })
    }

    const toggleMenu = () => {
        updateState({ menuOpen: !state.menuOpen })
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
            <Header {...{ openMenu: toggleMenu, notificationCount: state.notificationCount }} />
            {<NotificationChannel />}

            <AuthBrowser />

            <Box sx={{
                display: 'flex', alignItems: 'flex-start', flexDirection: 'row',
                overflowY: 'hidden', maxHeight: { xs: 'calc(100vh)', md: 'calc(100vh - 78px)' },
            }}>
                <SideBar {...{ isMenuOpen: state.menuOpen, closeMenu: closeMenu }} />

                <Box sx={{
                    overflowY: 'auto', maxHeight: { xs: 'calc(100vh - 22vh)', md: 'calc(100vh - 78px)' }, width: '100%'
                }}>
                    {children}
                </Box>

            </Box>

        </Provider>

    </ThemeProvider>
}