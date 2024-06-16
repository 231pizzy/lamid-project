'use client'

import { Badge, Box, IconButton, Typography, InputBase } from "@mui/material"
import IconElement from "./IconElement"

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close';
import Notifications from '@mui/icons-material/NotificationsOutlined';
import { ProfileAvatar } from "./ProfileAvatar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { getRequestHandler } from "./requestHandler";
import { useRef } from "react";
import NotificationPanel from "./NotificationsPanel";
import { useRouter } from "next/navigation"

const lamidSmallLogo = '/images/lamidLogo.png'

const getNotifications = ({ dataProcessor }) => {
    getRequestHandler({
        route: '/api/notifications-list',
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export default function Header({ openMenu }) {
    const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');


    const pageTitle = useSelector(state => state.route.pageTitle);
    const notificationCount = useSelector(state => state.userData.notificationCount)
    const ref = useRef(null);
    const router = useRouter();

    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, notificationCount: 0,
        menuOpen: false, notificationList: [], openNotification: false, notificationAnchor: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    // Search functionality
    const handleSearchClick = () => {
        setIsSearching(true);
      };
    
      const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
      };
    
      const handleSearchSubmit = () => {
        // Implement search logic here
        console.log('Search text:', searchText);
      };

      const handleCloseClick = () => {
        setSearchText('');
        setIsSearching(false);
      };

    useEffect(() => {
        updateState({ notificationAnchor: ref })
    }, [])

    useEffect(() => {
        updateState({ notificationCount: notificationCount })
    }, [notificationCount])


    const logo = ({ isSmall, style }) => {
        return <IconElement {...{ src: lamidSmallLogo, style: style }} />
    }

    const iconButton = ({ icon, onclick, style }) => {
        return <IconButton onClick={onclick} sx={{
            color: 'black'
        }}>
            {icon}
        </IconButton>
    }

    const closeNotifications = () => {
        updateState({
            notificationList: [],
            openNotification: false
        })
    }

    const handleNotifications = (event) => {
        getNotifications({
            dataProcessor: (result) => {
                if (result) {
                    updateState({
                        notificationList: result,
                        openNotification: true
                    })
                }
            }
        })
        /*   getNotifications(event, updateState, dispatch, openSnackbar,
              navigate, remoteRequest, toggleBlockView) */
    }

    const gotoMyProfile = () => {
        router.push('/admin/my-profile')
    }

    return <Box>
        {/* Row 1: Section is for only xs and sm breakpoints*/}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', borderBottom: '1px solid black' }}>
            {/* Logo */}
            {logo({ isSmall: true, style: { height: '50px', width: 'auto' } })}
        </Box>

        {/* Row 2: Main toolbar for all devices */}
        <Box ref={state.notificationAnchor} sx={{
            display: 'flex', alignItems: 'center', py: { xs: 1, md: 0 },
            flexDirection: 'row', borderBottom: '1px solid black',
        }}>
            {/* Menu icon button: For xs and sm breakpoints only */}
            <Box sx={{ display: { md: 'none' }, mx: 1 }}>
                {iconButton({ icon: <MenuIcon sx={{ fontSize: 24 }} />, onclick: openMenu })}
            </Box>

            {/* Logo: For md and above breakpoints only */}
            <Box sx={{ display: { xs: 'none', md: 'inherit', }, maxWidth: 'max-content' }}>
                {logo({ isSmall: false, style: { height: '65px', width: '200px' } })}
            </Box>


            {/* Page title */}
            <Typography sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 700, px: { xs: 0, md: 2 } }}>
                {pageTitle}
            </Typography>

            {/* Flex grow */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Search icon button */}
            {isSearching ? (
                <Box sx={{ display: 'flex', alignItems: 'center',  borderRadius: 8, border: '1px solid #BF0606', padding: '4px 12px', width: '300px',}}>
                    <IconButton onClick={handleSearchClick} sx={{ mr: { xs: 1, md: 2 } }}>
                    <SearchIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
                    <InputBase
                        value={searchText}
                        onChange={handleSearchInputChange}
                        placeholder="Search"
                        autoFocus
                    />
                    <IconButton onClick={handleCloseClick} sx={{ ml: { xs: 1, md: 2 } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            ) : (
                <IconButton onClick={handleSearchClick} sx={{ mr: { xs: 1, md: 2 } }}>
                    <SearchIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
            )}

            {/* Notification icon */}
            <Badge sx={{ mx: { xs: 1, md: 2 }, cursor: 'pointer' }} color='primary'
                onClick={handleNotifications}
                badgeContent={state.notificationCount}>
                <Notifications sx={{ fontSize: { xs: 20, md: 24 }, }} />
            </Badge>

            {/* Avatar of staff */}
            <ProfileAvatar {...{
                fullName: 'John Martin',
                diameter: 30,
                styleProp: { letterSpacing: 0, mx: { xs: 1, md: 3 }, cursor: 'pointer' },
                onclick: gotoMyProfile
            }} />
        </Box>

        {state.openNotification && <NotificationPanel {...{
            open: state.openNotification, onclose: closeNotifications, notificationList: state.notificationList
        }} />}
    </Box>
}