import { Box, IconButton, Modal, Typography } from "@mui/material"

import Close from '@mui/icons-material/Close';
/* Props {open.onClose,message, onProceed, onCancel, proceedTooltip,cancelTooltip} */
console.log('modal message opened');

export function ModalMessage({ open, onClose, message, image, }) {
    return <Modal open={open} onClose={onClose}>
        <Box sx={{
            height: 'max-content', transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 1, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', lg: '25%' },
        }}>
            <Box sx={{ position: 'relative' }}>
                {/* Close button */}
                <IconButton onClick={onClose} sx={{ position: 'absolute', color: 'black', right: 0, top: 0, }}>
                    <Close sx={{ fontSize: 35, }} />
                </IconButton>

                <Box sx={{ p: 4 }}>
                    {/* Image */}
                    <Box align='center' sx={{}}>
                        {image}
                    </Box>

                    {/* Message */}
                    <Typography align='center' sx={{ my: 4, fontWeight: 700, fontSize: { xs: 19 }, textTransform: 'uppercase' }}>
                        {message}
                    </Typography>
                </Box>

            </Box>
        </Box>
    </Modal>
}
