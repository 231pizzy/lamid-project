'use client'

import { Box, Button, Pagination, Typography } from "@mui/material";
import { useMemo, useRef, useState } from "react";

import TextRenderer from "@/Components/Table/TextRenderer";
import checkboxSelection from "@/utils/checkboxSelection";
import Table from "@/Components/Table";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import { searchForContact } from "./helper";
import { SearchBox } from "@/Components/SearchBox";
import { useRouter } from 'next/navigation'
import StatusRenderer from "@/Components/Table/StatusRenderer";
import AvatarRenderer from "@/Components/Table/AvatarRenderer";
import AvatarGroupRenderer from "@/Components/Table/AvatarGroupRenderer";
import FollowupRenderer from "@/Components/Table/FollowupRenderer";
import RankingRenderer from "@/Components/Table/RankingRenderer";
import AttachmentRenderer from "@/Components/Table/AttachmentRenderer";
import MessagesRenderer from "@/Components/Table/MessagesRenderer";
import { EmailShapeSvg, FacebookShapeSvg } from "@/public/icons/icons";

export default function ProspectTable({ }) {
    const router = useRouter();

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [emailCount, setEmailCount] = useState(null);
    const [facebookCount, setFacebookCount] = useState(null);

    const ColoredHeader = ({ items, isFlex }) => {
        return <Box sx={{
            display: 'inline-flex', flexDirection: isFlex ? 'row' : 'column', alignItems: 'center',
            width: '100%', justifyContent: 'center'
        }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: items[0]?.color, textTransform: 'uppercase' }}>
                {items[0]?.label}
            </Typography>
            <Typography sx={{
                ml: isFlex ? .5 : 0, fontWeight: 600, fontSize: 11, display: 'flex',
                alignItems: 'center', color: 'black'
            }}>
                ( <Typography sx={{ fontSize: 11, fontWeight: 600, color: items[1]?.color }}>
                    {items[1]?.label}
                </Typography>
                <Typography sx={{ fontSize: 11, mx: .5 }}>
                    /
                </Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: items[2]?.color }}>
                    {items[2]?.label}
                </Typography>)
            </Typography>
        </Box >
    }

    const NarrowHeader = ({ value }) => {
        return <Box sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '100%',
            alignItems: 'center', mx: 'auto',
        }}>
            <Typography
                //key={index}
                sx={{
                    fontSize: 11, whiteSpace: 'pre-wrap', textAlign: 'center', fontWeight: 600,
                    textTransform: 'uppercase'
                }}>
                {value}
            </Typography>
        </Box>
    }

    const DefaultHeader = ({ value }) => {
        return <Typography
            sx={{
                fontSize: 11, fontWeight: 600, display: 'inline-flex', width: '100%', alignItems: 'center',
                justifyContent: 'center', textTransform: 'uppercase'
            }}>
            {value}
        </Typography>
    }


    const [columnDefs,] = useState([
        {
            field: 'id',
            headerName: null,
            maxWidth: 50,
            checkboxSelection: checkboxSelection,
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: headerCheckboxSelection,
        },
        {
            field: 'fullName',
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerComponent: (props) => <DefaultHeader value={'Name'} />,
            headerName: 'Name',
        },
        {
            field: 'company',
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerComponent: (props) => <DefaultHeader value={'Company'} />,
            headerName: 'Company',
        },
        {
            field: 'sector',
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerComponent: (props) => <DefaultHeader value={'Sector'} />,
            headerName: 'Sector',
        },
        {
            field: 'status',
            minWidth: 100,
            cellRenderer: StatusRenderer,
            headerComponent: (props) => <DefaultHeader value={'Status'} />,
            headerName: 'Status',
        },
        {
            field: 'supervisor',
            minWidth: 100,
            cellRenderer: AvatarGroupRenderer,
            headerComponent: (props) => <DefaultHeader value={'Supervisor'} />,
            headerName: 'Supervisor',
        },
        {
            field: 'handler',
            minWidth: 100,
            cellRenderer: AvatarGroupRenderer,
            headerComponent: (props) => <NarrowHeader value={'Handler & Other Rep'} />,
            headerName: 'Handler & Other Rep',
        },
        {
            field: 'followup',
            minWidth: 90,
            cellRenderer: FollowupRenderer,
            headerComponent: (props) => <ColoredHeader
                items={[
                    { label: 'Follow up', color: 'black' },
                    { label: 'Used', color: '#19D3FC' },
                    { label: 'Action', color: '#BF0606' }]}
                isFlex={false} />,
            headerName: 'Follow up',
        },
        {
            field: 'appetiteRanking',
            minWidth: 90,
            cellRenderer: RankingRenderer,
            headerComponent: (props) => <NarrowHeader value={'Appetite Ranking'} />,
            headerName: 'Appetite Ranking',
        },
        {
            field: 'attachment',
            minWidth: 150,
            cellRenderer: AttachmentRenderer,
            headerComponent: (props) => <ColoredHeader
                items={[
                    { label: 'Attachment', color: 'black' },
                    { label: 'Sent', color: '#257AFB' },
                    { label: 'Received', color: '#BF0606' }]}
                isFlex={false} />,
            headerName: 'Attachment',
        },
        {
            field: 'messages',
            minWidth: 150,
            cellRenderer: MessagesRenderer,
            headerComponent: (props) => <ColoredHeader
                items={[
                    { label: 'Messages & Note', color: 'black' },
                    { label: 'Sent', color: '#257AFB' },
                    { label: 'Received', color: '#BF0606' }]}
                isFlex={false} />,
            headerName: 'Messages & Note',
        },
    ]);

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

    const findContact = (value, callback) => {
        searchForContact({ contactName: value, dataProcessor: callback })
    }

    const gotoContact = (id) => {
        router.push(`/admin/contact?id=${id}`)
    }

    const handleMenuClick = (id) => {
        gotoContact(id)
    }

    const handlePaginate = (event, value) => {
        setCurrentPage(value - 1)
    }

    const setSummaryValues = ({ currentPage, totalRows, pageSize, totalPages }) => {
        setCurrentPage(currentPage);
        setTotalRows(totalRows);
        setPageSize(pageSize);
        setTotalPages(totalPages)
    }

    const gotoEmails = () => {
        router.push('/admin/crm/emails')
    }


    const paginationLabel = useMemo(() => {
        const x = (currentPage + 1) * pageSize;
        return `${!currentPage ? 1 : (currentPage * pageSize) + 1} - ${x > totalRows ? totalRows : (currentPage + 1) * pageSize} of ${totalRows}`
    }, [currentPage, totalRows])

    const iconStyle = { height: '14px', width: '14px', marginRight: '4px' }

    return <Box sx={{ height: '100%' }}>

        <Box sx={{
            bgcolor: 'white', pl: 3, pr: 4, py: 1, display: 'flex', alignItems: 'center',
            borderBottom: '1px solid #1C1D221A'
        }}>
            {/* Prospect label */}
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 12, md: 11, xl: 13 }, mr: 1 }}>
                PROSPECTS
            </Typography>

            {/* Pagination */}
            {Boolean(totalPages) && <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {/* Pagination label*/}
                <Typography sx={{ mx: { xs: 1, xl: 4 }, fontWeight: 600, fontSize: { xs: 12, md: 13, xl: 15 } }}>
                    {paginationLabel}
                </Typography>

                {/* Pagination controller */}
                <Pagination size="small" variant="outlined" color="primary" count={totalPages} onChange={handlePaginate} />
            </Box>}

            {/* Search taxtbox */}
            <SearchBox {...{
                placeholder: 'Search by name', findValue: findContact, itemKey: 'fullName',
                menuClick: handleMenuClick, valueKey: '_id', mr: 0, width: '300px'
            }} />

            <Box sx={{ flexGrow: 1 }} />

            {/* Email button */}
            <Button variant='contained' onClick={gotoEmails}
                sx={{
                    display: 'flex', alignItems: 'center', color: 'black', bgcolor: '#FFE7E7', px: 1, py: 1, mr: 2,
                    ":hover": { color: 'white' }
                }}>
                <EmailShapeSvg style={iconStyle} />

                <Typography sx={{ fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    EMAIL (<b style={{ color: '#257AFB' }}>{emailCount?.sent || 4}</b>/<b style={{ color: '#BF0606' }}>{emailCount?.received || 2}</b>)
                </Typography>
            </Button>

            {/* Email button */}
            <Button variant='contained'
                sx={{
                    display: 'flex', alignItems: 'center', color: 'black', bgcolor: '#FFE7E7', px: 1, py: 1,
                    ":hover": { color: 'white' }
                }}>
                <FacebookShapeSvg style={iconStyle} />

                <Typography sx={{ fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    FACEBOOK (<b style={{ color: '#257AFB' }}>{facebookCount?.sent || 6}</b>/<b style={{ color: '#BF0606' }}>{facebookCount?.received || 5}</b>)
                </Typography>
            </Button>

        </Box>

        <Box sx={{ height: 'calc(100vh - 185px)', width: '100%' }}>
            {Boolean(data) && <Table headingArray={columnDefs}
                setValueSummary={setSummaryValues} currentTab={'all'} tabKey={'status'}
                editUrl={''}
                floatingActions={[]}
                closeFilter={() => { }} showFilter={false}
                filterTemplate={{}} filterRows={{}}
                viewUrl={''}
                publishEndpoint={''}
                pageNumber={currentPage}
                onRowClicked={gotoContact}
                unpublishEndpoint={''}
                cancelEndpoint={''}
                valuesURL={`/api/get-contact?stage=prospect`}
                showTableAction={false}
                title={'Prospect'}
                deleteEndpoint={''}
                valuesArray={data} />}
        </Box>
    </Box>
}