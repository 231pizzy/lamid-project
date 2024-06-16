'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { openSnackbar, setPageTitle } from "@/Components/redux/routeSlice";
import { Box, Button, IconButton, Modal, OutlinedInput, Typography } from "@mui/material";

import AddIcon from '@mui/icons-material/Add'
import BackIcon from '@mui/icons-material/West'
import PrevIcon from '@mui/icons-material/KeyboardArrowLeft'
import NextIcon from '@mui/icons-material/KeyboardArrowRight'

const privilegeHome = '/images/privilegeHome.png'

import PrivilegeComponent from "./accessories/PrivilegeComponent";

import CreatePrivilege from "./accessories/CreatePrivilege";

import { createPrivilege, deletePrivilege, editPrivilege, getPrivileges } from "./helper";

export default function Privilege() {
    const dispatch = useDispatch();
    const mainToolBarRef = useRef(null);
    const parentRef = useRef(null)

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Privilege' }))

        setToolbarHeight();

        handleGetPrivileges();

        updateState({ parentRef: parentRef, mainToolBarRef: mainToolBarRef })
    }, []);

    const [state, setState] = useState({
        selectedPrivilege: null, privilegesPerPage: 10, currentPage: 1, privilegeList: [],
        firstItem: '', lastItem: '', toolBarHeight: '10px', bottom: '10px', parentTop: '10px',
        createPrivilege: false, privilegeObject: {}, privilegeName: '', showNameForm: false,
        changesToList: 0, errMsg: '', parentRef: null, mainToolBarRef: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    }

    useEffect(() => {
        console.log('getting privileges');
        handleGetPrivileges();
    }, [state.changesToList]);

    const handleGetPrivileges = () => {
        getPrivileges({
            dataProcessor: (result) => {
                if (result)
                    updateState({ privilegeList: result })
            }
        })
    }

    const paginationLabel = useMemo(() => {
        let firstItem = ((state.currentPage - 1) * state.privilegesPerPage);

        const total = firstItem + state.privilegesPerPage;

        const lastItem = total < state.privilegeList?.length ? total : state.privilegeList?.length;

        updateState({ firstItem: firstItem, lastItem: lastItem })

        return `${firstItem + 1} - ${lastItem} of ${state.privilegeList?.length}`
    }, [state.privilegeList, state.currentPage]);


    const setToolbarHeight = () => {
        if (state.mainToolBarRef?.current && state.parentRef?.current)
            updateState({
                bottom: state.mainToolBarRef.current.getBoundingClientRect().bottom,
                toolBarHeight: state.mainToolBarRef.current.clientHeight,
                parentTop: state.parentRef.current.getBoundingClientRect().top,
            })
    }

    useEffect(() => {
        setToolbarHeight()
    }, [state.mainToolBarRef, state.parentRef])

    const gotoPrevPage = () => {
        updateState({ currentPage: state.currentPage - 1, })
    }

    const gotoNextPage = () => {
        updateState({ currentPage: state.currentPage + 1, })
    }

    const iconButtonElement = ({ icon, onclick, id, color, bgcolor, disabled, style }) => {
        return <IconButton id={id} sx={{ bgcolor: bgcolor, color: color, mr: 1, height: 28, width: 28, ...style }}
            onClick={onclick} disabled={disabled}>
            {icon}
        </IconButton>
    }

    const selectPrivilege = (event) => {
        updateState({ selectedPrivilege: event.target.id })
    }

    const unselectPrivilege = () => {
        updateState({ selectedPrivilege: null })
    }

    const switchToCreateMode = () => {
        updateState({ createPrivilege: true })
    }

    const exitCreateMode = () => {
        updateState({ createPrivilege: false })
    }

    const handlePrivilegeChange = (newPrivilegeObject) => {
        updateState({ privilegeObject: newPrivilegeObject })
    }

    const handleDeletePrivilege = (callback) => {
        deletePrivilege({
            name: state.selectedPrivilege, dataProcessor: (result) => {
                unselectPrivilege();
                updateState({ changesToList: state.changesToList + 1 })
                callback()
                dispatch(openSnackbar({ message: '1 privilege has been deleted', severity: 'success' }))
            }
        })
        /*   deletePrivilege(updateState, remoteRequest, dispatch, openSnackbar, navigate, state.selectedPrivilege,
              () => {
                  
              }) */
    }

    const handleCreatePrivilege = (privilegeName, privilegeObject) => {
        console.log('privilegeName', 'privilegeObject', privilegeObject, privilegeName)
        if (privilegeObject && privilegeName) {
            createPrivilege({
                name: privilegeName, privilegeObject: privilegeObject, dataProcessor: (result) => {
                    exitCreateMode();
                    closeNameForm();
                    updateState({ changesToList: state.changesToList + 1, selectedPrivilege: privilegeName });
                    dispatch(openSnackbar({ message: '1 new privilege created', severity: 'success' }))
                }
            })
            /*  createPrivilege(updateState, dispatch,
                 remoteRequest, openSnackbar, toggleBlockView, navigate,
                 privilegeObject, privilegeName,
                 () => {
                     exitCreateMode();
                     closeNameForm();
                     updateState({ changesToList: state.changesToList + 1, selectedPrivilege: privilegeName })
                 }) */
        }
    }

    const handleValidate = () => {
        if (state.privilegeName) {
            getPrivileges({
                name: state.privilegeName, dataProcessor: (result) => {
                    if (result) updateState({ errMsg: 'Name already exists' })
                    else handleCreatePrivilege(state.privilegeName, state.privilegeObject)
                }
            })
            /*   getPrivileges(updateState, remoteRequest, dispatch, openSnackbar, navigate, state.privilegeName, true,
                  () => { handleCreatePrivilege(state.privilegeName, state.privilegeObject) }) */
        }
        else {
            updateState({ errMsg: 'Name must not be empty' })
        }
    }

    const handleEditPrivilege = (privilegeName, privilegeObject) => {
        console.log('privilegeName', 'privilegeObject', privilegeObject, privilegeName)
        if (privilegeObject && privilegeName) {
            editPrivilege({
                name: privilegeName, privilegeObject: privilegeObject, dataProcessor: (result) => {
                    updateState({ changesToList: state.changesToList + 1 });
                    dispatch(openSnackbar({ message: 'Privilege edit saved', severity: 'success' }))
                }
            })
            /*   editPrivilege(updateState, dispatch,
                  remoteRequest, openSnackbar, toggleBlockView, navigate,
                  privilegeObject, privilegeName,
                  () => {
                      // unselectPrivilege();
                     
                  }) */
        }
    }

    const showNameForm = () => {
        updateState({ showNameForm: true })
    }

    const closeNameForm = () => {
        updateState({ showNameForm: false, privilegeName: '', errMsg: '' })
    }

    const handleTextInput = (event) => {
        updateState({ privilegeName: event.currentTarget.value, errMsg: '' })
    }

    console.log('state', state);

    return <Box ref={state.parentRef} sx={{
        maxHeight: `calc(100vh - (${state.parentTop}px + 20px))`,
        overflowY: 'hidden', position: 'relative',
    }}>
        {/* Appbar */}
        <Box ref={state.mainToolBarRef} sx={{ height: 'max-content' }}>
            {/* Row 1 */}
            {state.createPrivilege
                ? <CreatePrivilege {...{
                    exitCreateMode: exitCreateMode, submit: showNameForm,
                    privilegeName: state.privilegeName, privilegeObject: state.privilegeObject
                }} />
                : <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    py: { xs: 1, md: 1.5 }, px: { xs: 2, md: 2 },
                    bgcolor: '#F5F5F5', borderBottom: '1px solid #1C1D221A',
                }}>
                    <Typography sx={{
                        fontSize: { xs: 14, md: 16 }, fontWeight: 700, display: 'flex', alignItems: 'center'
                    }}>
                        {state.selectedPrivilege && iconButtonElement({
                            icon: <BackIcon sx={{ fontSize: 22 }} />, onclick: unselectPrivilege,
                            color: 'black', bgcolor: 'white', id: 'goBack', style: { mr: 2 }
                        })}
                        PRIVILEGE
                    </Typography>

                    {iconButtonElement({ icon: <AddIcon sx={{ fontSize: 22 }} />, color: 'white', bgcolor: '#BF0606', id: 'addPrivilege', onclick: switchToCreateMode })}
                </Box>}

            {/* Row 2 */}
            {!state.createPrivilege && <Box sx={{
                bgcolor: '#FFF4F4', py: { xs: 1, md: 1.5 }, px: { xs: 2, md: 2 },/*  overflowX: 'hidden' */
            }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', /* mb: { xs: 1, md: 2 } */
                }}>
                    <Typography sx={{
                        fontSize: { xs: 13, md: 14 }, fontWeight: 700
                    }}>
                        SAVED PRIVILEGES ({state.privilegeList?.length})
                    </Typography>

                    {Boolean(state.privilegeList?.length) && <Box sx={{
                        mb: { xs: 1, md: 2 },
                        display: 'flex', alignItems: 'center'
                    }}>
                        {iconButtonElement({
                            icon: <PrevIcon sx={{ fontSize: 22 }} />, disabled: state.currentPage <= 1,
                            color: '#BF0606', bgcolor: '#BF060614', id: 'prevSet', onclick: gotoPrevPage
                        })}

                        <Typography sx={{
                            fontSize: { xs: 13, md: 14 }, fontWeight: 700, mx: 2
                        }}>
                            {paginationLabel}
                        </Typography>

                        {iconButtonElement({
                            icon: <NextIcon sx={{ fontSize: 22 }} />, id: 'nextSet',
                            disabled: (state.currentPage * state.privilegesPerPage >= state.privilegeList?.length) ||
                                state.privilegeList?.length === 0,
                            color: '#BF0606', bgcolor: '#BF060614', onclick: gotoNextPage
                        })}
                    </Box>}
                </Box>

                <Box sx={{
                    overflowX: 'auto'
                }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', flexWrap: 'nowrap', width: 'max-content',

                    }}>
                        {state.privilegeList.slice(state.firstItem, state.lastItem)?.map((privilegeObj, index) => {
                            const selected = state.selectedPrivilege === privilegeObj.name;

                            return <Typography noWrap key={index} id={privilegeObj.name} sx={{
                                fontSize: { xs: 13, md: 14 }, fontWeight: 500, px: 2, py: .5, mr: 2, mb: 1, borderRadius: '8px',
                                bgcolor: selected ? '#BF060614' : 'white', color: selected ? '#BF0606' : 'black',
                                width: 'max-content', boxShadow: '0px 8px 12px 0px #0000000A', cursor: 'pointer',
                                border: `1px solid ${selected ? '#BF0606' : '#1C1D221A'}`, ":hover": { background: '#BF060604' },
                            }} onClick={selectPrivilege}>
                                {privilegeObj.name}
                            </Typography>
                        })}
                    </Box>
                </Box>
            </Box>}
        </Box>

        {/* Body */}
        <Box sx={{ /* pt: state.createPrivilege ? `${state.parentTop}px` : `calc(${state.toolBarHeight}px + 40px)`,
        height: '100%', */ height: `calc(100vh - (${state.bottom}px))`
        }}>
            {(state.selectedPrivilege || state.createPrivilege) ?
                <PrivilegeComponent {...{
                    privilegeName: state.selectedPrivilege, createMode: state.createPrivilege, saveEdit: handleEditPrivilege,
                    containerHeight: `calc(100vh - ${state.bottom}px)`, updatePrivilege: handlePrivilegeChange,
                    deletePrivilege: handleDeletePrivilege
                }} />
                :
                <Box sx={{ py: { xs: 1, sm: 2 }, height: `calc(100vh - ${state.bottom}px)`, overflowY: 'scroll' }}>
                    <Typography sx={{
                        fontSize: { xs: 14, md: 16 }, fontWeight: 700, my: { xs: 2, sm: 4 }, mx: 'auto',
                        maxWidth: { xs: '80vw', sm: '400px', md: '500px', }, textAlign: 'center'
                    }}>
                        Select a saved privilege to view or create a new privilege by clicking on the <span style={{ color: '#BF0606' }}>" +"</span> icon on the top right corner
                    </Typography>

                    <Box sx={{
                        height: 'auto', width: { xs: '70vw', sm: '300px', md: '300px', }, mx: 'auto',
                    }}>
                        <img src={privilegeHome} alt='none-selected' style={{
                            height: '100%', width: '100%',
                        }} />
                    </Box>
                </Box>}
        </Box>

        <Modal open={state.showNameForm} onClose={closeNameForm}>
            <Box align='center' sx={{
                height: 'max-content', transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 4, borderRadius: '16px',
                position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', lg: '25%' },
            }}>
                <Typography sx={{
                    fontSize: { xs: 14, md: 15 }, fontWeight: 700, mb: 3
                }}>
                    SAVE PRIVILEGE AS
                </Typography>

                <Typography sx={{
                    fontSize: { xs: 12, md: 13 }, fontWeight: 700, mb: 1, color: 'red'
                }}>
                    {state.errMsg}
                </Typography>

                <OutlinedInput
                    placeholder="Privilege name"
                    value={state.privilegeName}
                    onChange={handleTextInput}
                    fullWidth
                    sx={{ fontSize: 14, height: '40px' }}
                />

                <Box sx={{
                    display: 'flex', alignItems: 'center', pt: 3, justifyContent: 'center'
                }}>
                    <Button variant="text" sx={{ mr: 6, fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
                        onClick={() => { handleValidate() }}>
                        Create
                    </Button>

                    <Button variant="text" sx={{ color: '#646464', fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
                        onClick={closeNameForm}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>

    </Box>
}