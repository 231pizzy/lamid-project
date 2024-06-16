'use client'

import { Box, Button, Modal, Slide, TextField, Typography } from "@mui/material";

import Close from '@mui/icons-material/Close';

import { useState } from "react";

import { FileUpload } from "../crm/FileUpload";

import { useDispatch } from "react-redux";

import { openSnackbar } from "@/Components/redux/routeSlice";

import { useRouter, useSearchParams } from "next/navigation";
import { saveDocument } from "./helper";


export function UploadDocument({ closeForm, open }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams()

    const [state, setState] = useState({
        documentName: '', errMsg: '', fileArray: []
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const handleTextInput = (event) => {
        updateState({ documentName: event.currentTarget.value });
    }

    const getFileSize = (sizeInBytes) => {
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        const sizeInMB = (sizeInKB / 1024).toFixed(2);

        if (sizeInMB > 1) return `${sizeInMB}MB`
        else if (sizeInKB > 1) return `${sizeInKB}KB`
        else return `${sizeInBytes}B`
    };


    const handleFiles = (files) => {
        console.log('files selected', files);
        if (files) {
            const folderId = searchParams.get("folderId");
            const fileArray = Array.from(files).map(file => {
                return {
                    filename: file.name, size: getFileSize(file.size),
                    extension: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
                    file: file,
                    folderId: folderId 
                }
            });

            updateState({
                fileArray: fileArray
            });
        }
    }

    // const handleSaveDocument = () => {
    //     if (state.fileArray.length) {
    //         saveDocument({
    //             fileArray: state.fileArray, dataProcessor: (result) => {
    //                 closeForm(true);
    //                 openSnackbar({ message: 'Document uploaded', severity: 'success' });
    //             }
    //         })
    //     }
    // }
    const handleSaveDocument = () => {
        if (state.fileArray.length) {
            const folderId = searchParams.get("folderId");
            
            saveDocument({
                folderId: folderId, // Pass folderId as part of the data object
                fileArray: state.fileArray.map(file => ({ ...file, folderId })), // Include folderId for each file
                dataProcessor: (result) => {
                    closeForm(true);
                    openSnackbar({ message: 'Document uploaded', severity: 'success' });
                }
            }, folderId); // Pass folderId to the saveDocument function
        }
    };
    
    
    
    
    
    
    
    

    const removeContact = (filename) => {
        console.log('deleting file', filename);

        updateState({
            fileArray: state.fileArray.filter(item => item.filename !== filename),
        });
    }

    const changeFilename = (newName, index) => {
        const fileArr = [...state.fileArray]
        fileArr[index].filename = newName
        updateState({ fileArray: [...fileArr] })
    }

    return <Modal open={open} onClose={closeForm}>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Box sx={{
                height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
                position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '70%', md: '60%', lg: '45%', xl: '42%' },
            }}>
                {/* Heading */}
                <Box sx={{
                    display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                    py: 2, px: { xs: 1.5, sm: 4 }, mb: 3,
                    borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white',
                }}>
                    {/* Close form */}
                    <Close onClick={closeForm}
                        sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 32, mr: 4 }} />

                    {/* Heading label */}
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                        ADD NEW DOCUMENT
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant="contained" sx={{ py: .5, px: 2 }} onClick={handleSaveDocument} style={{ backgroundColor: '#BF0606', color: 'white' }}>
                        Save
                    </Button>
                </Box>

                {/* Body */}
                <Box sx={{}}>
                    {/* Upload section */}
                    <FileUpload {...{
                        handleFiles: handleFiles, multiple: true,
                        accept: { 'text/*': ['.txt', '.csv', '.xlsx', '.xls', '.pdf', '.ppt', '.doc', '.docx', '.pptm', '.pptx'], },
                        extentionArray: ['CSV', 'TXT', 'PDF', 'WORD', 'EXCEL', 'POWERPOINT'], showFiles: true,
                        removeContact: removeContact, fileArray: state.fileArray, saveName: changeFilename, filenameIsEditable: true
                    }} />
                </Box>
            </Box>
        </Slide>
    </Modal>
}