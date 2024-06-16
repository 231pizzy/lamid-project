import { Box, Button, Checkbox, CircularProgress, IconButton, Slide, Typography } from "@mui/material";

import { SearchBox } from "@/Components/SearchBox";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStaff, searchForStaff, updateHandler } from "./helper";
import CancelIcon from "@mui/icons-material/Close";
import { ProfileAvatar } from "../ProfileAvatar";
import { SubmitButton } from "../SubmitButton";

export default function StaffList({ handleClose, existingStaffList, title, id, submitEndPoint, valuekey }) {
    const [state, setState] = useState({
        firstItem: '', lastItem: '', searchValue: '', staffPerPage: 10, currentPage: 1, staffList: [],
        selectedStaff: existingStaffList || [], searchAnchor: useRef(null), submitting: false
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    };

    useEffect(() => {
        getStaff({
            list: true, dataProcessor: (result) => {
                if (result) updateState({ staffList: result?.data ?? [] })
            }
        })
    }, [])

    const findStaff = (value, callback) => {
        searchForStaff({
            name: value, dataProcessor: (result) => {
                callback(result);
            }
        })
    }

    const removeSearchBox = () => {
    }

    const removeStaff = (email) => {
        updateState({ selectedStaff: state.selectedStaff.filter(staffEmail => staffEmail !== email) })
    }

    const handleMenuClick = (email) => {
        if (!state.selectedStaff.includes(email)) {
            updateState({ selectedStaff: [...state.selectedStaff, email] })
        }
        removeSearchBox()
    }

    const gotoPrevPage = () => {
        updateState({ currentPage: state.currentPage - 1 })
    }

    const gotoNextPage = () => {
        updateState({ currentPage: state.currentPage + 1 })
    }

    const selectStaff = (email) => {
        if (state.selectedStaff.includes(email)) {
            //remove staff
            updateState({ selectedStaff: state.selectedStaff.filter(staffEmail => staffEmail !== email) })
        }
        else {
            //add staff
            updateState({ selectedStaff: [...state.selectedStaff, email] })
        }
    }

    const paginationLabel = useMemo(() => {
        let firstItem = ((state.currentPage - 1) * state.staffPerPage);

        const total = firstItem + state.staffPerPage;

        const lastItem = total < state.staffList.length ? total : state.staffList.length;

        updateState({ firstItem: firstItem, lastItem: lastItem })

        return `${firstItem + 1} - ${lastItem} of ${state.staffList.length}`
    }, [state.staffList, state.currentPage]);

    const handleSubmit = () => {
        updateState({ submitting: true });
        updateHandler({
            handler: JSON.stringify(state.selectedStaff), id, key: valuekey, submitEndPoint,
            dataProcessor: () => {
                updateState({ submitting: false });
                window.location.reload()
            }
        })
    }


    return <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            display: 'flex', flexDirection: 'column', width: { xs: '90%', md: '70%', lg: '50%', },
            bgcolor: 'white', pb: 0, position: 'absolute', top: 0, right: 0,
            borderRadius: '16px 0 0 16px', height: '100vh', overflowY: 'hidden'
        }}>
            {/* Action Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, borderBottom: '1px solid #1C1D221A' }}>
                <IconButton sx={{ p: .2, mr: 2 }}>
                    <CancelIcon sx={{ fontSize: 25, }} onClick={handleClose} />
                </IconButton>

                <Typography sx={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
                    {title}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <SubmitButton handleSubmit={handleSubmit} variant={'contained'}
                    isSubmitting={state.submitting} label={'Done'}
                />
            </Box>

            {/* Heading */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, bgcolor: 'rgba(28, 29, 34, 0.06)' }}>
                {/* Label */}
                <Typography sx={{
                    fontWeight: 700, fontSize: { xs: 13, sm: 14 }, display: 'flex', alignItems: 'center',
                    minWidth: 'max-content', mr: 2
                }}>
                    Staff ({state.staffList.length})
                </Typography>


                {/* Pagination */}
                <Box sx={{
                    px: 5, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minWidth: 'max-content'
                }}>
                    {/* Previous button */}
                    <Button variant="outlined" sx={{
                        minWidth: 0, p: 0, width: '50px',
                        fontWeight: 600, fontSize: { xs: 12, md: 12 }, borderRadius: '24px'
                    }}
                        disabled={state.currentPage <= 1}
                        onClick={gotoPrevPage}>
                        Prev
                    </Button>

                    {/* pagination */}
                    <Typography sx={{ px: 2, fontWeight: 600, fontSize: { xs: 14, md: 13 } }}>
                        {paginationLabel}
                    </Typography>

                    {/* Next button */}
                    <Button variant="outlined" sx={{ minWidth: 0, p: 0, width: '50px', fontWeight: 600, fontSize: { xs: 12, md: 12 }, borderRadius: '24px' }}
                        disabled={(state.currentPage * state.staffPerPage >= state.staffList.length) || state.staffList.length === 0}
                        onClick={gotoNextPage} >
                        Next
                    </Button>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Search text box */}
                <SearchBox searchAnchor={state.searchAnchor} width={'300px'} mr={0}
                    placeholder='Search Staff' findValue={findStaff} itemKey='fullName'
                    menuClick={handleMenuClick} valueKey='email' />
            </Box>

            {/* Selected Staffs */}
            {Boolean(state.selectedStaff.length) && <Box sx={{
                display: 'flex', alignItems: 'center',
                flexWrap: 'wrap', px: 2, py: 1, bgcolor: '#FFF6F6'
            }}>
                {state.selectedStaff.map((email, index) => {
                    const staffRecord = state.staffList.find(record => record.email === email)
                    return <Box key={index} sx={{
                        display: 'flex', alignItems: 'center', mr: 2, mb: 1, py: 1, px: 1,
                        borderRadius: '8px', bgcolor: '#FBFBFB', border: '1px solid #1C1D221A'
                    }}>
                        {/* Profile picture */}
                        <ProfileAvatar {...{ src: staffRecord?.profilePicture, diameter: 15, fullName: staffRecord?.fullName, styleProp: { fontSize: 10, letterSpacing: 0 } }} />
                        {/* Fullname */}
                        <Typography sx={{ fontSize: 12, fontWeight: 600, ml: 1, mr: 2 }}>
                            {staffRecord?.fullName}
                        </Typography>
                        {/* Remove button */}
                        <CancelIcon sx={{ fontSize: 13, cursor: 'pointer', color: '#1C1D2266' }}
                            onClick={() => { removeStaff(email) }} />
                    </Box>
                })}
            </Box>}

            {/* List of staff */}
            <Box sx={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', px: 2, py: 1,
                mb: 0, height: 'calc(100vh - 20px)', overflowY: 'auto', alignItems: 'flex-start'
            }}>
                {state.staffList.slice(state.firstItem, state.lastItem).map(staff =>
                    <Box id={staff?.email} sx={{
                        display: 'flex', alignItems: 'center', cursor: 'pointer',
                        border: '1px solid rgba(28, 29, 34, 0.1)', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)',
                        borderRadius: '12px', mr: 2, mb: { xs: 1.5, md: 3 }, p: 1,
                    }} onClick={() => { selectStaff(staff?.email) }} >
                        {/* Checkbox */}
                        <Checkbox id={staff?.email}
                            sx={{ p: 0 }}
                            checked={state.selectedStaff.includes(staff?.email)} />

                        {/* Profile picture of staff */}
                        <ProfileAvatar {...{
                            src: staff?.profilePicture, diameter: 40, fullName: staff?.fullName,
                            styleProp: { mx: .5, mr: 2, }
                        }} />

                        {/* Name and role */}
                        <Box id={staff?.email} sx={{ width: { xs: '100%', md: '110px', } }} >
                            {/* Full name of staff */}
                            < Typography id={staff?.email} align="left" noWrap
                                sx={{ overflowX: 'clip', fontWeight: 600, fontSize: { xs: 13, md: 13 } }}>
                                {staff?.fullName}
                            </Typography>

                            {/* Role of staff */}
                            <Typography id={staff?.email} align="left" noWrap
                                sx={{
                                    py: .3, overflowX: 'clip', width: 'max-content',
                                    color: '#8D8D8D', fontWeight: 500, fontSize: { xs: 12, md: 12 }
                                }}>
                                {staff.role}
                            </Typography>
                        </Box>
                    </Box>
                )}

            </Box>
        </Box>
    </Slide>
}