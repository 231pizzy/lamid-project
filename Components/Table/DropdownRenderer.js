import React, { useState } from "react";
import WarningModal from "../WarningModal/WarningModal";
import { postRequestHandler2 } from "../requestHandler";
import { Box, Button, IconButton, Typography } from "@mui/material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MapResources from "../ScheduleComponents/MapResources";
import MediaRenderer from "./MediaRenderer";



const DropdownRenderer = (props) => {

    const [selected, setSelected] = useState(props.column.colDef.field);
    const [opened, setOpened] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState(null)
    const [decision, setDecision] = useState(null);
    const [message, setMessage] = useState(null);

    const [openMapResource, setOpenMapResource] = useState(false)

    const [processing, setProcessing] = useState(false)

    const [warningTitle, setWarningTitle] = useState(null);

    const languageMapping = {
        'English': 'en',
        'French': 'fr',
        'Arabic': 'ar',
        'German': 'de',
        'Spanish': 'es',
        'Portugese': 'pt'
    }


    const newActionMapping = {
        eaTools: {
            publish: ['view'],
            unpublish: ['view', 'edit', 'delete']
        },
        faq: {
            publish: ['view'],
            unpublish: ['view', 'edit', 'delete']
        }
    }

    const awardFundMessage = (name) => {
        console.log('group name', name);
        return `You are about to award this fund to "${name}"`
    }

    const rejectFundMessage = (name) => {
        return `You are about to reject "${name}" from this fund`
    }

    const messageMapping = {
        schedule: {
            publish: 'You are about to publish this schedule, which means it will be visible for everyone to see on the website.',
            unpublish: 'You are about to unpublish this schedule, which means it will no longer be visible on the website',
            cancel: 'You are about to cancel this schedule, which means all events will no longer hold'
        },
        resource: {
            publish: 'You are about to publish this resource, which means it will be visible for everyone to see on the website.',
            unpublish: 'You are about to unpublish this resource, which means it will no longer be visible on the website',
        },
        activistTools: {
            publish: 'This tool will be visible on the E A website, and the creator will also be notified',
            unpublish: 'This tool will no longer be visible on the E A website.',
            reject: 'It will not be published by rejecting this tool; it will be deleted, and the creator will be notified about this decision. ',
        },
        guestTools: {
            publish: 'This tool will be visible on the E A website, and the creator will also be notified',
            unpublish: 'This tool will no longer be visible on the E A website.',
            reject: 'It will not be published by rejecting this tool; it will be deleted, and the creator will be notified about this decision. ',
        },
        group: {
            accept: 'This group will be active on the E A website, and the group admin will also be notified',
            decline: 'This group will not be active on the E A website.',
        },
        faq: {
            publish: 'This faq will be visible on the E A website.',
            unpublish: 'This Faq will no longer be visible on the E A website, but can still be accessed on faq section in the cms.',
        },
        vote: {
            award: awardFundMessage(props?.data?.name?.label),
            rejectApplication: rejectFundMessage(props?.data?.name?.label),
        },
        externalFund: {
            publish: 'This external fund will be visible on the E A website.',
            unpublish: 'This external fund will no longer be visible on the E A website, but can still be accessed on funds section in the cms.',
        },
    }



    const { publishEndpoint, unPublishEndpoint, cancelEndpoint, showLanguageSlection, publishMessage, unpublishMessage, title, id,
        rejectEndpoint, acceptEndpoint, declineEndpoint, acceptMessage, rejectMessage, declineMessage,
        awardEndpoint, rejectApplicationEndpoint } = props.colDef.cellRendererParams


    const toggleDropdown = () => {
        setOpened(!opened)
    }

    const closeDropdown = () => {
        setOpened(false)
    }

    const handleCloseMapResource = () => {
        console.log('closing modal')
        setOpenMapResource(false)
    }

    const handleCloseWarning = () => {
        setShowWarning(false)
        setProcessing(false)

        setTimeout(() => {
            setDecision(null);
            setSelectedLanguages(null);
            setWarningTitle(null);
            setMessage(null);
        }, [1000])
    }


    const actionMapping = {
        publish: {
            endpoint: publishEndpoint, message: publishMessage, title: 'publish', newStatus: 'published',
            newDecisions: ['unpublish', 'cancel'], label: 'Publish'
        },
        unpublish: {
            endpoint: unPublishEndpoint, message: unpublishMessage, title: 'unpublish', newStatus: 'unpublished',
            newDecisions: ['publish', 'cancel'], label: 'Unpublish'
        },
        cancel: {
            endpoint: cancelEndpoint, message: unpublishMessage, title: 'cancel', newStatus: 'cancelled',
            newDecisions: ['publish'], label: 'Cancel'
        },
        reject: {
            endpoint: rejectEndpoint, message: rejectMessage, title: 'reject', newStatus: 'rejected',
            newDecisions: ['publish'], label: 'Reject'
        },
        accept: {
            endpoint: acceptEndpoint, message: acceptMessage, title: 'accept', newStatus: 'active',
            newDecisions: ['decline'], label: 'Accept'
        },
        decline: {
            endpoint: declineEndpoint, message: declineMessage, title: 'decline', newStatus: 'declined',
            newDecisions: ['accept'], label: 'Decline'
        },
        award: {
            endpoint: awardEndpoint, message: awardFundMessage(props?.data?.name), title: 'award', newStatus: 'awarded',
            newDecisions: ['rejectApplication'], label: 'Award'
        },
        rejectApplication: {
            endpoint: rejectApplicationEndpoint, message: rejectFundMessage(props?.data?.name),
            title: 'reject', newStatus: 'rejected', newDecisions: ['award'], label: 'Reject'
        },
    }



    const handleAction = async (action) => {
        setProcessing(true)
        await postRequestHandler2({
            route: `${actionMapping[action]?.endpoint}?id=${props.data.id}`,
            body: { id: JSON.stringify([props.data.id]) },
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)

                console.log(action);
                console.log('row data', props.data)
                props?.node.setData({
                    ...props.data, status: actionMapping[action]?.newStatus,
                    decision: actionMapping[action]?.newDecisions,
                    ...(newActionMapping[id] ? { actions: newActionMapping[id][action] } : {})
                });

                handleCloseWarning()
            },
            errorCallback: err => {
                console.log('error occured', err);
                setProcessing(false);
            }
        })
    }

    const handleSelectItem = async (item) => {
        // setSelected(item);
        closeDropdown()
        console.log('item', item)

        setDecision(item);
        setMessage(messageMapping[id][item])
        setWarningTitle(actionMapping[item]?.title)

        setTimeout(() => {
            setShowWarning(true)
        }, 100)

    }

    const messageTemplate = (title, message, showLanguages) => {
        return <div>
            <p style={{ marginBottom: '12px' }}>{message}</p>
        </div>
    }

    const options = props.value && [...props.value, props.column.colDef.field];

    const mappingRequired = ['justConcluded', 'concluded']
    return (
        props.value?.length
            ? props.data?.resourceId ?
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <MediaRenderer data={props.data} value={props.data?.media} />
                </Box>
                : mappingRequired.includes(props.data?.status)
                    ? <Box>
                        <Button sx={{
                            display: 'flex', maxWidth: 'max-content', alignItems: 'center', px: 1, py: .5,
                            bgcolor: '#E6F1FF', mt: .4
                        }} onClick={() => { setOpenMapResource(true) }}>
                            <Typography sx={{ color: 'primary.main', fontSize: 11, fontWeight: 600, mr: .1 }}>
                                Map Resource
                            </Typography>
                            <KeyboardArrowRight />
                        </Button>
                        {openMapResource && <MapResources scheduleId={props?.data?.id} defaultDate={props?.data?.date} open={openMapResource} handleClose={handleCloseMapResource} />}
                    </Box>
                    : <div >
                        <select onClick={(e) => { e.stopPropagation() }} value={selected} id="decisions" placeholder="Decision"
                            onChange={event => { handleSelectItem(event.currentTarget?.value); }}
                            style={{
                                background: '#4F92AB1A', color: '#4F92AB', textTransform: 'capitalize',
                                padding: '8px 10px', border: 'none',
                            }}>
                            {options.map((item, index) => {
                                return (
                                    <option key={index} value={item} style={{
                                        padding: '18px 10px', textTransform: 'capitalize',
                                        display: item === props.column.colDef.field ? 'none' : 'block',
                                        background: 'white',
                                    }}>
                                        {item === props.column.colDef.field
                                            ? props.column.colDef.field
                                            : actionMapping[item]?.label}
                                    </option>)
                            })}
                        </select>

                        {showWarning && <WarningModal
                            title={`${warningTitle} ${title}`}
                            open={showWarning}
                            message={messageTemplate(title, message, showLanguageSlection)}
                            status={processing ? 'submitting' : null}
                            proceedAction={async () => { await handleAction(decision) }}
                            handleCancel={handleCloseWarning}
                        />}

                        {/*  <Modal visibility={showWarning} handleClose={handleCloseWarning}>
                <WarningModal
                    title={`${warningTitle} ${title}`}
                    status={form.status}
                    componentMessage={messageTemplate(title, message, showLanguageSlection)}
                    proceedAction={async () => { await handleAction(decision) }}
                    cancelAction={handleCloseWarning} />
            </Modal> */}
                    </div>
            : <div></div>
    );
}

export default DropdownRenderer