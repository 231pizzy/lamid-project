'use client'

import { Box, IconButton, Typography, } from "@mui/material";


import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import PrevIcon from "@mui/icons-material/KeyboardArrowLeft";


import { useMemo, useState } from "react";

import { TaskCard } from "./TaskCard.js";


export function LayoutComponent2({ lightBgcolor1, lightBgcolor2, darkBgcolor, headingBuilder, cardDataSource,
    taskHeadingBuilder, taskValueBuilder, selectedGoalObject, selectedGoalIndex, selectTask, unSelectTask }) {

    const [state, setState] = useState({
        projectObject: {}, currentTab: 0, workPhaseObject: {}, numberOfTasks: 1, lastGoalIndex: 4, startGoalIndex: 0,
        rowsPerPage: 4, currentPage: 1, selectedGoalIndex: undefined, selectedGoalObject: {},
        selectedTaskIndex: undefined, selectedTaskObject: {}
    });


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const paginateNext = () => {
        updateState({ currentPage: state.currentPage + 1 })
    }

    const paginatePrevious = () => {
        updateState({ currentPage: state.currentPage - 1 })
    }

    const paginationLabel = useMemo(() => {
        let firstItem = ((state.currentPage - 1) * state.rowsPerPage);

        const total = state.numberOfTasks;

        const tempLastItem = ((state.currentPage) * state.rowsPerPage);

        const lastItem = total < tempLastItem ? total : tempLastItem;

        updateState({ firstItem: firstItem, lastItem: lastItem })

        return `${firstItem + 1} - ${lastItem} of ${total}`
    }, [state.currentPage]);

    const selectTask1 = ({ index, taskObject }) => {
        console.log('sent', taskObject)
        updateState({ selectedTaskIndex: index, selectedTaskObject: taskObject });
        selectTask({ index: index, taskObject: taskObject })
    }

    const unSelectTask1 = () => {
        updateState({ selectedTaskIndex: undefined, selectedTaskObject: {} })
        unSelectTask()
    }

    const cardBuilder = ({ source, justifyContent, borderColor }) => {
        return <Box sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: justifyContent ?? 'flex-end', flexWrap: 'wrap'
        }}>
            {/* Data Card */}
            {source({ workPhaseObject: state.workPhaseObject, goalObject: selectedGoalObject })?.map((data, index) =>
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

    return (
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
                        TASKS UNDER GOAL {selectedGoalIndex + 1}
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
                            disabled={state.currentPage >= Math.round(state.numberOfTasks / state.rowsPerPage)}>
                            <NextArrow />
                        </IconButton>
                    </Box>
                </Box>

                {/* List of goals */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', px: 2, py: 2 }}>
                    {selectedGoalObject?.tasks?.slice((state.currentPage - 1) * state.rowsPerPage,
                        state.currentPage * state.rowsPerPage).map((taskData, index) => {
                            return <Box sx={{ mb: 2 }}>
                                <TaskCard {...{
                                    taskData: taskData, index: index, selectedTaskName: state.selectedTaskObject?.taskName,
                                    selectTask: selectTask1, unSelectTask: unSelectTask1, taskHeading: taskHeadingBuilder,
                                    taskValueBuilder: taskValueBuilder, headBgcolor: lightBgcolor1, color: darkBgcolor
                                }} />
                            </Box>

                        })}
                </Box>
            </Box>

            {/* Workphase timebank */}
            <Box sx={{ maxWidth: '30%' }}>
                {/* Heading */}
                <Typography sx={{
                    bgcolor: '#1C1D221A', px: 2, py: 1, height: 50, borderBottom: '1px solid #1C1D221A',
                    borderLeft: '1px solid #1C1D221A', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center'
                }}>
                    {/* Heading label */}
                    {/*  GOAL {state.selectedGoalIndex + 1} EXPENSES & INVOICE */}
                    {headingBuilder({ index: selectedGoalIndex + 1 })}
                </Typography>

                {/* Content */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-around',
                    bgcolor: lightBgcolor2 /* '#299C290D' */, pb: { md: 7 },
                }}>
                    {cardBuilder({ source: cardDataSource /* goalExpenseData */, justifyContent: 'center', borderColor: darkBgcolor })}
                </Box>
            </Box>
        </Box>
    )
}
