'use client'

import { Box, Typography } from "@mui/material";

import TeamIcon from "@mui/icons-material/GroupOutlined";
import Notifications from '@mui/icons-material/NotificationsOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import { useEffect, useState } from "react";
import IconElement from "@/Components/IconElement";

const iconStyle = { marginRight: '14px', height: '20px', width: '20px' }

const CalendarSvg = '/icons/calendarSvg.svg'
const CheckListSvg = '/icons/CheckListSvg.svg'
const DashboardSvg = '/icons/dashboardSvg.svg'
const ProjectGroupSvg = '/icons/projectGroup.svg'
const SettingSvg = '/icons/SettingSvg.svg'
const ThreePersonSvg = '/icons/ThreePersonSvg.svg'

const icon = (icon) => <IconElement {...{ src: icon, style: iconStyle }} />

const sections = [
    { label: 'Tools', value: 'tools', icon: icon(SettingSvg) },
    { label: 'Project Groups', value: 'projectGroups', icon: icon(ProjectGroupSvg) },
    { label: 'Teams', value: 'teams', icon: <TeamIcon style={{ ...iconStyle }} /> },
    { label: 'Staffs', value: 'staffs', icon: icon(ThreePersonSvg) },
    { label: 'Calendar', value: 'calendar', icon: icon(CalendarSvg) },
    { label: 'Task', value: 'task', icon: icon(CheckListSvg) },
    { label: 'Dashboard', value: 'dashboard', icon: icon(DashboardSvg) },
    { label: 'Notifications', value: 'notifications', icon: <Notifications style={{ ...iconStyle }} /> },
    { label: 'Settings', value: 'settings', icon: <SettingsIcon style={{ ...iconStyle }} /> },
];


export default function PrivilegeSideBar({ selectSection, }) {

    const [state, setState] = useState({
        selectedSection: null,
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    }

    const handleSelectSection = (id) => {
        selectSection(id)
        updateState({ selectedSection: id })
    }

    useEffect(() => {
        handleSelectSection('tools')
    }, [])


    return <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'stretch',/*  px: 2, */ py: 2, maxWidth: '100%',
        borderRight: '2px solid #1C1D221A',
    }}>
        {sections.map((dataObj, index) => {
            const selected = state.selectedSection === dataObj.value;

            return <Typography noWrap key={index} id={dataObj.value} sx={{
                px: { xs: 1, sm: 2 }, py: { xs: .5, sm: 1 }, bgcolor: selected ? '#F1F1F1' : 'white', cursor: 'pointer',
                border: `1.5px solid ${selected ? '#5D5D5D' : '#1C1D221A'}`, mb: 2, borderRadius: '22px',
                mx: 2, color: selected ? '#5D5D5D' : 'black', boxShadow: '0px 8px 12px 0px #0000000A',
                ':hover': { background: '#FFF4F4' }
            }} onClick={() => { handleSelectSection(dataObj.value) }}>
                {dataObj.icon}
                {dataObj.label}
            </Typography>
        })}
    </Box>
}