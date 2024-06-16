'use client'

import { Box, Button, Checkbox, Switch, Typography } from "@mui/material";
import PrivilegeSideBar from "./PrivilegeSideBar";
import { useEffect, useMemo, useRef, useState } from "react";

import SaveIcon from '@mui/icons-material/Save';

import sectionData from './privilegeList';

import Prompt from "@/Components/Prompt";
import { getPrivileges } from "../helper";
import IconElement from "@/Components/IconElement";
import { DeleteSvg } from "@/public/icons/icons";

//const DeleteSvg = '/icons/DeleteSvg.svg'

export default function PrivilegeComponent({ privilegeName, containerHeight, createMode, updatePrivilege, saveEdit, deletePrivilege }) {
    console.log('section data', sectionData);

    const ref = useRef(null);
    const tabBodyRef = useRef(null);
    const selectAllRef = useRef(null);

    const [state, setState] = useState({
        selectedSection: null, useableHeight: '10px', selectedSectionData: [], tabBodyRef: null, selectAllRef: null,
        selectedTabIndex: 0, tabBodyTop: '10px', privilegeObject: {}, showDeletePrompt: false, ref: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        })
    }

    const handleGetPrivileges = () => {
        getPrivileges({
            name: privilegeName, dataProcessor: (result) => {
                if (result)
                    updateState({ privilegeObject: result.privilegeObject ?? {} })
            }
        })
    }

    useEffect(() => {
        updateState({ ref: ref, tabBodyRef: tabBodyRef, selectAllRef: selectAllRef })

        if (state.ref?.current && state.tabBodyRef?.current)
            updateState({
                useableHeight: state.ref.current.getBoundingClientRect().top,
                tabBodyTop: state.tabBodyRef.current.getBoundingClientRect().bottom,
            })

        if (!createMode)
            handleGetPrivileges()
    }, [])

    const bodyTop = useMemo(() => {
        if (state.ref?.current)
            return state.ref.current.getBoundingClientRect().top
    }, [state.tabBodyRef?.current])

    const tabbodyTop = useMemo(() => {
        if (state.tabBodyRef?.current)
            return state.tabBodyRef.current.getBoundingClientRect().bottom
    }, [state.tabBodyRef?.current])

    useEffect(() => {
        if (state.selectedSection)
            updateState({ selectedSectionData: sectionData[state.selectedSection], selectedTabIndex: 0, })
    }, [state.selectedSection])

    useEffect(() => {
        handleGetPrivileges()
    }, [privilegeName])

    useEffect(() => {
        if (createMode) {
            updateState({ privilegeObject: {} })
        }
        else {
            handleGetPrivileges()
        }
    }, [createMode])

    const handleSelectSection = (id) => {
        updateState({ selectedSection: id })
    }

    const swtichTab = (event) => {
        updateState({ selectedTabIndex: Number(event.target.id) })
    }

    const handlePrivilegeChange = (event) => {
        const value = event.target.id;
        const indexName = state.selectedSectionData[state.selectedTabIndex]?.value;
        const copyObj = { ...state.privilegeObject }
        console.log('value', value, event.target.checked);

        if (event.target.checked) {
            copyObj[state.selectedSection] = copyObj[state.selectedSection] ?
                { ...copyObj[state.selectedSection], [indexName]: [...copyObj[state.selectedSection][indexName] ?? [], value] }
                : { [indexName]: [value] };

            updateState({
                privilegeObject: {
                    ...copyObj
                }
            })
        }
        else {
            copyObj[state.selectedSection][indexName] = copyObj[state.selectedSection][indexName]?.filter(item => item !== value);

            updateState({
                privilegeObject: {
                    ...copyObj
                }
            })
        }
        updatePrivilege(copyObj)
    }

    const isValueSelected = (value) => {
        try {
            const indexName = state.selectedSectionData[state.selectedTabIndex]?.value;
            return state.privilegeObject[state.selectedSection][indexName]?.includes(value)
        } catch (error) {
            return false
        }
    }

    const handleSaveEdit = () => {
        saveEdit(privilegeName, state.privilegeObject)
    }

    const handleSelectAll = (event) => {
        const indexName = state.selectedSectionData[state.selectedTabIndex]?.value;
        const copyObj = { ...state.privilegeObject };
        console.log('value', event.target.checked);

        if (event.target.checked) {
            const allValues = state.selectedSectionData[state.selectedTabIndex].privileges.map(item => item.value);

            copyObj[state.selectedSection] = copyObj[state.selectedSection] ?
                { ...copyObj[state.selectedSection], [indexName]: allValues }
                : { [indexName]: allValues };

            // copyObj[state.selectedSection][indexName] = allValues;

            updateState({
                privilegeObject: { ...copyObj }
            })
        }
        else {
            copyObj[state.selectedSection][indexName] = []

            updateState({
                privilegeObject: { ...copyObj }
            })
        }
        updatePrivilege(copyObj)
    }

    const confirmDelete = () => {
        updateState({ showDeletePrompt: true })
    }

    const closeDeletePrompt = () => {
        updateState({ showDeletePrompt: false })
    }

    const handleDelete = () => {
        deletePrivilege(() => {
            closeDeletePrompt()
        })
    }

    const handleSelectAllClick = () => {
        state.selectAllRef.current.click();
    }

    const isAllSelected = () => {
        if (state.privilegeObject[state.selectedSection]) {
            const indexName = state.selectedSectionData[state.selectedTabIndex]?.value;

            const selectedArr = state.privilegeObject[state.selectedSection][indexName] ?? [];

            console.log('indexName,selectedArr', indexName, selectedArr)

            const nonSelectedItems =
                state.selectedSectionData[state.selectedTabIndex].privileges.filter(item => !selectedArr.includes(item.value))

            console.log('indexName,selectedArr,nonSelectedItems', indexName, selectedArr, nonSelectedItems)

            return !Boolean(nonSelectedItems.length)
        }
    }

    console.log('compon state', state);

    return <Box sx={{
        display: 'flex', alignItems: 'flex-start',
    }}>
        {/* Side bar of sections */}
        <Box sx={{ width: { xs: 'max-content', md: '20%' }, overflowY: 'auto', maxHeight: containerHeight }}>
            <PrivilegeSideBar {...{ selectSection: handleSelectSection, }} />
        </Box>


        {/* Details of the selected section */}
        <Box sx={{ width: '80%' }}>
            {/* Toolbar */}
            {!createMode && <Box sx={{
                display: 'flex', alignItems: 'stretch', px: { xs: 2, sm: 4 }, py: { xs: 1, sm: 1.5 }, bgcolor: '#F5F5F5',
                borderBottom: '1px solid #1C1D221A'
            }}>
                <Typography sx={{
                    fontSize: { xs: 14, sm: 15 }, fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center'
                }}>
                    {privilegeName}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button sx={{
                    fontSize: { xs: 12, sm: 14 }, fontWeight: 600, bgcolor: 'white', color: '#333333',
                    px: 2, py: .5, borderRadius: '12px', mr: 2
                }} onClick={handleSaveEdit}>
                    <SaveIcon sx={{ mr: 1, height: '20px', width: 'auto' }} /> Save
                </Button>

                <Button sx={{
                    fontSize: { xs: 12, sm: 14 }, fontWeight: 600, bgcolor: 'white', color: '#BF0606',
                    pl: 1, pr: 1.5, py: .5, borderRadius: '12px'
                }} onClick={confirmDelete}>
                    <DeleteSvg style={{
                        marginRight: 2, height: '30px', width: 'auto',
                        padding: 0, backgroundColor: 'transparent'
                    }} />  Delete

                </Button>
            </Box>
            }
            {/* Body */}
            <Box ref={state.ref} sx={{ overflowY: 'hidden', height: `calc(100vh - ${bodyTop}px)` }}>
                {/* Tab head */}
                <Box sx={{
                    overflowX: 'auto',/*  width: '300px' */
                }}>
                    <Box ref={state.tabBodyRef} sx={{
                        display: 'flex', alignItems: 'stretch', width: 'max-content',
                        flexDirection: 'row', justifyContent: 'center', mx: 'auto'
                    }}>
                        {state.selectedSectionData.map((data, index) => {
                            const selected = state.selectedTabIndex === index;

                            return <Typography noWrap key={index} id={index} sx={{
                                px: 3, py: 2, mx: 2, fontSize: { xs: 14, md: 16 }, fontWeight: 600, width: 'max-content',
                                color: selected ? '#BF0606' : 'black', borderBottom: selected ? '2px solid #BF0606' : 'none',
                                cursor: 'pointer', ':hover': { background: '#BF06061A' }, display: 'block'
                            }} onClick={swtichTab}>
                                {data.label}
                            </Typography>
                        })}
                    </Box>
                </Box>

                {/* Tab body */}
                <Box sx={{
                    maxWidth: { md: '60%' }, mx: 'auto', overflowY: 'auto',
                    height: `calc(100vh - (${tabbodyTop}px + 80px))`,
                }}>
                    {/* Toolbar */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: { xs: 1, md: 2 },
                        px: { xs: 2, md: 4 }, bgcolor: '#F5F5F5', borderBottom: '1px solid #1C1D221A',
                    }}>
                        <Typography sx={{
                            fontSize: { xs: 14, md: 15 }, fontWeight: 700, textTransform: 'uppercase'
                        }}>
                            {state.selectedSectionData[state.selectedTabIndex]?.label}
                        </Typography>

                        <Typography ref={state.selectAllRef} sx={{
                            fontSize: { xs: 13, md: 14 }, fontWeight: 700, display: 'flex', alignItems: 'center'
                        }} onClick={handleSelectAllClick}>

                            select all
                            <Checkbox sx={{ bgcolor: 'white', p: 0, ml: 2, borderRadius: -1 }} onChange={handleSelectAll}
                                value={Boolean(isAllSelected())} checked={Boolean(isAllSelected())} />

                        </Typography>
                    </Box>

                    {/* Body */}
                    <Box sx={{ px: 4 }}>
                        {state.selectedSectionData[state.selectedTabIndex]?.privileges?.map((data, index) => {
                            const isSelected = isValueSelected(data.value);

                            return <Typography id={data.value} key={index} sx={{
                                fontSize: { xs: 14, md: 15 }, fontWeight: 500, display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', py: 1
                            }}>
                                {data?.label}

                                <Switch id={data.value} key={index} onChange={handlePrivilegeChange}
                                    value={isSelected} checked={isSelected} />
                            </Typography>
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>

        <Prompt {...{
            open: state.showDeletePrompt, onClose: closeDeletePrompt,
            message: `You are about to delete ${privilegeName}`, proceedTooltip: 'Go ahead and delete it',
            onCancel: closeDeletePrompt, cancelTooltip: 'Do nothing', onProceed: handleDelete
        }} />

    </Box>
}