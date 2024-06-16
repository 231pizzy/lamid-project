'use client'

import Header from "@/Components/Header";
import SideBar from "@/Components/SideBar";
import store from "@/Components/redux/store";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Provider } from "react-redux";

export default function LandingLayout({ children }) {
    // const isMobile = typeof window !== 'undefined' ? window.innerWidth < 900 : 900;

    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, menuOpen: false
    });

    useEffect(() => {
        updateState({ isMobile: window.innerWidth < 900, darkMode: localStorage.getItem('theme') === 'dark' ? true : false })
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
                mode: state.darkMode ? 'dark' : 'light'
            }
        })
    }, [state.darkMode])


    return <ThemeProvider theme={theme}>

        <Provider store={store}>
            <Header {...{ openMenu: toggleMenu }} />

            <Box sx={{
                 //height of header is 5vh or 78px
            /*     backgroundColor: 'background.default', */ display: 'flex', alignItems: 'flex-start', flexDirection: 'row',
                overflowY: 'hidden', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }
            }}>
                <SideBar {...{ isMenuOpen: state.menuOpen, closeMenu: closeMenu }} />

                {children}
            </Box>

            {/*  <Footer /> */}

        </Provider>

    </ThemeProvider>
}