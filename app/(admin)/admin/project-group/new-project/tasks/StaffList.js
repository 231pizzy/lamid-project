'use client'

import {
    Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Modal, Select, Tooltip, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';

import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import ExplanationIcon from '@mui/icons-material/ErrorOutline';

import { useEffect, useState, useRef, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import Filter from "./Filter";

import { v4 as uuid } from 'uuid';

import TimeSheet from "./TimeSheet";

import Profile from "./Profile";

import { openSnackbar } from "@/Components/redux/routeSlice";

import { ProfileAvatar } from "@/Components/ProfileAvatar";

import { SearchBox } from "@/Components/SearchBox";

import { useRouter } from "next/navigation";
import { getStaff } from "../../helper";


function StaffList(prop) {
    const dispatch = useDispatch();
    const router = useRouter();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);


    const goalData = useMemo(() => {
        return savedFormData.workPhases[prop.workPhaseKey].goals[prop.goalKey]
    }, [savedFormData.workPhases[prop.workPhaseKey].goals[prop.goalKey]])


    const [state, setState] = useState({
        searchValue: '', itemsPerPage: 10, firstItem: 1, lastItem: 10, currentPage: 1, showExplanation: true,
        staffList: [], showFilter: false, selectedStaff: {}, showTimeSheet: false, searchAnchor: useRef(null),
        showProfile: false, staffProfile: {}, listOfSelectedStaff: prop?.listOfSelectedStaff
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        getStaff({
            dataProcessor: (result) => {
                updateState({ staffList: [...result ?? []] })
            }
        });
    }, [])

    useEffect(() => {
        const firstItem = state.staffList.length ? 1 : 0;
        const lastItem = state.staffList.length >= 10 ? 10 : state.staffList.length;
        const currentPage = state.staffList.length ? 1 : 0;

        updateState({ firstItem: firstItem, lastItem: lastItem, currentPage: currentPage });
        prop.setStaffArray(state.staffList)
    }, [state.staffList])

    useEffect(() => {
        updateState({ listOfSelectedStaff: prop?.listOfSelectedStaff?.map(item => item?.email) })
    }, [prop])

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const gotoNext = (event) => {
        prop.gotoNext();
    }

    const closeFilter = (event) => {
        updateState({ showFilter: false })
    };

    const openFilter = (event) => {
        updateState({ showFilter: true })
    }

    const closeProfile = (event) => {
        updateState({ showProfile: false, staffProfile: {} })
    };

    const openProfile = (event) => {

        //   console.log('profile', event.currentTarget.id)
        const staffRecord = state.staffList.filter(item => item.email === event.currentTarget.id)

        updateState({ showProfile: true, staffProfile: staffRecord[0] })
    }

    const handleSelectStaff = (email) => {
        //add it to the list
        const staffRecord = state.staffList.find(item => item.email === email)
        //send the staff's record to the parent 
        prop.selectStaff(staffRecord)
        //add staff's email to the list of selected emails
        updateState({ listOfSelectedStaff: [...state.listOfSelectedStaff, email] })
    }

    const selectStaff = (event) => {
        event.stopPropagation()
        const email = event.currentTarget.id;

        console.log('selecting staff', email, state.listOfSelectedStaff);

        if (state.listOfSelectedStaff.includes(email)) {
            //send the email to the parent to do the needful
            prop.unSelectStaff(email);
            //remove it from the list
            updateState({ listOfSelectedStaff: state.listOfSelectedStaff.filter(staffEmail => staffEmail !== email) })
        }
        else {
            handleSelectStaff(email)
        }
    };

    const removeStaff = (email) => {
        prop.unSelectStaff(email);
    }

    const closeTimeSheet = (event) => {
        updateState({ showTimeSheet: false, selectedStaff: {} })
    }

    const closeExplanation = (event) => {
        updateState({ showExplanation: false })
    }

    const totalItems = useMemo(() => {
        return state.staffList.length
    }, [state.staffList]);

    const setSearchValue = (event) => {
        updateState({ searchValue: event.currentTarget.value })
    }

    const findStaff = (value, callback) => {
        searchForStaff(value, updateState, remoteRequest,
            dispatch, openSnackbar, navigate, callback)
    }

    const handleText = (event) => {
        updateState({ textInputValue: event.currentTarget.value })
    }

    const setItemsPerPage = (event) => {
        //    console.log('setting items per page');
        const value = event.target.value;
        const firstItem = totalItems ? 1 : 0;

        const lastItem = totalItems >= value ? value : (totalItems < value && totalItems > 0) ? totalItems : ''

        updateState({ itemsPerPage: value, firstItem: firstItem, lastItem: lastItem })
    }

    const buildSelectMenu = ({ bgcolor, itemList, value, onChangeHandle, stateKey }) => {
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormControl
                size='small'
                variant='outlined'
                sx={{ width: 'max-content', pr: 2, }}>
                <InputLabel  >   </InputLabel>
                <Select sx={{
                    fontSize: { xs: 12, md: 13 },
                    fontWeight: 500, border: '1px solid rgba(28, 29, 34, 0.1)',
                    color: '#333333', borderRadius: '16px', bgcolor: bgcolor
                }}
                    /*   startAdornment={<InputAdornment>
                          <Typography sx={{ fontSize: { xs: 12, md: 13 }, mr: 1 }}>
                              Staff Per Page:
                          </Typography>
                      </InputAdornment>} */
                    value={value}
                    //onChange={ (event)=>{addFilter(stateKey,item.name.toLowerCase())}}
                    onChange={onChangeHandle}
                    size='small' >
                    {itemList.map((item, indx) =>
                        <MenuItem key={indx}
                            value={item}
                            sx={{
                                fontSize: { xs: 12, md: 16 },
                                fontWeight: 500, color: '#333333',
                            }}>
                            <Typography sx={{
                                fontSize: { xs: 12, md: 13 }, fontWeight: 600,
                            }}>
                                {item}
                            </Typography>

                        </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    }

    const areAllTasksAssigned = () => {
        const tasksWithoutStaff = goalData.tasks.filter(task => !task.staff.length)
        //   console.log('tasksWithoutStaff', tasksWithoutStaff);

        return tasksWithoutStaff.length
    }

    const removeSearchBox = () => {
        // updateState({ showSearchBox: false })
    }

    const handleMenuClick = (email) => {
        console.log('clicked email', email)
        //Find the staff
        // handleViewProfile(email);
        if (!state.listOfSelectedStaff.includes(email)) {
            handleSelectStaff(email);
        }
        removeSearchBox()
    }

    const gotoPrevPage = () => {
    }

    const gotoNextPage = () => {
    }

    console.log('state staff', state)

    return (
        <Box sx={{ maxHeight: '100%', height: 'max-content', width: '50%' }}>
            {/* Heading */}
            <Box sx={{
                px: 3, py: 1, display: 'flex',
                alignItems: 'center', bgcolor: 'rgba(28, 29, 34, 0.04)',
            }}>
                <Typography sx={{
                    fontWeight: 700, display: 'flex', alignItems: 'center',
                    fontSize: { xs: 13, md: 14 },
                }}>
                    STAFF ({state.staffList.length})
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Search text box */}
                <SearchBox searchAnchor={state.searchAnchor}
                    placeholder='Search Staff' findValue={findStaff} itemKey='fullName'
                    handleMenuClick={handleMenuClick} valueKey='email' />

                {/*  <OutlinedInput
                    onChange={setSearchValue}
                    placeholder="Search staff"
                    name={nameValue}
                    startAdornment={<InputAdornment>
                        <SearchIcon sx={{ color: '#8D8D8D', fontSize: 20, mr: 2 }} />
                    </InputAdornment>}
                    type='text' value={state.searchValue}
                    sx={{ height: '40px', mr: { xs: 2, md: 3 }, width: '150px', color: '#8D8D8D', borderRadius: '16px', bgcolor: '#FBFBFB' }} /> */}

                {/* Filter button */}
                <Box sx={{
                    bgcolor: 'rgba(191, 6, 6, 0.1)', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)',
                    borderRadius: '16px', display: 'flex', cursor: 'pointer', alignItems: 'center', px: 1, py: 1, mr: 2
                }}
                    onClick={openFilter}>
                    <FilterIcon sx={{ color: '#5D5D5D', fontSize: 20, mr: .5 }} />
                    <Typography sx={{ color: '#5D5D5D', fontSize: { xs: 14, md: 15 } }}>
                        Filter
                    </Typography>
                </Box>


            </Box>

            {/* Brief info about page */}
            {state.showExplanation &&
                <Box sx={{
                    py: 1, px: 3,/*  width: 'max-content', */ display: 'flex',
                    alignItems: 'center', color: 'rgba(191, 6, 6, 0.8)', bgcolor: 'rgba(191, 6, 6, 0.08)',
                }}>
                    <ExplanationIcon sx={{ fontSize: 20, color: '#BF0606' }} />
                    <Typography sx={{ fontWeight: 400, fontSize: { xs: 12, md: 13 }, mx: 1 }}>
                        Staff displayed below are based on your pre-selected filters. Click on the <b>filter</b> icon to modify
                    </Typography>
                    <Close sx={{
                        borderRadius: '26.6667px', cursor: 'pointer',
                        bgcolor: 'rgba(191, 6, 6, 0.2)', color: '#BF0606', fontSize: 20
                    }} onClick={closeExplanation} />
                </Box>}

            {/* Selected Staff list */}
            {Boolean(state.listOfSelectedStaff.length) && <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 2, py: 2, bgcolor: '#FFF6F6' }}>
                {state.listOfSelectedStaff.map((email, index) => {
                    const staffRecord = state.staffList.find(record => record.email === email)
                    return <Box key={index} sx={{
                        display: 'flex', alignItems: 'center', mr: 2, mb: 1, py: 1, px: 1,
                        borderRadius: '8px', bgcolor: '#FBFBFB', border: '1px solid #1C1D221A'
                    }}>
                        {/* Profile picture */}
                        <ProfileAvatar {...{
                            src: staffRecord?.profilePicture, diameter: 20,
                            fullName: staffRecord?.fullName, styleProp: { fontSize: 10, letterSpacing: 0 }
                        }} />
                        {/* Fullname */}
                        <Typography sx={{ fontSize: 14, fontWeight: 600, ml: 1, mr: 2 }}>
                            {staffRecord?.fullName}
                        </Typography>
                        {/* Remove button */}
                        <Close sx={{ fontSize: 15, cursor: 'pointer', color: '#1C1D2266' }}
                            onClick={() => { removeStaff(email) }} />
                    </Box>
                })}
            </Box>}

            {/* Content */}
            <Box sx={{
                pt: 3, pb: 2, display: 'flex', maxHeight: '500px', overflowY: 'auto',
                justifyContent: 'space-evenly', flexWrap: 'wrap',
            }}>
                {state.staffList.slice(state.firstItem - 1, state.lastItem).map(staff => {
                    return <Box id={staff?.email} sx={{
                        display: 'flex', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(28, 29, 34, 0.1)', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.04)', borderRadius: '12px', mb: { xs: 1.5, md: 3 }, p: 1,
                    }} onClick={openProfile}>
                        {/* Checkbox */}
                        <Checkbox id={staff?.email} onClick={selectStaff} onChange={selectStaff} sx={{ p: 0 }}
                            checked={state.listOfSelectedStaff.includes(staff?.email)} />

                        {/* Profile picture of staff */}
                        <ProfileAvatar {...{
                            src: staff?.profilePicture, diameter: 56, fullName: staff?.fullName,
                            styleProp: { mx: 1 }
                        }} />
                        {/*   <Avatar id={staff?.email}
                            src={staff.profilePicture} sx={{ width: '40px', height: '40px', mx: .5 }} /> */}

                        {/* Name and role */}
                        <Box id={staff?.email} sx={{ width: { xs: '100%', md: '100px', }, px: .5, py: .5 }} >
                            {/* Full name of staff */}
                            <Tooltip id={staff?.email} title={staff.name}>
                                < Typography align="left" noWrap
                                    sx={{
                                        overflowX: 'clip', pb: .5,
                                        fontWeight: 600, fontSize: { xs: 13, md: 15 }
                                    }}>
                                    {staff.fullName}
                                </Typography>
                            </Tooltip>

                            {/* Role of staff */}
                            <Tooltip id={staff?.email} title={staff.role}>
                                <Typography align="left" noWrap
                                    sx={{
                                        overflowX: 'clip', color: '#8D8D8D', fontWeight: 600,
                                        fontSize: { xs: 13, md: 15 }, maxWidth: 'max-content'
                                    }}>
                                    {staff.role}
                                </Typography>
                            </Tooltip>

                            {/* View time sheet button */}
                            {/*  <Tooltip onClick={openTimeSheet} id={staff.email}
                                title={`view ${staff.name}'s time sheet for the duration of this task. `}>
                                <Typography id={staff.email} align="right" noWrap
                                    sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', color: '#BF0606', fontWeight: 600, fontSize: { xs: 11, md: 13 } }}>
                                    View time sheet
                                    <NextIcon id={staff.email}
                                        sx={{ display: 'flex', fontSize: 20, alignItems: 'center', ml: -.7, mr: -.5 }} />
                                </Typography>
                            </Tooltip> */}

                        </Box>
                    </Box>
                })}
            </Box>

            {/* Footer */}
            {Boolean(state.staffList?.length) && <Box sx={{ px: 5, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {/* Menu for Number of staff per page */}
                {/*    <Tooltip title='number of staff displayed '>
                    {buildSelectMenu({
                        itemList: Array.from({ length: Math.ceil(state.staffList.length / 5) }, (_, index) => (index + 1) * 5), value: state.itemsPerPage, onChangeHandle: setItemsPerPage,
                        stateKey: 'itemsPerPage', bgcolor: "#FBFBFB"
                    })}

                </Tooltip> */}

                {/* Previous button */}
                <Button variant="outlined" sx={{ minWidth: 0, width: '50px', fontWeight: 600, fontSize: { xs: 12, md: 13 }, borderRadius: '24px' }} disabled={state.firstItem <= 1}
                    onClick={gotoPrevPage}>
                    Prev
                </Button>

                {/* pagination */}
                <Typography sx={{ px: 2, fontWeight: 600, fontSize: { xs: 14, md: 15 } }}>

                    {`${state.firstItem.toLocaleString()}  ${state.lastItem ? '-' : ''}${state.lastItem.toLocaleString()} of ${totalItems.toLocaleString()}`}
                </Typography>

                {/* Next button */}
                <Button variant="outlined" sx={{ minWidth: 0, width: '50px', fontWeight: 600, fontSize: { xs: 12, md: 13 }, borderRadius: '24px' }} disabled={state.lastItem >= state.staffList.length}
                    onClick={gotoNextPage}>
                    Next
                </Button>
            </Box>}

            {/* Filter pop up */}
            <Modal open={state.showFilter} onClose={closeFilter}>
                <Filter closeFilter={closeFilter} />
            </Modal>

            {/* Time sheet pop up */}
            <Modal open={state.showTimeSheet} onClose={closeTimeSheet}>
                <TimeSheet staffRecord={state.selectedStaff} allTasks={goalData?.tasks} closeTimeSheet={closeTimeSheet} />
            </Modal>

            <Modal open={state.showProfile} onClose={closeProfile}>
                <Profile closeProfile={closeProfile} staffProfile={state.staffProfile} />
            </Modal>
        </Box >)
}

export default StaffList;