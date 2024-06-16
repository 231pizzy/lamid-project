'use client'

import {
    Avatar,
    Box, Button, Checkbox, FormControl, Grid, InputAdornment, InputLabel, LinearProgress, List, ListItemButton, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Slide, TextField, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutline';


import { useEffect, useState, useMemo } from "react";
import { useDispatch, } from "react-redux";


import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css'

import allCountries from '@/Components/countries.json';

//import { CitySelect, StateSelect, CountrySelect } from 'react-country-state-city';

import { v4 as uuid } from 'uuid';


import { openSnackbar } from "@/Components/redux/routeSlice";

import UploadedContacts from "./UploadedContacts";

import { ExcelRenderer } from 'react-excel-renderer'

import { FileUpload } from "./FileUpload";

import IconElement from "@/Components/IconElement";

import { useRouter } from "next/navigation";
import { createContact, editContact, getLocation } from "./helper";


const CsvSvg = '/icons/CsvSvg.svg'
const ExcelSvg = '/icons/ExcelSvg.svg'
const FacebookSvg = '/icons/FacebookSvg.svg'
const InstagramSvg = '/icons/InstagramSvg.svg'
const LinkedinSvg = '/icons/linkedinSvg.svg'
const TwitterSvg = '/icons/TwitterSvg.svg'
const TxtSvg = '/icons/TxtSvg.svg'

const dataSet1 = [
    { stateKey: 'fullName', label: 'Contact full name', placeholder: 'Eg. John Doe', type: 'text' },
    { stateKey: 'company', label: 'Company Name', type: 'text', placeholder: 'Eg. Lamid group' },
    { stateKey: 'sector', label: 'Sector', type: 'text', placeholder: 'Eg. Finance' },
]

const iconstyle = { cursor: 'pointer', width: '36px', height: '36px', }
const socialMediaData = [
    { icon: <IconElement {...{ src: TwitterSvg, style: iconstyle }} />, valueKey: 'twitter', holder: 'www.twitter.com/johndoe', bgcolor: 'rgba(85, 172, 238, 0.06)' },
    { icon: <IconElement {...{ src: FacebookSvg, style: iconstyle }} />, valueKey: 'facebook', holder: 'www.facebook.com/johndoe', bgcolor: 'rgba(56, 89, 151, 0.06)' },
    { icon: <IconElement {...{ src: InstagramSvg, style: iconstyle }} />, valueKey: 'instagram', holder: 'www.instagram.com/johndoe', bgcolor: 'rgba(250, 0, 122, 0.06)' },
    { icon: <IconElement {...{ src: LinkedinSvg, style: iconstyle }} />, valueKey: 'linkedin', holder: 'www.linkedin.com/in/johndoe', bgcolor: 'rgba(40, 103, 178, 0.06)' },
]

const socials = ['twitter', 'facebook', 'instagram', 'linkedin']

const defaultTabStyle = {
    fontWeight: 700, fontSize: 15, py: 2,
    display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%', cursor: 'pointer'
}


const selectedTabStyle = { ...defaultTabStyle, borderBottom: '4px solid #BF0606', color: '#BF0606', };

const iconStyle2 = { height: '40px', width: '40px' };

const fileIcons = {
    txt: { icon: <IconElement {...{ src: TxtSvg, style: iconStyle2 }} />, color: '#885CA7' },
    csv: { icon: <IconElement {...{ src: CsvSvg, style: iconStyle2 }} />, color: '#00A651' },
    xls: { icon: <IconElement {...{ src: ExcelSvg, style: iconStyle2 }} />, color: '#165332' },
    xlsx: { icon: <IconElement {...{ src: ExcelSvg, style: iconStyle2 }} />, color: '#165332' }
}


function AddClient({ closeForm, editMode, clientRecord }) {
    //props: closeForm
    console.log('clientRecord', clientRecord);

    const dispatch = useDispatch();
    const router = useRouter();


    const [state, setState] = useState({
        fullName: { value: clientRecord?.fullName ?? '', errMsg: '' },
        company: { value: clientRecord?.company ?? '', errMsg: '' },
        sector: { value: clientRecord?.sector ?? '', errMsg: '' },
        email: { value: clientRecord?.email ?? '', errMsg: '' },
        countryCode: '', phone: { value: clientRecord?.phone ?? '', errMsg: '' },
        country: { value: clientRecord?.country ?? 'Country', errMsg: '' },
        state: { value: clientRecord?.state ?? 'State', errMsg: '' },
        city: { value: clientRecord?.city ?? 'City', errMsg: '' },
        street: { value: clientRecord?.street ?? '', errMsg: '' },
        social: clientRecord?.social ?? [], allStates: ['State'], allCities: ['City'], allCountries: allCountries, twitter: '', facebook: clientRecord?.social?.facebook ?? '', twitter: clientRecord?.social?.twitter ?? '',
        instagram: clientRecord?.social?.instagram ?? '', linkedin: clientRecord?.social?.linkedin ?? '',
        tab: 'manual', files: [], renderFile: false, filenames: [],
        contactObject: {}, processedFiles: [], selectedFile: '', dataAdded: false, showPrompt: false, fileToRemove: ''
    });

    const updateState = (newValue) => {
        console.log('chnaging state', newValue)
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const locationLoader = ({ type, result }) => {
        const value = type === 'state' ? {
            allStates: result, state: { value: result[0] ?? 'State', errMsg: '' },
            city: { value: 'City', errMsg: '' }
        } :
            { allCities: result, city: { value: result[0] ?? 'City', errMsg: '' } }
        updateState(value);
    }

    //fetch states
    useEffect(() => {
        if (state.country.value !== 'Country')
            getLocation({ type: 'state', country: state.country.value, dataProcessor: locationLoader })
        //getLocation('state', { country: state.country.value }, updateState, remoteRequest, dispatch, openSnackbar, navigate)
    }, [state.country.value])

    //fetch cities
    useEffect(() => {
        if (state.state.value !== 'State')
            getLocation({ type: 'city', country: state.country.value, state: state.state.value, dataProcessor: locationLoader })

    }, [state.state.value])

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, []);

    const setPhoneNumber = (value) => {
        updateState({ phone: { value: value, errMsg: '' } })
    }

    const setLocation = ({ stateKey, value }) => {
        console.log('setting location', stateKey, value)
        updateState({ [stateKey]: { value: value, errMsg: '' }, })
    }

    const buildSelectMenu = ({ itemList, value, onChangeHandle, stateKey }) => {
        return <Box sx={{
            display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <FormControl
                size='small'
                variant='outlined' id={stateKey}
                sx={{ width: 'max-content', pr: 2, mb: 2 }}>
                <InputLabel  >   </InputLabel>
                <Select id={stateKey} sx={{
                    fontSize: { xs: 12, md: 13 },
                    fontWeight: 500, border: '2px solid rgba(28, 29, 34, 0.1)',
                    color: '#333333',
                }}
                    value={value.toLowerCase()}
                    onChange={(event) => { onChangeHandle({ stateKey: stateKey, value: event.target.value }) }}
                    size='small' >
                    {itemList.map((item, indx) =>
                        <MenuItem key={indx} id={stateKey}
                            value={stateKey === 'country' ? item?.name.toLowerCase() : item.toLowerCase()}
                            sx={{
                                fontSize: { xs: 12, md: 16 }, bgcolor: item.color,
                                fontWeight: 500, color: '#333333',
                            }}>
                            <Typography id={stateKey} sx={{
                                fontSize: { xs: 12, md: 13 }, fontWeight: 600,
                                display: 'flex',
                            }}>
                                {stateKey === 'country' && <Avatar id={stateKey} variant="square"
                                    sx={{ mr: 1, height: 16, width: 20 }}
                                    src={`https://flagcdn.com/16x12/${item?.code}.png`} />}
                                {stateKey === 'country' ? item?.name : item}
                            </Typography>
                        </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    }

    const handleTextInput = (event) => {
        const stateKey = event.currentTarget.id;
        const value = event.currentTarget.value
        socials.includes(stateKey) ?
            updateState({ [stateKey]: value }) :
            updateState({ [stateKey]: { value: value, errMsg: value ? '' : 'required' } })

    }

    const textInputElement = ({ disabled, fullWidth, value, placeholder, stateKey, type, adornment }) => {
        return <OutlinedInput
            disabled={disabled}
            value={value}
            fullWidth={fullWidth}
            id={stateKey}
            startAdornment={adornment && <InputAdornment position="start">
                {adornment}
            </InputAdornment>}
            type={type}
            name={nameValue}
            onChange={handleTextInput}
            placeholder={placeholder} />
    }

    const handleCloseForm = (dataAdded) => {
        closeForm({ dataAdded: dataAdded ? true : false });
    }

    const phoneNumberElement = () => {
        return (
            <Box sx={{}}>
                <PhoneInput
                    defaultCountry="ng"
                    value={state.phone.value}
                    onChange={setPhoneNumber}
                />
            </Box>
        )
    }

    const labelElement = ({ label }) => {
        return <Typography sx={{ mb: 1, fontSize: { xs: 13, md: 14, xl: 16 } }}>
            {label}
        </Typography>
    }


    const saveContact = (event) => {
        const callback = (message) => {
            dispatch(openSnackbar({ message: message, severity: 'success' }))
            closeForm({ dataAdded: true });
        }
        if (state.tab === 'upload') {
            if (Object.keys(state.contactObject).length) {
                const contactArr = [];
                Object.values(state.contactObject).forEach(arr => contactArr.push(...arr));

                createContact({
                    contactObject: contactArr, dataProcessor: () => {
                        callback(`${contactArr?.length} new Contact added`)
                    }
                })
            }
            else {
                console.log('nothing to upload')
            }
        }
        else {
            if (state.fullName.value && state.company.value && state.country.value && state.state.value
                && state.city.value && state.email.value &&
                state.phone.value && state.street.value && state.sector.value) {
                console.log('all filled');

                const socialAccounts = {};

                socials.filter(item => state[item]).map(item => socialAccounts[item] = state[item]);

                const contactObject = {
                    fullName: state.fullName.value, company: state.company.value, state: state.state.value, city: state.city.value, email: state.email.value, phone: state.phone.value, street: state.street.value,
                    sector: state.sector.value, social: JSON.stringify(socialAccounts), country: state.country.value
                }

                editMode ? editContact({
                    contactObject: contactObject, clientRecordId: clientRecord?._id,
                    dataProcessor: () => {
                        callback(`1 contact edited`)
                    }
                })
                    : createContact({
                        contactObject: [contactObject], dataProcessor: () => {
                            callback(`1 contact added`)
                        }
                    })
            }
            else {
                console.log('some fields empty',);
            }
        }
    }

    const switchTab = (event) => {
        updateState({ tab: event.target.id, renderFile: false })
    }

    const duplicateFIle = () => {
        dispatch(openSnackbar({ message: "File already exists", severity: 'error' }))
    }

    const parseTextFiles = (file, fileDetails, callback) => {
        console.log('parsing text file', state, fileDetails.filename, fileDetails.size)


        if (state.processedFiles.filter(item => Boolean(item.filename === fileDetails.filename) && (item.size === fileDetails.size)
        ).length) {
            console.log('duplicate file');
            duplicateFIle();
            return callback([], fileDetails.filename, fileDetails, true)
        }
        const reader = new FileReader();

        reader.onload = (e) => {
            // Split the contents of the CSV or TXT file into rows
            // const rows = reader.result.split('\n');
            const rows = e.target.result.split('\n');
            /*  Extract the process each row into an object with the following keys in the following order: 1. fullName,   2. company,   3. sector,   4. email,   5. phone 6. country,   7. state,   8. city,   9. street, 10. facebook, 11. twitter, 12. linkedin, 13. instagram */

            const progressTotal = rows.length;
            console.log('parsing', fileDetails.filename)

            const contactArr = rows.map((row, index) => {

                const rowArr = row.split(';'); //The columns are comma and single spaace separated 

                return {
                    fullName: rowArr[0]?.trim(), company: rowArr[1]?.trim(), sector: rowArr[2]?.trim(), email: rowArr[3]?.trim(),
                    phone: rowArr[4]?.trim(), country: rowArr[5]?.trim(), state: rowArr[6]?.trim(), city: rowArr[7]?.trim(),
                    street: rowArr[8]?.trim(), social: JSON.stringify({
                        facebook: rowArr[9]?.trim(), twitter: rowArr[10]?.trim(),
                        linkedin: rowArr[11]?.trim(), instagram: rowArr[12]?.trim()
                    })
                };
            });

            console.log('state before spread', fileDetails.filename, state.contactObject, contactArr)

            console.log('calling callback', state.contactObject, state.processedFiles)
            callback(contactArr, fileDetails.filename, fileDetails,)
        };
        return reader.readAsText(file);
    }

    const parseSpreadsheet = (file, fileDetails, callback) => {
        console.log('parsing spreadsheet', fileDetails);
        ExcelRenderer(file, (err, res) => {
            if (err) {
                console.log('error in excel processing', err)
            }
            else {
                console.log('result', res);
                const rows = res.rows;
                if (rows.length) {
                    const heading = rows[0];
                    rows.splice(0, 1)

                    const contactArr = rows.map((row, index) => {
                        return {
                            fullName: row[0]?.trim(), company: row[1]?.trim(), sector: row[2]?.trim(), email: row[3]?.trim(),
                            phone: row[4]?.trim(), country: row[5]?.trim(), state: row[6]?.trim(), city: row[7]?.trim(),
                            street: row[8]?.trim(), social: JSON.stringify({
                                facebook: row[9]?.trim(), twitter: row[10]?.trim(),
                                linkedin: row[11]?.trim(), instagram: row[12]?.trim()
                            })
                        };
                    });

                    console.log('state before spread', fileDetails.filename, contactArr)
                    callback(contactArr, fileDetails.filename, fileDetails,)
                }
            }
        })
    }

    const getFileSize = (sizeInBytes) => {
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        const sizeInMB = (sizeInKB / 1024).toFixed(2);

        if (sizeInMB > 1) return `${sizeInMB}MB`
        else if (sizeInKB > 1) return `${sizeInKB}KB`
        else return `${sizeInBytes}B`
    };

    const confirmRemoveContact = (event, filename) => {
        event.stopPropagation();
        updateState({ showPrompt: true, fileToRemove: filename })
    };

    const removeContact = (filename) => {
        const contact = { ...state.contactObject };
        Reflect.deleteProperty(contact, filename);

        console.log('deleting contact file', filename);

        updateState({
            filenames: state.filenames.filter(filename1 => filename1.filename !== filename),
            processedFiles: state.processedFiles.filter(filename1 => filename1.filename !== filename),
            contactObject: { ...contact }, fileToRemove: '', showPrompt: false
        });
    }

    const viewUploadedContact = (filename) => {
        updateState({ selectedFile: filename })
    }

    const closeFileViewer = () => {
        updateState({ selectedFile: '' })
    }

    const handleFiles = (files) => {
        console.log('files grabbed', files);
        if (files) {
            const fileArr = []
            const filenames = Array.from(files).map(file => {
                fileArr.push(file)
                return {
                    filename: file.name, size: getFileSize(file.size),
                    extension: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
                }
            });

            updateState({
                files: fileArr, renderFile: true,
                filenames: filenames
            });

            let processedFiles = [];
            let contactObject = {}

            //Process file and extract all the required data
            const processFile = (index, maxIndex) => {
                if (index < maxIndex) {

                    const file = files[index]
                    const fileDetails = filenames[index];
                    const fileExtension = fileDetails.extension
                    const name = fileDetails.filename

                    console.log('processing', name)

                    const callback = (contactArr, nameOfFile, fileDetails, duplicate) => {
                        if (duplicate) {
                            return processFile(index + 1, maxIndex)
                        }
                        console.log('final data', contactArr)
                        contactObject = { ...contactObject, [nameOfFile]: contactArr }
                        processedFiles.push(fileDetails)

                        processFile(index + 1, maxIndex)
                    }


                    if (fileExtension === 'csv' || fileExtension === 'txt') {
                        return parseTextFiles(file, fileDetails, callback)
                    }
                    else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                        return parseSpreadsheet(file, fileDetails, callback);
                    }
                }
                else {
                    console.log('all processed');
                    updateState({
                        contactObject: { ...state.contactObject, ...contactObject },
                        processedFiles: [...state.processedFiles, ...processedFiles],
                        filenames: [],
                        files: []
                    });

                }

            }

            processFile(0, files.length)
        }
    }

    const fileRenderingView = () => {
        return <Box sx={{ mt: 2 }}>
            {/* Preocessed files */}
            <Box>
                {/* Heading */}
                <Typography sx={{
                    bgcolor: 'rgba(28, 29, 34, 0.04)',
                    color: '#5D5D5D', px: 3, py: 1, fontSize: 17, fontWeight: 600
                }}>
                    Processed files
                </Typography>

                {/* Files */}
                <Box sx={{ px: 3 }} >
                    {state.processedFiles.map((filename, index) => {
                        const fileExtension = filename.extension;
                        const id = filename.filename;
                        return <Box key={index} id={filename.filename}
                            sx={{
                                display: 'flex', alignItems: 'center', cursor: 'pointer',
                                py: 2, borderBottom: '1px solid rgba(28, 29, 34, 0.1)'
                            }} onClick={() => { viewUploadedContact(id) }}>
                            {/* Icon */}
                            {fileIcons[fileExtension].icon}

                            {/* file index, extension and size */}
                            <Box id={filename.filename} sx={{ ml: 2 }}>
                                {/* File name and extension */}
                                <Typography sx={{ mb: .5, fontWeight: 600, fontSize: 14 }}>
                                    {filename.filename.split('.')[0]} {fileExtension.toUpperCase()} file
                                </Typography>
                                {/* File size */}
                                <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                                    {filename.size}
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* Close icon */}
                            <DeleteIcon id={id} sx={{ fontSize: 26, color: '#8D8D8D' }}
                                onClick={(event) => { confirmRemoveContact(event, id) }} />
                        </Box>
                    }

                    )}
                </Box>
            </Box>
        </Box>

    }

    const UploadTab = () => {
        return <Box sx={{}}>
            {/* Upload  */}
            <FileUpload {...{
                handleFiles: handleFiles, multiple: true, accept: { 'text/*': ['.txt', '.csv', '.xlsx', '.xls'] },
                extentionArray: ['CSV', 'TXT', 'EXCEL'], showFiles: true, viewUploadedContact: viewUploadedContact,
                removeContact: removeContact, fileArray: state.processedFiles
            }} />

            {!state.processedFiles.length &&
                /* ?    fileRenderingView() : */
                <Box align="center" sx={{
                    bgcolor: '#EAEAEA', boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.03)', px: 2, py: 2,
                    borderRadius: '16px', lineHeight: '20px', color: '#5D5D5D', fontSize: 14, mt: 4, mx: 4
                }}>
                    {/* Section 1 */}
                    <Typography sx={{ bgcolor: 'white', fontWeight: 700, fontSize: 16, px: 2, py: 1, }}>
                        Before uploading your contact, make sure the columns are arranged in this order.
                    </Typography>
                    <Typography align="center" sx={{ lineHeight: '20px', color: '#5D5D5D', fontSize: 15, py: 2 }}>
                        1. Contact name,   2. Company's name,   3. Sector,   4. Email,   5. Phone number,
                        6. Country,   7. State,   8. City,   9. street, 10. Facebook, 11. Twitter, 12. Linkedin, 13. instagram
                    </Typography>


                    {/* Section 2 */}
                    {/* Heading */}
                    <Typography sx={{ bgcolor: 'white', fontWeight: 700, fontSize: 16, px: 2, py: 1, mb: 2 }}>
                        Additional Information
                    </Typography>
                    <Box align="left" >
                        <Typography sx={{ my: 1, fontSize: 15 }}>
                            1. The CSV or TXT file should not have a header.
                        </Typography>
                        <Typography sx={{ mb: 1, fontSize: 15 }}>
                            2. The first row of the spreadsheet (Excel) document should be the heading.
                        </Typography>
                        <Typography sx={{ mb: 1, fontSize: 15 }}>
                            3. The columns in the CSV or TXT file should be separated with a semicolon (;).
                        </Typography>
                        <Typography sx={{ mb: 1, fontSize: 15 }}>
                            4. One row is a single contact and the next row is another separate contact
                        </Typography>
                    </Box>


                </Box>}
        </Box>
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
                    <Close onClick={handleCloseForm}
                        sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 26, mr: 4 }} />

                    {/* Heading label */}
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                        {editMode ? 'EDIT CONTACT' : 'ADD NEW CLIENT'}
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    {(state.tab === 'upload' || editMode) &&
                        <Button variant="contained" sx={{ py: 0 }}
                            onClick={saveContact}>
                            Save
                        </Button>}
                </Box>

                {/*  Row 2*/}
                {/* Tabs:  manual and upload */}
                {!editMode && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Upload */}
                    <Typography id='manual' sx={state.tab === 'manual' ? selectedTabStyle : defaultTabStyle}
                        onClick={switchTab}>
                        MANUALLY
                    </Typography>
                    {/* Manual */}
                    <Typography id='upload' sx={state.tab === 'upload' ? selectedTabStyle : defaultTabStyle}
                        onClick={switchTab}>
                        UPLOAD
                    </Typography>
                </Box>}
            </Box>

            {/* Content */}
            <Box sx={{ mt: editMode ? '70px' : '150px', maxHeight: '85%', overflowY: 'auto' }}>
                {/* Content */}
                {state.tab === 'upload' && !editMode ?

                    UploadTab() :

                    <Box>
                        {/* Name and sector  */}
                        <Box>
                            {/* Section heading */}
                            <Typography sx={{ px: 2, py: .5, bgcolor: 'rgba(28, 29, 34, 0.06)', fontSize: { xs: 13, md: 14, xl: 16 } }}>
                                Name and sector
                            </Typography>

                            {/* Content */}
                            <Box sx={{ px: 4, py: 2 }}>
                                {dataSet1.map(item =>
                                    <Box sx={{ py: 1 }}>
                                        {/* Label */}
                                        <Typography sx={{ mb: 1, fontSize: { xs: 13, md: 14, xl: 16 } }}>
                                            {item.label}
                                        </Typography>
                                        {/* TextBox */}
                                        {textInputElement({
                                            fullWidth: true, value: state[item.stateKey].value,
                                            placeholder: item.placeholder, type: 'text', stateKey: item.stateKey
                                        })}
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Email,phone, and address */}
                        <Box>
                            {/* Section heading */}
                            <Typography sx={{ px: 2, py: .5, bgcolor: 'rgba(28, 29, 34, 0.06)', fontSize: { xs: 13, md: 14, xl: 16 } }}>
                                Address and contact
                            </Typography>

                            {/* Section content */}
                            <Box sx={{ px: 4, py: 2 }}>
                                {/* Email */}
                                <Box>
                                    {/* Label */}
                                    {labelElement({ label: 'Email' })}
                                    {/* Textbox */}
                                    {textInputElement({
                                        fullWidth: true, value: state.email.value,
                                        placeholder: 'Eg. example@mail.com', type: 'email', stateKey: 'email'
                                    })}
                                </Box>

                                {/* Phone number */}
                                <Box sx={{ py: 2 }}>
                                    {labelElement({ label: 'Phone number' })}
                                    {phoneNumberElement()}
                                </Box>

                                {/* Country */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {/* Country */}
                                    <Box>
                                        {labelElement({ label: 'Country' })}
                                        {buildSelectMenu({
                                            itemList: state.allCountries, value: state.country.value, onChangeHandle: setLocation,
                                            stateKey: 'country'
                                        })}
                                    </Box>
                                    {/* State */}
                                    <Box>
                                        {labelElement({ label: 'State' })}
                                        {buildSelectMenu({
                                            itemList: state.allStates, value: state.state.value, onChangeHandle: setLocation,
                                            stateKey: 'state'
                                        })}
                                    </Box>
                                    {/* City */}
                                    <Box>
                                        {labelElement({ label: 'City' })}
                                        {buildSelectMenu({
                                            itemList: state.allCities, value: state.city.value, onChangeHandle: setLocation,
                                            stateKey: 'city'
                                        })}
                                    </Box>
                                </Box>

                                {/* Street */}
                                <Box>
                                    {labelElement({ label: 'Street address' })}
                                    {textInputElement({
                                        fullWidth: true, value: state.street.value,
                                        placeholder: 'Eg. 40, Allen Avenue', type: 'text', stateKey: 'street'
                                    })}
                                </Box>
                            </Box>
                        </Box>

                        {/* Social media */}
                        <Box sx={{ py: 2 }}>
                            {/* Section heading */}
                            <Typography sx={{
                                px: 2, py: .5, display: 'flex', alignItems: 'center',
                                bgcolor: 'rgba(28, 29, 34, 0.06)', fontSize: { xs: 13, md: 14, xl: 16 }
                            }}>
                                Social media
                                <Typography sx={{ ml: .5, color: '#BF0606', fontSize: { xs: 13, md: 14, xl: 16 } }}>
                                    (optional)
                                </Typography>
                            </Typography>

                            {/* Social media handles */}
                            <Box sx={{ py: 2 }}>
                                {socialMediaData.map(social =>
                                    <Box sx={{ display: 'flex', px: 4, py: 1.5 }}>
                                        {/* Social media icon */}


                                        {/* Textbox for social media handle */}
                                        {textInputElement({
                                            fullWidth: true, value: state[social.valueKey],
                                            placeholder: social.holder, type: 'text', stateKey: social.valueKey,
                                            adornment: <Box sx={{
                                                px: 1, display: 'flex', alignItems: 'center',
                                                borderRadius: '6px 0px 0px 6px', bgcolor: social.bgcolor
                                            }}>
                                                {social.icon}
                                            </Box>
                                        })}
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Create contact button */}
                        {!editMode && <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button id='new-contact' onClick={saveContact} variant='contained'>
                                Create Contact
                            </Button>
                        </Box>}

                    </Box>
                }


            </Box>



            <Modal open={state.selectedFile} onClose={closeFileViewer}>
                <UploadedContacts closeView={closeFileViewer} contacts={state.contactObject[state.selectedFile]}
                    filename={state.selectedFile} />
            </Modal>

            {/*      <Prompt open={state.showPrompt} message='You are about to remove this contact' proceedTooltip='Alright, remove contact'
                cancelTooltip='No, do not remove it' onCancel={() => { updateState({ showPrompt: false, fileToRemove: '' }) }}
                onProceed={() => { removeContact(state.fileToRemove) }} onClose={() => { updateState({ showPrompt: false, fileToRemove: '' }) }} /> */}
        </Box >
    </Slide>)
}

export default AddClient;