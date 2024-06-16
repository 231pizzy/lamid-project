import { Close } from "@mui/icons-material";
import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";

export default function WarningModal({ title, open, message, proceedAction, status, type = 'danger',
    showAction = true, handleCancel }) {
    return <Modal open={open} onClose={handleCancel} sx={{
        display: 'flex', alignitems: 'center',
        justifyContent: 'center'
    }}>
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'white', my: 'auto',
            width: { xs: '90vw', sm: '40vw', lg: '30vw' }, borderRadius: '12px', height: 'max-content'
        }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', width: '100%', py: 1,
                borderBottom: '1px solid #1414171A', justifyContent: 'center'
            }}>
                <Typography sx={{
                    color: type === 'danger' ? 'red' : 'primary.main', fontWeight: 600,
                    width: '100%', display: 'flex', justifyContent: 'center', textTransform: 'capitalize'
                }}>
                    {title}
                </Typography>

                <Close sx={{ fontSize: 18, cursor: 'pointer', mr: 1 }} onClick={handleCancel} />
            </Box>

            {/* Message */}
            {(message instanceof String) ? <Typography sx={{ py: 2, px: 2, textAlign: 'center', }}>
                {message}
            </Typography> : <Box sx={{ py: 2, px: 2, textAlign: 'center', }}>
                {message}
            </Box>}

            {/* Action bar */}
            {showAction && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 2, pt: 1, width: '100%' }}>
                <Button variant="contained" sx={{
                    fontSize: 12, color: 'black', borderRadius: '16px', mr: 3, py: .5,
                    bgcolor: '#E4E4E4', border: '1px solid #AEAEAE'
                }} onClick={handleCancel}>
                    Cancel
                </Button>

                <Button variant="contained" sx={{
                    fontSize: 12, color: 'white', borderRadius: '16px',
                    bgcolor: '#0E60BF',
                }} disabled={status === 'submitting'} onClick={proceedAction}>
                    {status === 'submitting' && <CircularProgress id='submiting' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}  Proceed
                </Button>
            </Box>}
        </Box>
    </Modal>
}