import Close from "@mui/icons-material/Close";
import { Box, Modal, Typography } from "@mui/material";
import { modalStyle } from './style'

export default function ModalMessage({ title, open, message, type = 'danger', handleCancel }) {
    return <Modal open={open} onClose={handleCancel} sx={modalStyle.modal}>
        <Box sx={modalStyle.container}>
            {/* Heading */}
            <Box sx={modalStyle.headingWrapper}>
                <Typography sx={{
                    ...modalStyle.title, color: type === 'danger' ? 'red' : 'primary.main',
                }}>
                    {title}
                </Typography>

                <Close sx={modalStyle.icon} onClick={handleCancel} />
            </Box>

            {/* Message */}
            {(message instanceof String) ? <Typography sx={modalStyle.message}>
                {message}
            </Typography> : <Box sx={modalStyle.message}>
                {message}
            </Box>}
        </Box>
    </Modal>
}