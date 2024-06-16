'use client'

import {
    Avatar, Box, Button, InputAdornment, MenuItem, Select, Slide, Switch, TextField, Typography,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import Close from '@mui/icons-material/Close';
import CameraIcon from '@mui/icons-material/AddAPhotoOutlined';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, } from "react-redux";

import { v4 as uuid } from 'uuid';

import moment from "moment/moment";

import { Phone, PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css'

import listOfSkills from '@/Components/skills.js'

import ModalForm from "@/Components/ModalForm";
import { addNewStaff, isEmailTaken } from "../helper";
import { openSnackbar } from "@/Components/redux/routeSlice";

// firebase
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from "firebase/storage";
import { app } from "@/firebase/clientApp";


const bioFields = [
    { label: 'Full name', type: 'text', key: 'fullName', placeholder: 'Eg. John Doe', },
    { label: 'Phone number', type: 'text', key: 'phone', placeholder: 'Phone', },
    { label: 'Email', type: 'text', key: 'email', placeholder: 'Eg. user@example.com', },
    { label: 'Password', type: 'password', key: 'password', placeholder: 'Password', },
]

// const teams = [
//     'Management', 'Development', 'Research', 'Design', 'Marketing',
// ]

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

const qualifications = ['None', 'Masters', 'PhD', 'Bachelor degree', '2-year Diploma', 'High School Certificate']

const emailPattern = /^([\w|+|\-|_|~|\.])+[@]([\w])+\.[a-z]+$/i;


function AddStaff(prop) {
    //props: closeForm
    const [teams, setTeams] = useState([]);
    console.log("data", teams)
    const dispatch = useDispatch();

    const [file, setFile] = useState(undefined);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [filePerc, setFilePerc] = useState(0);
    const fileRef = useRef(null);

    const [state, setState] = useState({
        fullName: '', email: '', phone: '', password: '',
        team: 'management', role: '', privileges: {
            tools: { crm: false, forms: false },
            projectGroup: { createProjectGroup: false, deleteProjectGroup: false }, team: { createTeam: false, deleteTeam: false },
            staff: { addStaff: false, removeStaff: false }, shortListedSkills: [], editInputValue: '',
        }, birthday: moment().format('DD/MM/yyyy'), teams: teams, profilePicture: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg", errMsg: {}, searchValue: '',
        education: {}, workExperience: {}, skills: [], numberOfEducation: 1, numberOfWorkExperience: 1, editIndex: undefined
    });

    const updateState = (newValue) => {
        console.log('chnaging state', newValue)
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        if (state.searchValue) {
            findSkill()
        }
        else {
            updateState({ shortListedSkills: [] })
        }
    }, [state.searchValue])

    useEffect(() => {
        const getTeamNames = async () => {
            try {
                const response = await fetch('/api/teamStatus');
                if (response.ok) {
                    const data = await response.json();
                    setTeams(data); 
                } else {
                    console.error('Failed to fetch teams:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            } 
        };

        getTeamNames();
    }, []);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    useEffect(() => {
        if (fileRef.current) {
            // Initialize the ref after component mount
            fileRef.current.addEventListener("change", handleFileChange);
        }
        return () => {
            // Clean up event listener on unmount
            if (fileRef.current) {
                fileRef.current.removeEventListener("change", handleFileChange);
            }
        };
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // profilephoto update
    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    // setAvatarUrl(downloadURL)
                    updateState({ profilePicture: downloadURL })
                );
            }
        );
    };



    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, []);


    const setPhoneNumber = (value) => {
        updateState({ phone: value, errMsg: { ...state.errMsg, phone: '' } })
    }

    const handleTextInput = (event) => {
        const key = event.target.id
        updateState({ [key]: event.currentTarget.value, errMsg: { ...state.errMsg, [key]: '' } })
    }

    const handleSkillInput = (event) => {
        updateState({ searchValue: event.currentTarget.value })
    }

    const addSkill = (event) => {
        console.log('adding')
        const skill = event.target.id
        if (!state.skills.find(item => item.value === skill)) {
            updateState({ skills: [...state.skills, { value: skill, years: 0 }] })
        }
    }

    const removeSkill = (skill) => {
        /*    const skill = event.target.id */

        const found = state.skills.find(item => item.value === skill);
        console.log('skill', skill, found)

        if (found) {
            updateState({ skills: state.skills.filter(item => item.value !== skill) })
        }
    }

    const handleMenu = ({ event, key, index, category }) => {
        updateState({ [key]: event.target.value })
    }

    const saveEdit = (event) => {
        const dataArr = [...state.skills];
        dataArr[state.editIndex].years = state.editInputValue;

        updateState({ skills: dataArr, editIndex: undefined, editInputValue: '' })
    }

    const handleEditFormInput = (event) => {
        updateState({ editInputValue: event.currentTarget.value })
    }

    const showEditForm = (index) => {
        updateState({ editIndex: index })
    }

    const handleFile = (event) => {
        console.log('picture received');
        updateState({ profilePicture: event.target.files[0] })
    }

    const handlePrivilege = (event, parentKey, childKey) => {
        updateState({
            privileges: {
                ...state.privileges,
                [parentKey]: { ...state.privileges[parentKey], [childKey]: event.target.checked }
            }
        })
    }

    const addMoreCredential = (event) => {
        const id = event.target.id
        updateState({ [id]: state[id] + 1 })
    }

    const textInputElement = ({ disabled, fullWidth, width, value, onBlur, multiline,
        placeholder, stateKey, type, adornment, handleTextInput, style }) => {
        return <TextField
            disabled={disabled}
            value={value}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={4}
            id={stateKey}
            onBlur={onBlur}
            error={Boolean(state.errMsg[stateKey])}
            helperText={state.errMsg[stateKey]}
            startAdornment={adornment && <InputAdornment position="start">
                {adornment}
            </InputAdornment>}
            type={type}
            name={nameValue}
            onChange={handleTextInput}
            placeholder={placeholder}
            sx={{ width: width, zIndex: 2, ...style }} />
    }

    const closeForm = (staffAdded) => {
        prop.closeForm({ staffAdded: staffAdded ? true : false });
    }

    const findSkill = () => {
        const regEx = new RegExp(`\\b${state.searchValue}`, 'i');

        const resultArr = listOfSkills.filter(item => regEx.test(item));
        updateState({ shortListedSkills: [state.searchValue, ...resultArr] });
    }

    const dropDownMenu = ({ valueArr, key, value, handleChange, index, category }) => {
        return <Select value={value} sx={{ mr: 2, bgcolor: '#F5F5F5' }}
            onChange={(event) => { handleChange({ event, key, index, category }) }} id={key}>
            {valueArr.map((item, index) =>
                <MenuItem key={index} value={item.toLowerCase()} id={key}>
                    {item}
                </MenuItem>
            )}
        </Select>
    }

    const validateEmail = (callback) => {
        /* Check if email is valid and if it already exists */
        if (emailPattern.test(state.email)) {
            isEmailTaken({
                email: state.email, dataProcessor: (isTaken) => {
                    if (isTaken) {
                        updateState({ errMsg: { ...state.errMsg, email: 'Choose a different email.' } })
                        dispatch(openSnackbar({ message: 'Choose a different email.', severity: 'error' }))
                    }
                    else {
                        callback ? callback() : () => { }
                    }
                }
            })
            /*   validate(updateState, remoteRequest, 'email', state.email, dispatch, openSnackbar, navigate,
                  (type, errMsg) => { updateState({ errMsg: { ...state.errMsg, [type]: errMsg } }) },
                  callback ? callback : () => { }) */
        }
        else {
            updateState({ errMsg: { ...state.errMsg, email: 'Invalid email' } })
        }
    }

    const validatePhone = () => {
        console.log('validating phone');
        /* Check if email is valid and if it already exists */
        if (state.phone) {
            validate(updateState, remoteRequest, 'phone', state.phone, dispatch, openSnackbar, navigate,
                (type, errMsg) => { updateState({ errMsg: { ...state.errMsg, [type]: errMsg } }) }, () => { })
        }
    }

    const closeEditForm = () => {
        updateState({ editIndex: undefined })
    }


    const getNonEmptyArray = (object) => {
        const nonEmptyArr = Object.values(object).filter(data => Object.values(data).filter(item => item.length).length);
        console.log('non empty arr', nonEmptyArr);
        return nonEmptyArr
    }

    const validateData = () => {
        //Check for empty personal field
        if (!state.fullName || state.phone.length <= 6 || !state.email || !state.password ||
            !state.role || !state.team || state.errMsg?.phone && state.errMsg?.email) {
            dispatch(openSnackbar({ message: 'Fill all the fields in personal section.', severity: 'error' }))
        }
        else {
            validateEmail(() => {
                const dataObject = {
                    fullName: state.fullName, phone: state.phone, email: state.email, birthday: state.birthday,
                    password: state.password, team: state.team, role: state.role, privileges: state.privileges,
                    workExperience: state.workExperience, profilePicture: state.profilePicture,
                    education: state.education, skills: state.skills, designation: 'staff'
                }

                addNewStaff({
                    dataObject: dataObject, dataProcessor: (result) => {
                        closeForm({ staffAdded: true });
                        dispatch(openSnackbar({ message: '! new staff created', severity: 'success' }))
                    }
                })
            })
        }
    }

    const handleCredential = ({ event, category, key, index }) => {
        const isDate = key === 'qualification'
        const dataArr = { ...state[category] };

        dataArr[index] = { ...dataArr[index], [key]: isDate ? event.target.value : event.currentTarget.value }

        updateState({ [category]: { ...dataArr }, errMsg: { ...state.errMsg, [category]: '' } })
    }

    const label = ({ label, style }) => {
        return <Typography sx={{ pt: 2, pb: 1, ...style }}>
            {label}
        </Typography>
    }

    const credentials = ({ category, index, }) => {
        const isNullValue = !state[category][index];
        console.log('is null', isNullValue)

        return <Box sx={{ px: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Organisation/Institution */}
                <Box sx={{ width: { xs: '100%', md: '45%', }, mr: 3 }}>
                    {label({ label: category === 'education' ? 'Institution\'s name' : 'Organisation\'s name' })}

                    {textInputElement({
                        stateKey: 'birthday', handleTextInput: (event) => {
                            handleCredential({
                                event: event, category: category,
                                key: category === 'education' ? 'institution' : 'organisation', index: index
                            })
                        }, value: isNullValue ? '' : state[category][index][category === 'education' ? 'institution' : 'organisation'] ?? '', type: 'text', fullWidth: true,
                        placeholder: category === 'education' ? 'Institution\'s name' : 'Organisation\'s name',
                    })}
                </Box>


                {/* Role/Course */}
                <Box sx={{ width: { xs: '100%', md: '45%', } }}>
                    {label({ label: category === 'education' ? 'Course of study' : 'Role' })}
                    {textInputElement({
                        stateKey: category, handleTextInput: (event) => {
                            handleCredential({
                                event: event, category: category,
                                key: category === 'education' ? 'course' : 'role', index: index
                            })
                        }, value: isNullValue ? '' : state[category][index][category === 'education' ? 'course' : 'role'] ?? '', type: 'text', fullWidth: true,
                        placeholder: category === 'education' ? 'Eg. Architecture' : 'Eg. Operations Manager',
                    })}
                </Box>

            </Box>

            {/* Qualification obtained */}
            {category === 'education' && <Box sx={{ width: { xs: '100%', md: '45%', } }}>
                {label({ label: 'Qualification obtained' })}

                {dropDownMenu({
                    valueArr: qualifications, key: 'qualification',
                    value: isNullValue ? 'none' : state[category][index]?.qualification ?? 'none',
                    handleChange: handleCredential, category: category, index: index
                })}
            </Box>}

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Start date */}
                <Box sx={{ width: { xs: '100%', md: '45%', } }}>
                    {label({ label: 'Start date' })}
                    {textInputElement({
                        stateKey: category, handleTextInput: (event) => {
                            handleCredential({
                                event: event, category: category,
                                key: 'startDate', index: index
                            })
                        }, value: isNullValue ? '' : state[category][index]?.startDate ?? '', type: 'date',
                    })}
                </Box>

                {/* End date */}
                <Box sx={{ width: { xs: '100%', md: '45%', } }}>
                    {label({ label: 'End date' })}
                    {textInputElement({
                        stateKey: category, handleTextInput: (event) => {
                            handleCredential({
                                event: event, category: category,
                                key: 'endDate', index: index
                            })
                        }, value: isNullValue ? '' : state[category][index]?.endDate ?? '', type: 'date',
                    })}
                </Box>
            </Box>

            {/* Summary */}
            {label({ label: 'Summary' })}
            {textInputElement({
                stateKey: category, fullWidth: true, multiline: true,
                handleTextInput: (event) => {
                    handleCredential({
                        event: event, category: category,
                        key: 'summary', index: index
                    })
                }, value: isNullValue ? '' : state[category][index]?.summary ?? '', type: 'text',
                placeholder: 'You can add more information you think will be helpful'
            })}

        </Box>
    }

    const closeSearchList = () => {
        updateState({ shortListedSkills: [] });
    }

    const handleFormClick = (event) => {
        if (state.shortListedSkills?.length)
            closeSearchList()
    }


    console.log('add client state', state);

    return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
            position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '70%', md: '60%', lg: '45%', xl: '42%' },
        }}>
            {/* Heading */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1,
                borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white',
            }}>
                {/* Row 1 */}
                <Box sx={{
                    display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                    py: 2, px: { xs: 1.5, sm: 4 }
                }}>
                    {/* Close form */}
                    <Close onClick={closeForm}
                        sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 26, mr: 4 }} />

                    {/* Heading label */}
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                        ADD NEW STAFF
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button variant="contained" sx={{ py: .5, px: 3 }}
                        onClick={validateData} id='addNewStaff'>
                        Create
                    </Button>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ mt: '90px', maxHeight: '85%', overflowY: 'scroll' }} onClick={handleFormClick}>
                {/* Profile picture avatar */}
                    <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
                <Box sx={{ width: 'max-content', position: 'relative', mx: 'auto' }}>
                    {/* <Avatar src={state.profilePicture ? URL.createObjectURL(state.profilePicture) : 'ds'}
                        sx={{ width: 90, height: 90, position: 'relative' }} /> */}
                           <img
                                    // onClick={() => fileRef.current.click()}
                                    src={state.profilePicture}
                                    alt="profile"
                                    className="rounded-full object-cover mt-2"
                                    style={{ height: '100px', width: '100px', position: 'relative' }}
                                />
                                 <AddAPhotoIcon onClick={() => fileRef.current.click()} className="h-8 w-8" style={{ position: 'absolute', bottom: '0', right: '0', cusor: "pointer", color: "red" }} />
                    {/* <Box component='label' sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', p: .5,
                        position: 'absolute', bgcolor: '#BF0606', bottom: 0, right: 0, borderRadius: '26.66667px',
                    }}>
                        {/* <input type="file" style={{ display: 'none' }} accept=".jpg, .jpeg, .png" onChange={handleFile} /> */}
                        {/* <CameraIcon onClick={() => fileRef.current.click()}  sx={{
                            fontSize: 20, color: 'white', bgcolor: '#BF0606', borderRadius: '26.66667px',cusor: "pointer"
                        }} /> */}
                    {/* </Box> */} 
                </Box>

                    <p className="text-sm self-center text-center">
                                {fileUploadError ? (
                                    <span className="text-red-700">
                                        Error Image upload (image must be less than 3 mb)
                                    </span>
                                ) : filePerc > 0 && filePerc < 100 ? (
                                    <span className="text-green-700">{`Uploading ${filePerc}%`}</span>
                                ) : filePerc === 100 ? (
                                    <span className="text-green-700">Image successfully uploaded!</span>
                                ) : (
                                    ""
                                )}
                            </p>

                <Typography sx={{ bgcolor: '#F5F5F5', px: 4, py: 1, mt: 3 }}>
                    PERSONAL DATA
                </Typography>
                {/* Personal data */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', px: 4, pb: 4 }}>
                    {/* Name, phone, email, password */}
                    {bioFields.map((field, index) =>
                        <Box key={index} sx={{ width: { xs: '100%', md: '45%', }, mr: { md: 2 }, }}
                            onBlur={field.key === 'email' ? validateEmail /* : field.key === 'phone' ? validatePhone */ : () => { }}>

                            <Typography sx={{ pt: 2, pb: 1 }}>
                                {field.label}
                            </Typography>

                            {field.key !== 'phone'
                                ? textInputElement({
                                    fullWidth: true, stateKey: field.key, handleTextInput: handleTextInput,
                                    value: state[field.key], placeholder: field.placeholder, type: field.type
                                })
                                : <Box>
                                    <PhoneInput defaultCountry="ng" value={state.phone} onChange={setPhoneNumber} />
                                    <Typography sx={{ fontSize: 12, color: '#BF0606' }}>{state.errMsg.phone}</Typography>
                                </Box>}
                        </Box>
                    )}

                    {/* Date of birth */}
                    <Box sx={{ /* display: 'flex', flexDirection: 'column' */width: { xs: '100%', md: '45%', }, mr: 3 }}>
                        {label({ label: 'Date of birth' })}
                        {textInputElement({
                            stateKey: 'birthday', handleTextInput: handleTextInput,
                            value: state.birthday, type: 'date'
                        })}
                    </Box>

                    {/* Team */}
                    <Box sx={{ width: { xs: '100%', md: '45%', }, }}>
                        {label({ label: 'Team' })}
                        {dropDownMenu({ valueArr: teams, key: 'team', value: "management", handleChange: handleMenu })}
                    </Box>

                    {/* Role */}
                    <Box sx={{ width: { xs: '100%', md: '45%', } }}>
                        {label({ label: 'Role' })}
                        {textInputElement({
                            fullWidth: true, stateKey: 'role', handleTextInput: handleTextInput,
                            value: state.role, placeholder: 'C.E.O', type: 'text'
                        })}
                    </Box>
                </Box>

                {/* Qualifications */}
                <Box sx={{}}>
                    {/* Education */}
                    {Array.from({ length: state.numberOfEducation }).reverse().map((data, index) => {
                        return <Box key={index} sx={{ mb: 4 }}>
                            {/* Heading */}
                            <Typography sx={{ bgcolor: '#F5F5F5', px: 4, py: 1 }}>
                                EDUCATION - {index + 1}
                            </Typography>

                            {credentials({ category: 'education', index: index })}
                        </Box>
                    })}

                    <Button variant='text' sx={{ mx: 4, mt: -3, mb: 2, fontSize: 13 }}
                        id='numberOfEducation' onClick={addMoreCredential}>
                        <AddIcon sx={{ fontSize: 12 }} /> Add another education
                    </Button>




                    {/* Work Experience */}
                    {/* Education */}
                    {Array.from({ length: state.numberOfWorkExperience }).reverse().map((data, index) => {
                        return <Box key={index} sx={{ mb: 4 }}>
                            {/* Heading */}
                            <Typography sx={{ bgcolor: '#F5F5F5', px: 4, py: 1 }}>
                                WORK EXPERIENCE - {index + 1}
                            </Typography>
                            {credentials({ category: 'workExperience', index: index })}
                        </Box>
                    })}

                    <Button variant='text' sx={{ mx: 4, mt: -3, mb: 2, fontSize: 13 }}
                        id='numberOfWorkExperience' onClick={addMoreCredential}>
                        <AddIcon sx={{ fontSize: 12 }} /> Add another work experience
                    </Button>
                </Box>

                {/* Skills */}
                <Typography sx={{ bgcolor: '#F5F5F5', px: 4, py: 1, mb: 2 }}>
                    SKILLS
                </Typography>

                {/* Added skills */}
                {Object.values(state.skills).length > 0 &&
                    <Box sx={{
                        display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', pt: 2,
                        bgcolor: '#FFF6F6', px: 4
                    }}>
                        {Object.values(state.skills).map((data, index) => {
                            return <Box key={index} sx={{
                                display: 'flex', alignItems: 'center', borderRadius: '8px', mb: 2,
                                bgcolor: '#FBFBFB', border: '1px solid #1C1D221A', mr: 3, px: 2, py: .5
                            }}>
                                <Box >
                                    <Typography id={data?.value}
                                        sx={{ fontSize: 14, fontWeight: 500, mb: .5 }}>
                                        {data?.value}
                                    </Typography>
                                    <Typography id={data?.value}
                                        sx={{ fontSize: 12, fontWeight: 400 }}>
                                        {data?.years} years <EditIcon sx={{
                                            fontSize: 16, ml: 1, cursor: 'pointer',
                                            ":hover": { color: 'primary.main' },
                                        }}
                                            onClick={() => { showEditForm(index) }} />
                                    </Typography>
                                </Box>

                                <Close id={data?.value} sx={{
                                    ml: 1, fontSize: 17, cursor: 'pointer',
                                    ":hover": { color: 'black' }, color: '#1C1D2266'
                                }}
                                    onClick={() => { removeSkill(data?.value) }} />
                            </Box>
                        })}
                    </Box>
                }

                <Box sx={{ px: 4, pb: 4, }}>
                    <Box sx={{ position: 'relative', width: '90%', }}>
                        {label({ label: 'Search for and add skills ' })}

                        {/* Search box */}
                        {textInputElement({
                            stateKey: 'skillInput', handleTextInput: handleSkillInput, fullWidth: true,
                            value: state.searchValue, type: 'text', placeholder: 'Eg. Figma'
                        })}

                        {state.shortListedSkills?.length > 0 && <Box sx={{
                            position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 2,
                            maxHeight: '300px', overflowY: 'auto', bgcolor: 'white'
                        }}>
                            {state.shortListedSkills?.map((data, index) => {
                                return <Typography key={index} id={data} onClick={addSkill}
                                    sx={{
                                        py: 1, px: 2, borderTop: '2px solid #F5F5F5',
                                        bgcolor: state.skills?.find(item => item.value === data) ? '#FFF6F6' : 'white',
                                        cursor: 'pointer', ":hover": { background: '#F5F5F5' }
                                    }}>
                                    {data}
                                </Typography>
                            })}
                        </Box>}

                    </Box>

                </Box>

                {/* Privileges */}
                <Typography sx={{ bgcolor: '#F5F5F5', px: 4, py: 1 }}>
                    STAFF PRIVILEGES
                </Typography>

                <Box sx={{ mt: 2 }}>
                    {privileges.map((privilege, index) =>
                        <Box key={index} sx={{}}>
                            {/* Heading */}
                            <Typography sx={{ px: 4, py: 1, color: '#BF0606', bgcolor: 'rgba(191, 6, 6, 0.08)' }}>
                                {privilege.label}
                            </Typography>
                            {/* Content */}
                            <Box sx={{ px: 4, py: 1, }}>
                                {privilege.children.map((child, index) =>
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography>
                                            {child.label}
                                        </Typography>
                                        <Switch checked={state.privileges[privilege.key][child.key]}
                                            value={state.privileges[privilege.key][child.key]}
                                            onChange={(event) => { handlePrivilege(event, privilege.key, child.key) }} />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>

            </Box>

            {state.editIndex !== undefined && <ModalForm {...{
                onclose: closeEditForm, width: { xs: '80%', md: '300px' }, Component:
                    <Box align='center' sx={{}}>
                        {label({ label: 'How many years experience?' })}
                        {textInputElement({
                            stateKey: 'skillInput', handleTextInput: handleEditFormInput, fullWidth: true,
                            value: state.editInputValue, type: 'number', placeholder: 'Example: 2',
                            style: { mt: 1, textAlign: 'center' }
                        })}

                        <Button variant='contained' onClick={saveEdit} sx={{ mx: 'auto', mt: 2 }}>
                            Save  <SaveIcon sx={{ ml: 1, fontSize: 16 }} />
                        </Button>
                    </Box>
            }} />}
        </Box >
    </Slide >)
}

export default AddStaff;