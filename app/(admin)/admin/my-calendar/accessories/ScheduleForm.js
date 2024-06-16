'use client'

import {
    Box, Typography, Button, RadioGroup, Radio, Checkbox, CircularProgress, OutlinedInput, Slide
} from "@mui/material";

import styles from '../Calendar.scss';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'react-calendar/dist/Calendar.css'

import CancelIcon from "@mui/icons-material/Close";

import NextIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openSnackbar, toggleBlockView } from "@/Components/redux/routeSlice";


import { v4 as uuid } from 'uuid';

import { ProfileAvatar } from "@/Components/ProfileAvatar";

import { SearchBox } from "@/Components/SearchBox";
import { getStaff, searchForStaff } from "../../staff/helper";
import { createSchedule, saveSheduleEdit } from "../helper";

const radioParam = [
    { label: 'Reminder', value: 'reminder', color: '#F29323' },
    { label: 'Event', value: 'event', color: '#03B203' },
    { label: 'Birthday', value: 'birthday', color: '#7745E1' }
];
/* 
const hours = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
const minutes = Array.from({ length: 60 }, (_, index) => index.toString()).map(item => item.length < 2 ? `0${item}` : item) */

const currentHour = moment().add(1, 'hour').format('h').toString();
const currentMinute = '0';
const currentPeriod = moment().format('a').toString();
const startHour = moment().format('h').toString();
const endHour = moment().add(1, 'hour').format('h').toString();

const period = ['am', 'pm'];

const Ahours = Array.from({ length: 4 }, (_, index) => index + 8);

const Phours = [12];
Array.from({ length: 4 }, (_, index) => Phours.push(index + 1));

//const availableHours = { am: ['8', '9', '10', '11'], pm: ['12', '1', '2', "3", '4'] }
const availableHours = Array.from({ length: 12 }, (_, index) => (index + 1).toString());


const defaultHour = { am: '8', pm: '12' };
const defaultMinute = '00';
const defaultPeriod = 'am';

const timeDefaults = { 0: defaultHour, 1: defaultMinute, 2: defaultPeriod }

//const selectedHour = availableHours[currentPeriod].includes(currentHour) ? currentHour : defaultHour[currentPeriod]

const minutes = ['0', '30'];

console.log('hours', Ahours);

function ScheduleForm({ scheduleArr, closeForm, stateController, editSchedule, submitAction, scheduleRecord }) {
    const dispatch = useDispatch();
    const disabledButtons = useSelector(state => state.route.disabledButtons);
    // const closeForm = closeForm;
    const calendarController = stateController;
    const schedules = scheduleArr

    const [state, setState] = useState({
        name: { value: scheduleRecord?.title ?? '', errMsg: '' },
        details: { value: scheduleRecord?.details ?? '', errMsg: '' },
        date: { value: scheduleRecord?.date ?? moment().format('yyyy-MM-DD'), errMsg: '' },
        startTIme: { value: scheduleRecord?.startTime ?? '', errMsg: '' },
        endTime: { value: scheduleRecord?.endTime ?? '', errMsg: '' },
        type: scheduleRecord?.type ?? '', notify: scheduleRecord?.notify ?? false,
        repeat: scheduleRecord?.repeat ?? false, firstItem: '', lastItem: '',
        inputStartTime: {
            value: scheduleRecord?.startTime ?
                moment(scheduleRecord.startTime).format('HH:mm')
                : moment().format('HH:mm'),
            modified: false, errMsg: ''
        }, searchValue: '', staffPerPage: 10, currentPage: 1, staffList: [], selectedStaff: scheduleRecord?.selectedStaff ?? [],
        inputEndTime: {
            value: scheduleRecord?.endTime ?
                moment(scheduleRecord.endTime).format('HH:mm')
                : moment().add(1, 'hour').format('HH:mm'), modified: false, errMsg: ''
        }, searchAnchor: useRef(null)
    });

    const timeIndex = { hour: 0, minute: 1, period: 2 };

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    };

    useEffect(() => {
        getStaff({
            list: true, dataProcessor: (result) => {
                if (result)
                    updateState({ staffList: result?.data ?? [] })
            }
        })
        //   getStaff(updateState, remoteRequest, dispatch, openSnackbar, navigate, true);

        // updateState({ firstItem: firstItem, lastItem: lastItem, currentPage: currentPage })
    }, [])


    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const validate = (event) => {
        const id = event.currentTarget.id;
        const value = event.currentTarget.value;

        if (!value && id === 'date') {
            updateState({ [id]: { value: moment().format('yyyy-MM-DD'), errMsg: 'Required' } })
        }
        else if (!value) {
            updateState({ [id]: { value: value, errMsg: 'Required' } })
        }
        else {
            updateState({ [id]: { errMsg: '', value: value } })
        }
    };

    const handleNotify = (event) => {
        updateState({ notify: !state.notify })
    };


    const handleRepeat = (event) => {
        updateState({ repeat: !state.repeat })
    }


    //Text box for name and description
    const textBox = ({ label, stateKey, type, placeholder, details, changeHandler, value }) => {
        return <Box sx={{ mb: 0 }}>
            <Typography sx={{
                display: 'flex',
                fontSize: { xs: 12, md: 13, }, fontWeight: 600,
                mb: 1, color: '#8D8D8D', whiteSpace: 'pre-wrap'
            }}>
                {label}

                {state[stateKey].errMsg && type !== 'date' && <Typography sx={{
                    fontSize: { xs: 8, md: 9, }, fontWeight: 700,
                    ml: .5, color: 'red', whiteSpace: 'pre-wrap'
                }}>
                    **required
                </Typography>}
            </Typography>

            <OutlinedInput id={stateKey} placeholder={placeholder} fullWidth multiline={details}
                rows={4} value={state[stateKey].value}
                type={type} onChange={validate}
                name={nameValue}
                sx={{
                    fontSize: { xs: 12, md: 14, }, height: '36px',
                    fontWeight: 500, color: '#333333',
                }}
            />

        </Box>

    };

    console.log('state createschedule', state);

    const handleTimeSelection = (key, index, value) => {
        console.log('called time handler');

        const currArr = [...state[key].value];
        currArr[index] = value;

        let finalValue = currArr;


        if (index === 1) {
            finalValue[index] = Number(value)
        }
        if (!value) {
            finalValue[index] = timeDefaults[index]
        }
        else if (index === 1 && Number(value) >= 60) {
            finalValue = [...state[key].value]
        }
        else if (index === 2) {
            finalValue[0] = defaultHour[value]
        }


        updateState({ [key]: { value: [...finalValue], modified: true, errMsg: '' } })
    }

    const findStaff = (value, callback) => {
        searchForStaff({
            name: value, dataProcessor: (result) => {
                callback(result);
            }
        })
        /*  searchForStaff(value, updateState, remoteRequest,
             dispatch, openSnackbar, navigate, callback) */
    }

    const removeSearchBox = () => {
        // updateState({ showSearchBox: false })
    }

    const handleMenuClick = (email) => {
        //Find the staff
        // handleViewProfile(email);
        if (!state.selectedStaff.includes(email)) {
            updateState({ selectedStaff: [...state.selectedStaff, email] })
        }
        removeSearchBox()
    }

    const handleScheduleType = (event) => {
        console.log('type value', event.target.value);
        updateState({ type: event.target.value })
    }

    const handleSubmit = (event) => {
        if (state.date.value && state.name.value && state.details.value && state.type && state.selectedStaff.length &&
            state.inputStartTime.value && state.inputEndTime.value) {

            const dataObject = {
                date: state.date.value, startTime: moment(state.inputStartTime.value, 'HH:mm').format('h:mm a'),
                endTime: moment(state.inputEndTime.value, 'HH:mm').format('h:mm a'), label: state.name.value,
                description: state.details.value, notify: state.notify, repeat: state.repeat, type: state.type,
                selectedStaff: state.selectedStaff
            };

            editSchedule ? saveSheduleEdit({
                dataObject: dataObject, id: scheduleRecord.id, dataProcessor: (result) => {
                    if (result) {
                        console.log('changes saved', result);

                        dispatch(openSnackbar({ message: 'Changes have been saved', severity: 'success' }))
                        closeForm(true);
                        const index = schedules.findIndex((item) => item.id === id);
                        console.log('index', index);

                        schedules[index] = {
                            ...dataObject, id: result
                        };

                        calendarController({
                            calendar: [...schedules]
                        })


                    }
                }
            })/*  saveChanges(event, scheduleRecord.id, state.date.value,
                moment(state.inputStartTime.value, 'HH:mm').format('h:mm a'),
                moment(state.inputEndTime.value, 'HH:mm').format('h:mm a'), state.name.value, state.details.value,
                state.notify, state.repeat, state.type, navigate, updateState, dispatch, remoteRequest,
                openSnackbar, toggleBlockView, closeForm, calendarController, schedules, state.selectedStaff) */

                : createSchedule({
                    dataObject: { ...dataObject }, dataProcessor: (result) => {
                        if (result) {
                            closeForm();

                            calendarController({
                                calendar: [...schedules, { ...dataObject, id: result }]
                            })

                            dispatch(openSnackbar({ message: '1 new schedule has been created', severity: 'success' }))
                        }
                    }
                })

            /*  saveSchedule(event, state.date.value, moment(state.inputStartTime.value, 'HH:mm').format('h:mm a'),
                 moment(state.inputEndTime.value, 'HH:mm').format('h:mm a'), state.name.value, state.details.value,
                 state.notify, state.repeat, state.type, navigate, updateState, dispatch, remoteRequest,
                 openSnackbar, toggleBlockView, closeForm, calendarController, schedules, state.selectedStaff); */
        }
        else {
            dispatch(openSnackbar({ message: 'Some required data are missing', severity: 'error' }))
        }
    }

    const gotoNextPage = () => {
        updateState({ currentPage: state.currentPage + 1 })
    }

    const removeStaff = (email) => {
        updateState({ selectedStaff: state.selectedStaff.filter(staffEmail => staffEmail !== email) })
    }

    const gotoPrevPage = () => {
        updateState({ currentPage: state.currentPage - 1 })
    }

    const selectStaff = (email) => {
        //const email = event.currentTarget.id;
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

    console.log('schedule form view state', state)

    return (
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Box className='calendarClass' sx={{
                maxWidth: { xs: '90%', md: '70%', lg: '50%', },
                bgcolor: 'white', pb: 4,
                position: 'absolute', top: 0, right: 0,
                borderRadius: '16px 0 0 16px', height: '100vh', overflowY: 'hidden'
            }}>
                {/* Toolbar */}
                <Box sx={{
                    bgcolor: 'white', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                    display: 'flex', px: 4, py: 2, alignItems: 'center'
                }}>
                    {/* Cancel button */}
                    <CancelIcon onClick={closeForm}
                        sx={{ mr: 2, height: 24, width: 24, color: 'black' }} />

                    {/* Page title */}
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 13, md: 15 } }}>
                        {editSchedule ? 'EDIT' : 'CREATE'} SCHEDULE
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Submit button */}
                    <Button id='createAdminSchedule' variant='contained' sx={{
                        width: { xs: '60px', md: '130px' },
                        fontWeight: 700, fontSize: { xs: 11, md: 12 }
                    }} disabled={buttonActive('createAdminSchedule')}
                        onClick={handleSubmit}>
                        {buttonActive('createAdminSchedule') &&
                            <CircularProgress id='createAdminSchedule' size={20}
                                sx={{ mr: 2, color: '#08e8de' }} />}

                        {editSchedule ? 'Save' : 'Create Schedule'}
                    </Button>
                </Box>

                <Box sx={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <Box sx={{
                        maxWidth: '100%', px: 4, py: 2
                    }}>
                        {/* Name */}
                        {textBox({ label: 'SCHEDULE TITLE', stateKey: 'name', type: 'text', placeholder: 'eg. Design review', details: false, })}

                        {/* Radio buttons for selecting type of schedule */}
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ color: '#1C1D224D', fontSize: 14, fontWeight: 600 }}>
                                TYPE OF SCHEDULE
                            </Typography>
                            <Box fullWidth sx={{ display: 'flex', pb: 2 }} >
                                {radioParam.map((param, index) =>
                                    <RadioGroup key={index}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'flex-start', mr: 3, py: 1
                                        }}>
                                            <Radio id={param.value} onChange={handleScheduleType}
                                                checked={(state.type === param.value) ?
                                                    true : false} value={param.value}
                                                sx={{ p: 0, mr: 1 }}
                                            />
                                            <Typography sx={{
                                                display: 'flex', alignItems: 'flex-end',
                                                justifyContent: 'center',
                                                fontSize: { xs: 12, md: 13, }, fontWeight: 600,
                                                color: param.color, whiteSpace: 'pre-wrap'
                                            }}>
                                                {param.label}
                                            </Typography>
                                        </Box>
                                    </RadioGroup>)}
                            </Box>
                        </Box>

                        {/* Event address */}
                        {textBox({ label: 'EVENT ADDRESS', stateKey: 'details', type: 'url', placeholder: 'eg. www.example.com' })}

                        {/* Date, start time and end time */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', mt: 2 }}>
                            <Box sx={{ mb: 2, mr: 4 }}>
                                {/* Date */}
                                {textBox({ label: 'DATE', stateKey: 'date', type: 'date', details: false })}
                            </Box>

                            <Box sx={{ mb: 2, mr: 4 }}>
                                {/* Date */}
                                {textBox({ label: 'START TIME', stateKey: 'inputStartTime', type: 'time', details: false })}
                            </Box>

                            <Box sx={{ mb: 2, mr: 4 }}>
                                {/* Date */}
                                {textBox({ label: 'END TIME', stateKey: 'inputEndTime', type: 'time', details: false })}
                            </Box>

                            {/*   <Box sx={{ mb: 2, mr: 4 }}> 
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {timeSelectionMenu('inputStartTime', 'START TIME')}
                                </Box>
                            </Box> */}

                            {/* End time */}
                            {/*   <Box sx={{ mb: 2 }}>
                                {timeSelectionMenu('inputEndTime', 'END TIME')}
                            </Box> */}
                        </Box>

                        {/* Noftify */}
                        {/*   <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                            <Checkbox checked={state.notify} />
                            <Typography sx={{
                                fontSize: { xs: 12, md: 13, }, fontWeight: 500,
                                color: 'black', whiteSpace: 'pre-wrap', cursor: 'pointer'
                            }} onClick={handleNotify}>
                                Send a notification to all participants 10 minutes before schedule time
                            </Typography>
                        </Box> */}
                    </Box>

                    {/* Participants */}
                    <Box sx={{}}>
                        {/* Heading */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, bgcolor: 'rgba(28, 29, 34, 0.06)' }}>
                            {/* Label */}
                            <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 17 } }}>
                                Schedule Participants
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* Search text box */}
                            <SearchBox searchAnchor={state.searchAnchor}
                                placeholder='Search Staff' findValue={findStaff} itemKey='fullName'
                                menuClick={handleMenuClick} valueKey='email' />
                        </Box>

                        {/* Selected Staff list */}
                        {Boolean(state.selectedStaff.length) && <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 2, py: 2, bgcolor: '#FFF6F6' }}>
                            {state.selectedStaff.map((email, index) => {
                                const staffRecord = state.staffList.find(record => record.email === email)
                                return <Box key={index} sx={{
                                    display: 'flex', alignItems: 'center', mr: 2, mb: 1, py: 1, px: 1,
                                    borderRadius: '8px', bgcolor: '#FBFBFB', border: '1px solid #1C1D221A'
                                }}>
                                    {/* Profile picture */}
                                    <ProfileAvatar {...{ src: staffRecord?.profilePicture, diameter: 20, fullName: staffRecord?.fullName, styleProp: { fontSize: 10, letterSpacing: 0 } }} />
                                    {/* Fullname */}
                                    <Typography sx={{ fontSize: 14, fontWeight: 600, ml: 1, mr: 2 }}>
                                        {staffRecord?.fullName}
                                    </Typography>
                                    {/* Remove button */}
                                    <CancelIcon sx={{ fontSize: 15, cursor: 'pointer', color: '#1C1D2266' }}
                                        onClick={() => { removeStaff(email) }} />
                                </Box>
                            })}
                        </Box>}

                        {/* Content */}
                        <Box sx={{
                            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', px: 2, py: 1,
                            mb: 4, maxHeight: '200px', overflowY: 'scroll'
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
                                        src: staff?.profilePicture, diameter: 56, fullName: staff?.fullName,
                                        styleProp: { mx: .5, mr: 2, }
                                    }} />

                                    {/* Name and role */}
                                    <Box id={staff?.email} sx={{ width: { xs: '100%', md: '110px', } }} >
                                        {/* Full name of staff */}
                                        < Typography id={staff?.email} align="left" noWrap
                                            sx={{ overflowX: 'clip', fontWeight: 600, fontSize: { xs: 13, md: 15 } }}>
                                            {staff?.fullName}
                                        </Typography>

                                        {/* Role of staff */}
                                        <Typography id={staff?.email} align="left" noWrap
                                            sx={{
                                                py: .3, overflowX: 'clip', width: 'max-content',
                                                color: '#8D8D8D', fontWeight: 500, fontSize: { xs: 13, md: 15 }
                                            }}>
                                            {staff.role}
                                        </Typography>

                                        {/* View time sheet button */}
                                        <Button variant="text" id={staff.email} align="left" noWrap
                                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#BF0606', fontWeight: 600, fontSize: { xs: 11, md: 13 }, p: 0 }}>
                                            See more
                                            <NextIcon id={staff.email}
                                                sx={{ display: 'flex', fontSize: 20, alignItems: 'center', ml: -.7, mr: -.5 }} />
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                            {/* Pagination */}
                            <Box sx={{
                                px: 5, pb: 3, display: 'flex', justifyContent: 'flex-end',
                                alignItems: 'center', width: '100%'
                            }}>
                                {/* Previous button */}
                                <Button variant="outlined" sx={{
                                    minWidth: 0, p: 0, width: '50px',
                                    fontWeight: 600, fontSize: { xs: 12, md: 13 }, borderRadius: '24px'
                                }}
                                    disabled={state.currentPage <= 1}
                                    onClick={gotoPrevPage}>
                                    Prev
                                </Button>

                                {/* pagination */}
                                <Typography sx={{ px: 2, fontWeight: 600, fontSize: { xs: 14, md: 15 } }}>

                                    {paginationLabel}

                                </Typography>

                                {/* Next button */}
                                <Button variant="outlined" sx={{ minWidth: 0, p: 0, width: '50px', fontWeight: 600, fontSize: { xs: 12, md: 13 }, borderRadius: '24px' }}
                                    disabled={(state.currentPage * state.staffPerPage >= state.staffList.length) || state.staffList.length === 0}
                                    onClick={gotoNextPage} >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Slide>
    )
}

export default ScheduleForm;