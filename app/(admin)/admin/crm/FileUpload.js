import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUploadOutlined';
import Dropzone from "react-dropzone";
import { useState } from "react";
import Prompt from "@/Components/Prompt";

import Close from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import IconElement from "@/Components/IconElement";


const CsvSvg = '/icons/CsvSvg.svg';
const ExcelSvg = '/icons/ExcelSvg.svg';
const TxtSvg = '/icons/TxtSvg.svg';

const iconstyle = { height: '40px', width: '40px' }

const fileIcons = {
    txt: { icon: <IconElement {...{ style: iconstyle, src: TxtSvg }} />, color: '#885CA7' },
    csv: { icon: <IconElement {...{ style: iconstyle, src: CsvSvg }} />, color: '#00A651' },
    xls: { icon: <IconElement {...{ style: iconstyle, src: ExcelSvg }} />, color: '#165332' },
    xlsx: { icon: <IconElement {...{ style: iconstyle, src: ExcelSvg }} />, color: '#165332' },
    others: { icon: <FileIcon sx={{ height: '40px', width: '40px' }} />, color: '#165332' }
}


export function FileUpload({ handleFiles, multiple, accept, extentionArray, showFiles, viewUploadedContact, removeContact,
    fileArray, saveName, filenameIsEditable }) {
    const [state, setState] = useState({
        processedFiles: [], showPrompt: false, fileToRemove: '', newFilename: '', editFileIndex: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    console.log('array of files', fileArray)

    const confirmRemoveContact = (event, filename) => {
        event.stopPropagation();
        updateState({ showPrompt: true, fileToRemove: filename })
    };

    const closePrompt = () => {
        updateState({ showPrompt: false, fileToRemove: '' })
    }

    const deleteFile = () => {
        removeContact(state.fileToRemove);
        closePrompt();
    }

    const editName = (index) => {
        updateState({ editFileIndex: index, newFilename: fileArray[index].filename.split('.')[0] })
    }

    const cancelNameChange = () => {
        updateState({ editFileIndex: null, newFilename: '' })
    }

    const handleSaveName = (event) => {
        saveName(state.newFilename, state.editFileIndex)
        cancelNameChange()
    }

    const handleTextInput = (event) => {
        updateState({ newFilename: event.currentTarget.value })
    }

    const fileRenderingView = () => {
        return <Box sx={{ mt: 2 }}>
            {/* Preocessed files */}
            <Box>
                {/* Heading */}
                <Typography sx={{
                    bgcolor: 'rgba(28, 29, 34, 0.04)',
                    color: '#5D5D5D', px: 3, py: 1, fontSize: 17, fontWeight: 600
                }}>
                    Processed files
                </Typography>

                {/* Files */}
                <Box sx={{ px: 3 }} >
                    {fileArray.map((filename, index) => {
                        const fileExtension = filename.extension;
                        const id = filename.filename;
                        return <Box key={index} id={filename.filename}
                            sx={{
                                display: 'flex', alignItems: 'flex-start', cursor: viewUploadedContact ? 'pointer' : 'inherit',
                                py: 2, borderBottom: '1px solid rgba(28, 29, 34, 0.1)'
                            }} onClick={viewUploadedContact ? () => { viewUploadedContact(id) } : () => { }}>
                            {/* Icon */}
                            {fileIcons[fileExtension]?.icon ?? fileIcons.others.icon}

                            {/* file index, extension and size */}
                            <Box id={filename.filename} sx={{ ml: 2 }}>
                                {/* File name and extension */}
                                {state.editFileIndex === index ?
                                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                                        {/* File name */}
                                        <TextField
                                            value={state.newFilename}
                                            fullWidth
                                            placeholder="Eg. Staff Performance"
                                            onChange={handleTextInput}
                                        />
                                        {/* Save button */}
                                        <SaveIcon sx={{ mx: 2, cursor: 'pointer' }} onClick={handleSaveName} />
                                        <Close sx={{ cursor: 'pointer' }} onClick={cancelNameChange} />
                                    </Box>

                                    : <Typography sx={{ mb: .5, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', }}>
                                        {filename.filename.split('.')[0]} {fileExtension.toUpperCase()} file
                                        {filenameIsEditable && <EditIcon sx={{ ml: 1, cursor: 'pointer' }}
                                            onClick={() => { editName(index) }} />}
                                    </Typography>}
                                {/* File size */}
                                <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                                    {filename.size}
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* Close icon */}
                            <IconButton id={id} onClick={(event) => { confirmRemoveContact(event, id) }}>
                                <DeleteIcon id={id} sx={{ fontSize: 26, color: '#8D8D8D' }} />
                            </IconButton>

                        </Box>
                    }

                    )}
                </Box>
            </Box>
        </Box>

    }

    return <Box>
        <Dropzone onDrop={handleFiles} multiple={multiple} accept={accept}>
            {({ getRootProps, getInputProps, isDragActive }) =>
                <Box  {...getRootProps()} sx={{
                    border: isDragActive ? '2px dashed #BF0606' : '2px dashed rgba(28, 29, 34, 0.3)', mx: 4,
                    borderRadius: '16px', px: 4, py: 2, bgcolor: isDragActive ? 'rgba(191, 6, 6, 0.08)' : '#F8F8F8',
                }}>
                    {/* First row */}
                    <Typography sx={{ fontSize: 16, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
                        {/* Upload icon */}
                        <FileUploadIcon sx={{ mr: 2 }} />
                        {/* click to upload label */}
                        <Typography component='label'
                            sx={{ cursor: 'pointer', color: '#BF0606', mr: .5, textDecoration: 'underline' }}>
                            Click to upload
                        </Typography>
                        {/* Other part of label */}
                        <Typography >
                            file or drag drop file here
                        </Typography>
                    </Typography>

                    {/* Second row: allowed file extensions */}
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#5D5D5D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {extentionArray.join(', ')}
                    </Typography>
                </Box>
            }
        </Dropzone>
        {showFiles && Boolean(fileArray?.length) && fileRenderingView()}

        <Prompt open={state.showPrompt} message='You are about to remove this file' proceedTooltip='Alright, remove file'
            cancelTooltip='No, do not remove it' onCancel={closePrompt} onProceed={deleteFile} onClose={closePrompt} />

    </Box>

}