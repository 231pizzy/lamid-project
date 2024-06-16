'use client'

import { Box, ButtonGroup, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, lighten } from "@mui/material"

import { useState, useEffect } from "react";

import Phone from "@mui/icons-material/PhoneOutlined";
import Email from "@mui/icons-material/EmailOutlined";
import Location from "@mui/icons-material/LocationOnOutlined";

import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";
import { ProfileAvatar } from "@/Components/ProfileAvatar";
import { useRouter } from "next/navigation";


const statusColor = {
    introductory: '#257AFB', reinforcement: '#FF6C4B', conversion: '#4E944F', unassigned: '#4E944F', client: '#FF6C4B'
}

function ListLayout(prop) {
    const router = useRouter();
    const [state, setState] = useState({
        selected: prop.selected ?? [], orderBy: '', order: '', tableContent: prop.tableContent
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    console.log('contacts', prop.tableContent);

    useEffect(() => {
        updateState({ tableContent: prop.tableContent, selected: prop.selected })
    }, [prop])

    const handleCheckbox = (event) => {
        event.stopPropagation()
        const id = event.target.id;
        prop.selectItem(id);
    }


    const gotoContact = (event) => {
        const id = event.currentTarget.id;
        console.log('id', id)
        // prop.gotoContact(id)
        router.push(`/admin/contact/?id=${id}`,)
    }

    const isChecked = (id) => {
        return state.selected.includes(id);
    }



    const createEmail = (event, email, profilePicture, fullName) => {
        event.stopPropagation();
        prop.createEmail({ email: email, profilePicture: profilePicture, fullName: fullName })
    }


    const sort = (event) => {
        const orderBy = event.currentTarget.id;
        const order = state.order === 'desc' ? 'asc' : 'desc';
        let sorted = [];
        if (order === 'desc') {
            sorted = tableContent.sort((a, b) => a[orderBy] < b[orderBy] ? 1 : -1);
        }
        else {
            sorted = tableContent.sort((a, b) => a[orderBy] > b[orderBy] ? 1 : -1);
        }

        updateState({
            tableContent: [...sorted],
            orderBy: orderBy,
            order: order
        })
    }

    const TaxtValueCell = ({ value, color, icon, wrap, noWrap, alignItems, textTransform,
        bgcolor, width, justifyContent, px, py, borderRadius, fontSize, fontWeight }) => {
        return <TableCell align="left" >
            {/*    <Box sx={{ display: 'flex', alignItems: 'center' }}> */}

            <Typography noWrap={noWrap} sx={{
                fontSize: fontSize ?? 14, bgcolor: bgcolor ?? 'inherit', width: width ?? 'auto',
                color: color, fontWeight: fontWeight, px: px ?? 0, alignItems: 'alignItems' ?? 'inherit',
                display: 'flex', justifyContent: justifyContent ?? 'inherit', textTransform: textTransform ?? 'inherit',
                py: py ?? 0, borderRadius: borderRadius ?? 'inherit', flexWrap: wrap ?? 'inherit'
            }}>
                {icon}
                {value}
            </Typography>
            {/*   </Box> */}
        </TableCell>
    }

    const tableHeading = ['CONTACT NAME', 'COMPANY', 'SECTOR', 'CONTACT', 'STATUS', 'HANDLER', 'SUPERVISOR', 'FOLLOW UPS', 'ATTACHMENTS',];

    const tableContent = state.tableContent;

    console.log('state list layout', state);

    return <Box disableGutters sx={{
        /*  maxHeight: '100%', overflowY: 'scroll', */
        boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
        /* width: '100%', */ maxWidth: '100%', bgcolor: '#FFFFFF',
        border: '1px solid rgba(28, 29, 34, 0.1)', pb: 1
    }}>
        <TableContainer sx={{
            width: '100%', m: 0, p: 0, maxWidth: '100%', maxHeight: prop.maxHeight ? prop.maxHeight : '75vh', overflowX: 'auto',
            /*  '&::-webkit-scrollbar': { width: '0' }, */
        }}>
            <Table stickyHeader size='small' sx={{ maxWidth: '100%', m: 0, p: 0, overflowX: 'auto' }}>
                {/* Table heading */}
                <TableHead   >
                    <TableRow sx={{ bgcolor: '#F7F7F7', zIndex: 2, position: 'relative' }}>
                        {/* Checkbox cell */}
                        <TableCell sx={{ borderRight: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: '#F7F7F7', height: 50 }} align='left'>
                            <Checkbox size="small" sx={{ p: 0, color: 'rgba(28, 29, 34, 0.2)' }}
                                onClick={prop.selectAll} checked={prop.allSelected()}
                            />
                        </TableCell>

                        {tableHeading.map((headValue, cellInx) => (
                            <TableCell key={cellInx}
                                align={headValue === 'Action' ? 'center' : 'left'}
                                sx={{
                                    borderRight: '1px solid  rgba(28, 29, 34, 0.1)',
                                    bgcolor: '#F7F7F7', height: 50, color: '#333333'
                                }}>
                                <TableSortLabel id={headValue.toLowerCase()}
                                    active={state.orderBy === headValue.toLowerCase()}
                                    direction={state.order}
                                    onClick={sort}
                                    sx={{ color: 'black' }}>
                                    <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>
                                        {headValue}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                        ))}

                        <TableCell sx={{
                            borderRight: '1px solid  rgba(28, 29, 34, 0.1)',
                            bgcolor: '#F7F7F7', height: 50
                        }} align='center'>
                            <Typography noWrap sx={{ fontSize: 14, fontWeight: 700 }}>
                                Actions
                            </Typography>
                        </TableCell>

                    </TableRow>
                </TableHead>

                {/* Table body */}
                <TableBody sx={{ width: '100%', m: 0, p: 0, maxWidth: '100%', overflowX: 'auto' }}>

                    {state.tableContent.map((rowValue, rowIndx) => (
                        /* Table body Row */
                        <TableRow role='checkbox' id={rowValue._id.toString()}
                            onClick={gotoContact}
                            sx={{ bgcolor: isChecked(rowValue._id) ? '#FEF5F5' : '#FBFBFB' }}>
                            {/* Row Checkbox */}
                            <TableCell sx={{ borderLeft: isChecked(rowValue._id) ? '4px solid #BF0606' : '', height: 50 }}
                                align='left'>
                                <Checkbox size="small" id={rowValue._id}
                                    checked={isChecked(rowValue._id)}
                                    sx={{ p: 0 }} onClick={handleCheckbox} />
                            </TableCell>

                            {/* Contact Name */}
                            {TaxtValueCell({ value: rowValue.fullName, color: '#333333', fontWeight: 600, noWrap: true })}

                            {/* Company */}
                            {TaxtValueCell({ value: rowValue.company, color: '#5D5D5D', fontWeight: 600 })}

                            {/* Sector */}
                            <TableCell align="center"  >
                                <Typography sx={{
                                  /*   bgcolor: 'rgba(191, 6, 6, 0.08)',  */px: .5, py: .5, maxWidth: 'max-content', display: 'flex',
                                    borderRadius: '8px', justifyContent: 'center', alignItems: 'center',
                                    /*  color: 'rgba(191, 6, 6, 0.7)', */
                                    color: '#5D5D5D', fontSize: 13, fontWeight: 600
                                }}>
                                    {rowValue.sector}
                                </Typography>
                            </TableCell>

                            {/* Contact */}
                            <TableCell align="left"  >
                                {/* Phone number */}
                                <Typography noWrap sx={{
                                    display: 'flex', alignItems: 'center',
                                    fontSize: 13, mt: 1, mb: .5, color: '#5D5D5D',
                                }}>
                                    <Phone fontSize="14px" sx={{ mr: 1 }} />
                                    {rowValue.phone}
                                </Typography>

                                {/* Email */}
                                <Typography noWrap sx={{
                                    display: 'flex', alignItems: 'center',
                                    fontSize: 13, color: '#5D5D5D', mb: .5,
                                }}>
                                    <Email fontSize="14px" sx={{ mr: 1 }} />
                                    {rowValue.email}
                                </Typography>

                                {/* Address */}
                                <Typography noWrap sx={{
                                    display: 'flex', alignItems: 'center',
                                    fontSize: 13, color: '#5D5D5D', maxWidth: '120px', overflowX: 'clip'
                                }}>
                                    <Location fontSize="14px" sx={{ mr: 1 }} />
                                    {`${rowValue.street}, ${rowValue.city}, ${rowValue.state}, ${rowValue.country}`}
                                </Typography>
                            </TableCell>

                            {/* Status */}
                            <TableCell align="center"  >
                                {Boolean(rowValue?.status) && <Typography sx={{
                                    bgcolor: lighten(statusColor[rowValue?.status] ?? '#FFFFFF', 0.85),
                                    px: 2, py: .5, display: 'flex', borderRadius: '16px', justifyContent: 'center', alignItems: 'center', color: statusColor[rowValue?.status],
                                    fontSize: 13, fontWeight: 600, boxShadow: '0px 8px 12px 0px rgba(0, 0, 0, 0.04)',
                                    textTransform: 'capitalize'
                                }}>
                                    {rowValue?.status}
                                </Typography>}
                            </TableCell>

                            <TableCell align="left"  >
                                <ProfileAvatar {...{
                                    diameter: 40, src: null, fullName: 'John Paul',
                                    styleProp: { color: '#EF2B2B', bgcolor: 'white', letterSpacing: 0 }
                                }} />
                            </TableCell>

                            <TableCell align="left"  >
                                <ProfileAvatar {...{
                                    diameter: 40, src: null, fullName: 'Sam David',
                                    styleProp: { color: '#EF2B2B', bgcolor: 'white', letterSpacing: 0 }
                                }} />
                            </TableCell>

                            {/* Followups */}
                            <TableCell align="center" >
                                {TaxtValueCell({
                                    value: `${0}/5`,
                                    color: '#5D5D5D', fontWeight: 500, fontSize: 13
                                })}
                            </TableCell>

                            {/* Attachments */}
                            {TaxtValueCell({
                                value: `${rowValue?.attachments ?? 0} files`,
                                color: '#5D5D5D', fontWeight: 500, fontSize: 13
                            })}

                            {/* Actons */}
                            <TableCell align="right">
                                <ButtonGroup>
                                    <Box sx={{
                                        display: 'flex',
                                        bgcolor: '#EFEFEF', justifyContent: 'center',
                                        border: '1px solid rgba(28, 29, 34, 0.1)',
                                        borderRadius: '7px',
                                        alignItems: 'center', minHeight: 0, minWidth: 0,
                                        height: 4, width: 4, p: 1.5, mr: 2
                                    }}>
                                        <Phone sx={{ fontSize: 16 }} />
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        border: '1px solid rgba(28, 29, 34, 0.1)',
                                        borderRadius: '7px',
                                        bgcolor: '#EFEFEF', justifyContent: 'center',
                                        alignItems: 'center', height: 4, width: 4, p: 1.5
                                    }}
                                        onClick={(event) => { createEmail(event, rowValue.email, 'rierd', rowValue.fullName) }}
                                    >
                                        <Email sx={{ fontSize: 16 }} />
                                    </Box>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box >
}

export default ListLayout