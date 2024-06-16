// import CloseIcon from "@mui/icons-material/Close";
// import { Box, Button, Modal, Typography, TextField } from "@mui/material";
// import { modalStyle } from './style';

// export default function CreateDocModal({ open, type = 'danger', handleCancel, handleCreate }) {
//     return (
//         <Modal open={open} onClose={handleCancel} sx={modalStyle.modal}>
//             <Box sx={modalStyle.container}>

//                 {/* Message */}
//                 <Box sx={modalStyle.message}>
//                     {/* Heading */}
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

//                     <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2, flex: 1, marginRight: 2, fontSize: '15px'   }}>CREATE NEW DOCUMENT CATEGORY</Typography>

//                     {/* Create Button */}
//                     <Button variant="contained" onClick={handleCreate} sx={{ marginBottom: 2, marginLeft: 4, bgcolor: '#BF0606'  }} style={{backgroundColor: '#BF0606' }}>Create</Button>
//                     </Box>

//                     <Typography variant="h6" sx={{ marginBottom: 1,  textAlign: 'left',  color: '#8D8D8D'  }}>Title</Typography>
//                     {/* Input Area */}
//                     <TextField
//                         label="Eg. Category"
//                         variant="outlined"
//                         fullWidth
//                         multiline
//                         rows={2}
//                     />
//                 </Box>
//             </Box>
//         </Modal>
//     );
// }
'use client'
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { modalStyle } from './style';
import { useState } from 'react';
import BeatLoader from "react-spinners/BeatLoader";

export default function CreateDocModal({ open, handleCancel, handleCreate }) {
    const [folderName, setFolderName] = useState('');
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!folderName.trim()) {
            setErrorMessage('Folder name cannot be empty');
            return;
        }

        try {
            setLoading(true)
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
                setLoading(false)
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
                
                        {/* <Button variant="contained"  onClick={handleSubmit}  sx={{ marginBottom: 2, marginLeft: 4}} style={{ backgroundColor: '#BF0606', color: 'white' }}>Create</Button> */}
                        {/* {loading ? (
                
                        ) : ( */}
                        <Button variant="contained" onClick={handleSubmit} sx={{ marginBottom: 2, marginLeft: 4 }} style={{ backgroundColor: '#BF0606', color: 'white' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <BeatLoader
                                    color={"white"}
                                    loading={loading}
                                    size={5}
                                />
                            ) : (
                                "Create"
                            )}
                        </Button>
                        {/* )} */}
                    </Box>
                    <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'left', color: '#8D8D8D' }}>Title</Typography>
                    <TextField
                        label="Eg. Category"
                        variant="outlined"
                        fullWidth
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                     {errorMessage && (
                <p className="text-red-500 text-center mt-2" style={{color: 'red'}}>
                    {errorMessage}
                </p>
            )}
                </Box>
            </Box>
        </Modal>
    );
}
