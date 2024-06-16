import { Box, Button, CircularProgress, Modal, Tooltip, Typography } from "@mui/material"

/* Props {open.onClose,message, onProceed, onCancel, proceedTooltip,cancelTooltip} */
console.log('prompt component opened');

function Prompt({ open, onClose, message, proceedTooltip, onProceed, submitting, cancelTooltip, onCancel }) {
    return <Modal open={open} onClose={onClose}>
        <Box sx={{
            height: 'max-content', transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 4, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', lg: '25%' },
        }}>
            <Typography align='center' sx={{ mb: 4, fontWeight: 700, fontSize: { xs: 13, lg: 15 }, textTransform: 'uppercase' }}>
                {message}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Tooltip title={proceedTooltip}>
                    <Button onClick={onProceed} disabled={submitting}
                        sx={{ fontWeight: 700, fontSize: { xs: 14, lg: 18 }, }}>
                        {submitting && <CircularProgress size={20} sx={{ mr: 2, color: '#08e8de' }} />}  Proceed
                    </Button>
                </Tooltip>

                <Tooltip title={cancelTooltip}>
                    <Button onClick={onCancel}
                        sx={{ fontWeight: 700, fontSize: { xs: 14, lg: 18 }, color: '#646464' }}>
                        Cancel
                    </Button>
                </Tooltip>
            </Box>
        </Box>
    </Modal>
}

export default Prompt