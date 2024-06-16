'use client'

import store from "@/Components/redux/store";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { Provider, } from "react-redux";

export default function LandingLayout({ children }) {
    let theme = useMemo(() => {
        return createTheme({
            typography: {
                button: {
                    textTransform: 'none',
                },
                fontFamily: 'Open Sans'
            },
            palette: {
                //  mode: state.darkMode ? 'dark' : 'light',
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

            <Box>
                {children}
            </Box>
        </Provider>

    </ThemeProvider>
}