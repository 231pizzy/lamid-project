'use client'

import { Box, Button, IconButton, LinearProgress, Typography, } from "@mui/material";


import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import PrevIcon from "@mui/icons-material/KeyboardArrowLeft";

import { useEffect, useMemo, useState } from "react";
import IconElement from "@/Components/IconElement";
import { GoalSvg } from "@/public/icons/icons";


export function LayoutComponent({ darkBgcolor, lightBgcolor1, lightBgcolor2, tabBgcolor, cardBuilderSource1, cardBuilderSource2, goalComputer, projectObject, workPhaseObject, computeHeading, selectGoal, unSelectGoal }) {

    const [state, setState] = useState({
        projectObject: projectObject, currentTab: 0, workPhaseObject: workPhaseObject, numberOfGoals: 1, lastGoalIndex: 4, startGoalIndex: 0,
        rowsPerPage: 4, currentPage: 1, selectedGoalName: null
    });


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        updateState({ workPhaseObject: workPhaseObject, numberOfGoals: Object.keys(workPhaseObject.goals).length })
    }, [workPhaseObject])


    const switchTab = (index) => {
        if (state.projectObject?.workPhases) {
            const workPhaseObject = Object.values(state.projectObject?.workPhases)[index]
            updateState({
                currentTab: index, workPhaseObject: workPhaseObject,
                numberOfGoals: Object.keys(workPhaseObject.goals).length,
                selectedGoalName: null
            });
            unSelectGoal()
        }
    }

    const paginateNext = () => {
        updateState({ currentPage: state.currentPage + 1 })
    }

    const paginatePrevious = () => {
        updateState({ currentPage: state.currentPage - 1 })
    }


    const paginationLabel = useMemo(() => {
        let firstItem = ((state.currentPage - 1) * state.rowsPerPage);

        const total = state.numberOfGoals;

        const tempLastItem = ((state.currentPage) * state.rowsPerPage);

        const lastItem = total < tempLastItem ? total : tempLastItem;

        updateState({ firstItem: firstItem, lastItem: lastItem })

        return `${firstItem + 1} - ${lastItem} of ${total}`
    }, [state.currentPage]);

    const handleGoalClick = ({ goalObject, goalIndex }) => {
        console.log('goalObject, index', goalObject, goalIndex)
        if (state.selectedGoalName === goalObject?.goalName) {
            unSelectGoal();
            updateState({ selectedGoalName: null })
        }
        else {
            /* required:index, goalObject, numberOfTasks */
            selectGoal({ index: goalIndex, goalObject: goalObject, numberOfTasks: goalObject?.tasks?.length })
            updateState({ selectedGoalName: goalObject?.goalName })
        }
    }



    const cardBuilder = ({ source, justifyContent, borderColor }) => {
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: justifyContent ?? 'flex-end', flexWrap: 'wrap' }}>
            {/* Data Card */}
            {source({ projectObject: projectObject, workPhaseObject: state.workPhaseObject })?.map((data, index) =>
                <Box sx={{
                    background: data.bgcolor, border: `1px solid ${borderColor}`,
                    borderRadius: '12px', color: data.color, px: 1.5, py: 1,
                    boxShadow: '8px 8px 20px 0px #4F4F4F14', maxWidth: 'max-content', mx: 2, my: 2

                }}>
                    {/* Heading and Icon */}
                    <Typography sx={{ textTransform: 'capitalize', fontSize: 14, mb: .5, fontWeight: 600, }}>
                        {data.label}
                        {/* Icon */}
                        {data.icon}
                    </Typography>

                    {/* value */}
                    <Typography sx={{ fontSize: data?.fontSize ?? 20, fontWeight: 600, color: data?.valueColor }}>
                        {data.value}
                    </Typography>
                </Box>
            )}

        </Box>
    }

    return (<Box>
        {/* project group Time Summary */}
        {cardBuilder({ source: cardBuilderSource1, borderColor: darkBgcolor })}

        {Boolean(projectObject?.workPhases) ?
            <Box sx={{ maxHeight: '82vh', overflowY: 'auto' }}>

                {/* Work phases switch */}
                <Box sx={{
                    px: 2, display: 'flex', alignItems: 'center',
                    borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                    bgcolor: tabBgcolor, px: 2, py: 2, overflowX: 'auto',
                }}>
                    {Object.keys(projectObject?.workPhases)?.map((phase, index) => {
                        return <Button variant={state.currentTab === index ? 'contained' : 'outlined'} id={index}
                            onClick={() => { switchTab(index) }}
                            sx={{
                                bgcolor: state.currentTab === index ? darkBgcolor : 'white', fontWeight: 700,
                                color: state.currentTab === index ? 'white' : darkBgcolor, mr: 3,
                                border: `1px solid ${darkBgcolor}`,
                                ":hover": { background: lightBgcolor1, color: darkBgcolor, border: `1px solid ${darkBgcolor}` }
                            }}>
                            WORK PHASE {index + 1}
                        </Button>
                    })}

                </Box>

                {/* Workphase goals and workphase time bank usage */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', border: '1px solid #1C1D221A', flexGrow: 1 }}>
                    {/* Workphase goals */}
                    <Box sx={{ flexGrow: 1 }}>
                        {/* Heading and pagination */}
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            bgcolor: '#1C1D221A', px: 2, py: 1, height: '50px'
                        }}>
                            {/* Label: Goals under Workphase {index+1}*/}
                            <Typography sx={{ fontWeight: 600, fontSize: 16, mr: 5 }}>
                                GOALS UNDER WORKPHASE {state.currentTab + 1}
                            </Typography>

                            {/* Pagination */}
                            <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                <IconButton sx={{ border: '1px solid #BF0606', bgcolor: '#BF060614', height: 30, width: 30 }}
                                    onClick={paginatePrevious} disabled={state.currentPage === 1}>
                                    <PrevIcon />
                                </IconButton>
                                <Typography sx={{ px: 2, fontWeight: 600, fontSize: 16 }}>
                                    {paginationLabel}
                                </Typography>
                                <IconButton sx={{ border: '1px solid #BF0606', bgcolor: '#BF060614', height: 30, width: 30 }}
                                    onClick={paginateNext}
                                    disabled={state.currentPage >= Math.round(state.numberOfGoals / state.rowsPerPage)}>
                                    <NextArrow />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* List of goals */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', px: 2, pt: 2 }}>
                            {Object.values(state.workPhaseObject.goals).slice((state.currentPage - 1) * state.rowsPerPage, state.currentPage * state.rowsPerPage).map((data, index) => {
                                const goalData = goalComputer({ goalObject: data })
                                return <Box sx={{
                                    minWidth: 300, maxWidth: 300, cursor: 'pointer',
                                    border: state.selectedGoalName === data.goalName ? '2px solid #BF0606' : '1.5px solid #1C1D221A',
                                    boxShadow: '0px 6px 12px 0px #4F4F4F14', borderRadius: '16px', mb: 3, mr: 1
                                }} onClick={selectGoal ?
                                    () => { handleGoalClick({ goalIndex: index, goalObject: data }) } : () => { }}>
                                    {/* Heading */}
                                    <Typography sx={{
                                        bgcolor: lightBgcolor1, borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center',
                                        px: 1, py: 1, color: darkBgcolor, fontSize: 14, fontWeight: 600,
                                    }}>
                                        {/* Icon */}
                                        <GoalSvg style={{ height: '22px', width: '22px', marginRight: '12px' }} />
                                        {/* Label */}
                                        Goal - {(index + 1)}
                                    </Typography>

                                    {/* Goal name */}
                                    <Typography align='justify' sx={{ px: 2, py: 1.5, fontSize: 14, fontWeight: 600, }}>
                                        {data?.goalName}
                                    </Typography>

                                    {/* Time bank */}
                                    <Box>
                                        {/* Heading */}
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280' }}>
                                            {/* Label and icon*/}
                                            {goalData?.valueHeading}
                                        </Typography>

                                        {/* Content */}
                                        <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                                            {/* Time Spent */}
                                            <Box sx={{ mb: 1.5 }}>
                                                {/* Label */}
                                                <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: darkBgcolor }}>
                                                    {goalData?.valueData}
                                                </Typography>
                                            </Box>

                                            {/* Progress bar */}
                                            <LinearProgress
                                                value={(goalData?.used / goalData?.total) * 100} variant='determinate'
                                                sx={{
                                                    '& .MuiLinearProgress-barColorPrimary': {
                                                        backgroundColor: darkBgcolor
                                                    },
                                                    bgcolor: '#D9D9D9',
                                                    borderRadius: '2px',
                                                    height: '4px'
                                                }} />
                                        </Box>

                                    </Box>
                                </Box>
                            })}
                        </Box>
                    </Box>

                    {/* Workphase timebank */}
                    <Box sx={{ maxWidth: '30%', }}>
                        {/* Heading */}
                        <Typography sx={{
                            bgcolor: '#1C1D221A', px: 2, py: 1, height: 50, borderBottom: '1px solid #1C1D221A',
                            borderLeft: '1px solid #1C1D221A', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center'
                        }}>
                            {/*  WORKPHASE {state.currentTab + 1} TIME-BANK USAGE */}
                            {computeHeading({ phaseIndex: state.currentTab + 1 })}
                        </Typography>

                        {/* Content */}
                        <Box sx={{
                            display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-around',
                            bgcolor: lightBgcolor2, pb: 3
                        }}>
                            {cardBuilder({ source: cardBuilderSource2, justifyContent: 'center', borderColor: darkBgcolor })}
                        </Box>
                    </Box>
                </Box>
            </Box >
            : <Typography align='center' sx={{ mt: 4, fontWeight: 700, fontSize: 18 }}>
                Fetching data...
            </Typography>}
    </Box>)
}
