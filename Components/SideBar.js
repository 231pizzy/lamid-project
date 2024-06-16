'use client'

import { useMemo, useState } from 'react'

import TeamIcon from '@mui/icons-material/GroupOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CaretDownIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CaretUpIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

import { usePathname, useRouter } from 'next/navigation';
import { Backdrop, Box, Divider, Typography } from '@mui/material';
import IconElement from './IconElement';
import { useDispatch, useSelector } from 'react-redux';
import { openLogoutPrompt } from './redux/routeSlice';
import SnackbarComponent from './Snackbar';
import LogOut from './LogOut';
import { useEffect } from 'react';
import { CalendarSvg, DashboardSvg, LogOutSvg, OnePersonSvg, Privilege, ProjectGroupSvg, SettingSvg, ThreePersonSvg } from '@/public/icons/icons';


/* const OnePersonSvg = '/icons/OnePersonSvg.svg';
const CalendarSvg = '/icons/calendarSvg.svg';
const DashboardSvg = '/icons/dashboardSvg.svg';
const SettingSvg = '/icons/SettingSvg.svg';
const ProjectGroupSvg = '/icons/projectGroup.svg';
const ThreePersonSvg = '/icons/ThreePersonSvg.svg';
const Privilege = '/icons/Privilege.svg';
const LogOutSvg = '/icons/LogOutSvg.svg'; */

const lamidLogo = '/images/lamidLogo.png'

/* const OnePersonSvgRed = '/icons/OnePersonSvgRed.svg';
const CalendarSvgRed = '/icons/calendarSvgRed.svg';
const DashboardSvgRed = '/icons/dashboardSvgRed.svg';
const SettingSvgRed = '/icons/SettingSvgRed.svg';
const ProjectGroupSvgRed = '/icons/projectGroupRed.svg';
const ThreePersonSvgRed = '/icons/ThreePersonSvgRed.svg';
const PrivilegeRed = '/icons/PrivilegeRed.svg'; */

const toolsSubMenuIds = ['crm', 'forms', 'documents']

export default function SideBar({ isMenuOpen, closeMenu }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const message = useSelector(state => state.route.snackbarMessage);
    const severity = useSelector(state => state.route.snackbarSeverity);
    const snackBarOpen = useSelector(state => state.route.showSnackbar);

    const pathname = usePathname();



    const [state, setState] = useState({
        selectedToolSubMenu: '', openTools: false, openMenu: false, selectedMenu: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    const getSelectedTab = () => {
        const pathname1 = pathname.split('/')[2] ?? ''

        console.log('pathname', pathname, pathname1);

        const setSubMenu = (id) => {
            updateState({ selectedToolSubMenu: id })
        }

        switch (pathname1) {
            case '':
                return '';
            case 'crm':
            case 'contact':
                setSubMenu('crm')
                return 'tools';
            case 'form-builder':
            case 'forms':
                setSubMenu('forms')
                return 'tools';
            case 'documents':
                setSubMenu('documents')
                return 'tools';
            case 'my-profile':
                return 'my-profile';
            case 'my-calendar':
                return 'my-calendar';
            case 'project-group':
            case 'project-group-detail':
                return 'project-group';
            case 'team':
                return 'team';
            case 'privilege':
                return 'privilege';
            case 'staff':
            case 'staff-profile':
            case 'edit-profile':
                return 'staff'
        }
    }

    useEffect(() => {
        updateState({ selectedMenu: getSelectedTab() })
    }, [pathname])

    const handleDrawerClose = () => {
        closeMenu()
    };

    const handleSideNav = (event) => {
        const id = event.currentTarget.id;

        if (id === 'crm') {
            window.location.href = `/admin/${id}`;
        }
        else {
            router.push(`/admin/${id}`)
        }

        toolsSubMenuIds.includes(id) ?
            updateState({ selectedToolSubMenu: id, selectedMenu: 'tools', })
            : updateState({ selectedToolSubMenu: '', selectedMenu: id, })

        handleDrawerClose();
    }

    const handleViewProfile = () => {
        updateState({ selectedToolSubMenu: '', selectedMenu: 'my-profile', })
        router.push('/admin/my-profile', { state: { email: null, self: true } });
    }


    const openToolsMenu = () => {
        updateState({ openTools: true })
    }

    const closeToolsMenu = () => {
        updateState({ openTools: false })
    }

    const handleToolsClick = () => {
        state.openTools ? closeToolsMenu() : openToolsMenu()
    }

    const openLogOut = (event) => {
        dispatch(openLogoutPrompt());
        handleDrawerClose();
    }

    const iconStyle = { height: '20px', width: '20px', marginRight: '24px' }

    const personalSideBarData = useMemo(() => {
        return [
            {
                label: 'My Profile', route: 'my-profile',
                icon: <OnePersonSvg style={{ ...iconStyle }} />, processor: handleViewProfile
            },
            {
                label: 'My Calendar', route: 'my-calendar',
                icon: <CalendarSvg style={{ ...iconStyle }} />, processor: handleSideNav
            },
        ];
    }, [])

    const toolsSubMenu = useMemo(() => {
        const menuItems = [
            { label: 'Crm/Address book', id: 'crm', processor: handleSideNav },
            { label: 'Forms', id: 'forms', processor: handleSideNav },
            { label: 'Documents', id: 'documents', processor: handleSideNav },
        ];

        return <Box sx={{ py: 1, pr: 1 }}>
            {menuItems.map((item, index) => {
                const isSelected = state.selectedToolSubMenu === item.id;
                return <Box key={index} id={item.id} className='tools-child' onClick={item.processor}
                    sx={{
                        width: 'max-content', display: 'flex', py: .5, cursor: 'pointer',
                        alignItems: 'center', justifyContent: 'flex-start'
                    }}>
                    <div style={{ height: '1px', width: '30px', background: '#8D8D8D' }} ></div>
                    <Typography sx={{
                        color: isSelected ? 'white' : '#5D5D5D', fontSize: 13, borderRadius: '16px',
                        bgcolor: isSelected ? '#DA4E4E' : 'white', px: 1, py: .5, width: 'max-content'
                    }}>
                        {item.label}
                    </Typography>
                </Box>
            })}
        </Box>

    }, [state.selectedToolSubMenu, state.openTools])


    /*  const teamIcon = <TeamIcon sx={{ ...iconStyle }} /> */

    const sideBarData = useMemo(() => {
        return [
            { label: 'Dashboard', route: '', icon: <DashboardSvg style={{ ...iconStyle }} />, processor: handleSideNav },
            { label: 'Tools', route: 'tools', icon: <SettingSvg style={{ ...iconStyle }} />, processor: handleToolsClick },
            { label: 'Project Group', route: 'project-group', icon: <ProjectGroupSvg style={{ ...iconStyle }} />, processor: handleSideNav },
            { label: 'Team', route: 'team', icon: <TeamIcon style={{ ...iconStyle }} />, isIcon: true, processor: handleSideNav },
            { label: 'Staff', route: 'staff', icon: <ThreePersonSvg style={{ ...iconStyle }} />, processor: handleSideNav },
        ];
    }, [state.openTools, state.selectedToolSubMenu])


    const sideBarButton = ({ label, onclick, iconSrc, id, index, justifySelf }) => {
        const selected = state.selectedMenu === id;

        return <Typography key={index} id={id} onClick={onclick}
            sx={{
                display: 'flex', alignItems: 'center', px: 2, py: 1, my: .5, minWidth: { xs: '60vw', sm: '30vw', md: 0 },
                bgcolor: selected ? '#BF06061A' : 'white', color: id === 'logout' ? '#BF0606' : selected ? '#BF0606' : '#5D5D5D',
                justifySelf: justifySelf, cursor: 'pointer', ":hover": { background: '#BF06061A' },
                borderRight: selected ? '2px solid #BF0606' : 'none'
            }}>
            {iconSrc}

            {label}

            {Boolean(id === 'tools') ?
                state.openTools ? <CaretUpIcon /> : <CaretDownIcon /> : null}
        </Typography>
    }

    return <Box sx={{
        minWidth: { md: '200px' }, position: { xs: 'absolute', md: 'relative', }, maxWidth: 'max-content', zIndex: 1111,
        top: 0, left: 0, right: 0, bottom: 0, height: { xs: 'calc(100vh - vh)', md: '100vh' }, background: 'white', borderRight: '1px solid #C5C5C5',
        display: { xs: isMenuOpen ? 'block' : 'none', md: 'block' }, overflowY: { xs: 'hidden', md: 'auto' }

    }}>
        <Box sx={{ zIndex: 1111, bgcolor: 'white', height: '100%' }}>

            <Box sx={{ display: { md: 'none' } }}>
                {/* Lamid logo */}
                <IconElement {...{ src: lamidLogo, style: { margin: '12px 8px', height: '40px', width: 'auto' } }} />

                {/* Menu label */}
                <Typography sx={{
                    display: 'flex', bgcolor: '#EFEFEF', px: 2, py: 1.5, fontSize: 14, fontWeight: 600,
                    alignItems: 'center', justifyContent: 'space-between'
                }}>
                    MENU
                    <CloseIcon onClick={handleDrawerClose} />
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Section 1 */}
                <Box sx={{ mb: 2 }}>
                    {sideBarData.map((data, index) => {
                        const id = data?.route;
                        return <Box key={index}>
                            {sideBarButton({
                                label: data.label, onclick: data.processor, id: id,
                                iconSrc: data.icon, index: index
                            })}

                            {Boolean(state.openTools && id === 'tools') &&
                                <Box sx={{ ml: 3, display: 'flex' }}>
                                    <div style={{ width: '1px', height: '100px', background: '#8D8D8D' }} ></div>
                                    {toolsSubMenu}
                                </Box>}
                        </Box>
                    })}

                </Box>

                {/* Personal section */}
                <Box sx={{ mb: 4 }}>
                    <Divider />
                    <Typography sx={{ display: { xs: 'none', sm: 'inherit' }, px: 2, pt: 1, pb: 1, fontSize: { xs: 13, md: 14 } }}>
                        PERSONAL
                    </Typography>

                    <Box>
                        {personalSideBarData.map((data, index) => {
                            return sideBarButton({
                                label: data.label, onclick: data.processor, id: data?.route,
                                iconSrc: data.icon, index: index
                            })
                        })}
                    </Box>
                </Box>

                {/* Privilege button */}
                {sideBarButton({
                    label: 'Privilege', onclick: handleSideNav, id: 'privilege',
                    iconSrc: <Privilege style={{ ...iconStyle }} />,
                })}

                <Divider />

                {/* Log out button */}
                {sideBarButton({
                    label: 'Log Out', onclick: openLogOut, id: 'logout', justifySelf: 'flex-end',
                    iconSrc: <LogOutSvg style={{ ...iconStyle }} />,
                })}

            </Box>
        </Box>

        <Backdrop onClick={closeMenu} open={true} sx={{ display: { md: 'none' }, zIndex: -2 }} >

        </Backdrop>

        {/* Snackbar that services the whole application */}
        {snackBarOpen && <SnackbarComponent {...{ message: message, severity: severity }} />}

        {/* Logout prompt for all the children */}
        <LogOut />
    </Box>
}