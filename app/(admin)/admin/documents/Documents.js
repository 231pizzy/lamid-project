'use client'

import {
    Box, Divider, IconButton, Checkbox, Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PropagateLoader from "react-spinners/PropagateLoader";

import Prompt from "@/Components/Prompt";

import { useEffect, useState } from "react";
import CreateDocModal from "@/Components/CreateDocumentModal/CreateDocMessage";
import Link from 'next/link';

const DeleteSvg = '/icons/DeleteSvg.svg';


function ToolsDocument({ noToolbar }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [openPrompt, setOpenPrompt] = useState(false)

    const getFolders = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/folders", {
                method: "GET",
            });
            const data = await res.json();
            setFolders(data);
            setLoading(false);
        } catch (err) {
            console.log("[collections_GET]", err);
        }
    };

    useEffect(() => {
        getFolders();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckboxChange = (folderId) => {
        if (selectedFolders.includes(folderId)) {
            setSelectedFolders(selectedFolders.filter(id => id !== folderId));
            console.log(selectedFolders)
        } else {
            setSelectedFolders([...selectedFolders, folderId]);
        }
    };


    const handleSelectAll = () => {
        if (selectedFolders.length === folders.length) {
            setSelectedFolders([]);
        } else {
            const allFolderIds = folders.map(folder => folder._id);
            setSelectedFolders(allFolderIds);
        }
    };

    const handleDeselectAll = () => {
        setSelectedFolders([]);
    };

    const handleDeleteSelectedFolders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/folders`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderIds: selectedFolders }),
            });
            if (response.ok) {
                window.location.href = "/admin/documents";
                setLoading(false);
            } else {
                console.error('Failed to delete selected folders and associated documents');
                // Handle error cases if needed
            }
        } catch (error) {
            console.error('Error deleting selected folders and associated documents:', error);
            // Handle network errors or other exceptions
        }
    };

    const confirmDeleteFolder = () => {
        setOpenPrompt(true)
    }

    const closeFolderPrompt = () => {
        setOpenPrompt(false)
        setLoading(false);
    }

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
            </Box>}

            {/* Body */}
            <div className="flex w-full h-full">
                <div style={{ width: '282px', height: '799px', top: '165px', left: '240px', gap: '24px', borderRight: '1.5px solid #ccc' }}>
                    {/* Heading */}
                    <div className="flex items-center justify-between" style={{ backgroundColor: '#F5F5F5', width: '282px', height: '70px', }}>
                        {/* Heading */}
                        <h1 className="font-open-sans text-lg font-semibold mt-6 ml-4 text-center" style={{ fontSize: '18px', lineHeight: '24.51px' }}>CATEGORIES</h1>

                        {/* Icon button */}
                        <div className="mt-6 mr-4">
                            <IconButton sx={{ height: 30, width: 30 }} onClick={openModal} style={{ backgroundColor: '#BF0606' }}>
                                <AddIcon sx={{ fontSize: 26, color: 'white' }} />
                            </IconButton>
                            <CreateDocModal
                                // title="Your Title" 
                                open={isModalOpen}
                                handleCancel={closeModal}
                            />


                        </div>
                    </div>
                    {/* Team card elements */}
                    <div className="relative flex flex-wrap" style={{ width: 'hug-218px', height: 'hug-676px', top: '40px', left: '32px', gap: '28px', backgroundColor: 'FFFFFF'}}>
                        {loading ? (
                        <div className="w-1/3 items-center justify-center flex mt-20" style={{ width: '218px', height: '60px', padding: '0px 74px 0px 0px', border: '1px'}}>
                                <PropagateLoader
                                    color={"red"}
                                    loading={loading}
                                    size={15}
                                    style={{ position: 'absolute' }}
                                
                                />
                        </div>

                        ) : (
                            folders.map((folder, index) => (
                                <div key={index} className="w-1/3 mb-4 rounded-lg" style={{ width: '218px', height: '60px', padding: '0px 74px 0px 0px', gap: '10px', border: '1px', background: '#F7F7F7' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            style={{ width: '60px', color: ' #b50d0d', height: '60px', borderRight: '1px solid #8D8D8D' }}
                                            onChange={() => handleCheckboxChange(folder._id)}
                                            checked={selectedFolders.includes(folder._id)}
                                        />
                                        <Link
                                            href={{
                                                pathname: '/admin/folderData',
                                                query: { folderId: folder._id, folderName: folder.name }
                                            }}
                                        >
                                            <h3 style={{ marginLeft: '15px' }}>{folder.name}</h3>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>

                {/* Upload file */}
                <div className="flex flex-col items-center justify-center h-screen w-full" style={{ backgroundColor: '#FCF8F8' }}>
                {loading ? (
                    <div className="mt-2 items-center justify-center ml-24" >
                        <PropagateLoader
                                    color={"red"}
                                    loading={loading}
                                    size={15}
                                    style={{ position: 'absolute' }}
                                
                                />
                    </div>

               ) : (
                    <div className="mt-2 items-center justify-center ml-24" >

                        <h1 className="text-center mb-6">Upload And Download Documents Here</h1>
                        <button>
                            <img src="/images/uploadFile.png" alt="Upload File" />
                        </button>

                        {/* Modal */}
                        {selectedFolders.length > 0 && (
                            <div className="border rounded-lg flex items-center justify-between" style={{ width: '547px', height: '73px', borderColor: '#FFD4D4' }}>
                                <CloseIcon className="ml-6 cursor-pointer" onClick={handleDeselectAll} />
                                <p className="ml-2">{selectedFolders.length} item(s) selected</p>
                                <button onClick={handleSelectAll} style={{ color: '#BF0606' }}>{selectedFolders.length === folders.length ? 'Deselect All' : 'Select All'}</button>
                                <div style={{ color: '#BF0606', borderColor: '#FFD4D4', width: '103px', height: '38px', }} className="mr-6 border cursor-pointer flex items-center justify-between hover:bg-red-100 rounded-md">
                                    <DeleteIcon style={{ width: '20px', height: '20px', marginLeft: '6px' }} />
                                    <button onClick={confirmDeleteFolder} className="mr-3">Delete</button>
                                </div>
                            </div>

                        )}
                    </div>
                    )}
                </div>

            </div>

    

  <Prompt
    open={openPrompt}
    message={`You are about to delete selected folder(s) and associated documents`}
    proceedTooltip='Alright, delete the folder'
    cancelTooltip='No, do not delete it'
    onCancel={closeFolderPrompt}
    onProceed={handleDeleteSelectedFolders}
    onClose={closeFolderPrompt}
  />

        </Box>)
}

export default ToolsDocument;



{/* <Box sx={{ maxHeight: noToolbar ? '300px' : '90vh', overflowY: 'hidden' }}>
{/* Document types */}
{/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}> */ }
// {documentTypes.map((docType, index) => {
// return <Typography noWrap key={index} id={docType.value} onClick={changeDocType}
// sx={{
// mr: 3, bgcolor: state.selectedDocType === docType.value ? '#FBEDED' : '#F5F5F5', borderRadius: '16px', border: '1px solid #1C1D221A',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.2)', width: 'max-content', px: 1, py: .5,
//         fontSize: 15, cursor: 'pointer', ":hover": { border: '1px solid #BF0606' },
//     }}>
//     {docType.label}
// </Typography>
//     })}
// </Box>

{/* Documents */ }
{/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2, mr: 3., maxHeight: noToolbar ? '300px' : '70vh', overflowY: 'auto' }}>
    {state.documentArray.map((data, index) => {
        return <Box sx={{
            py: 1, mr: 4, borderRadius: '12px', ":hover": { border: '1px solid #BF0606' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)', cursor: 'pointer', mb: 4,
        }}> */}
{/* Name of document */ }
// <Typography align="center" sx={{
//     fontSize: 14, fontWeight: 600, px: 1.5, pb: 1
// }}>
//     {data.name}

// </Typography>
// <Divider />

{/* Copy download link */ }
// <Typography sx={{
//     px: 1, py: 1, my: 3, fontWeight: 600, fontSize: 14, width: 'max-content',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.2)', bgcolor: '#F5F5F5', mx: 'auto',
//     ":hover": { bgcolor: '#FBEDED' }
// }} onClick={() => { copyFileLink(data?.filename) }}>
//     Copy Link
// </Typography>

{/* Download button with number of downloads */ }
// <Divider />
// <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, justifyContent: 'space-between' }}>
//     {/* Delete button */}
//     <IconButton sx={{}} id={data?.filename} onClick={(event) => {
//         event.stopPropagation();
//         confirmDelete(data?.filename)
//     }}>
//         <IconElement {...{ src: DeleteSvg, id: data?.filename }} />
//     </IconButton>

// <a href={getPath(data?.filename)} onClick={linkClicked} download={true}>
//     <Typography noWrap sx={{
//         color: '#8D8D8D', display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5',
//         py: .5, px: 1.5, width: 'max-content', ml: 4, mr: 1, fontSize: 14, borderRadius: '12px',
//         boxShadow: '0 1px 4px rgba(0,0,0,0.2)', mt: 1, cursor: 'pointer', float: 'right',
//         ":hover": { border: '1px solid #BF0606' },
//     }}/*  onClick={() => { linkClicked(data?.filename) }} */ >
//         {/* Download icon */}
//         <DownloadIcon sx={{ fontSize: 20, mr: .5 }} />
//         {/* Number of downloads */}
//         {`${data?.downloads ?? 0} Download`}
//     </Typography>
// </a>
//             </Box>

//         </Box>
//     })}
// </Box>
// </Box>

// {state.addDocument && <UploadDocument {...{ open: state.addDocument, closeForm: closeDocumentForm }} />}

// <Prompt open={state.showPrompt} message='You are about to delete this document'
// proceedTooltip='Alright, delete the document' cancelTooltip='No, do not remove it'
// onCancel={closePrompt} onProceed={handleDeleteDocument} onClose={closePrompt} /> */}