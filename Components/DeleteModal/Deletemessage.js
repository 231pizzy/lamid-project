'use client'
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { modalStyle } from './style';
import React, { useState } from 'react';

export default function DeleteMessage({ open, handleCancel, handleCreate }) {
    const [folderName, setFolderName] = useState('');

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: folderName }),
            });
            if (response.ok) {
                console.log('Folder created successfully');
                window.location.href = "/admin/documents";
                setFolderName('');
                handleCancel(); // Close the modal after successful folder creation
            } else {
                console.error('Failed to create folder');
                // Handle error cases if needed
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            // Handle network errors or other exceptions
        }
    };

    return (
        <Modal open={open} onClose={handleCancel} sx={modalStyle.modal}>
            <Box sx={modalStyle.container}>
                <Box sx={modalStyle.message}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2, flex: 1, marginRight: 2, fontSize: '15px' }}>CREATE NEW DOCUMENT CATEGORY</Typography>
                        <Button variant="contained"  onClick={handleSubmit}  sx={{ marginBottom: 2, marginLeft: 4, bgcolor: '#BF0606' }}>Create</Button>
                    </Box>
                    <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'left', color: '#8D8D8D' }}>Title</Typography>
                    <TextField
                        label="Eg. Category"
                        variant="outlined"
                        fullWidth
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                </Box>
            </Box>
        </Modal>
    );
}
