import { Add, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ReportSheet from "./ReportSheet";
import CreateSupervisorEvaluationReport from "./CreateSupervisorEvaluationReport";

export default function FollowupReport({ index, goalName, goalId, goalProgress, clientStage, clientId, report }) {
    console.log('report', report)

    const [open, setOpen] = useState(null);
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);

    const handleOpen = (id) => {
        setOpen(open === id ? null : id)
    }

    const closeEvaluationForm = () => {
        setShowEvaluationForm(false)
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Heading */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#FBFBFB', px: 1.5, py: 1, justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 11 }}>
                FOLLOW UP - {index + 1}
            </Typography>

            {!report?.supervisorReport && <Button variant="text" sx={{ px: 1, py: .1, fontSize: 11, fontWeight: 600 }}
                onClick={() => { setShowEvaluationForm(true) }}>
                <Add sx={{ fontSize: 12 }} /> Add Evaluation
            </Button>}
        </Box>

        {/* Handler's report */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', bgcolor: '#F5F5FF', px: 1.5,
                justifyContent: 'space-between', borderTop: '1px solid #1C1D221A'
            }} >
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#4646EA' }}>
                    Handler's Report
                </Typography>

                <Button variant="text" sx={{ fontSize: 10, fontWeight: 600, py: .2, color: '#4646EA' }}
                    onClick={() => { handleOpen('handler') }}>
                    {open === 'handler' ? 'Close' : 'Open'}  {open === 'handler' ? <ArrowDropUp /> : <ArrowDropDown />}
                </Button>
            </Box>

            {/* Content */}
            {open === 'handler' && <ReportSheet progressStatus={goalProgress} goalName={goalName}
                category={'handler'} index={index} clientStage={clientStage} clientId={clientId}
                report={report?.handlerReport} />}
        </Box>

        {/* Supervisor's report */}
        {Boolean(report?.supervisorReport) && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', bgcolor: '#E8FFE8', px: 1.5,
                justifyContent: 'space-between', borderTop: '1px solid #1C1D221A'
            }} >
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#008000' }}>
                    Supervisor's Evaluation
                </Typography>

                <Button variant="text" sx={{ fontSize: 10, fontWeight: 600, py: .2, color: '#008000' }}
                    onClick={() => { handleOpen('supervisor') }}>
                    {open === 'supervisor' ? 'Close' : 'Open'}  {open === 'supervisor' ? <ArrowDropUp /> : <ArrowDropDown />}
                </Button>
            </Box>

            {/* Content */}
            {open === 'supervisor' && <ReportSheet handlerName={report?.handlerReport?.fullName}
                category={'supervisor'} progressStatus={goalProgress} index={index}
                report={report?.supervisorReport} />}
        </Box>}

        {showEvaluationForm && <CreateSupervisorEvaluationReport open={showEvaluationForm}
            handleClose={closeEvaluationForm} id={clientId}
            goalName={goalName}
            goalProgress={goalProgress}
            goalId={goalId}
            index={index}
            handlerName={report?.handlerReport?.fullName}
            followupId={report?.handlerReport?._id}
            clientStage={clientStage} />}
    </Box>
}