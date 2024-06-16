'use client'
import { Box, Modal, } from "@mui/material"
import { useEffect } from "react";


function ImageModal({ open, onClose, imageUrl }) {
    const handleClose = () => {
        onClose(); // Call the onClose function passed from the parent component to close the modal
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Check if the click target is outside the modal content
            const modalContent = document.getElementById("modalContent");
            if (modalContent && !modalContent.contains(event.target)) {
                handleClose();
            }
        };
    
        if (open) {
            // Add event listener when the modal is open
            window.addEventListener('click', handleOutsideClick);
        }
    
        return () => {
            // Remove event listener when the component unmounts or modal closes
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [open, onClose]);

    return <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Box sx={{
            height: 'max-content', transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 4, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', lg: '30%' }, maxWidth: '800px',
        }}>
            <img src={imageUrl} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'  }} />
        </Box>
    </Modal>
}

export default ImageModal