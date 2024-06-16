import { Box, Modal, Slide } from "@mui/material";
import ModalHeading from "./ModalHeading";

export default function SideModal({ open, handleClose, title, actionArray, children }) {
    return open && <Modal open={open} onClose={handleClose}>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Box sx={{
                display: 'flex', flexDirection: 'column', width: { xs: '90%', md: '70%', lg: '50%', },
                bgcolor: 'white', pb: 0, position: 'absolute', top: 0, right: 0,
                height: '100vh', overflowY: 'hidden'
            }}>
                <ModalHeading handleClose={handleClose} title={title} actionArray={actionArray} />
                <Box sx={{ height: 'calc(100vh - 50px)', width: '100%', overflowY: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Slide>
    </Modal>
}