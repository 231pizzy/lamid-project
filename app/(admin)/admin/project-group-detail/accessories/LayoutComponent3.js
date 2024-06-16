'use client'

import { Box, Typography, } from "@mui/material";


import { useState } from "react";
import { TaskCard } from "./TaskCard.js";

import ResourceUsageSheet from "@/Components/ResourceUsageSheet.js";


export function LayoutComponent3({ headBuilder, selectedTaskIndex, selectedTaskObject, darkBgcolor, taskHeading,
    lightBgcolor1, lightBgcolor2, instruction, image, lightBgcolor3, taskValueBuilder, indicatorData, }) {

    const [state, setState] = useState({
        projectObject: {}, currentTab: 0, workPhaseObject: {}, numberOfTasks: 1, lastGoalIndex: 4, startGoalIndex: 0,
        rowsPerPage: 4, currentPage: 1, selectedGoalIndex: undefined, selectedGoalObject: {},
        selectedTaskIndex: undefined, selectedTaskObject: {}, selectedAssignee: undefined
    });


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const selectAssignee = (email) => {
        updateState({ selectedAssignee: email })
    }

    console.log('project group layout 3 state', state);

    return (<Box>
        {/* Heading */}
        <Typography sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 2, bgcolor: lightBgcolor3 /* '#FFFAFA' */,
            borderWidth: '1px, 0px, 1px, 0px', borderStyle: 'solid', borderColor: '#1C1D221A', fontWeight: 700

        }}>
            {/*   EXPENSE AND INVOICE BREAKDOWN FOR TASK - {state.selectedTaskIndex + 1} */}
            {headBuilder({ index: selectedTaskIndex + 1 })}
        </Typography>

        {/* Content */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', }}>
            {/* selected Task details */}
            <Box sx={{ borderRight: '1px solid #1C1D221A', borderBottom: '1px solid #1C1D221A', }}>
                {/* Heading */}
                <Typography sx={{ px: 3, py: 1, bgcolor: lightBgcolor2, fontWeight: 600, fontSize: 16 }}>
                    TASK DETAILS
                </Typography>
                {/* Content */}
                <Box sx={{ py: 1 }}>
                    {/* Task card */}
                    <TaskCard {...{
                        index: selectedTaskIndex, taskData: selectedTaskObject, taskHeading: taskHeading,
                        color: darkBgcolor /* '#4E944F' */, headBgcolor: lightBgcolor1/* '#F2FFF2' */, showDetails: true, indicatorData: indicatorData, taskValueBuilder: taskValueBuilder, selectAssignee: selectAssignee,
                        selectedAssignee: state.selectedAssignee
                    }} />
                    {/* Assignee */}
                </Box>
            </Box>

            {/*  breakdown */}
            {state.selectedAssignee ?
                <ResourceUsageSheet {...{ lightColor: lightBgcolor2, darkColor: darkBgcolor, gradient: darkBgcolor }} />
                : <Box align='center' sx={{ width: '100%', py: 2, px: 2, }}>
                    {/* Instruction */}
                    <Typography sx={{ fontWeight: 700, fontSize: 20, my: 3, textTransform: 'uppercase' }}>
                        {/*   Select an assignee to look at their expense and invoice */}
                        {instruction}
                    </Typography>

                    {/* Image */}
                    <img src={image/* selectAssignee */} alt="selectAssignee" style={{ width: '50%', height: '50%' }} />
                </Box>}
        </Box>
    </Box>
    )
}
