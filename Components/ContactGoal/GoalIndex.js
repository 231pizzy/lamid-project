import { ContactStatus, ConversionSvg, IntroductorySvg, NotAssignedSvg, ReinforcementSvg } from "@/public/icons/icons";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GoalCard from "./GoalCard";
import CreateGoal from "./CreateGoal";
import { getRequestHandler } from "../requestHandler";
import Loader from "../Loader";

export default function GoalIndex({ clientId, stage, }) {
    const [currentTab, setCurrentTab] = useState('todo');

    const [tabData, setTabData] = useState(null)
    const [fetching, setFetching] = useState(false);
    const [progressData, setProgessData] = useState(null);

    const [showGoalCreateForm, setShowCreateGoalForm] = useState(false)

    useEffect(() => {
        progressData && setTabData(progressData?.filter(i => i?.progessStatus === currentTab))
    }, [currentTab, progressData])

    useEffect(() => {
        // setFetching(true)
        getRequestHandler({
            route: `/api/get-contact-goals/?id=${clientId}`,
            successCallback: body => {
                const result = body?.result;
                setFetching(false)
                setProgessData(result || [])
            },
            errorCallback: err => {
                console.log('Something went wrong', err)
                setFetching(false)
            }
        })
    }, [])

    const iconStyle1 = { height: '20px', width: '20px' }

    const stages = [
        { id: 'not assigned', color: '#9F9C9C', label: 'Not Assigned', icon: <NotAssignedSvg style={iconStyle1} /> },
        { id: 'introductory', color: '#257AFB', label: 'Introductory', icon: <IntroductorySvg style={iconStyle1} /> },
        { id: 'reinforcement', color: '#FF6C4B', label: 'Reinforcement', icon: <ReinforcementSvg style={iconStyle1} /> },
        { id: 'conversion', color: '#4E944F', label: 'Conversion', icon: <ConversionSvg style={iconStyle1} /> },
    ]

    const progress = [
        { id: 'todo', color: '#257AFB', label: 'To do' },
        { id: 'inProgress', color: '#FF6C4B', label: 'In Progress' },
        { id: 'completed', color: '#4E944F', label: 'Completed' },
    ]

    const switchTab = (id) => {
        setCurrentTab(id)
    }


    const closeCreateGoalForm = () => {
        setShowCreateGoalForm(false)
    }

    const openCreateGoalForm = () => {
        setShowCreateGoalForm(true)
    }


    return <Box>
        <Box sx={{
            display: 'block', width: { xs: '100%', md: '450px', xl: '550px' },
            borderRadius: '8px', border: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1,
                borderBottom: '1px solid #1C1D221A'
            }}>
                <Typography sx={{ fontSize: { xs: 11, md: 12 }, fontWeight: 700 }}>
                    GOALS
                </Typography>

                <Button variant='contained' sx={{
                    color: 'primary.main', fontSize: 11, px: 1, py: .5, fontWeight: 600,
                    bgcolor: '#BF06061A', ":hover": { color: 'white' }
                }} onClick={openCreateGoalForm}>
                    + Add Goal
                </Button>
            </Box>

            {/* Status Heading */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', width: '100%', pt: 1, bgcolor: '#1C1D220A',
                    alignItems: 'center', borderBottom: '1px solid #1C1D221A'
                }}>
                    <ContactStatus style={iconStyle1} />
                    <Typography sx={{ color: '#5D5D5D', fontSize: 11, mt: 1, py: .5 }}>
                        Prospect status
                    </Typography>
                </Box>

                {stages.map((item, index) => {
                    return <Box key={index} sx={{
                        display: 'flex', flexDirection: 'column',
                        borderBottom: stage === item.id ? `1px solid ${item.color}20` : '1px solid #1C1D221A',
                        width: '100%', alignItems: 'center', position: 'relative'
                    }}>
                        {item.icon}
                        {index !== 3 && <div style={{
                            minHeight: '2px', background: '#9F9C9C', width: '55px', position: 'absolute',
                            top: '10px', right: '-25px'
                        }}></div>}
                        <Typography sx={{
                            color: item.color, fontSize: 11, mt: 1, fontWeight: 600, px: 1,
                            bgcolor: stage === item.id ? `${item.color}20` : 'white', py: .5,
                        }}>
                            {item.label}
                        </Typography>
                    </Box>
                })}
            </Box>

            {/* TabHead */}
            <Box sx={{ display: 'flex', bgcolor: `${stages.find(i => i.id === stage).color}20` }}>
                {progress.map((item, indx) => {
                    return <Typography key={indx} sx={{
                        width: '100%', fontSize: 12, fontWeight: 600, color: item.color, cursor: 'pointer',
                        textAlign: 'center', py: 2, ":hover": { background: `${item.color}10` },
                        borderBottom: item.id === currentTab ? `4px solid ${item.color}` : '1px solid #1C1D221A',
                    }} onClick={() => { switchTab(item.id) }}>
                        {item.label} ({progressData?.filter(i => i?.progessStatus === item?.id)?.length ?? 0})
                    </Typography>
                })}
            </Box>

            {/* Tab body */}
            <Box sx={{
               /*  display: 'flex', flexDirection: 'column',  */bgcolor: '#F5F5F5', px: 1,
                maxHeight: '400px', overflowY: 'hidden', ":hover": { overflowY: 'auto' },
                overflowX: 'hidden'
                /* '&::-webkit-scrollbar': { width: 0 }, */
            }}>
                {tabData ? tabData?.map((item, index) => {
                    return <GoalCard key={index} index={index} status={currentTab} dueDate={item?.dueDate}
                        followupUsed={item?.followupUsed} maxFollowup={item?.maxFollowup} goalId={item?.goalId}
                        followupData={item?.followupData} goalName={item?.goalName} clientStage={'Prospect'}
                        clientId={clientId} />
                }) : <Loader />}
            </Box>

        </Box>


        {showGoalCreateForm && <CreateGoal id={clientId} open={showGoalCreateForm} handleClose={closeCreateGoalForm} />}

    </Box>
}