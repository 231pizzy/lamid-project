'use client'

import {
    Box, Typography, Divider, Switch,
} from "@mui/material";

import { useDispatch } from "react-redux";

import { useState, useEffect } from "react";


import { openSnackbar, setPageTitle } from "@/Components/redux/routeSlice";
import { getPrivileges } from "../helper";

const privileges = [
    {
        label: 'Tools', key: 'tools', children: [
            { label: 'Access to CRM/Address book', key: 'crm' },
            { label: 'Access to Forms', key: 'forms' },
        ]
    },
    {
        label: 'Project Group', key: 'projectGroup', children: [
            { label: 'Create a project group', key: 'createProjectGroup' },
            { label: 'Delete a project group', key: 'deleteProjectGroup' },
        ]
    },
    {
        label: 'Team', key: 'team', children: [
            { label: 'Create a team', key: 'createTeam' },
            { label: 'Delete a team', key: 'deleteTeam' },
        ]
    },
    {
        label: 'Staff', key: 'staff', children: [
            { label: 'Add new staff member', key: 'addStaff' },
            { label: 'Remove Staff Member', key: 'removeStaff' },
        ]
    }
]

export default function Privileges(prop) {
    const dispatch = useDispatch();

    // const [state, setState] = useState({
    //     email: prop.email, privileges: {
    //         tools: { crm: false, forms: false },
    //         projectGroup: { createProjectGroup: false, deleteProjectGroup: false }, team: { createTeam: false, deleteTeam: false },
    //         staff: { addStaff: false, removeStaff: false }
    //     },
    // });
    const [state, setState] = useState({
        email: prop.email,
        privileges: {
            tools: {},
            projectGroup: {},
            team: {},
            staff: {}
        },
    });
    
    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };
    // useEffect(() => {
    //     /* Set Page title */
    //     dispatch(setPageTitle({ pageTitle: 'Staff' }))
    //     getPrivileges({
    //         email: prop.email, dataProcessor: (result) => {
    //             updateState({ privileges: result?.privileges?.length ? result.privileges : state.privileges })
    //         }
    //     })

    // }, [])
    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Staff' }));
        getPrivileges({
            email: prop.email,
            dataProcessor: (result) => {
                if (result?.privileges && result.privileges.length > 0) {
                    updateState({ privileges: result.privileges[0] });
                }
            }
        });

    }, []);


    // const handlePrivilege = (event, parentKey, childKey) => {
    //     updateState({
    //         privileges: {
    //             ...state.privileges,
    //             [parentKey]: { ...state.privileges[parentKey], [childKey]: event.target.checked }
    //         }
    //     })
    // }
    const handlePrivilege = (event, parentKey, childKey) => {
        updateState({
            privileges: {
                ...state.privileges,
                [parentKey]: { ...state.privileges[parentKey], [childKey]: event.target.checked }
            }
        })
    }


    return (
        <Box sx={{
            display: 'block', pb: 1, width: { xs: '100%', md: '95%', lg: '70%', xl: '70%' },
            bgcolor: '#FBFBFB', borderRadius: '12px',
            border: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            {/* Heading */}
            <Typography sx={{
                width: '100%', wordBreak: 'break-word',
                ml: 1, p: 2, fontSize: { xs: 14, sm: 16 },
                fontWeight: 600, color: 'black',
            }}>
                Staff Privileges
            </Typography>

            <Divider />

            {/* Body */}
            <Box sx={{ px: 3, py: 2 }}>
                {privileges.map((privilege, index) =>
                    <Box key={index} sx={{ bgcolor: 'white' }}>
                        {/* Heading */}
                        <Typography noWrap sx={{ px: 3, py: .5, color: '#BF0606', bgcolor: 'rgba(191, 6, 6, 0.06)' }}>
                            {privilege.label}
                        </Typography>
                        {/* Content */}
                        <Box sx={{ px: 3, py: 1, }}>
                            {privilege.children.map((child, index) =>
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography noWrap>
                                        {child.label}
                                    </Typography>
                                    {state.privileges && state.privileges[privilege.key] && state.privileges[privilege.key][child.key] !== undefined &&
                                        <Switch checked={state.privileges[privilege.key][child.key]}
                                            value={state.privileges[privilege.key][child.key]} readOnly
                                            onChange={(event) => { handlePrivilege(event, privilege.key, child.key) }}/>
                                    }
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
        // <Box sx={{
        //     display: 'block', pb: 1, width: { xs: '100%', md: '95%', lg: '70%', xl: '70%' },
        //     bgcolor: '#FBFBFB', borderRadius: '12px',
        //     border: '1px solid rgba(28, 29, 34, 0.1)'
        // }}>
        //     {/* Heading */}
        //     <Typography sx={{
        //         width: '100%', wordBreak: 'break-word',
        //         ml: 1, p: 2, fontSize: { xs: 14, sm: 16 },
        //         fontWeight: 600, color: 'black',
        //     }}>
        //         Staff Priviledges
        //     </Typography>

        //     <Divider />

        //     {/* Body */}
        //     <Box sx={{ px: 3, py: 2 }}>
        //         {privileges.map((privilege, index) =>
        //             <Box key={index} sx={{ bgcolor: 'white' }}>
        //                 {/* Heading */}
        //                 <Typography noWrap sx={{ px: 3, py: .5, color: '#BF0606', bgcolor: 'rgba(191, 6, 6, 0.06)' }}>
        //                     {privilege.label}
        //                 </Typography>
        //                 {/* Content */}
        //                 <Box sx={{ px: 3, py: 1, }}>
        //                     {privilege.children.map((child, index) =>
        //                         <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        //                             <Typography noWrap>
        //                                 {child.label}
        //                             </Typography>
        //                             <Switch checked={state.privileges[privilege.key][child.key]}
        //                                 value={state.privileges[privilege.key][child.key]} readOnly
        //                                 /* onChange={(event) => { handlePrivilege(event, privilege.key, child.key) }}  */ />
        //                         </Box>
        //                     )}
        //                 </Box>
        //             </Box>
        //         )}
        //     </Box>
        // </Box>


    )
}
