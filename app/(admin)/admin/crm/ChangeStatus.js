import { Close } from "@mui/icons-material";
import { Box, Button, Modal, Radio, RadioGroup, Typography } from "@mui/material";
import { useState } from "react";
import { updateContactStatus } from "./helper";
import { SubmitButton } from "@/Components/SubmitButton";

export default function ChangeStatus({ open, handleClose, currentStatus, id }) {
    const [selectedValue, setSelectedValue] = useState(currentStatus);
    const [submitting, setSubmitting] = useState(false);

    const options = [
        { value: 'not assigned', label: 'Not Assigned', color: '#34343480' },
        { value: 'introductory', label: 'Introductory', color: '#257AFB' },
        { value: 'reinforcement', label: 'Reinforcement', color: '#FF6C4B' },
        { value: 'conversion', label: 'Conversion', color: '#4E944F' },
    ]

    const handleSelect = (value) => {
        setSelectedValue(value)
    }

    const handleSubmit = () => {
        setSubmitting(true);
        updateContactStatus({
            id, status: selectedValue, dataProcessor: () => {
                setSubmitting(false);
                window.location.reload()
            }
        })
    }

    return <Modal open={open} onClose={handleClose} sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
        <Box sx={{ width: { xs: '90vw', md: '300px' }, bgcolor: 'white', borderRadius: '8px', }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%',
                px: 2, py: 1, bgcolor: '#F9F9F9', borderBottom: '1px solid #1C1D221A', borderRadius: '8px 8px 0 0'
            }}>
                <Typography sx={{ textTransform: 'uppercase', fontSize: 13, fontWeight: 700 }}>
                    change prospect status
                </Typography>
                <Close sx={{ fontSize: 24 }} onClick={handleClose} />
            </Box>

            {/* Options */}
            <Box sx={{ display: 'flex', flexDirection: 'column', px: 2, py: 2 }}>
                {options.map((item, index) => {
                    return <RadioGroup name="status" value={selectedValue}>
                        <Button key={index}
                            onClick={() => { handleSelect(item.value) }}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
                            <Radio name="status" id={item.value} value={item.value} />
                            <Typography component={'label'} htmlFor={item.value} sx={{ ml: 1, fontSize: 13, fontWeight: 600, color: item.color }}>
                                {item.label}
                            </Typography>
                        </Button>
                    </RadioGroup>
                })}
            </Box>

            {/* Proceed button */}
            <SubmitButton handleSubmit={handleSubmit} variant={'text'}
                isSubmitting={submitting} label={'Proceed'} style={{
                    bgcolor: '#BF060614', borderRadius: '12px', width: '100%', mb: 1, fontSize: 13,
                }}
            />
        </Box>
    </Modal>
}