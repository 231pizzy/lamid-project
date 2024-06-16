'use client'

import {
    Box, Button, Typography, Checkbox, IconButton, Pagination, Modal
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useState, useEffect, useMemo, useRef } from "react";

import SettingIcon from "@mui/icons-material/SettingsOutlined";

import AddIcon from "@mui/icons-material/AddOutlined";

import FilterIcon from '@mui/icons-material/FilterAltOutlined';

import { setDashboardView, setPageTitle } from "@/Components/redux/routeSlice";;

import { v4 as uuid } from 'uuid';

import GridLayout from "./GridLayout";

import ListLayout from "./ListLayout";

import AddClient from "./AddClient";

import EmailClient from "./EmailClient";

import Contact from "./Contact";

import Filter from "./Filter";

import { SearchBox } from "@/Components/SearchBox";
import { useRouter } from "next/navigation";
import { getContactList, getNumberOfContacts, searchForContact } from "./helper";

function Crm({ noToolbar }) {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        /* Set Page title */
        if (!noToolbar) {
            dispatch(setPageTitle({ pageTitle: 'Tools' }))
        }
    })

    const [state, setState] = useState({
        selected: [], orderBy: '', order: '', tableContent: [], currentLayout: 'list',
        currentPage: 1, firstItem: '', lastItem: '', rowsPerPage: 10, paginationCount: 1,
        searchValue: '', openAddClientForm: false, openSendEmailForm: false, dataAdded: 0,
        emailClient: { email: '', fullName: '', profilePicture: '' }, showFilter: false, numberOfContacts: 0,
        selectedClientId: '', searchAnchor: useRef(null), openSearchMenu: false, searchResult: [],
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        console.log('refreshing contacts')
        fetchData();
    }, [state.dataAdded])

    useEffect(() => {

        //  updateState({ paginationCount: Math.ceil(state.numberOfContacts / state.rowsPerPage) })
    }, [state.numberOfContacts])



    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const handleCheckbox = (id) => {
        console.log('id', id)
        //  const id = event.target.id;
        const selectedItems = state.selected;
        if (selectedItems.includes(id)) {
            //remove it from the list of selected items
            selectedItems.splice(selectedItems.indexOf(id), 1);
            updateState({ selected: [...selectedItems] })
        }
        else {
            //add it to the  list of selected items
            updateState({ selected: [...state.selected, id] })
        }
    }

    const fetchData = () => {
        console.log('setting page count')

        /*   const callback = (numberOfContacts) => {
              return {
                  paginationCount: Math.ceil(numberOfContacts / state.rowsPerPage),
                  numberOfContacts: numberOfContacts
              }
          }; */

        getNumberOfContacts({
            dataProcessor: (result) => {
                console.log('result', result)
                const numberOfContacts = result?.count;

                updateState({
                    tableContent: [...result?.contacts],
                    paginationCount: Math.ceil(numberOfContacts / state.rowsPerPage),
                    numberOfContacts: numberOfContacts
                })
            }
        })

        //  getContacts(updateState, remoteRequest, dispatch, openSnackbar, navigate, 10, 0, callback);
    }

    const openAddClientForm = (event) => {
        updateState({ openAddClientForm: true })
    }

    const closeAddClientForm = ({ dataAdded }) => {
        console.log('closing form', dataAdded);

        updateState({ openAddClientForm: false, dataAdded: dataAdded ? state.dataAdded + 1 : state.dataAdded })
    }

    const openSendEmailForm = (event) => {
        updateState({ openSendEmailForm: true })
    }

    /* const fetchMoreContacts = () => {
      
    } */

    const closeSendEmailForm = (event) => {
        updateState({ openSendEmailForm: false })
    }

    const handleSelectAll = (event) => {
        if (state.selected.length === tableContent.length) {
            //remove all from the list of selected items 
            updateState({ selected: [] })
        }
        else {
            //add all items to the  list of selected items
            updateState({
                selected: tableContent.map(itemObj => itemObj._id),

            })
        }
    }

    const openFilter = () => {
        updateState({ showFilter: true })
    }

    const closeFilter = () => {
        updateState({ showFilter: false })
    }


    const isChecked = (id) => {
        return state.selected.includes(id);
    }

    const allChecked = () => {
        return state.selected.length === tableContent.length
    }

    const gotoContact = (id) => {
        console.log('tools id', id)
        updateState({ selectedClientId: id });
        router.push('/admin/contact', { state: { clientId: id } })
    }


    const handlePaginate = (event, value) => {
        // updateState({ currentPage: value })
        // const callback= () => { return { currentPage: value } }

        getContactList({
            offset: Math.min([(value - 1) * state.rowsPerPage]), size: 10,
            dataProcessor: (result) => {
                updateState({
                    tableContent: [...result], currentPage: value
                });
            }
        })

    }

    const paginationLabel = useMemo(() => {
        let firstItem = ((state.currentPage - 1) * state.rowsPerPage);

        const total = state.numberOfContacts;

        const tempLastItem = ((state.currentPage) * state.rowsPerPage);

        const lastItem = total < tempLastItem ? total : tempLastItem;

        updateState({ firstItem: firstItem, lastItem: lastItem })

        return `${firstItem + 1} - ${lastItem} of ${total}`
    }, [state.tableContent, state.currentPage, state.numberOfContacts]);


    const switchLayout = (event) => {
        const layout = event.currentTarget.id;
        updateState({ currentLayout: layout });
    }

    const createEmail = ({ email, profilePicture, fullName }) => {
        console.log('open email form')
        updateState({
            openSendEmailForm: true,
            emailClient: { profilePicture: profilePicture, email: email, fullName: fullName }
        });
    }

    const updateContacts = (newContactObject) => {
        console.log('updating contact');
        updateState({ tableContent: [newContactObject, ...state.tableContent] });
    }

    const swtichToCRM = () => {
        updateState({ selectedClientId: '' })
    }

    const findContact = (value, callback) => {
        console.log('launching search')
        searchForContact({ contactName: value, dataProcessor: callback })
    }

    const handleMenuClick = (id) => {
        // updateState({inMenu:false})
        // const value = event.target.id;
        console.log('cliked', id);
        gotoContact(id)
    }

    const tableContent = state.tableContent;

    console.log('tool state', state)

    return (
        state.selectedClientId ?

            <Contact clientId={state.selectedClientId} createEmail={createEmail} swtichToCRM={swtichToCRM} /> :

            <Box sx={{ overflowY: 'hidden', }}>
                {/* Fixed toolbar */}
                {!noToolbar && <Box sx={{}}>
                    {/* Row 1 */}
                    <Box sx={{ bgcolor: '#F5F5F5', pl: 3, pr: 1.5, py: 1.5, display: 'flex', alignItems: 'center' }}>
                        {/* Page Label */}
                        <Typography noWrap sx={{
                            display: 'flex', alignItems: 'center',
                            fontWeight: 700, fontSize: { xs: 13, md: 16 }
                        }}>
                            CRM/ADDRESS BOOK
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        <IconButton sx={{ bgcolor: '#1C1D220F' }}
                            onClick={openFilter}>
                            <FilterIcon sx={{ color: '#5D5D5D', fontSize: 20, }} />
                        </IconButton>

                        <IconButton sx={{ bgcolor: '#1C1D220F', mx: 2 }}>
                            <SettingIcon sx={{ color: '#5D5D5D', fontSize: 20, }} />
                        </IconButton>

                        {/* Add new contact button */}
                        <Button variant='contained' onClick={openAddClientForm} sx={{
                            px: 2, py: .5, mr: 2, fontSize: 13, borderRadius: '8px', fontWeight: 500
                        }}>
                            <AddIcon sx={{ fontSize: 18 }} /> Add Contact
                        </Button>

                    </Box>

                    {/* Row 2 */}
                    {Boolean(state.tableContent.length) && <Box sx={{ bgcolor: 'white', pl: 3, pr: 4, py: 1, display: 'flex', alignItems: 'center' }}>
                        {/* Contact label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 12, md: 13, xl: 15 } }}>
                            CONTACT
                        </Typography>

                        {/* Pagination */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* current page range and total page */}
                            <Typography sx={{ mx: { xs: 1, xl: 4 }, fontWeight: 600, fontSize: { xs: 12, md: 13, xl: 15 } }}>
                                {paginationLabel}
                            </Typography>
                            {/* Pagination controller */}
                            <Pagination variant="outlined" color="primary"
                                count={state.paginationCount} onChange={handlePaginate} />
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Select all button */}

                        {state.currentLayout === 'grid' && <Typography sx={{
                            border: '1px solid rgba(28, 29, 34, 0.1)', alignItems: 'center', px: 1, py: .5,
                            borderRadius: '12px',
                            display: 'flex', mr: { xs: 2, xl: 4 }, color: '#8D8D8D', fontSize: { xs: 12, md: 13, xl: 15 }
                        }}>
                            Select all
                            <Checkbox size='small' sx={{ ml: 1, p: 0, color: ' #CAC9C9', }}
                                onClick={handleSelectAll} checked={allChecked()} />
                        </Typography>}


                        {/* Search taxtbox */}
                        <SearchBox {...{
                            placeholder: 'Search by name', findValue: findContact, itemKey: 'fullName',
                            menuClick: handleMenuClick, valueKey: '_id', mr: 0, width: '300px'
                        }} />

                    </Box>}
                </Box>}

                <Box sx={{ maxHeight: '75vh', overflowY: state.currentLayout === 'list' ? 'hidden' : 'scroll', }}>
                    {state.tableContent.length ?

                        state.currentLayout === 'list' ? <ListLayout firstItem={state.firstItem} selectAll={handleSelectAll}
                            allSelected={allChecked} selected={state.selected} selectItem={handleCheckbox} createEmail={createEmail}
                            gotoContact={gotoContact}
                            lastItem={state.lastItem} tableContent={noToolbar ? state.tableContent?.slice(0, 5) : state.tableContent} maxHeight={noToolbar ? '300px' : 0} />
                            : <GridLayout firstItem={state.firstItem} allSelected={allChecked} selectAll={handleSelectAll}
                                selected={state.selected} selectItem={handleCheckbox} createEmail={createEmail} gotoContact={gotoContact}
                                lastItem={state.lastItem} tableContent={state.tableContent} />
                        :
                        <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, fontWeight: 700 }}>
                            No contacts
                        </Typography>}

                </Box>

                <Modal open={state.openAddClientForm} onClose={closeAddClientForm}>

                    <AddClient closeForm={closeAddClientForm} updateContacts={updateContacts} />

                </Modal>

                <Modal open={state.openSendEmailForm} onClose={closeSendEmailForm}>
                    <EmailClient email={[state.emailClient.email]} profilePicture={state.emailClient.profilePicture} fullName={state.emailClient.fullName} closeForm={closeSendEmailForm} />
                </Modal>

                <Modal open={state.showFilter} onClose={closeFilter}>
                    <Filter closeFilter={closeFilter} />
                </Modal>

            </Box>
    )
}

export default Crm;