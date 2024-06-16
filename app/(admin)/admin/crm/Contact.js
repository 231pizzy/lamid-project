'use client'

import {
    Box, Button, Typography, ButtonGroup, Tabs, Tab, Modal, Avatar, IconButton, Menu, MenuItem, SvgIcon
} from "@mui/material";
import { useDispatch } from "react-redux";

import { useState, useEffect, useRef, } from "react";

import More from "@mui/icons-material/MoreHorizOutlined";
import NextArrow from "@mui/icons-material/WestOutlined";

import { lighten } from '@mui/material/styles';
import GoalIndex from '@/Components/ContactGoal/GoalIndex'
import RankingVisualisation from '@/Components/RankingVisualisation/RankingVisualisation'

import { openSnackbar, setPageTitle, } from "@/Components/redux/routeSlice";

import {
    ContactPerson, ContactStatus, FigmaSvg,
    Handler, Info, LinkedinSvg, PdfSvg, EmailSvg, TwitterBlank, SupportSvg, EditSvg, DeleteSvg
} from "@/public/icons/icons";

import EmailClient from "./EmailClient";

import FollowUpForm from "./FollowUpForm";

import moment from "moment";

import Prompt from "@/Components/Prompt";

import AddClient from "./AddClient";

import { useRouter, useSearchParams } from "next/navigation";
import { createFollowUp, deleteContact, getClientContact } from "./helper";
import { progressData } from "./sampleData";
import StaffList from "@/Components/Staff/StaffList";
import { ProfileAvatarGroup } from "@/Components/ProfileAvatarGroup";
import ChangeStatus from "./ChangeStatus";
import ContactEmail from "@/Components/ContactEmail/ContactEmail";
import FacebookMessages from "@/Components/Facebook/FacebookMessages";
import Notes from "@/Components/Notes/Notes";

const iconStyle1 = { height: '20px', width: '20px' };

const HandlerIcon = <Handler style={{ ...iconStyle1 }} />
const ContactPersonIcon = <ContactPerson style={{ ...iconStyle1 }} />
const ContactStatusIcon = <ContactStatus style={{ ...iconStyle1 }} />
const SupportIcon = <SupportSvg style={iconStyle1} />


const statusColor = {
    introductory: '#257AFB',
    reinforcement: '#FF6C4B',
    conversion: '#4E944F',
    'not assigned': '#5D5D5D',
    client: '#FF6C4B'
}

export default function Contact() {
    const router = useRouter();
    const childRef = useRef(null);

    const dispatch = useDispatch();

    const searchParams = useSearchParams();
    const contactId = searchParams.get('id');

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Tools' }));

        handleGetContact();
        updateState({ childRef: childRef })

    }, [])


    const [state, setState] = useState({
        currentTab: 0, clientId: contactId, clientRecord: {}, openSendEmailForm: false, openFollowupForm: false,
        changesInRecord: { phone: 0, email: 0, inPerson: 0, letter: 0, online: 0 }, tabContactMode: 'phone',
        showMore: false, moreAnchor: null, showDeletePrompt: false, showEditContactForm: false, editCount: 0,
        childRef: null, childHeight: '100%', showHandlerOptions: false, showRepOptions: false,
        openStaffList: false, showSupervisorOptions: false, staffListUser: null, showStatusForm: false,
        showGoalCreateForm: false, rankingTab: 'appetite', showRankingTab: true
    });


    const getHeight = () => {
        if (state.childRef?.current) {
            return state.childRef.current.getBoundingClientRect().top
        }
    }

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const handleGetContact = () => {
        getClientContact({
            contactId: state.clientId, dataProcessor: (contact) => {
                updateState({
                    clientRecord: {
                        ...contact,
                        address: `${contact.street ?? ''}, ${contact.city ?? ''}, ${contact.state ?? ''}, ${contact.country ?? ''}`
                    }
                });
            }
        })
    }

    useEffect(() => {
        handleGetContact()
    }, [state.editCount])

    const changeTab = (event, index) => {
        updateState({ currentTab: index, tabContactMode: event.target.id })
    }

    const openSendEmailForm = (event) => {
        updateState({ openSendEmailForm: true })
    }

    const closeSendEmailForm = (event) => {
        updateState({ openSendEmailForm: false })
    }

    const closeStatusForm = () => {
        updateState({ showStatusForm: false })
    }

    const closeStaffList = () => {
        updateState({ openStaffList: false });
    }

    const openFollowupForm = (event) => {
        updateState({ openFollowupForm: true })
    }

    const closeFollowupForm = (event) => {
        updateState({ openFollowupForm: false })
    }

    const swtichToCRM = () => {
        router.back();
    }

    const switchRankingTab = (id) => {
        updateState({ rankingTab: id })
    }

    const updateFollowUp = (mode) => {
        updateState({ changesInRecord: { ...state.changesInRecord, [mode]: state.changesInRecord[mode] + 1 } })
    }

    const createFollowup = ({ date, time, contactMode, topic, details, rating, clientId }) => {

        createFollowUp({
            date: date, time: time, clientId: clientId, contactMode: contactMode, topic: topic,
            details: details, rating: rating, dataProcessor: () => {
                updateFollowUp(contactMode);
                closeFollowupForm()
            }
        });
    }

    const openMore = (event) => {
        updateState({ showMore: true, moreAnchor: event.currentTarget })
    }

    const closeMore = () => {
        updateState({ showMore: false, moreAnchor: null })
    }

    const confirmDelete = () => {
        updateState({ showDeletePrompt: true });
        closeMore()
    }

    const closedeletePrompt = () => {
        updateState({ showDeletePrompt: false })
    }

    const closeEditContactForm = (edited) => {
        updateState({ showEditContactForm: false, editCount: edited ? state.editCount + 1 : state.editCount })
    }

    const editContact = () => {
        updateState({ showEditContactForm: true })
        closeMore();
    }

    const handleDeleteContact = () => {
        deleteContact({
            contactId: state.clientRecord?._id, dataProcessor: () => {
                dispatch(openSnackbar({ message: 'Contact has been deleted', severity: 'success' }));
                closedeletePrompt();
                router.back();
            }
        })
    }

    const openHandlerOptions = (event) => {
        updateState({ showHandlerOptions: true, moreAnchor: event.currentTarget })
    }

    const openRepOptions = (event) => {
        updateState({ showRepOptions: true, moreAnchor: event.currentTarget })
    }

    const openSupervisorOptions = (event) => {
        updateState({ showSupervisorOptions: true, moreAnchor: event.currentTarget })
    }

    const MoreButton = (onclick) => {
        return <IconButton sx={{
            bgcolor: '#F5F5F5', p: .5
        }} onClick={onclick}>
            <More sx={{ fontSize: 15, color: '#5D5D5D' }} />
        </IconButton>
    }

    const openStatusChangeMenu = () => {
        updateState({ showStatusForm: true })
    }

    const heading = ({ onclick, label, icon, noButton, items, open, onClose, button }) => {
        return <Box sx={{
            px: 2, py: 1, color: '#5D5D5D', bgcolor: '#EEEEEE', display: 'flex', alignItems: 'center'
        }}>
            {icon}
            <Typography sx={{
                px: 2, fontWeight: 600, fontSize: { xs: 11, md: 12 },
                color: '#5D5D5D', bgcolor: '#EEEEEE'
            }}>
                {label}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {!noButton && MoreButton(onclick)}

            {button && button}

            {!noButton && <Menu anchorEl={state.moreAnchor} open={open} onClose={onClose}  >
                {items.map((data, index) => {
                    return <MenuItem key={index} sx={{
                        px: 1, py: .5, textTransform: 'capitalize', borderBottom: '1px solid #1C1D221A',
                        fontSize: 12, display: 'flex', alignItems: 'center'
                    }} onClick={data.action}>
                        {data.icon} {data.label}
                    </MenuItem>
                })}
            </Menu>}
        </Box>
    }

    const addHandler = () => {
        updateState({ staffListUser: 'handler', openStaffList: true })
    }


    const addSupervisor = () => {
        updateState({ staffListUser: 'supervisor', openStaffList: true })
    }


    const addRep = () => {
        updateState({ staffListUser: 'rep', openStaffList: true })
    }

    const toggleRanking = () => {
        updateState({ showRankingTab: !state.showRankingTab })
    }

    const iconStyle = { width: '20px', height: '20px', marginRight: '8px' }

    const moreElements = [
        { label: 'Edit', value: 'edit', icon: <EditSvg style={iconStyle} />, action: editContact },
        { label: `Delete ${state.clientRecord?.stage}`, value: 'delete', icon: <DeleteSvg style={iconStyle} />, action: confirmDelete },
    ]

    const handlerMoreElements = [
        { label: state.clientRecord?.handler?.length > 0 ? 'Update Handler' : `Add Handler`, value: 'add', icon: <Handler style={iconStyle} />, action: addHandler },
        // ...(state.clientRecord?.handler?.length > 0 ? [{ label: 'Remove handler', value: 'remove', icon: <Close style={iconStyle} />, action: removeHandler }] : []),
    ]

    const supervisorMoreElements = [
        { label: state.clientRecord?.supervisor?.length > 0 ? 'Update Supervisor' : 'Add Supervisor', value: 'add', icon: <ContactPerson style={iconStyle} />, action: addSupervisor },
        //  ...(state.clientRecord?.supervisor?.length > 0 ? [{ label: `Remove Supervisor`, value: 'delete', icon: <Close style={iconStyle} />, action: removeSupervisor }] : []),
    ]

    const RepMoreElements = [
        { label: state.clientRecord?.rep?.length > 0 ? 'Update Rep' : 'Add Rep', value: 'add', icon: <SupportSvg style={iconStyle} />, action: addRep },
        // ...(state.clientRecord?.rep?.length > 0 ? [{ label: `Remove Rep`, value: 'delete', icon: <Close style={iconStyle} />, action: removeRep }] : []),
    ]

    const titleMapping = {
        handler: 'Assign Handler',
        rep: 'Assign Rep',
        supervisor: 'Assign Supervisor'
    }

    const progressDataSample = progressData(state)


    return (
        Object.keys(state.clientRecord).length ?
            <Box sx={{
                maxWidth: '100%', maxHeight: 'calc(100vh - 78px)', overflowY: 'hidden',
            }}>
                {/* Toolbar */}
                < Box sx={{ bgcolor: '#F5F5F5', py: 1, px: 2, display: 'flex', alignItems: 'center' }}>
                    {/* Back button */}
                    < IconButton sx={{
                        mr: 2, bgcolor: 'white', border: '1.5px solid rgba(28, 29, 34, 0.1)', p: .5
                    }}
                        onClick={swtichToCRM}>
                        <NextArrow sx={{ color: '#5D5D5D', fontSize: 15 }} />
                    </IconButton >

                    {/* Contact detail label */}
                    < Typography sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 700, textTransform: 'uppercase' }}>
                        {state.clientRecord.stage}
                    </Typography >

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{
                        display: 'flex', cursor: 'pointer', bgcolor: '#EFEFEF', justifyContent: 'center',
                        border: '1.5px solid rgba(28, 29, 34, 0.1)', borderRadius: '6px', mr: 2,
                        boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', p: .5,
                    }}
                    /* onClick={(event) => { openSendEmailForm(event) }} */
                    >
                        <EmailSvg style={{ height: '20px', width: '20px' }} />
                    </Box>

                    {/* Add follow up button */}
                    <Button variant='contained' sx={{
                        mr: 2, py: .5, borderRadius: '8px', border: 0, bgcolor: 'primary.main',
                        color: "white", fontSize: 12
                    }} /* onClick={openFollowupForm} */>
                        Convert to Client
                    </Button>
                </Box >

                {/* Content */}
                <Box /* ref={state.childRef} */ sx={{
                    maxWidth: '100%', display: 'flex', pt: 2, alignItems: 'flex-start',
                    justifyContent: { xs: 'flex-start', md: 'center', xl: 'space-between' }, px: { xs: 1, md: 2 }, pb: 2,
                    flexDirection: { xs: 'column', md: 'row' },
                    height: `calc(100vh - 150px)`, overflowY: 'scroll',
                }}>
                    {/* Contact details section */}
                    <Box sx={{
                        display: 'block', pb: 2, width: { xs: '100%', md: '220px', xl: '300px' },
                        bgcolor: 'white', borderRadius: '8px', overflow: 'hidden',
                        boxShadow: '0px 8px 12px 0px #0000000A',
                        border: '1px solid rgba(28, 29, 34, 0.1)', mr: { md: 2, },
                    }}>
                        {/* Heading */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, bgcolor: 'white' }}>

                            <Typography sx={{
                                fontSize: 12, textTransform: 'uppercase', fontWeight: 700,
                                display: 'flex', alignItems: 'center'
                            }}>
                                <Info style={{
                                    height: '20px', width: '20px', marginRight: '4px',
                                }} />
                                Profile
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            {MoreButton(openMore)}

                            <Menu anchorEl={state.moreAnchor} open={state.showMore} onClose={closeMore}  >
                                {moreElements.map((data, index) => {
                                    return <MenuItem key={index} sx={{
                                        px: 1, py: .5, textTransform: 'capitalize', borderBottom: '1px solid #1C1D221A',
                                        fontSize: 12, display: 'flex', alignItems: 'center'
                                    }} onClick={data.action}>
                                        {data.icon} {data.label}
                                    </MenuItem>
                                })}
                            </Menu>
                        </Box>

                        {/* Client details */}
                        <Box sx={{
                            p: { xs: 2, }, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                            bgcolor: '#FBFBFB'
                        }}>
                            <Box>
                                {/* Contact Name */}
                                <Typography sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 700 }}>
                                    {state.clientRecord.fullName}
                                </Typography>
                                {/* Company name */}
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.company}
                                </Typography>

                                {/* Sector */}
                                <Typography sx={{ fontSize: { xs: 12, md: 11 }, mt: 1.5, fontWeight: 600, color: '#8D8D8D' }}>
                                    SECTOR
                                </Typography>
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.sector}
                                </Typography>

                                {/* Email */}
                                <Typography sx={{ fontSize: { xs: 12, md: 11 }, mt: 1.5, fontWeight: 600, color: '#8D8D8D' }}>
                                    EMAIL
                                </Typography>
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.email}
                                </Typography>

                                {/* Phone */}
                                <Typography sx={{ fontSize: { xs: 12, md: 11 }, mt: 1.5, fontWeight: 600, color: '#8D8D8D' }}>
                                    PHONE
                                </Typography>
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.phone}
                                </Typography>

                                {/* Address */}
                                <Typography sx={{ fontSize: { xs: 12, md: 11 }, mt: 1.5, fontWeight: 600, color: '#8D8D8D' }}>
                                    ADDRESS
                                </Typography>
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.address}
                                </Typography>

                                {/* Twitter */}
                                <Typography sx={{
                                    fontSize: { xs: 12, md: 11 }, mt: 1.5, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', color: '#8D8D8D'
                                }}>
                                    <TwitterBlank style={{ height: '15px', marginRight: '4px', width: '15px' }} /> TWITTER
                                </Typography>
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.social?.twitter || '---'}
                                </Typography>

                                {/* LinkedIn */}
                                <Typography sx={{
                                    fontSize: { xs: 12, md: 11 }, mt: 1.5, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', color: '#8D8D8D'
                                }}>
                                    <LinkedinSvg style={{ height: '15px', marginRight: '4px', width: '15px' }} /> LinkedIn
                                </Typography>
                                <Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 500 }}>
                                    {state.clientRecord.social?.linkedin || '---'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Contact status */}
                        {heading({
                            label: 'Status', icon: ContactStatusIcon, noButton: true,
                            button: <Button variant="text" sx={{ fontSize: 11 }} onClick={openStatusChangeMenu}>
                                Change Status
                            </Button>
                        })}
                        <Typography sx={{
                            bgcolor: lighten(statusColor[state.clientRecord.status], 0.85),
                            px: 2, py: .5, display: 'flex', borderRadius: '20px', justifyContent: 'center', alignItems: 'center',
                            color: statusColor[state.clientRecord.status], maxWidth: 'max-content', m: 2,
                            fontSize: 12, fontWeight: 600, boxShadow: '0px 8px 12px 0px rgba(0, 0, 0, 0.04)',
                            textTransform: 'capitalize', border: '1px solid', borderColor: statusColor[state.clientRecord.status]
                        }}>
                            {state.clientRecord.status}
                        </Typography>

                        {/* Handler */}
                        {heading({
                            label: 'Handler', icon: HandlerIcon, onclick: openHandlerOptions,
                            open: state.showHandlerOptions, items: handlerMoreElements,
                            onClose: () => { updateState({ showHandlerOptions: false, moreAnchor: null }) }
                        })}

                        <Box sx={{ mr: 'auto', ml: 2, maxWidth: 'max-content', py: 1 }}>
                            <ProfileAvatarGroup emailArray={state.clientRecord?.handler}
                                color='#EF2B2B' bgcolor='white' diameter={25} max={3} />
                        </Box>

                        {/* Other rep */}
                        {heading({
                            label: 'Other Rep', icon: SupportIcon, open: state.showRepOptions, onclick: openRepOptions,
                            items: RepMoreElements, onClose: () => { updateState({ showRepOptions: false, moreAnchor: null }) }
                        })}

                        <Box sx={{ mr: 'auto', ml: 2, maxWidth: 'max-content', py: 1 }}>
                            <ProfileAvatarGroup emailArray={state.clientRecord?.rep}
                                color='#EF2B2B' bgcolor='white' diameter={25} max={3} />
                        </Box>

                        {/* Supervisor */}
                        {heading({
                            label: 'Supervisor', icon: ContactPersonIcon, open: state.showSupervisorOptions, onclick: openSupervisorOptions,
                            items: supervisorMoreElements, onClose: () => { updateState({ showSupervisorOptions: false, moreAnchor: null }) }
                        })}

                        <Box sx={{ mr: 'auto', ml: 2, maxWidth: 'max-content', py: 1 }}>
                            <ProfileAvatarGroup emailArray={state.clientRecord?.supervisor}
                                color='#EF2B2B' bgcolor='white' diameter={25} max={3} />
                        </Box>
                    </Box>

                    {/*Goals */}
                    <GoalIndex clientId={contactId}
                        stage={state.clientRecord?.status}
                    />

                    {/* Third column */}
                    <Box sx={{ pl: { md: 2, }, width: { xs: '90vw', md: '400px', xl: '500px' }, }}>
                        {/* Contact ranking visualisation */}
                        <RankingVisualisation clientId={contactId} />

                        {/* Email */}
                        <ContactEmail clientId={contactId}
                            fullName={state.clientRecord?.fullName}
                            emailAddress={state.clientRecord?.email}
                        />

                        {/* Facebook messages */}
                        <FacebookMessages clientId={contactId}
                            fullName={state.clientRecord?.fullName}
                            emailAddress={state.clientRecord?.email}
                        />

                        {/* Notes */}
                        <Notes clientId={contactId}
                            fullName={state.clientRecord?.fullName}
                            emailAddress={state.clientRecord?.email}
                        />
                    </Box>
                </Box>

                {state.showStatusForm && <ChangeStatus open={state.showStatusForm}
                    id={contactId}
                    handleClose={closeStatusForm}
                    currentStatus={state.clientRecord?.status}
                />}

                <Modal open={state.openSendEmailForm} onClose={closeSendEmailForm}>
                    <EmailClient email={[state.clientRecord.email]} profilePicture={'cddfd'} fullName={state.clientRecord.fullName} closeForm={closeSendEmailForm} />
                </Modal>

                <Modal open={state.openFollowupForm} onClose={closeFollowupForm}>
                    <FollowUpForm saveFormData={createFollowup} clientId={state.clientId}
                        closeForm={closeFollowupForm} updateFollowUp={updateFollowUp} />
                </Modal>

                <Modal open={state.openStaffList} onClose={closeStaffList}>
                    <StaffList handleClose={closeStaffList} title={titleMapping[state.staffListUser]}
                        existingStaffList={state.clientRecord[state.staffListUser]} id={contactId}
                        submitEndPoint={'/api/update-handler'} valuekey={state.staffListUser} />
                </Modal>

                <Prompt {...{
                    open: state.showDeletePrompt, onClose: closedeletePrompt, message: 'You are about to delete this contact',
                    proceedTooltip: 'Alright, delete it', cancelTooltip: 'No. Do not delete it', onCancel: closedeletePrompt,
                    onProceed: handleDeleteContact
                }} />

                {state.showEditContactForm && <Modal open={state.showEditContactForm} onClose={closeEditContactForm}>
                    <AddClient closeForm={closeEditContactForm} editMode={true} clientRecord={state.clientRecord} />
                </Modal>}

            </Box > :
            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, py: 4 }}>
                Fetching data
            </Typography>
    )
}
