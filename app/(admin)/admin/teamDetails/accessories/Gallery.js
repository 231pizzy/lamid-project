'use client'

import { Box, IconButton, Slide, Tab, Tabs, Typography } from "@mui/material";

import moment from "moment";

import { useEffect, useMemo, useState } from "react";

import Close from '@mui/icons-material/Close';

import { useDispatch, } from "react-redux";

import IconElement from "@/Components/IconElement";
import { getAllFilesForChat } from "../helper";
import { Documents } from "./Document";
import { Links } from "./Links";

const CsvSvg = '/icons/CsvSvg.svg'
const ExcelSvg = '/icons/ExcelSvg.svg'
const PdfSvg = '/icons/pdfSvg.svg'
const TxtSvg = '/icons/TxtSvg.svg'
const DownloadSvg = '/icons/DownloadSvg.svg'

const extStyling = { width: '70px', height: '70px' }

const icon = (icon) => <IconElement {...{ src: icon, style: extStyling }} />

// const fileExtIcons = {
//     'pdf': icon(PdfSvg),
//     'txt': icon(TxtSvg),
//     'csv': icon(CsvSvg),
//     'xlsx': icon(ExcelSvg)
// }

// const imageExtensions = ['png', 'jpg', 'jpeg'];

export function Gallery({ closeView, goal}) {

    const [state, setState] = useState({
        openModal: false, currentTab: 0, files: [], chatfiles: []
    });


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    // const getFilePath = async (filename) => {
    //     !chatfiles[filename] && fetch(`/api/get-file-by-name/?folder=team-chat-files&&filename=${filename}`,
    //         { method: 'GET' }).then(resp => {
    //             resp.blob().then(blob => {
    //                 console.log('setting image', filename)
    //                 setFiles((prevFiles) => ({ ...prevFiles, [filename]: URL.createObjectURL(blob), }))
    //             })
    //         })

    // }

    // const closeModal = () => {
    //     updateState({ openModal: false });
    //     closeView();
    // }

    const switchTab = (event, index) => {
        updateState({ currentTab: index })
    }


    console.log('gallery state', state);

    const tabStyle = { fontSize: 14, fontWeight: 700, p: 0, m: 0, width: '100%' }

    const tabBodyParam = { goal: goal}
    console.log('tabBodyParam', tabBodyParam);

    return <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
            position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', md: '60%', lg: '45%', xl: '35%' },
        }}>
            {/* Toolbar */}
            <Box sx={{
                mb: 2, pb: 1, borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white'
            }}>
                {/* Row 1 */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', px: { xs: 1.5, sm: 4 }, py: 2, borderBottom: '1px solid #1C1D221A',
                    boxShadow: '0px 6px 12px 0px #4F4F4F14'
                }}>
                    {/* Heading label */}
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, }, mx: 3 }}>
                        GALLERY
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Close form */}
                    <Close onClick={closeView}
                        sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 35, }} />
                </Box>

                {/* Row 2 */}
                <Box sx={{ width: '100%', pt: 1 }}>
                    {/* Tabs */}
                    <Tabs value={state.currentTab} onChange={switchTab} sx={{ width: '100%', }} >
                        <Tab id='document' label={<Typography id='overview' sx={{ ...tabStyle }}>DOCUMENTS</Typography>}
                            sx={{ width: '50%' }} />
                        <Tab id='links' label={<Typography sx={{ ...tabStyle }}>LINKS</Typography>} sx={{ width: '50%' }} />
                    </Tabs>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ height: '86vh', overflowY: 'auto', pb: 6 }}>
                {state.currentTab === 0 ?
                    <Documents {...{ ...tabBodyParam }} /> : <Links {...{ ...tabBodyParam }} />}
            </Box>
        </Box>
    </Slide>
}