'use client'

import { Box, lighten, Tab, Tabs, Typography, } from "@mui/material";

import BackIcon from "@mui/icons-material/WestOutlined";

import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { ProfileAvatar } from "@/Components/ProfileAvatar.js";

import { setPageTitle } from "@/Components/redux/routeSlice.js";

import { OverviewTab } from "./accessories/OverviewTab.js";

import { GoalsTab } from "./accessories/GoalsTab.js";

import { TimeTrackerTab } from "./accessories/TimeTrackerTab.js";

import { ExpenseTab } from "./accessories/ExpenseTab.js";

import CalendarView from "../my-calendar/Calendar.js";

import { useRouter, useSearchParams } from "next/navigation.js";

import IconElement from "@/Components/IconElement.js";
import { useRef } from "react";
import { CalendarSvg, CheckListSvg, OverviewSvg, ProjectExpenseSvg, ProjectSetting, TimerSvg } from "@/public/icons/icons.js";
import { SettingsTab } from "./accessories/SettingsTab.js";


const iconStyle1 = { height: '20px', width: '20px' }

const icon = (icon) => <IconElement {...{ src: icon, style: iconStyle1 }} />

export default function ProjectGroupDetails() {
    const dispatch = useDispatch();
    const ref = useRef(null);

    const searchParams = useSearchParams();

    const router = useRouter();

    const projectId = searchParams.get('projectId');
    const projectName = searchParams.get('projectName');
    const statusKey = searchParams.get('statusKey');
    const goalDetail = searchParams.get('goalDetail');
    const projectColor = searchParams.get('projectColor');
    const goalName = searchParams.get('goalName');

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Project Group' }))
        updateState({ ref: ref })
        //  getProjectGroupData(updateState, remoteRequest, dispatch, openSnackbar, navigate, projectId)
    }, []);

    const [state, setState] = useState({
        currentTab: 0, hideBackButton: true, ref: null, projectColor: projectColor
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

    const hideBackButton = (value) => {
        updateState({ hideBackButton: value })
    }


    const getBoxTop = () => {
        if (state.ref?.current) {
            return state.ref.current.getBoundingClientRect().top;
        }
    }

    console.log('project group detail state', projectColor, state);

    const tabStyle = { fontSize: 14, fontWeight: 600, p: 0, m: 0 }

    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>
            {/* Tool bar section */}
            <Box sx={{
                px: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                bgcolor: '#F5F5F5'
            }}>
                {/* Back button */}
                {!state.hideBackButton && <BackIcon onClick={goBack}
                    sx={{ bgcolor: 'white', cursor: 'pointer', fontSize: 32, borderRadius: '26.6667px', mr: 2 }} />}

                {/* Project name avatar */}
                <ProfileAvatar {...{
                    diameter: 40, src: null, fullName: projectName,
                    styleProp: {
                        mr: 2, color: projectColor || '#BF0606',
                        bgcolor: lighten(projectColor || '#BF0606', 0.9)
                    }
                }} />

                {/* Project group name */}
                <Typography sx={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>
                    {projectName}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Tabs */}
                <Tabs value={state.currentTab} onChange={switchTab}  >
                    <Tab id='overview' icon={<OverviewSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography id='overview' sx={{ ...tabStyle }}>Overview</Typography>} />
                    <Tab id='goals' icon={<CheckListSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Goals</Typography>} />
                    <Tab id='time-tracker' icon={<TimerSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Time Tracker</Typography>} />
                    <Tab id='expenses' icon={<ProjectExpenseSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Expenses & Invoice</Typography>} />
                    <Tab id='schedule' icon={<CalendarSvg style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Schedule</Typography>} />
                    <Tab id='setting' icon={<ProjectSetting style={{ ...iconStyle1 }} />} iconPosition="start"
                        label={<Typography sx={{ ...tabStyle }}>Group Setting</Typography>} />
                </Tabs>
            </Box>

            {/* Body */}
            <Box sx={{ maxHeight: `calc(100vh - ${getBoxTop()}px)`, overflowY: 'hidden' }}>
                {/* Overview tab body */}
                {state.currentTab === 0 && <OverviewTab {...{ projectId: projectId, gotoTab: switchTab }} />}

                {/* Goals tab body */}
                {state.currentTab === 1 && <GoalsTab {...{
                    projectId: projectId, statusKey: statusKey, gotoDetails: goalDetail, goalName: goalName,
                    hideBackButton: hideBackButton
                }} />}

                {/* Timetracker tab body */}
                {state.currentTab === 2 && <TimeTrackerTab {...{ projectId: projectId }} />}

                {/* Budget and expense tab body */}
                {state.currentTab === 3 && <ExpenseTab {...{ projectId: projectId }} />}

                {/* Schedule tab body */}
                {state.currentTab === 4 && <CalendarView {...{ hideHeading: true }} />}

                {/* Schedule tab body */}
                {state.currentTab === 5 && <SettingsTab {...{ projectId: projectId }} />}
            </Box>


        </Box >)
}
