import { CalendarSvg, DeleteSvg, EditSvg, FollowupAction } from "@/public/icons/icons";
import { Add, KeyboardArrowDown, KeyboardArrowRight, MoreHoriz } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import FollowupReport from "./FollowupReport";
import { getRequestHandler, postRequestHandler } from "../requestHandler";
import Loader from "../Loader";
import Prompt from "../Prompt";
import CreateGoal from "./CreateGoal";
import CreateFollowupReport from "./CreateFollowupReport";

export default function GoalCard({ index, status, clientId, goalId, goalName, clientStage, dueDate, followupUsed, maxFollowup }) {
    const [showAll, setShowAll] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [showGoalCreateForm, setShowGoalCreateForm] = useState(false);
    const [goalEditData, setGoalEditData] = useState(null);

    const [showFollowupForm, setShowFollowupForm] = useState(false);

    const [followupData, setFollowupData] = useState(null);

    const progress = {
        todo: { id: 'todo', color: '#257AFB', label: 'To do' },
        inProgress: { id: 'inProgress', color: '#FF6C4B', label: 'In Progress' },
        completed: { id: 'completed', color: '#4E944F', label: 'Completed' },
    }

    useEffect(() => {
        setShowAll(false)
    }, [/* followupData */])

    useEffect(() => {
        if (showAll) {
            setFetching(true)
            getRequestHandler({
                route: `/api/get-followup-data/?id=${goalId}`,
                successCallback: body => {
                    const result = body?.result;
                    setFetching(false)
                    setFollowupData(result || [])
                },
                errorCallback: err => {
                    console.log('Something went wrong', err)
                    setFetching(false)
                }
            })
        }
    }, [showAll])

    useEffect(() => {
        if (showGoalCreateForm) {
            getRequestHandler({
                route: `/api/get-contact-goals/?goalId=${goalId}`,
                successCallback: body => {
                    const result = body?.result;
                    setGoalEditData(result || {})
                },
                errorCallback: err => {
                    console.log('Something went wrong', err)
                }
            })
        }
    }, [showGoalCreateForm])

    const statusObject = progress[status]

    const toggleShowAll = () => {
        setShowAll(!showAll)
    }

    const closeMenu = () => {
        setShowMenu(false)
        setMoreAnchor(null)
    }

    const openMore = (event) => {
        setMoreAnchor(event.currentTarget);
        setShowMenu(true)
    }

    const handleDeleteGoal = () => {
        setSubmitting(true)
        getRequestHandler({
            route: `/api/delete-contact-goal/?id=${goalId}`,
            successCallback: body => {
                setSubmitting(false)
                window.location.reload()
            },
            errorCallback: err => {
                console.log('Something went wrong', err)
                setSubmitting(false)
            }
        })
    }

    const startGoal = async () => {
        await postRequestHandler({
            route: '/api/start-contact-goal',
            body: { goalId },
            successCallback: body => {
                window.location.reload()
            },
            errorCallback: err => {
                console.log('something went wrong', err)
            }
        })
    }

    const MoreButton = (onclick) => {
        return <IconButton sx={{
            bgcolor: '#F5F5F5', p: .5
        }} onClick={onclick}>
            <MoreHoriz sx={{ fontSize: 13, color: '#5D5D5D' }} />
        </IconButton>
    }

    const editGoal = () => {
        setShowGoalCreateForm(true)
    }

    const confirmDelete = () => {
        setShowDeletePrompt(true)
    }

    const closedeletePrompt = () => {
        setShowDeletePrompt(false)
    }

    const closeCreateGoalForm = () => {
        setShowGoalCreateForm(false)
    }

    const openFollowupForm = () => {
        setShowFollowupForm(true)
    }

    const closeFollowupForm = () => {
        setShowFollowupForm(false)
    }

    const iconStyle = { width: '20px', height: '20px', marginRight: '8px' }

    const moreElements = [
        { label: 'Edit Goal', value: 'edit', icon: <EditSvg style={iconStyle} />, action: editGoal },
        { label: `Delete Goal`, value: 'delete', icon: <DeleteSvg style={iconStyle} />, action: confirmDelete },
    ]

    return <Box sx={{
        display: 'flex', flexDirection: 'column', my: 1.5, width: '100%', bgcolor: 'white', border: '1px solid #1C1D221A',
        borderRadius: '8px', overflow: 'hidden', boxShadow: '8px 8px 20px 0px #4F4F4F14, -8px -8px 20px 0px #4F4F4F14'
    }}>
        {/* Heading */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 2, borderBottom: '1px solid #1C1D221A' }}>
            {/* Goal - {index} */}
            <Typography sx={{ fontWeight: 700, fontSize: 11, mr: 1 }}>
                GOAL - {index + 1}
            </Typography>

            {/* Goal Status */}
            <Typography sx={{
                fontSize: 8, color: statusObject?.color, border: `1px solid ${statusObject?.color}`,
                p: .5, borderRadius: '8px', fontWeight: 500, bgcolor: `${statusObject?.color}10`
            }} >
                {statusObject?.label}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Due date */}
            <Typography sx={{
                fontSize: 11, color: '#8D8D8D', border: `1px solid #8D8D8D`, p: .5, borderRadius: '8px',
                bgcolor: '#1C1D220A', mr: 1, display: 'flex', alignItems: 'center', fontWeight: 600,
            }}>
                <CalendarSvg style={{ width: '15px', height: '15px', marginRight: '4px' }} />  Due : {moment(dueDate, 'yyyy/MM/DD').format('MMM DD').toString()}
            </Typography>

            {/* Follow up count */}
            <Box sx={{
                border: `1px solid #8D8D8D`, p: .5, borderRadius: '8px',
                bgcolor: '#1C1D220A', mr: 1, display: 'flex', alignItems: 'center'
            }}>
                <FollowupAction style={{ width: '15px', height: '15px' }} />
                <Typography sx={{ fontSize: 11, color: '#8D8D8D', mx: .5, fontWeight: 600 }}>
                    Follow - up
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#8D8D8D', mr: .5, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    (<b style={{ color: '#257AFB' }}>{followupUsed}</b> / <b style={{ color: '#BF0606' }}>{maxFollowup}</b>)
                </Typography>
                {status === 'inProgress' && Number(followupUsed) < Number(maxFollowup) && <IconButton sx={{ p: .1, color: 'primary.main', bgcolor: '#BF06061A' }}
                    onClick={openFollowupForm}>
                    <Add sx={{ fontSize: 11 }} />
                </IconButton>}
            </Box>

            {/* More */}
            {status === 'todo' && MoreButton(openMore)}

            {status === 'todo' && <Menu anchorEl={moreAnchor} open={showMenu} onClose={closeMenu}  >
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

        {/*  Goal name*/}
        <Typography sx={{
            px: 1.5, py: 1, fontSize: 13, fontWeight: 500,
            borderBottom: status === 'completed' ? '1px solid #1C1D221A' : 'none'
        }}>
            {goalName}
        </Typography>

        {/* Start goal or see follow ups */}
        <Box sx={{ width: '100%', display: 'flex', py: 1.5 }}>
            {status === 'todo' && <Button sx={{
                fontSize: 11, color: '#8D8D8D', border: `1px solid #8D8D8D`, p: .5, borderRadius: '8px',
                bgcolor: '#1C1D220A', ml: 'auto', mr: 1.5, display: 'flex', alignItems: 'center', fontWeight: 600,
            }} onClick={startGoal}>
                Click to start this goal
            </Button>}

            {(status === 'inProgress' || status === 'completed') && <Box sx={{
                display: 'flex', alignItems: 'center', width: '100%',
                justifyContent: status === 'inProgress' ? 'center' : 'space-between'
            }}>
                <Button variant='text' sx={{
                    fontSize: 11, py: .1, px: 1, ml: status === 'completed' ? 1.5 : 0,
                    width: status === 'inProgress' ? '100%' : 'max-content', bgcolor: showAll ? '#BF06060F' : 'white',
                }}
                    onClick={toggleShowAll}>
                    {showAll ? 'Hide' : 'See'} all follow up <KeyboardArrowDown />
                </Button>

                {status === 'completed' && <Typography sx={{
                    color: 'white', bgcolor: '#4E944F', px: 1, py: .5, borderRadius: '8px', mr: 2,
                    fontSize: 11, fontWeight: 500,
                }}>
                    Goal Completed
                </Typography>}
            </Box>}
        </Box>

        {/* Send evaluation form */}
        {status === 'completed' && <Button sx={{
            fontSize: 11, color: '#8D8D8D', borderTop: `1px solid #8D8D8D`, p: .5, width: '100%',
            bgcolor: '#1C1D220A', display: 'flex', alignItems: 'center', fontWeight: 600, borderRadius: '0'
        }}>
            Click here to send prospect evaluation form for this goal <KeyboardArrowRight />
        </Button>}

        {/* Follow up reports */}
        {showAll && status !== 'todo' && <Box>
            {followupData ? followupData?.map((item, index) => {
                return <FollowupReport key={index}
                    goalName={goalName} goalProgress={status} goalId={goalId}
                    index={index} clientStage={clientStage}
                    report={item} clientId={clientId} />
            }) : <Loader />}
        </Box>}

        <Prompt {...{
            open: showDeletePrompt, onClose: closedeletePrompt, message: 'You are about to delete this contact goal',
            proceedTooltip: 'Alright, delete it', cancelTooltip: 'No. Do not delete it', onCancel: closedeletePrompt,
            onProceed: handleDeleteGoal, submitting
        }} />

        {showGoalCreateForm && goalEditData && <CreateGoal goalData={goalEditData} goalId={goalId} id={null} open={showGoalCreateForm} handleClose={closeCreateGoalForm} />}
        {showFollowupForm && <CreateFollowupReport open={showFollowupForm} handleClose={closeFollowupForm} id={clientId}
            goalName={goalName} goalProgress={status} goalId={goalId} index={index} clientStage={clientStage} />}
    </Box>
}