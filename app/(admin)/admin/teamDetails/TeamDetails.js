'use client'

import { Box, lighten, Tab, Tabs, Typography, } from "@mui/material";

import BackIcon from "@mui/icons-material/WestOutlined";

import { GoalsTab } from "./accessories/GoalsTab.js";

import { TimeTrackerTab } from "./accessories/TimeTrackerTab.js";

import { ExpenseTab } from "./accessories/ExpenseTab.js";

import CalendarView from "../my-calendar/Calendar.js";

import { useRouter, useSearchParams } from "next/navigation.js";

import IconElement from "@/Components/IconElement.js";
import { CalendarSvg, CheckListSvg, OverviewSvg, ProjectExpenseSvg, ProjectSetting, TimerSvg } from "@/public/icons/icons.js";
import { useState } from "react";
import { SettingsTab } from "./accessories/SettingsTab.js";


const iconStyle1 = { height: '20px', width: '20px' }

const icon = (icon) => <IconElement {...{ src: icon, style: iconStyle1 }} />

export default function TeamDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    const color = searchParams.get('color');

    const router = useRouter();

    const [state, setState] = useState({
        currentTab: 0, hideBackButton: true, ref: null, color: color
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const switchTab = (event, index) => {
        //console.log('tab id', event.target.id)
        updateState({ currentTab: index, hideBackButton: false })
    }

    const goBack = () => {
        router.back()
    }


    const tabStyle = { fontSize: 14, fontWeight: 600, p: 0, m: 0 }

    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>
            {/* Tool bar section */}
            <Box sx={{
                px: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                bgcolor: '#F5F5F5'
            }}>
                {/* Back button */}
                <BackIcon onClick={goBack}
                    sx={{ bgcolor: 'white', cursor: 'pointer', fontSize: 32, borderRadius: '26.6667px', mr: 2 }} />

                {/* team name avatar */}
                <img
                    src={avatar} 
                    alt={name} 
                    className="rounded-full object-cover mt-2"
                    style={{ height: '48px', width: '48px', border: `1px solid ${color}`}}
                />

                {/* team group name */}
                <Typography sx={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase', marginLeft: "15px" }}>
                    {name}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Tabs */}
                <Tabs value={state.currentTab} onChange={switchTab} TabIndicatorProps={{style: {backgroundColor: '#BF0606',}}} >
                    {/* <Tab id='overview' icon={<OverviewSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography id='overview' sx={{ ...tabStyle }}>Overview</Typography>} /> */}
                    <Tab id='goals' icon={<CheckListSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Goals</Typography>} />
                    <Tab id='time-tracker' icon={<TimerSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Time Tracker</Typography>} />
                    <Tab id='expenses' icon={<ProjectExpenseSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Expenses & Invoice</Typography>} />
                    <Tab id='schedule' icon={<CalendarSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Schedule</Typography>} />
                    <Tab id='setting' icon={<ProjectSetting style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Team Setting</Typography>} />
                </Tabs>
            </Box>

            {/* Body */}
            <Box sx={{ overflowY: 'hidden' }}>
           
            {/* Goals tab body */}
            {state.currentTab === 0 && <GoalsTab {...{ 
            teamName: name, teamId: id, teamColor: color,
             }} />}

            {/* Timetracker tab body */}
            {state.currentTab === 1 && <TimeTrackerTab {...{ teamId: id }} />}

            {/* Budget and expense tab body */}
            {state.currentTab === 2 && <ExpenseTab {...{ teamId: id }} />}

            {/* Schedule tab body */}
            {state.currentTab === 3 && <CalendarView {...{ teamId: id}} />}

              {/* Settings tab body */}
              {state.currentTab === 4 && <SettingsTab {...{ teamId: id}} />}
            </Box>
        </Box >)
}
