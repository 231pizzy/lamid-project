import { Box, Modal } from "@mui/material";

export default function ModalForm({ onclose, Component, width, height, style }) {
    return <Modal open={true} onClose={onclose}>
        <Box sx={{
            height: height ?? 'max-content', transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 4, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%', width: width, ...style
        }}>
            {Component}
        </Box>
    </Modal>
}