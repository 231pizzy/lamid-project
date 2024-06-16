'use client'

import {
    Box, Divider, IconButton, Modal, Slide, Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddOutlined";
import DownloadIcon from "@mui/icons-material/DownloadOutlined";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar, setPageTitle } from "@/Components/redux/routeSlice";
import Link from 'next/link';

import { UploadDocument } from "./UploadDocument";

import Prompt from "@/Components/Prompt";

import IconElement from "@/Components/IconElement";

import { useRouter, useSearchParams } from "next/navigation";

import { deleteDocument, downloadDocument, getDocument } from "./helper";
// import { ModalMessage } from "@/Components/ModalMessage";
import PropagateLoader from "react-spinners/PropagateLoader";
import EditFolderName from "./EditFolderName";
// import uploadFile from "../../../../public/images/uploadFile.png"

const DeleteSvg = '/icons/DeleteSvg.svg';

const documentTypes = [
    { label: 'TXT doc', value: 'txt' },
    { label: 'CSV doc', value: 'csv' },
    { label: 'PDF doc', value: 'pdf' },
    { label: 'XLSX doc', value: 'xlsx' },
    { label: 'XLS doc', value: 'xls' },
    { label: 'DOC doc', value: 'doc' },
    { label: 'DOCX doc', value: 'docx' },
    { label: 'PPT doc', value: 'ppt' },
    // { label: 'PPTX doc', value: 'pptx' },
    // { label: 'PPTM doc', value: 'pptm' },
];

function ToolsDocument({ noToolbar }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams()
    const folderName = searchParams.get("folderName");
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({
        selectedDocType: 'txt', addDocument: false, addedFiles: 0, documentArray: [], showPrompt: false,
        documentToDelete: null, fileLink: ''
    });

    const [openPrompt, setOpenPrompt] = useState(false)

    useEffect(() => {
        /* Set Page title */
        const folderId = searchParams.get("folderId");
        console.log("Inside useEffect - folderId:", folderId);

        if (!noToolbar) {
            dispatch(setPageTitle({ pageTitle: 'Tools' }))
        }

        /*   const baseUrl = window.location.origin;
          const userCategory = window.location.pathname.split('/')[1]
          const docLink = `${baseUrl}/${userCategory}/download-document/${filename}`
  
          updateState({ fileLink: docLink }) */

        getDocument({
            docType: state.selectedDocType, folderId: folderId, dataProcessor: (result) => {
                updateState({
                    documentArray: result,
                })
                console.log(result);
            }
        })
    }, [])


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const fetchDocument = (extension) => {
        const folderId = searchParams.get("folderId");
        console.log("Inside useEffect - folderId:", folderId);
        getDocument({
            docType: extension, folderId: folderId, dataProcessor: (result) => {
                updateState({
                    documentArray: result,
                })
            }
        })
    }

    useEffect(() => {
        fetchDocument(state.selectedDocType)
        //  getDocument(updateState, remoteRequest, dispatch, openSnackbar, navigate, state.selectedDocType)
    }, [state.selectedDocType, state.addedFiles])

    const getPath = (filename) => {
        const path = (process.env.NODE_ENV === 'production') ?
            `/api/download-document/?filename=${filename}` :
            `http://localhost:3000/api/download-document/?filename=${filename}`

        return path
    }


    const changeDocType = (event) => {
        updateState({ selectedDocType: event.target.id })
    }

    const openDocumentForm = () => {
        updateState({ addDocument: true })
    }

    const closeDocumentForm = (filesAdded) => {
        updateState({ addDocument: false, addedFiles: filesAdded ? state.addedFiles + 1 : state.addedFiles })
    }

    const handleDeleteDocument = () => {
        if (state.documentToDelete) {
            deleteDocument({
                fileName: state.documentToDelete, dataProcessor: (result) => {
                    updateState({ addedFiles: state.addedFiles + 1 });
                    closePrompt()
                }
            })
        }
    }

    // const handleDeletefolder = async () => {
    //     try {
    //         const folderId = searchParams.get("folderId");
    //         const response = await fetch(`/api/folders`, {
    //             method: 'DELETE', // Use the DELETE method
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ folderId }), // Include the folderId in the request body
    //         });
    //         if (response.ok) {
    //             window.location.href = "/admin/documents";
    //             console.log('Folder and associated documents deleted successfully');
    //         } else {
    //             console.error('Failed to delete folder and associated documents');
    //             // Handle error cases if needed
    //         }
    //     } catch (error) {
    //         console.error('Error deleting folder and associated documents:', error);
    //         // Handle network errors or other exceptions
    //     }
    // };

    const handleDeletefolder = async () => {
        try {
            setLoading(true)
            const folderId = searchParams.get("folderId");
            const response = await fetch(`/api/folders`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderIds: [folderId] }), // Send an array of folderIds
            });
            if (response.ok) {
                window.location.href = "/admin/documents";
                setLoading(false)
            } else {
                console.error('Failed to delete folder and associated documents');
                // Handle error cases if needed
            }
        } catch (error) {
            console.error('Error deleting folder and associated documents:', error);
            // Handle network errors or other exceptions
        }
    };




    const confirmDelete = (filename) => {
        updateState({ showPrompt: true, documentToDelete: filename });
    }

    const confirmDeleteFolder = () => {
        setOpenPrompt(true)
    }

    const closeFolderPrompt = () => {
        setOpenPrompt(false)
    }

    const closePrompt = () => {
        updateState({ showPrompt: false, documentToDelete: null })
    }

    const linkClicked = (event) => {
        //event.preventDefault()
        console.log('clicked')
        /*    downloadDocument({
               filename: filename, dataProcessor: () => { */
        setTimeout(() => {
            fetchDocument(state.selectedDocType)
            // getDocument(updateState, remoteRequest, dispatch, openSnackbar, navigate, state.selectedDocType)
        }, 2000)
        /*  } */
        /*    }) */
    }

    const copyFileLink = (filename) => {
        const baseUrl = window.location.origin;
        const userCategory = window.location.pathname.split('/')[1]
        const fileLink = getPath(filename)
        navigator.clipboard.writeText(fileLink);  // Copy link
        dispatch(openSnackbar({ message: 'form link copied to clipboard', severity: 'success' }))
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };



    return (
        <Box sx={{ maxWidth: '100%', overflowY: 'hidden', }}>
            {/* Toolbar */}
            {!noToolbar && <Box sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', px: 3, py: 2, bgcolor: '#F5F5F5',
                borderBottom: '1px solid #1C1D221A'
            }}>
                {/* Page title */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, md: 16 } }}>
                    DOCUMENTS
                </Typography>

                {/* Add button */}
                <IconButton sx={{ bgcolor: '#BF0606', height: 30, width: 30 }} onClick={openDocumentForm}>
                    <AddIcon sx={{ fontSize: 26, color: 'white' }} />
                </IconButton>
            </Box>}

            {/* Body */}
            <Box sx={{ maxHeight: noToolbar ? '300px' : '90vh', overflowY: 'hidden' }}>
                {/* Document types */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2, borderBottom: '1px solid #1C1D221A' }} className="justify-between">
                    <Link href="/admin/documents" className="flex items-center justify-center hover:bg-gray-200 h-8 w-8 rounded-full mr-4">
                        <ArrowBackIcon sx={{ fontSize: 20 }} />
                    </Link>

                    <Typography
                        noWrap
                        sx={{
                            mr: 2,
                            fontFamily: 'Open Sans',
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: '24.51px',
                            textAlign: 'center',
                            color: '#333333'
                        }}
                    >
                        {folderName}
                    </Typography>
                    <div onClick={openModal} className="flex items-center justify-center bg-gray-200 h-8 w-8 rounded-full mr-12 cursor-pointer">
                        <BorderColorIcon sx={{ fontSize: 20 }} />
                    </div>
                    <EditFolderName
                        open={isModalOpen}
                        handleCancel={closeModal}
                    />

                    {/* document types */}
                    {documentTypes.map((docType, index) => {
                        return <Typography noWrap key={index} id={docType.value} onClick={changeDocType}
                            sx={{
                                mr: 2, bgcolor: state.selectedDocType === docType.value ? '#FBEDED' : '#F5F5F5', borderRadius: '16px', border: '1px solid #1C1D221A',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', width: 'max-content', px: 1, py: .5,
                                fontSize: 15, cursor: 'pointer', ":hover": { border: '1px solid #BF0606' },
                            }}>
                            {docType.label}
                        </Typography>
                    })}
                    <div onClick={confirmDeleteFolder} className="flex items-center justify-center ml-24 bg-gray-100 h-8 w-8 rounded-full cursor-pointer">
                        <DeleteIcon className="hover:text-red-500" />
                    </div>
                    {/* <IconButton sx={{height: 30, width: 30 }} onClick={openDocumentForm} className="bg-red-500">
                </IconButton> */}
                    <div onClick={openDocumentForm} className="flex items-center justify-center bg-red-700 h-l w-l rounded-full ml-2 cursor-pointer">
                        <AddIcon sx={{ fontSize: 26, color: 'white' }} />
                    </div>
                </Box>

                {/* Documents */}
                {loading ? (
                    <div className="flex items-center justify-center flex-wrap px-3 py-3 mr-3 overflow-auto mt-10" >
                        <PropagateLoader
                            color={"red"}
                            loading={loading}
                            size={15}
                            style={{ position: 'absolute' }}

                        />
                    </div>

                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2, mr: 3., maxHeight: noToolbar ? '300px' : '70vh', overflowY: 'auto' }}>
                        {state.documentArray.map((data, index) => {
                            return <Box sx={{
                                py: 1, mr: 4, borderRadius: '12px', ":hover": { border: '1px solid #BF0606' },
                                boxShadow: '0 1px 4px rgba(0,0,0,0.2)', cursor: 'pointer', mb: 4,
                            }}>
                                {/* Name of document */}
                                <Typography align="center" sx={{
                                    fontSize: 14, fontWeight: 600, px: 1.5, pb: 1
                                }}>
                                    {data.name}

                                </Typography>
                                <Divider />

                                {/* Copy download link */}
                                <Typography sx={{
                                    px: 1, py: 1, my: 3, fontWeight: 600, fontSize: 14, width: 'max-content',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', bgcolor: '#F5F5F5', mx: 'auto',
                                    ":hover": { bgcolor: '#FBEDED' }
                                }} onClick={() => { copyFileLink(data?.filename) }}>
                                    Copy Link
                                </Typography>

                                {/* Download button with number of downloads */}
                                <Divider />
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, justifyContent: 'space-between' }}>
                                    {/* Delete button */}
                                    <IconButton sx={{}} id={data?.filename} onClick={(event) => {
                                        event.stopPropagation();
                                        confirmDelete(data?.filename)
                                    }}>
                                        <IconElement {...{ src: DeleteSvg, id: data?.filename }} />
                                    </IconButton>

                                    <a href={getPath(data?.filename)} onClick={linkClicked} download={true}>
                                        <Typography noWrap sx={{
                                            color: '#8D8D8D', display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5',
                                            py: .5, px: 1.5, width: 'max-content', ml: 4, mr: 1, fontSize: 14, borderRadius: '12px',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)', mt: 1, cursor: 'pointer', float: 'right',
                                            ":hover": { border: '1px solid #BF0606' },
                                        }}/*  onClick={() => { linkClicked(data?.filename) }} */ >
                                            {/* Download icon */}
                                            <DownloadIcon sx={{ fontSize: 20, mr: 5 }} />
                                            {/* Number of downloads */}
                                            {`${data?.downloads ?? 0} Download`}
                                        </Typography>
                                    </a>
                                </Box>

                            </Box>
                        })}
                    </Box>
                )}
            </Box>

            {state.addDocument && <UploadDocument {...{ open: state.addDocument, closeForm: closeDocumentForm }} />}

            <Prompt open={state.showPrompt} message='You are about to delete this document'
                proceedTooltip='Alright, delete the document' cancelTooltip='No, do not remove it'
                onCancel={closePrompt} onProceed={handleDeleteDocument} onClose={closePrompt} />

            <Prompt open={openPrompt} message={`You are about to delete this Folder and All documents in ${folderName}`}
                proceedTooltip='Alright, delete the folder' cancelTooltip='No, do not delete it'
                onCancel={closeFolderPrompt} onProceed={handleDeletefolder} onClose={closeFolderPrompt} />

        </Box>)
}

export default ToolsDocument;


