'use client'
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { modalStyle } from './style';
import React, { useState } from 'react';
import { useSearchParams } from "next/navigation";

export default function EditFolderName({ open, handleCancel, handleCreate }) {
    const [folderName, setFolderName] = useState('');
    const searchParams = useSearchParams()
    const currentFolderName = searchParams.get("folderName");

    const getPath = () => {
        const path = (process.env.NODE_ENV === 'production') ?
            `/api/folders` :
            `http://localhost:3001/api/folders`
    
        return path;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const folderId  = searchParams.get("folderId"); // Get the folderId from the request body
    
            const response = await fetch(`/api/folders`, {
                method: 'PUT', // Use the PUT method
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: folderName, folderId }), // Include both name and folderId in the request body
            });
            if (response.ok) {
                console.log('Folder name updated successfully');
                window.location.href = "/admin/documents";
                handleCancel(); // Close the modal after successful folder name update
            } else {
                console.error('Failed to update folder name');
                // Handle error cases if needed
            }
        } catch (error) {
            console.error('Error updating folder name:', error);
            // Handle network errors or other exceptions
        }
    };
    

    return (
        <Modal open={open} onClose={handleCancel} sx={modalStyle.modal}>
            <Box sx={modalStyle.container}>
                <Box sx={modalStyle.message}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2, flex: 1, marginRight: 2, fontSize: '15px' }}>EDIT CATEGORY NAME</Typography>
                        <Button variant="contained"  onClick={handleSubmit}  sx={{ marginBottom: 2, marginLeft: 4, bgcolor: '#BF0606' }}>SAVE</Button>
                    </Box>
                    <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'left', color: '#8D8D8D' }}>Title</Typography>
                    <TextField
                        // label="Eg. Category"
                        placeholder={currentFolderName}
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
