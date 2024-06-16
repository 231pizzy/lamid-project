'use client'

import { Box, LinearProgress, Typography } from "@mui/material";

import CalendarIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/PersonOutline";
import moment from "moment";

import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";

import { useEffect, useState } from "react";
import { ProfileAvatar } from "@/Components/ProfileAvatar";

import { useDispatch } from "react-redux";

import { getProfilePictures } from "../helper";
import { TaskSvg } from "@/public/icons/icons";



export function TaskCard({ index, taskData, selectTask, unSelectTask, selectedTaskName, color, headBgcolor,
    showDetails, taskHeading, taskValueBuilder, indicatorData, selectAssignee, selectedAssignee }) {

    console.log('selected task name', selectedTaskName)
    const dispatch = useDispatch();

    const [state, setState] = useState({
        profilePictures: []
    });


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        getProfilePictures({
            emailArray: Object.keys(taskData.taskAssignmentMapping),
            dataProcessor: (result) => {
                updateState({ profilePictures: result })
            }
        });
    }, [])



    const handleTaskClick = (/* { index, taskObject } */) => {
        if (selectedTaskName === taskData.taskName) {
            //  updateState({ selectedTaskName: null })
            unSelectTask()
        }
        else {
            //   updateState({ selectedTaskName: taskObject.taskName })
            selectTask({ index: index, taskObject: taskData })
        }
    }


    const assigneeHeading = () => {
        console.log('show details', showDetails);
        return <Typography sx={{ fontSize: showDetails ? 15 : 14, fontWeight: 600, px: 2, py: showDetails ? 1 : .5, bgcolor: '#F2F2F2E5', color: showDetails ? '#5D5D5D' : '#1C1D2280', display: 'flex', alignItems: 'center', }}>
            {/* Icon */}
            {!showDetails && <PersonIcon style={{ height: '20px', width: '20px', marginRight: '8px' }} />}
            {/* Label */}
            Assignee {showDetails && `(${Object.keys(taskData.taskAssignmentMapping).length})`}
        </Typography>
    }

    return <Box sx={{}}>
        <Box key={index} sx={{
            minWidth: 300, maxWidth: 'max-content', border: selectedTaskName === taskData.taskName ?
                '2px solid #BF0606' : '1.5px solid #1C1D221A', cursor: selectTask ? 'pointer' : 'inherit',
            boxShadow: '0px 6px 12px 0px #4F4F4F14', borderRadius: '16px', mb: showDetails ? 2 : .5, mr: 1, mx: showDetails ? 3 : 0
        }} onClick={selectTask ? () => { handleTaskClick(/* { index: index, taskObject: taskData } */) } : () => { }}>
            {/* Heading */}
            <Typography sx={{
                bgcolor: headBgcolor ?? '#4E944F1A', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center',
                px: 2, py: 1, color: color ?? 'black', fontSize: 14, fontWeight: 600,
            }}>
                {/* Icon */}
                <TaskSvg style={{ height: '22px', width: '18px', marginRight: '12px', color: color }} />
                {/* Label */}
                Task - {(index + 1)}
            </Typography>

            {/* Task name: if showDetail is true  */}
            {showDetails && <Typography sx={{ px: 2, py: 1.5, fontWeight: 600, fontSize: 15, maxWidth: { md: 400 } }}>
                {taskData?.taskName}
            </Typography>}

            {/* Task date and budget */}
            <Box align='justify' sx={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'flex-start', }}>
                {/* Task start and end date: May 14th-19th */}
                <Box>
                    {/* Heading */}
                    <Typography sx={{ fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280', display: 'flex', alignItems: 'center', }}>
                        {/* Icon */}
                        <CalendarIcon style={{ height: '22px', width: '22px', marginRight: '8px' }} />
                        {/* Label */}
                        Date
                    </Typography>
                    {/* Value */}
                    <Typography noWrap sx={{
                        fontSize: 14, fontWeight: 600, px: 1, py: .5, bgcolor: '#1C1D220A',
                        mx: 2, my: 2, borderRadius: '16px', border: '1px solid #1C1D221A'
                    }}>
                        {`${moment(taskData?.startDate, 'yyyy-MM-DD').format('MMM Do')} - ${moment(taskData?.endDate, 'yyyy-MM-DD').format('MMM Do')}`}
                    </Typography>
                </Box>

                {/* Task budget */}
                <Box sx={{ width: showDetails ? 'max-content' : '100%', borderLeft: '1px solid #1C1D221A' }}>
                    {/* Heading */}
                    <Typography sx={{ fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280', display: 'flex', alignItems: 'center', }}>
                        {/* Icon */}
                        {/*   <Budget style={{ height: '22px', width: '22px', marginRight: '8px' }} /> */}
                        {/* Label */}
                        {/*   Budget {showDetails && formatMoney({ amount: taskData?.taskBudget || 0 })} */}
                        {taskHeading({ showDetails: true, taskObject: taskData })}
                    </Typography>
                    {/* Value */}
                    <Box sx={{ py: 1, }}>
                        {!showDetails ? <Typography noWrap sx={{
                            fontSize: 14, fontWeight: 600, px: 1, mt: 1, py: .5, bgcolor: '#1C1D220A',
                            mx: 2, borderRadius: '16px', border: '1px solid #1C1D221A',
                        }}>
                            {/* {formatMoney({ amount: taskData?.taskBudget })} */}
                            {taskValueBuilder({ taskObject: taskData })}
                        </Typography>

                            : <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                                {/* Time Spent */}
                                <Box sx={{ mb: 1.5 }}>
                                    {/* Label */}
                                    <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: color }}>
                                        {taskValueBuilder({ taskObject: taskData })}
                                        {/*  Spent : {formatMoney({ amount: taskData?.amountSpent || 0 })} out of {formatMoney({ amount: taskData?.taskBudget || 0 })} */}
                                    </Typography>
                                </Box>

                                {/* Progress bar */}
                                <LinearProgress
                                    value={(indicatorData({ taskObject: taskData }).used / indicatorData({ taskObject: taskData }).total) * 100} variant='determinate'
                                    sx={{
                                        '& .MuiLinearProgress-barColorPrimary': {
                                            backgroundColor: color
                                        },
                                        bgcolor: '#D9D9D9',
                                        borderRadius: '2px',
                                        height: '4px'
                                    }} />
                            </Box>}
                    </Box>

                </Box>
            </Box>

            {/* Pictures of the members of the group if showDetails is false*/}
            {!showDetails && <Box>
                {/* Heading */}
                {assigneeHeading()}
                {/* Avatar group of profile pictures */}
                <Box sx={{
                    px: 2, pt: 1, pb: 2, display: 'flex', alignItems: 'center',
                    justifyContent: 'flex-start',
                }}><ProfileAvatarGroup {...{
                    emailArray: Object.keys(taskData?.taskAssignmentMapping), diameter: 30,
                    color: color, bgcolor: '#F2FFF2', max: 3
                }} /></Box>
            </Box>}
        </Box>

        {/*Task members: if showDetails is true*/}
        {showDetails && <Box sx={{}}>
            {/* Heading */}
            {assigneeHeading()}

            {/* Content */}
            <Box sx={{
                py: 2, px: 1, mx: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
                maxWidth: { md: '100%' }, maxHeight: 400, overflowY: 'auto'
            }}>
                {state.profilePictures.map((dataObject, index) => {
                    return <Box sx={{
                        mr: 1, borderRadius: '16px', minWidth: 150, border: selectedAssignee === dataObject?.email ?
                            '1.5px solid #BF0606' : '1.5px solid #1C1D221A',
                        boxShadow: '0px 6px 12px 0px #4F4F4F14', mb: 2
                    }} onClick={() => { selectAssignee(dataObject?.email) }}>
                        {/* Heading */}
                        <Typography sx={{
                            display: 'flex', alignItems: 'center', bgcolor: headBgcolor, color: color,
                            px: 1, py: .5, borderRadius: '16px 16px 0 0', fontSize: 14, fontWeight: 600,
                        }}>
                            <PersonIcon sx={{ fontSize: 22, mr: 1 }} />
                            Assignee - {index + 1}
                        </Typography>

                        {/* Body */}
                        <Box align='center' sx={{ py: 2 }}>
                            {/* Profile picture */}
                            <ProfileAvatar {...{
                                src: dataObject?.profilePicture ? dataObject?.email : null, fullName: dataObject?.fullName,
                                diameter: 60, byEmail: true, styleProp: {}
                            }} />

                            {/* Full name */}
                            <Typography sx={{ fontSize: 15, fontWeight: 600, pt: 2, textTransform: 'capitalize' }}>
                                {dataObject?.fullName}
                            </Typography>

                            {/* Role */}
                            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#8D8D8D' }}>
                                {dataObject?.role}
                            </Typography>
                        </Box>
                    </Box>

                })}
            </Box>
        </Box>}
    </Box>
}