import { CalendarSvg, DeleteSvg, EditSvg, EmailSvg, FacebookSvg, InPersonSvg, LetterSvg, MailSvg, OnlineSvg } from "@/public/icons/icons";
import { AccessTime, MoreHoriz, Star } from "@mui/icons-material";
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import Phone from "@mui/icons-material/PhoneOutlined";

import moment from "moment";
import { useState } from "react";
import { Heading } from "./Heading";
import { ProfileAvatar } from "../ProfileAvatar";
import { getRequestHandler } from "../requestHandler";
import Prompt from "../Prompt";
import CreateFollowupReport from "./CreateFollowupReport";
import CreateSupervisorEvaluationReport from "./CreateSupervisorEvaluationReport";

export default function ReportSheet({ category, report, progressStatus, index, clientStage,
    clientId, goalName, handlerName }) {
    console.log('reportsheet', report)
    const [open, setOpen] = useState(null);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [showFollowupForm, setShowFollowupForm] = useState(false);
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const iconStyle = { height: '12px', width: '12px', marginRight: '4px' }
    const contactModeMapping = {
        email: <MailSvg style={iconStyle} />,
        phone: <Phone sx={{ fontSize: 12, mr: 1, color: '#257AFB' }} />,
        inPerson: <InPersonSvg style={iconStyle} />,
        online: <OnlineSvg style={iconStyle} />,
        letter: <LetterSvg style={iconStyle} />,
        facebook: <FacebookSvg style={iconStyle} />
    }

    const actionMapping = {
        todo: { color: '#F4CD1E', label: 'To Do' },
        review: { color: '#F24DD8', label: 'Review' },
        complete: { color: '#008000', label: 'Complete' },
    }

    const openMore = (event) => {
        setMoreAnchor(event.currentTarget);
        setShowMenu(true)
    }

    const handleOpen = (id) => {
        setOpen(open === id ? null : id)
    }

    const closeFollowupForm = () => {
        category === 'handler' ? setShowFollowupForm(false) : setShowEvaluationForm(false)
    }

    const editReport = () => {
        category === 'handler' ? setShowFollowupForm(true) : setShowEvaluationForm(true)
    }

    const closeMenu = () => {
        setShowMenu(false)
        setMoreAnchor(null)
    }


    const confirmDelete = () => {
        setShowDeletePrompt(true)
    }

    const closedeletePrompt = () => {
        setShowDeletePrompt(false)
    }

    const handleDeleteFollowupReport = () => {
        setDeleting(true)
        getRequestHandler({
            route: category === 'handler'
                ? `/api/delete-followup-report/?id=${report?._id}`
                : `/api/delete-evaluation-report/?id=${report?._id}`,
            successCallback: body => {
                setDeleting(false)
                window.location.reload()
            },
            errorCallback: err => {
                console.log('Something went wrong', err)
                setDeleting(false)
            }
        })
    }

    const iconStyle1 = { width: '20px', height: '20px', marginRight: '8px' }

    const moreElements = [
        { label: category === 'handler' ? 'Edit Followup Report' : 'Edit Evaluation', value: 'edit', icon: <EditSvg style={iconStyle1} />, action: editReport },
        { label: category === 'handler' ? `Delete Followup Report` : 'Delete Evaluation', value: 'delete', icon: <DeleteSvg style={iconStyle1} />, action: confirmDelete },
    ]

    const MoreButton = (onclick) => {
        return <IconButton sx={{
            bgcolor: '#F5F5F5', p: .5
        }} onClick={onclick}>
            <MoreHoriz sx={{ fontSize: 13, color: '#5D5D5D' }} />
        </IconButton>
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Personal data */}
        <Box sx={{
            display: 'flex', alignItems: 'center', borderBottom: '1px solid #1C1D221A',
            justifyContent: 'space-between', px: 1.5, py: 1
        }}>
            {/* Name and image */}
            <Box sx={{
                display: 'flex', alignItems: 'center', px: 1, py: .5, bgcolor: '#1C1D220A',
                borderRadius: '12px', border: '1px solid #1C1D221A'
            }}>
                <ProfileAvatar src={report?.email} fullName={report?.fullName} diameter={15} byEmail={true} />
                <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
                    {report?.fullName}
                </Typography>
            </Box>

            {/* More */}
            {progressStatus === 'inProgress' && MoreButton(openMore)}

            {progressStatus === 'inProgress' && <Menu anchorEl={moreAnchor} open={showMenu} onClose={closeMenu}  >
                {moreElements.map((data, index) => {
                    return <MenuItem key={index} sx={{
                        px: 1, py: .5, textTransform: 'capitalize', borderBottom: '1px solid #1C1D221A',
                        fontSize: 12, display: 'flex', alignItems: 'center'
                    }} onClick={data.action}>
                        {data.icon} {data.label}
                    </MenuItem>
                })}
            </Menu>}
        </Box>

        {/* Date, time and contact mode */}
        {category === 'handler' && <Box sx={{
            display: 'flex', alignItems: 'center', borderBottom: '1px solid #1C1D221A', px: 1.5, py: 1
        }}>
            {/* Date and time */}
            <Box sx={{
                display: 'flex', alignItems: 'center', px: 1, py: .5, bgcolor: '#1C1D220A',
                borderRadius: '12px', mr: 2, border: '1px solid #1C1D221A'
            }}>
                <Typography sx={{
                    color: '#8D8D8D', fontSize: 10, fontWeight: 600, mr: 1,
                    display: 'flex', alignItems: 'center',
                }}>
                    <CalendarSvg style={{ height: '15px', width: '15px', marginRight: '4px' }} />
                    {moment(report?.date, 'yyyy/MM/DD').format('DD/MM/yyyy')}
                </Typography>

                <Typography sx={{
                    color: '#8D8D8D', fontSize: 10, fontWeight: 600,
                    display: 'flex', alignItems: 'center',
                }}>
                    <AccessTime sx={{ height: '15px', width: '15px', mr: .5 }} />
                    {moment(report?.time, 'HH:mm').format('h:mma')}
                </Typography>
            </Box>

            {/* Contact mode */}
            <Box sx={{
                display: 'flex', alignItems: 'center', px: 1, py: .5, bgcolor: '#1C1D220A',
                borderRadius: '12px', border: '1px solid #1C1D221A'
            }}>
                <Typography sx={{ color: '#8D8D8D', fontSize: 10, fontWeight: 600, mr: 1 }}>
                    Mode of contact:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {report?.contactMode?.map(i => contactModeMapping[i])}
                </Box>
            </Box>
        </Box>}

        {/* Questions and answers section */}
        {/* Heading */}
        <Heading handleOpen={handleOpen} open={open} id='qa'
            label={`${category}'s evaluation of ${category === 'handler' ? 'Prospect' : 'Handler'}`}
            color={'black'} bgcolor={'#1C1D220A'}
        />

        {/* Content */}
        {open === 'qa' && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {report?.questionAndAnswers?.map((item, index) => {
                return <Box key={index} sx={{
                    display: 'flex', flexDirection: 'column', px: 1.5, py: 1,
                    borderBottom: '1px solid #1C1D221A'
                }}>
                    <Typography sx={{ fontSize: 12, mb: .5 }}>
                        {item?.question}
                    </Typography>

                    <Typography sx={{
                        fontSize: 11, fontWeight: 600, p: .6, bgcolor: '#1C1D220A', textTransform: 'capitalize',
                        border: '1px solid #1C1D221A', maxWidth: 'max-content', borderRadius: '8px'
                    }}>
                        {item?.answer}
                    </Typography>
                </Box>
            })}
        </Box>}

        {/* Performance */}
        {/* Heading */}
        {category === 'supervisor' && <Heading handleOpen={handleOpen} open={open} id='handlerPerformance'
            label={`${handlerName}'s overall impact with prospect`}
            color={'black'} bgcolor={'#1C1D220A'}
        />}

        {/* Content */}
        {category === 'supervisor' && open === 'handlerPerformance' &&
            <Typography sx={{
                color: '#8D8D8D', fontSize: 10, fontWeight: 500, maxWidth: 'max-content',
                display: 'flex', alignItems: 'center', px: 1, py: .5, my: 1, ml: 1.5, bgcolor: '#1C1D220A',
                borderRadius: '8px', border: '1px solid #1C1D221A'
            }}>
                Performance: <Star sx={{ color: '#F4CD1E', fontSize: 12, ml: .5 }} /> <b>{Number.isInteger(Number(report?.handlerPerformance)) ? `${report?.handlerPerformance}/4` : 'N/A'}</b>
            </Typography>}

        {/* Appetite ranking */}
        {/* Heading */}
        <Heading handleOpen={handleOpen} open={open} id={`${category}AppetiteRanking`}
            label={`Prospect appetite ranking`}
            color={'black'} bgcolor={'#1C1D220A'}
        />

        {/* Content */}
        {open === `${category}AppetiteRanking` &&
            <Typography sx={{
                color: '#8D8D8D', fontSize: 10, fontWeight: 500, maxWidth: 'max-content',
                display: 'flex', alignItems: 'center', px: 1, py: .5, my: 1, ml: 1.5, bgcolor: '#1C1D220A',
                borderRadius: '8px', border: '1px solid #1C1D221A'
            }}>
                Rating: <Star sx={{ color: '#F4CD1E', fontSize: 12, ml: .5 }} /> <b>{Number.isInteger(Number(report?.appetiteRanking)) ? `${report?.appetiteRanking}/4` : 'N/A'}</b>
            </Typography>}


        {/* Outcome */}
        {/* Heading */}
        <Heading handleOpen={handleOpen} open={open} id={`${category}outcome`}
            label={category === 'handler' ? 'Outcome' : 'Call to action'}
            color={'black'} bgcolor={'#1C1D220A'}
        />

        {/* Content */}
        {open === `${category}outcome` && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {Object.keys(report.outcome)?.map((item, index) => {
                return <Box key={index} sx={{
                    display: 'flex', flexDirection: 'column', px: 1.5, py: 1,
                    borderBottom: '1px solid #1C1D221A'
                }}>
                    <Typography sx={{ fontSize: 12, mb: .5, fontWeight: 700, color: actionMapping[item]?.color }}>
                        {actionMapping[item]?.label}
                    </Typography>


                    <Typography sx={{
                        fontSize: 11, fontWeight: 500, maxWidth: 'max-content',
                    }} dangerouslySetInnerHTML={{ __html: (report.outcome || {})[item] }}>
                    </Typography>
                </Box>
            })}
        </Box>}

        {/* Next step */}
        {/* Heading */}
        <Heading handleOpen={handleOpen} open={open} id={`nextStep`}
            label={'Next Step'}
            color={'black'} bgcolor={'#1C1D220A'}
        />

        {/* Content */}
        {open === 'nextStep' && <Typography sx={{
            fontSize: 11, fontWeight: 500, maxWidth: 'max-content', px: 1.5, py: 1
        }} dangerouslySetInnerHTML={{ __html: report.nextStep }}>
        </Typography>}

        <Prompt {...{
            open: showDeletePrompt, onClose: closedeletePrompt,
            message: `You are about to delete this ${category === 'handler' ? 'follow up' : 'evaluation'} report`,
            proceedTooltip: 'Alright, delete it', cancelTooltip: 'No. Do not delete it', onCancel: closedeletePrompt,
            onProceed: handleDeleteFollowupReport, submitting: deleting
        }} />

        {showFollowupForm && <CreateFollowupReport open={showFollowupForm} followupId={report?._id}
            handleClose={closeFollowupForm} id={clientId} followupData={report}
            goalName={goalName} goalProgress={progressStatus} goalId={report?.goalId}
            index={index} clientStage={clientStage} />}

        {showEvaluationForm && <CreateSupervisorEvaluationReport open={showEvaluationForm}
            handleClose={closeFollowupForm} id={clientId}
            goalName={goalName}
            goalProgress={progressStatus}
            goalId={report?.goalId}
            evaluationId={report?._id}
            index={index}
            followupData={report}
            handlerName={report?.fullName}
            followupId={report?.followupId}
            clientStage={clientStage} />}
    </Box>
}