'use client'

import {
    Box, Button, Card, Grid, Typography, IconButton, Select, MenuItem, InputLabel,
    Avatar, Divider, Badge, OutlinedInput, InputAdornment, FormControl, CircularProgress, Modal
} from "@mui/material";


import { v4 as uuid } from 'uuid';
import Delete from "@mui/icons-material/CloseOutlined";

import Camera from "@mui/icons-material/AddAPhotoOutlined";

import AddIcon from "@mui/icons-material/AddOutlined";

import VisibilityOn from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PlayIcon from '@mui/icons-material/PlayArrow';

import { lighten } from '@mui/material/styles';

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar, setDashboardView, setPageTitle, toggleBlockView } from "@/Components/redux/routeSlice";
import { getStaff, isEmailTaken } from "../staff/helper";
import { useRef } from "react";
import { getBoxTop } from "@/Components/getBoxTop";
import { useRouter } from "next/navigation";
import BioSection from "./BioSection";
import QualificationSection from "./QualificationSection";
import moment from "moment";
import { checkPassword, updateStaff } from "./helper";


const teams = ['Management', 'Design', 'Development', 'Operations', 'Security'];

const workExperienceData = [
    { label: 'Role', stateKey: 'role', type: 'text', placeholder: 'Eg. consultant' },
    { label: 'Company Name', stateKey: 'company', type: 'text', placeholder: 'Eg. Lamid consultant' },
    { label: 'Start Date', stateKey: 'startDate', type: 'date', placeholder: 'Eg. 25th Mar 2022' },
    { label: 'End Date', stateKey: 'endDate', type: 'date', placeholder: 'Eg. 25th Mar 2023' },
    { label: 'Job Summary', stateKey: 'description', type: 'text', placeholder: 'Eg. Share experience here', summary: true },
]

const educationData = [
    { label: 'Course', stateKey: 'course', type: 'text', placeholder: 'Eg. Medicine' },
    { label: 'School Name', stateKey: 'school', type: 'text', placeholder: 'Eg. University of Benin' },
    { label: 'Start Date', stateKey: 'startDate', type: 'date', placeholder: 'Eg. 25th Mar 2022' },
    { label: 'End Date', stateKey: 'endDate', type: 'date', placeholder: 'Eg. 25th Mar 2023' },
    { label: 'Summary', stateKey: 'description', type: 'text', placeholder: 'Eg. Share experience here', summary: true },
]

const roleDataLabels = ['Project Group', 'Role'];

const emailPattern = /^([\w|+|\-|_|~|\.])+[@]([\w])+\.[a-z]+$/i;

export default function EditProfile() {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const router = useRouter();

    const disabledButtons = useSelector(state => state.route.disabledButtons);

    const [state, setState] = useState({
        email: { value: '', errMsg: '' }, phone: { value: '', errMsg: '' },
        fullName: { value: '', errMsg: '' }, password: { value: '', errMsg: '' },
        team: { value: '', errMsg: '' },
        birthday: { value: '', errMsg: '' },
        role: { value: '', errMsg: '' }, projectGroup: '', ref: null,
        projectGroupRole: '', originalPassword: '',
        workExperience: { value: [], errMsg: '' }, originalEmail: '',
        education: { value: [], errMsg: '' }, skills: { value: [], errMsg: '' },
        image: { value: 'default.jpg', errMsg: '' },
        originalImage: 'default.jpg', openPasswordModal: false,
        languages: { value: [], errMsg: '' },
        projectColor: '', newExperience: {}, newEducation: {}, newTool: '', dataLoaded: false,
        newKnowledge: '', newLanguage: '', showPassword: false, hiddenItems: [], addNewItem: [],
        currentPassword: { value: '', errMsg: '' }, password1: { value: '', errMsg: '' }, password2: { value: '', errMsg: '' }
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Profile' }))
        updateState({ ref: ref })

        getStaff({
            dataProcessor: (result) => {
                const resultObj = result?.data ?? {}
                updateState({
                    email: { value: resultObj?.email, errMsg: '' }, phone: { value: resultObj?.phone, errMsg: '' },
                    fullName: { value: resultObj?.fullName, errMsg: '' }, password: { value: resultObj?.password, errMsg: '' },
                    team: { value: resultObj?.team, errMsg: '' },
                    birthday: { value: moment(resultObj?.birthday, 'DD/MM/yyyy').format('yyyy-MM-DD').toString(), errMsg: '' },
                    role: { value: resultObj?.role, errMsg: '' }, projectGroup: resultObj?.projectGroup,
                    projectGroupRole: resultObj?.projectGroupRole, originalPassword: resultObj?.password,
                    workExperience: { value: [...resultObj?.workExperience], errMsg: '' }, originalEmail: resultObj?.email,
                    education: { value: [...resultObj?.education], errMsg: '' },
                    skills: { value: [...resultObj?.skills], errMsg: '' },
                    image: { value: resultObj?.profilePicture ?? 'default.jpg', errMsg: '' },
                    originalImage: resultObj?.profilePicture ?? 'default.jpg', openPasswordModal: false,
                    languages: { value: [...resultObj?.languages], errMsg: '' },
                    projectColor: resultObj?.projectColor, dataLoaded: true
                })
            }
        });



        //  getAdminProfile(state, updateState, navigate, remoteRequest, dispatch, openSnackbar, true);
    }, []);

    //generate unique name for text field
    let nameValue = uuid()

    const roleData = [state.projectGroup, state.projectGroupRole];

    const buttonActive = (id) => {
        return disabledButtons.includes(id);
    }

    const validate = (event) => {
        const id = event.currentTarget.id;
        const value = event.currentTarget.value;

        if (!value) {
            updateState({ [id]: { value: value, errMsg: 'Required' } })
        }
        else if (id === 'email') {
            return (emailPattern.test(value))
                ? handleTextInput(event)
                :
                updateState({ [id]: { value: value, errMsg: 'Invalid email' } })
        }
        else {
            handleTextInput(event);
        }
    };

    const togglePanel = (event) => {
        const key = event.currentTarget.id;

        if (state.hiddenItems.includes(key)) {
            //remove the key from the list of hidden items
            updateState({ hiddenItems: state.hiddenItems.filter(item => item !== key) })
        }
        else {
            //add the key to the list of hidden items
            updateState({ hiddenItems: [...state.hiddenItems, key] })
        }
    };

    const handleGotoProfile = (event) => {
        console.log('clicked');
        router.replace('/admin/my-profile',)
    };

    const handleGotoIndexPage = (event) => {
        router.replace('/');
    }

    const handleSkill = (key, index, value) => {
        const newValue = [...state[key].value];
        newValue[index] = value;
        updateState({
            [key]: { errMsg: '', value: [...newValue] },
            addNewItem: state.addNewItem.filter(item => item !== key)
        })
    }

    const handleDeleteSkill = (key, index) => {
        console.log('key', key, index)
        const arr = [...state[key].value]
        arr.splice(index, 1);
        console.log('arr', arr);

        updateState({ [key]: { errMsg: '', value: arr } })
    }

    const handleAddSkill = (event) => {
        const key = event.currentTarget.id
        const newArr = [...state[key].value];
        newArr.push('');
        updateState({ [key]: { errMsg: '', value: newArr } })
    }

    const handleAddExperience = (event) => {
        const key = event.currentTarget.id
        const newArr = [...state[key].value];
        newArr.push({
            role: '', company: '', startDate: { day: '12', month: 'May', year: '2022' },
            endDate: { day: '12', month: 'May', year: '2022' }, description: ''
        });
        updateState({ [key]: { errMsg: '', value: newArr } })
    }

    const handleAddEducation = (event) => {
        const key = event.currentTarget.id
        const newArr = [...state[key].value];
        newArr.push({
            school: '', course: '', startDate: { day: '12', month: 'May', year: '2022' },
            endDate: { day: '12', month: 'May', year: '2022' }, description: ''
        });
        updateState({ [key]: { errMsg: '', value: newArr } })
    }

    const handleTextInput = (event) => {
        const key = event.currentTarget.id;
        const value = event.currentTarget.value;
        console.log('Handling text', key, value);

        updateState({ [key]: { errMsg: '', value: value } })
    }

    const handleEduExpTextInput = (value, key, category, index, type) => {
        //category could be workExperience or education 
        //grab the required field, update it and save the changes to the state
        const field = { ...state[category].value[index] }
        /*   if (type !== 'date') { */
        field[key] = value;
        /*  }
         else {
             const date = new Date(value);
             const dateArr = date.toDateString().split(' ');
             field[key].day = Number(dateArr[2]) + 1
             field[key].month = dateArr[1]
             field[key].year = dateArr[3]
         } */

        const newV = [...state[category].value]
        newV[index] = field
        console.log('field', field, 'newV', newV);
        updateState({ [category]: { errMsg: '', value: newV } })
    }

    const handleTeam = (event) => {
        console.log('team selected')
        updateState({ team: { errMsg: '', value: event.target.value } })
    }

    const handleFileSelect = (event) => {
        console.log('image selected');

        updateState({ image: { errMsg: '', value: event.target.files[0] } });
        event.target.value = null
    }

    const handlePasswordVisibility = (event) => {
        updateState({ showPassword: !state.showPassword })
    }

    const validateEmail = (callback) => {
        /* Check if email is valid and if it already exists */
        const email = state.email.value

        if (email === state.originalEmail) {
            //There is a possibility that the email is still the same as the original one.
            //In that case, there is no need for any validation. Just invoke the callback
            callback ? callback() : () => { }
        }
        else if (emailPattern.test(email)) {
            isEmailTaken({
                email: email, dataProcessor: (isTaken) => {
                    if (isTaken) {
                        updateState({ errMsg: { ...state.errMsg, email: 'Choose a different email.' } })
                        dispatch(openSnackbar({ message: 'Choose a different email.', severity: 'error' }))
                    }
                    else {
                        callback ? callback() : () => { }
                    }
                }
            })
        }
        else {
            updateState({ email: { value: email, errMsg: 'Invalid email' } })
            dispatch(openSnackbar({ message: 'Please use a properly formatted email.', severity: 'error' }))
        }
    }

    const handleSaveChanges = (event) => {
        //Chack if the format of the email is correct and the email is not being used by another user
        validateEmail(() => {
            const workExperience = [];
            const education = [];

            //get only the records with no missing fields
            for (let obj of state.workExperience.value) {
                console.log('obj', obj)
                const len = Object.values(obj).filter(item => Boolean(item)).length;
                console.log('length', len);
                if (len === 5) workExperience.push(obj) //There are 5 required keys in the each experience
            }
            console.log('final experience', workExperience);

            //get only the records with no missing fields
            for (let obj of state.education.value) {
                console.log('obj', obj)
                const len = Object.values(obj).filter(item => Boolean(item)).length;
                console.log('length', len);
                if (len === 5) education.push(obj) //There are 5 required keys in the each experience
            }
            console.log('final education', education);

            //get only the records with no blank fields
            const languages = state.languages.value.filter(item => item.length)

            console.log('languages', languages)

            if (state.email.value && state.phone.value && state.fullName.value &&
                state.password.value && state.role.value && (!state.email.errMsg ||
                    !state.phone.errMsg || !state.fullName.errMsg || !state.password.errMsg
                    || !state.role.errMsg)) {
                console.log('good to go');

                const emailChanged = state.originalEmail !== state.email.value

                const dataObject = {
                    email: state.email.value, phone: state.phone.value, password: state.password.value, team: state.team.value,
                    fullName: state.fullName.value, imageChanged: (state.image.value instanceof File),
                    passwordChanged: state.originalPassword !== state.password.value, role: state.role.value,
                    workExperience: state.workExperience.value, education: state.education.value, languages: state.languages.value,
                    skills: state.skills.value, emailChanged: emailChanged, originalFilename: state.originalImage
                }

                updateStaff({
                    email: state.originalEmail, profilePicture: state.image.value, dataObject: dataObject,
                    dataProcessor: (result) => {
                        dispatch(openSnackbar({ message: 'Profile update saved', severity: 'success' }));
                        emailChanged ? handleGotoIndexPage() : handleGotoProfile();
                    }
                })

                /*  saveChanges(event, state.originalImage !== state.image.value, state.originalImage,
                     state.originalPassword !== state.password.value,
                     state.originalEmail !== state.email.value, state.team.value, navigate,
                     state.email.value, state.phone.value, state.fullName.value, state.image.value,
                     state.password.value, state.role.value, workExperience, education,
                     languages, updateState, dispatch, remoteRequest, openSnackbar, toggleBlockView) */
            }
            else {
                dispatch(openSnackbar({ message: 'Some required data is missing ', severity: 'error' }));
            }
        })
    }

    const formatDate = (year, month, day,) => {
        const date = new Date(`${year}-${month}-${day}`);
        try {
            return date?.toISOString().slice(0, 10)
        } catch (error) {
            return '1990-01-01'
        }

    };

    //For Biodata
    const textElement = (label, stateKey, type, placeholder, index) => {
        return <Box sx={{ mb: 2, pr: { xs: 2, sm: 4, md: 3 } }}>
            {/* Textfield label */}
            <Typography align='left' sx={{
                fontSize: { xs: 12, md: 14, }, fontWeight: 600,
                mb: 1, color: '#8D8D8D', whiteSpace: 'pre-wrap'
            }}>
                {label}
            </Typography>

            {/* Textfield rendered conditionally.
            The textfield for password is a bit different from the others */}
            {type === 'password' ? <OutlinedInput fullWidth id={stateKey} placeholder={placeholder}
                value={state[stateKey].value} name={nameValue}
                type={state.showPassword ? 'text' : 'password'} endAdornment={
                    <InputAdornment position="end" >
                        <IconButton end='edge'
                            onClick={handlePasswordVisibility} >
                            {state.showPassword ? <VisibilityOn /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>}
                onChange={validate}
                sx={{
                    p: 0,
                    fontSize: { xs: 12, md: 14, },
                    fontWeight: 500, color: '#333333',
                    height: '40px'
                }}
            /> :
                <OutlinedInput placeholder={placeholder} id={stateKey}
                    value={state[stateKey].value}
                    type={type}
                    onChange={validate}
                    sx={{
                        fontSize: { xs: 12, md: 13, },
                        fontWeight: 500, color: '#333333',
                        height: '40px', width: '100%'
                    }}
                />}
            {state[stateKey].errMsg && <InputLabel id='password-id' sx={{ mb: 0, }}>
                <Typography variant='body1' sx={{
                    ml: 2,
                    color: '#BF0606',
                    fontSize: 12, lineHeight: '24.51px'
                }}>
                    {state[stateKey].errMsg}
                </Typography>
            </InputLabel>}
        </Box>
    };

    //For work experience and education
    const workExperienceTextbox = (label, stateKey, type, placeholder, index, summary, mainStateKey) => {
        return <Box
            sx={{ pl: 2, pr: { xs: 2, sm: 4, md: 3 }, mb: summary ? 6 : 2, width: summary ? '100%' : 'inherit' }}>

            <Typography sx={{
                fontSize: { xs: 12, md: 13, }, fontWeight: 600,
                mb: 1, color: '#8D8D8D', whiteSpace: 'pre-wrap'
            }}>
                {label}
            </Typography>

            <OutlinedInput id={stateKey} placeholder={placeholder} fullWidth={summary} multiline={summary}
                rows={4} onChange={(event) => {
                    handleEduExpTextInput(event.currentTarget.value, stateKey, mainStateKey, index, type)
                }}
                name={nameValue}
                value={state[mainStateKey].value[index][stateKey] /* type !== 'date'
                    ? state[mainStateKey].value[index][stateKey]
                    : formatDate(state[mainStateKey].value[index][stateKey]?.year,
                        state[mainStateKey].value[index][stateKey]?.month,
                        state[mainStateKey].value[index][stateKey]?.day) */}
                type={type}

                sx={{
                    width: '100%',
                    fontSize: { xs: 12, md: 13, },
                    fontWeight: 500, color: '#333333',
                    height: summary ? 'auto' : '40px'
                }}
            />

        </Box>

    };

    const setPhoneNumber = (value) => {
        updateState({ phone: { value: value, errMsg: '' } })
    }

    //For skills
    const skillsTexbox = (stateKey, type, placeholder, index) => {
        return <OutlinedInput id={stateKey} placeholder={placeholder}
            value={state[stateKey].value[index]}
            name={nameValue}
            type={type}
            onChange={(event) => { handleSkill(stateKey, index, event.currentTarget.value) }}
            sx={{
                mb: 1,
                fontSize: { xs: 11, md: 13, },
                fontWeight: 600, color: '#333333',
                height: '40px'
            }}
        />
    }

    const validatePassword = (event) => {
        /* Confirm the current password from server */
        checkPassword({
            password: state.currentPassword.value, dataProcessor: (match) => {
                if (!match) {
                    updateState({ currentPassword: { value: state.currentPassword.value, errMsg: 'Invalid password' } });
                }
                else {
                    const currentPassword = { currentPassword: { value: state.currentPassword.value, errMsg: '' } }
                    if (!state.password1.value) {
                        updateState({ password1: { value: state.password1.value, errMsg: 'Required' }, ...currentPassword })
                    }
                    else if (!state.password2.value) {
                        updateState({ password2: { value: state.password2.value, errMsg: 'Required' }, ...currentPassword })
                    }
                    else if (state.password1.value !== state.password2.value) {
                        updateState({
                            password2: { value: state.password2.value, errMsg: 'Password does not match' },
                            ...currentPassword
                        })
                    }
                    else {
                        updateState({ password: { value: state.password1.value, errMsg: '' }, ...currentPassword })
                        closePasswordModal();
                    }

                }
            }
        })
    }

    const openPasswordModal = () => {
        updateState({
            openPasswordModal: true, currentPassword: { value: '', errMsg: '' }
            , password1: { value: '', errMsg: '' }, password2: { value: '', errMsg: '' }
        })
    }

    const closePasswordModal = () => {
        updateState({ openPasswordModal: false })
    }

    console.log('state', state);

    return (
        state.dataLoaded &&
        <Box sx={{ maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden', maxWidth: '100%', }}>
            {/* Toolbar */}
            <Box sx={{
                bgcolor: '#FFFFFF', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                display: 'flex', px: 2, py: 2, alignItems: 'center', maxHeight: 'max-content'
            }}>
                <Typography sx={{
                    color: '#8D8D8D', cursor: 'pointer', fontWeight: 700, fontSize: { xs: 13, sm: 15 }
                }} onClick={handleGotoProfile}>
                    Profile
                </Typography>

                <PlayIcon
                    sx={{ mx: 1, fontSize: 14, color: '#black' }} />

                <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 15 } }}>
                    Edit profile
                </Typography>

                {/* Push the remaining content to the end of the row */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Save button */}
                <Button id='saveProfileChanges' variant='contained' onClick={handleSaveChanges} sx={{
                    m: 0, mr: 1, height: '32px', fontWeight: 600, fontSize: { xs: 11, sm: 11 }
                }} disabled={buttonActive('saveProfileChanges')}>

                    {buttonActive('saveProfileChanges') && <CircularProgress id='saveProfileChanges' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}

                    Save Changes

                </Button>

            </Box>

            {/* Body */}
            <Box ref={state.ref} sx={{
                border: '0px solid rgba(28, 29, 34, 0.1)', maxHeight: { xs: 'calc(100vh - 10vh)', md: 'calc(100vh - 150px)' },
                pt: 2, overflowY: 'scroll'
            }}>
                <Box sx={{
                    display: 'flex',/*  alignItems: 'stretch', */ flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: { md: 'wrap', lg: 'nowrap' },
                }}>
                    <BioSection {...{
                        image: state.image.value,
                        fullName: state.fullName.value, email: state.email.value,
                        phone: state.phone.value, role: state.role.value, handleTextInput: handleTextInput,
                        setPhoneNumber: setPhoneNumber, handleTeam: handleTeam, selectedTeam: state.team.value,
                        listOfTeams: teams, roleData: roleData, handleFileSelect: handleFileSelect,
                        openPasswordModal: openPasswordModal, projectColor: state.projectColor, birthday: state.birthday.value
                    }} />

                    <Box sx={{ flexGrow: 1 }} />

                    {/*Qualification Section */}
                    <QualificationSection {...{
                        workExperience: state.workExperience.value, education: state.education.value,
                        handleAddEducation: handleAddEducation, handleAddExperience: handleAddExperience,
                        handleAddSkill: handleAddSkill, workExperienceTextbox: workExperienceTextbox,
                        handleDeleteSkill: handleDeleteSkill, togglePanel: togglePanel, hiddenItems: state.hiddenItems,
                        skillsTexbox: skillsTexbox, skills: state.skills.value, languages: state.languages.value
                    }} />
                </Box>
                {/* Bio data and role section */}


            </Box>

            <Modal open={state.openPasswordModal} onClose={closePasswordModal}>
                <Box align='center' sx={{
                    position: 'absolute', left: '50%', top: '50%', maxWidth: 'max-content', px: 4, py: 2,
                    transform: 'translate(-50%,-50%)', bgcolor: 'white'
                }}>
                    {/* Label */}
                    <Typography align='center' sx={{ fontWeight: 600, fontSize: 16, mb: 2 }}>
                        Update Password
                    </Typography>
                    {/* Current Password */}
                    {textElement('Current Password', 'currentPassword', 'password', 'Current password')}
                    {/* New password */}
                    {textElement('New Password', 'password1', 'password', 'New password')}
                    {/* Confirm password */}
                    {textElement('Confirm Password', 'password2', 'password', 'Confirm password')}
                    {/* Submit button */}
                    <Button variant="contained" onClick={validatePassword} >
                        Update password
                    </Button>
                </Box>
            </Modal>

        </Box>
    )
}
