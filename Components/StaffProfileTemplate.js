'use client'

import {
    Box, Button, Typography, Avatar, Tabs, Tab, Icon, createSvgIcon,
} from "@mui/material";

import { useDispatch } from "react-redux";

import { useState, useEffect, useMemo } from "react";


import Phone from "@mui/icons-material/PhoneOutlined";
import Email from "@mui/icons-material/EmailOutlined";
import More from "@mui/icons-material/MoreVertOutlined";
import BackArrow from "@mui/icons-material/WestOutlined";
import FrontArrow from "@mui/icons-material/EastOutlined";
import Profile from "@mui/icons-material/PersonOutline";
import EditIcon from '@mui/icons-material/Edit'

import { setPageTitle } from "@/Components/redux/routeSlice";

import StaffProfile from "@/app/(admin)/admin/staff-profile/accessories/StaffProfile";

import Privileges from "@/app/(admin)/admin/staff-profile/accessories/Privileges";

import TimeSheet from "@/app/(admin)/admin/staff-profile/accessories/TimeSheet";

import { ProfileAvatar } from "./ProfileAvatar";

import { useRouter, useSearchParams } from "next/navigation";

import { getStaff } from "@/app/(admin)/admin/staff/helper";
import { useRef } from "react";
import { getBoxTop } from "./getBoxTop";
import { TimeSheetSvg } from "@/public/icons/icons";

function StaffHome({ myProfile }) {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const router = useRouter()

    const searchParams = useSearchParams();

    const [state, setState] = useState({
        currentTab: 0, staffRecord: {}, email: searchParams.get('email'), self: searchParams.get('self'), ref: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    useEffect(() => {
        dispatch(setPageTitle({ pageTitle: myProfile ? 'Profile' : 'Staff' }));

        getStaff({
            email: state.email, dataProcessor: (result) => {
                updateState({ staffRecord: result.data })
            }
        })

        updateState({ ref: ref });

        //  getStaffRecord(updateState, remoteRequest, dispatch, openSnackbar, navigate, state.email, myProfile)
    }, [])

    const switchTab = (event, index) => {
        console.log('tab id', event.target.id)
        updateState({ currentTab: index })
    }

    const contactData = [
        { key: 'phone', icon: <Phone sx={{ fontSize: 16, mr: 1 }} /> },
        { key: 'email', icon: <Email sx={{ fontSize: 16, mr: 1 }} /> },
    ]

    const staffRecord = useMemo(() => {
        return state.staffRecord
    }, [state.staffRecord])

    const goBack = () => {
        router.back();
    }

    const heading = (label) => {
        return <Typography sx={{
            bgcolor: 'rgba(191, 6, 6, 0.06)', px: 2, py: .5, fontWeight: 600,
            fontSize: { xs: 12, md: 13 }, color: 'rgba(191, 6, 6, 0.7)'
        }}>
            {label}
        </Typography>
    }

    // const teamProjectGroup = (label, index) => {
    //     return <Box key={index} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
    //         <Avatar sx={{ mr: 1.5, height: 30, width: 30, bgcolor: 'rgba(93, 167, 219, 0.2)' }}>
    //             <Typography align="center" sx={{
    //                 textTransform: 'uppercase', fontWeight: 700,
    //                 fontSize: { xs: 14, md: 16 }, color: '#5DA7DB'
    //             }}>
    //                 {/* {label?.split(' ')?.map(word => word.charAt(0)).join('')} */}
    //             </Typography>
    //         </Avatar>
    //         <Typography noWrap sx={{ fontSize: { xs: 12, md: 14 }, fontWeight: 600 }}>
    //             {label}
    //         </Typography>
    //     </Box>
    // }

    const teamProjectGroup = (label, teams) => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                <Avatar sx={{ mr: 1.5, height: 30, width: 30, bgcolor: 'rgba(93, 167, 219, 0.2)' }}>
                    <Typography align="center" sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: { xs: 14, md: 16 }, color: '#5DA7DB' }}>
                        {/* You can uncomment the line below if you want to display initials */}
                        {label?.split(' ')?.map(word => word.charAt(0)).join('')}
                    </Typography>
                </Avatar>
                <Typography noWrap sx={{ fontSize: { xs: 12, md: 14 }, fontWeight: 600 }}>
                    {teams ? teams.join(', ') : ''}
                </Typography>
            </Box>
        );
    };


    const handleEditProfile = (event) => {
        router.push('/admin/edit-profile', /* { state: { ...state.adminProfileData } } */);
    }


    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>
            {/* Toolbar*/}
            <Box sx={{
                bgcolor: '#F5F5F5', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                display: 'flex', px: 2, alignItems: 'center', pr: 3
            }}>
                {/* Back button */}
                <BackArrow sx={{ mr: 3, bgcolor: 'white', borderRadius: '26.6667px', cursor: 'pointer' }}
                    onClick={goBack} />
                {/* Label */}
                <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 17 } }}>
                    Staff details
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Tabs */}
                <Box sx={{ p: 0, mr: 2 }}>
                    <Tabs value={state.currentTab} onChange={switchTab}  >
                        <Tab id='timesheet' icon={<TimeSheetSvg />}
                            iconPosition="start"
                            label={<Typography id='timesheet' sx={{ p: 0, m: 0 }}>Time-sheet</Typography>} />
                        <Tab id='privilge' icon={<FrontArrow sx={{ mr: 3 }} />} iconPosition="start"
                            label={<Typography sx={{ p: 0, m: 0 }}>Privileges</Typography>} />
                        <Tab id='profile' icon={<Profile sx={{ mr: 3 }} />} iconPosition="start"
                            label={<Typography sx={{ p: 0, m: 0 }}>Profile</Typography>} />
                    </Tabs>

                </Box>

                {/* More button */}
                <More sx={{ color: '#5D5D5D', border: '1px solid #5D5D5D', borderRadius: '26.66667px' }} />

            </Box>

            {/* Content */}
            <Box ref={state.ref} sx={{
                display: 'flex', justifyContent: 'flex-start', flexWrap: { xs: 'wrap', lg: 'inherit' },
                alignItems: 'stretch', px: 2, py: 2, height: `calc(100vh - ${getBoxTop(state.ref)}px)`, overflowY: 'scroll'
            }}>
                {/* Column 1 */}
                <Box sx={{
                    bgcolor: '#FBFBFB', borderRadius: '8px', border: '1px solid rgba(28, 29, 34, 0.1)',
                    width: 'max-content', minWidth: { md: '200px', lg: '300px' }, mx: { xs: 'auto', lg: 'inherit' }, mr: { lg: 2 }, mb: { xs: 4, md: 0 }, position: 'relative'
                }}>
                    {myProfile && <Button variant='text' sx={{
                        color: 'text.secondary', fontWeight: 700, fontSize: { xs: 11, md: 14 }, position: 'absolute',
                        right: '10px', top: '10px', display: 'flex', alignItems: 'center', p: 0
                    }} onClick={handleEditProfile}>
                        <EditIcon sx={{ fontSize: 16, mr: 1 }} /> Edit
                    </Button>}

                    <Box sx={{ px: 2 }}>
                        {/* Profile picture */}
                        {/* <ProfileAvatar {...{
                            src: staffRecord?.profilePicture, fullName: staffRecord?.fullName, diameter: 80,
                            styleProp: { mx: 'auto', my: 2 }
                        }} /> */}
                        <img
                            src={staffRecord?.profilePicture}
                            style={{ height: '80px', width: '80px', margin: 'auto', display: 'block', marginTop: "6px" }}
                            className="rounded-full object-cover mt-2"
                        />

                        {/* Fullname */}
                        <Typography noWrap sx={{
                            display: 'flex', justifyContent: 'center', textTransform: 'capitalize',
                            fontWeight: 700, fontSize: { xs: 14, md: 17 }
                        }}>
                            {staffRecord?.fullName}
                        </Typography>


                        {/* Role */}
                        <Typography noWrap sx={{
                            color: '#8D8D8D', display: 'flex', mb: 3,
                            justifyContent: 'center', fontWeight: 700, fontSize: { xs: 13, md: 15 }
                        }}>
                            {staffRecord?.role}
                        </Typography>
                    </Box>

                    {/* Details */}
                    <Typography sx={{
                        bgcolor: 'white', display: 'flex', py: .5, mb: 1, border: '1px solid rgba(28, 29, 34, 0.1)',
                        justifyContent: 'center', fontWeight: 700, fontSize: { xs: 13, md: 15 }
                    }}>
                        DETAILS
                    </Typography>

                    {/* Contact */}
                    {heading('Contact')}
                    {/* Phone and Email  */}
                    <Box sx={{ py: 1.5 }}>
                        {contactData.map(data =>
                            <Typography noWrap sx={{
                                color: '#5D5D5D', display: 'flex', alignItems: 'center',
                                px: 2, py: .5, fontSize: { xs: 12, md: 14 }, fontWeight: 600,
                            }}>
                                {data.icon}
                                {staffRecord[data.key]}
                            </Typography>)}
                    </Box>

                    {/* Team */}
                    {heading('Team')}
                    {/* Team the staff belongs to */}
                    {teamProjectGroup('Team', staffRecord?.team)}

                    {/* Project group */}
                    {Boolean(staffRecord?.projectGroups?.length) && heading('Project Group')}
                    {/* Project groups the staff belongs to */}
                    <Box>
                        {staffRecord?.projectGroups?.map((group, index) =>
                            teamProjectGroup(group, index)
                        )}

                    </Box>
                </Box>

                {/* Column 2:tab body */}
                <Box sx={{ width: '100%' }}>
                    {state.currentTab === 2 && <StaffProfile email={state.email} />}
                    {state.currentTab === 1 && <Privileges email={state.email} />}
                    {state.currentTab === 0 && <TimeSheet email={state.email} />}
                </Box>
            </Box>
        </Box >
    )
}

export default StaffHome;