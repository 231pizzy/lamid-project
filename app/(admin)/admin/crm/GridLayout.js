'use client'

import { Box, ButtonGroup, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material"

import { useState, useEffect, useMemo } from "react";

import Phone from "@mui/icons-material/PhoneOutlined";
import Email from "@mui/icons-material/EmailOutlined";
import Location from "@mui/icons-material/LocationOnOutlined";

import IconElement from "@/Components/IconElement";

const InPersonSvg = '/icons/InpersonSvg.svg';
const MailSvg = '/icons/MailSvg.svg';
const LetterSvg = '/icons/LetterSvg.svg';
const OnlineSvg = '/icons/OnlineSvg.svg';


const iconStyle = { width: '15px', height: '15px', margin: '0 4px 0 4px' }

const contactModes = [
    {
        label: 'Phone', icon: <Phone sx={{
            borderRadius: '20px', bgcolor: 'rgba(93, 74, 208, 0.15)', color: '#5D4AD0',
            fontSize: 14, mx: .5
        }} />, value: 'phone'
    },
    { label: 'In Person', icon: <IconElement {...{ src: InPersonSvg, style: iconStyle }} />, value: 'inPerson' },
    { label: 'Email', icon: <IconElement {...{ src: MailSvg, style: iconStyle }} />, value: 'email' },
    { label: 'Online', icon: <IconElement {...{ src: OnlineSvg, style: iconStyle }} />, value: 'online' },
    { label: 'Letter', icon: <IconElement {...{ src: LetterSvg, style: iconStyle }} />, value: 'letter' },
]

const contactData = [
    { icon: <Phone fontSize="14px" sx={{ mr: 1 }} />, valueKey: 'phone' },
    { icon: <Email fontSize="14px" sx={{ mr: 1 }} />, valueKey: 'email' },
    { icon: <Location fontSize="14px" sx={{ mr: 1 }} />, valueKey: 'street', valueKey2: 'city', valueKey3: 'country' },
]

const actions = [
    { icon: <Phone sx={{ color: '#5D5D5D', fontSize: 16 }} />, mr: 2, valueKey: 'call' },
    { icon: <Email sx={{ color: '#5D5D5D', fontSize: 16 }} />, mr: 0, valueKey: 'email' },
]

function GridLayout(prop) {
    const [state, setState] = useState({
        selected: prop.selected ?? [], orderBy: '', order: '', tableContent: prop.tableContent,
        firstItem: prop.firstItem, lastItem: prop.lastItem
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        updateState({ tableContent: prop.tableContent, selected: prop.selected })
    }, [prop])

    const handleCheckbox = (event) => {
        event.stopPropagation()
        const id = event.target.id;
        prop.selectItem(id);
    }

    const isChecked = (id) => {
        return state.selected.includes(id);
    }

    const createEmail = (event, email, profilePicture, fullName) => {
        event.stopPropagation()
        console.log('create email')
        prop.createEmail({ email: email, profilePicture: profilePicture, fullName: fullName })
    }

    const gotoContact = (event) => {
        const id = event.currentTarget.id;
        console.log('id', id)
        prop.gotoContact(id)
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

    const contactCard = ({ id, company, contactName, sector, contactObject, followupsCount }) => {
        return <Box id={id} sx={{
            mt: 3, mx: 2, border: '1px solid rgba(28, 29, 34, 0.1)', borderRadius: '12px',
            boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', width: '350px',
        }} onClick={gotoContact}>
            {/* Checkbox, company, contact name,call, email,sector */}
            <Box sx={{ display: 'flex', }}>
                {/* Checkbox */}
                <Checkbox size="medium" id={id}
                    checked={isChecked(id)}
                    sx={{ p: 0, mx: 2, mt: 3, mb: 2 }} onClick={handleCheckbox} />
                {/* company name and contact name */}
                <Box sx={{ pt: 3, pb: 1, pr: 2 }}>
                    {/* Company name */}
                    <Typography sx={{ textTransform: 'capitalize', mb: .5, fontWeight: 700, fontSize: 16 }}>
                        {company}
                    </Typography>
                    {/* Contact person's name */}
                    <Typography sx={{
                        display: 'flex', textTransform: 'capitalize', color: '#5D5D5D',
                        fontWeight: 600, fontSize: 14
                    }}>
                        Contact:
                        {contactName}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                {/* Sector and call and email actions*/}
                <Box>
                    {/* Sector */}
                    <Box sx={{
                        borderRadius: '2px 12px 2px 2px',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                    }}>
                        <Typography sx={{
                            color: 'rgba(191, 6, 6, 0.7)', display: 'flex', bgcolor: 'rgba(191, 6, 6, 0.08)',
                            fontWeight: 600, fontSize: 13, px: .5, py: .5, borderRadius: '2px 12px 2px 2px',
                            alignItems: 'center',
                        }}>
                            {sector}
                        </Typography>
                    </Box>

                    {/* Actions */}
                    <ButtonGroup sx={{ pt: 2, pr: 2 }}>
                        {actions.map(action =>
                            <Box sx={{
                                display: 'flex',
                                cursor: 'pointer',
                                bgcolor: '#EFEFEF', justifyContent: 'center',
                                border: '1px solid rgba(28, 29, 34, 0.1)',
                                borderRadius: '7px',
                                alignItems: 'center', minHeight: 0, minWidth: 0,
                                height: 4, width: 4, p: 1.5, mr: action.mr
                            }}
                                onClick={action.valueKey === 'email' ?
                                    (event) => { createEmail(event, contactObject.email, 'rierd', contactName) }
                                    : () => { }}
                            >
                                {action.icon}
                            </Box>
                        )}

                    </ButtonGroup>
                </Box>

            </Box>

            {/* Contact information */}
            <Box>
                {/* Section label */}
                <Typography sx={{
                    color: '#8D8D8D', fontWeight: 600, fontSize: 13,
                    bgcolor: 'rgba(28, 29, 34, 0.04)', px: 2, py: .5
                }}>
                    Contact & address
                </Typography>

                {/* Section content */}
                <Box sx={{ px: 2, }}>
                    {contactData.map(data =>
                        <Typography sx={{
                            display: 'flex', alignItems: 'center', textTransform: data.valueKey === 'email' ? 'lowercase' : 'capitalize',
                            fontSize: 14, mt: 1, mb: .5, color: '#5D5D5D',
                        }}>
                            {data.icon}
                            {!data.valueKey2 && contactObject[data.valueKey]}
                            {data.valueKey2 && `${contactObject[data.valueKey]}, ${contactObject[data.valueKey2]}, ${contactObject[data.valueKey3]}`}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/*Followups */}
            <Box  >
                {/* Section label */}
                <Typography sx={{
                    color: '#8D8D8D', fontWeight: 600, fontSize: 13,
                    bgcolor: 'rgba(28, 29, 34, 0.04)', px: 2, py: .5
                }}>
                    Follow-ups
                </Typography>

                {/* Section content */}
                <Box sx={{ flexWrap: 'wrap', display: 'flex', alignItems: 'center', pt: 1, pb: 2, px: 2 }}>
                    {contactModes.map((mode, index) =>
                        <Typography id={index} sx={{ flexWrap: 'wrap', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', mr: 2 }}>
                            {mode.icon}
                            {mode.label} ({followupsCount[mode.value]})
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    }


    const tableContent = state.tableContent;

    return <Box disableGutters sx={{
        maxHeight: '100%', display: 'flex', flexWrap: 'wrap',
        boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
        width: '100%', maxWidth: '100%', bgcolor: '#FFFFFF', pb: 2,
        border: '1px solid rgba(28, 29, 34, 0.1)', justifyContent: 'space-evenly'
    }}>
        {state.tableContent.map((rowValue, rowIndx) => {
            return contactCard({
                id: rowValue._id.toString(), contactName: rowValue.fullName, company: rowValue.company,
                contactObject: {
                    phone: rowValue.phone, email: rowValue.email, street: rowValue.street,
                    city: rowValue.city, state: rowValue.state, country: rowValue.country
                }, followupsCount: rowValue.followupsCount,
                sector: rowValue.sector, galleryObject: {
                    notes: rowValue?.notes ?? 0,
                    appointments: rowValue?.appointments ?? 0, files: rowValue?.files ?? 0
                }
            })
        })}

    </Box>
}

export default GridLayout