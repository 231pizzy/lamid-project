import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import style from './styles.module.css'

import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    useEffect,
} from 'react';

import moment from 'moment';

import CMSFloatingActionBar from '../CMSFloatingActionBar';
import Filter from '../Filter';
import { Button, Typography } from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';



const Table = ({ headingArray, valuesArray, valuesURL, viewUrl, noPagination, filterTemplate, filterRows, showTableAction,
    editUrl, title, setValueSummary, currentTab, tabKey = 'status', showFilter, closeFilter, filterisGrouped, perPage,
    customHeader, selectRows, currentlySelectedRows, floatingActions, hasGroupedHeading, deleteEndpoint,
    notifyUrl, replyUrl, markAsReadEndpoint, markAsUnreadEndpoint, publishEndpoint, unpublishEndpoint,
    exportColumnArray, exportHeading, exportHeadingsArray, exportCellRenderer, exportCellWidths, searchEndPoint,
    dataEndpoint, downloadHeadingArray, downloadCellRenderer, downloadCellWidths, cancelEndpoint,
    downloadColumnIds, zipExportColumnArray, zipExportTitle, zipExportFormat, onRowClicked = () => { },
    zipExportEndpoint, zipExportSections, pageNumber }) => {


    const containerStyle = useMemo(() => ({ width: '100%', height: '100%', position: 'relative', }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [columnDefs, setColumnDefs] = useState([]);
    const [selectItemsRows, setSelectedRows] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(perPage ?? 10)

    const [selectedFilters, setSelectedFilters] = useState(null);

    const [filterBarData, setFilterBarData] = useState([]);

    const [read, setRead] = useState(false);
    const [replied, setReplied] = useState(false);
    const [published, setPublished] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [defaultEmail, setDefaultEmail] = useState(false);


    const [includesJustConcluded, setIncludesJustConcluded] = useState(false);
    const [includesConcluded, setIncludesConcluded] = useState(false);


    const [draftId, setDraftId] = useState(null)

    const gridRef = useRef();

    useEffect(() => {
        if (headingArray) setColumnDefs(headingArray)

        setItemsPerPage(perPage ?? Math.ceil(window.innerHeight / 50))
    }, []);

    useEffect(() => {
        gridRef.current?.api?.paginationGoToPage(pageNumber)
    }, [pageNumber])

    const defaultColDef = useMemo(() => {
        return {
            editable: false,
            sortable: true,
            domLayout: 'autoHeight',
            menuTabs: [],
            resizable: true,
            cellStyle: { fontSize: '12px', fontWeight: '600' },
            flex: 1,
            headerCellClass: 'header-cell',
            minWidth: 80,
        };
    }, []);

    const getNewRowData = (currentTab, rowData) => {
        return rowData.filter(item => currentTab === 'all' ? true : Array.isArray(item[tabKey]) ? item[tabKey].includes(currentTab) : (item[tabKey]?.toString() === currentTab?.toString()))
    }

    const processRows = (rowData, currentTab) => {
        if (rowData?.length) {
            const api = gridRef.current?.api;

            /*  getNewRowData(currentTab, rowData)?.forEach(item => {
                
             }); */

            setValueSummary({
                totalRows: getNewRowData(currentTab, rowData)?.length,
                currentPage: api?.paginationGetCurrentPage(),
                pageSize: api?.paginationGetPageSize(),
                totalPages: api?.paginationGetTotalPages()
            })
        }
    }

    useEffect(() => {
        processRows(rowData, currentTab)
    }, [rowData])


    const onGridReady = useCallback((params) => {
        if (valuesURL) {
            params.api.showLoadingOverlay();
            fetch(`${valuesURL}`, { method: 'GET', cache: 'no-store' })
                .then((resp) => resp.json())
                .then((data) => {
                    data?.errorRedirect && window.location.replace('/login')
                    data = data?.result;

                    setRowData(data);
                });
        }
        else if (valuesArray) {
            setRowData(valuesArray)
        }

    }, [currentTab]);

    const handleCancelSelection = () => {
        setSelectedRows([]);
        gridRef.current?.api?.deselectAll();
    }

    const handleRowSelection = useCallback((event) => {
        const api = event.api;
        const selectedRows = api.getSelectedNodes();
        const x = selectedRows.map(item => item.data.id);
        const status = selectedRows[0]?.data?.status;

        if (title === 'Schedule' && x?.length === 1) {
            setPublished(status === 'published' || status === 'concluded' || status === 'justConcluded' || status === 'now')
            setCancelled(status === 'cancelled')
        }
        if (title === 'Resource' && x?.length === 1) {
            setPublished(status === 'published')
        }
        if (title === 'Enquiry' && x?.length === 1) {
            setRead(status === 'read')
            setReplied(status === 'replied')
        }
        if (title === 'Contact Enquiry Email' && x?.length === 1) {
            setDefaultEmail(status === 'default')
        }

        if (title === 'Schedule') {
            setIncludesConcluded(Boolean(selectedRows?.find(i => i?.data?.status === 'concluded')))
            setIncludesJustConcluded(Boolean(selectedRows?.find(i => i?.data?.status === 'justConcluded')))
        }

        setSelectedRows(x)
    }, [])

    const buildDurationLabel = (value) => {
        return `${value?.hours ? (value?.hours + 'hours') : ''} ${value?.minutes ? (value?.minutes + ' minutes') : ''}`
    }

    const updateFilterBarData = (filters) => {

        const data = []

        filters && Object.keys(filters).forEach(key => {
            const record = filters[key]
            const labelRecord = filterRows?.find(i => i?.value === key);

            key !== 'id' && JSON.parse(record?.filter)?.forEach(i => {
                const label = labelRecord?.valueSet ? labelRecord?.valueSet?.find(it => it?.value === i)?.label : i;

                data.push({
                    column: key,
                    value: i,
                    label: Number(label?.minutes) >= 0 ? buildDurationLabel(label) : label
                })
            })
        })

        setFilterBarData(data);
    }

    const applyFilter = ({ filters }) => {
        if (gridRef?.current.api) {
            // Get a reference to the filter instance
            let gridApi = gridRef?.current.api;

            gridApi?.setFilterModel(filters)

            // Tell grid to run filter operation again
            gridApi.onFilterChanged();

            setSelectedFilters(filters)

            updateFilterBarData(filters)
        }
    }

    const handleFilterReset = () => {
        applyFilter({ filters: null })
    }

    const removeSelectedFilter = (columnId, value) => {
        if (gridRef?.current.api) {
            //Make a copy of the currently selected filters
            let copy = { ...(selectedFilters ?? {}) };

            //Get the column filter
            let columnFilter = JSON.parse(selectedFilters[columnId]?.filter);

            //Remove the value from the array of values the column filter has
            columnFilter = columnFilter.filter(i => i?.toString() !== value?.toString())

            //If the columnFIlter is empty, delete the key from the copy
            if (!columnFilter?.length) {
                delete copy[columnId]
                //If the copy is now empty after the delete, set copy to null to reset the filter
                if (!Object.keys(copy)?.length) {
                    copy = null;
                    return handleFilterReset(); //Reset the filter since there is nothing left to filter
                }
            }
            else {
                //Put back the filter that has been changed if it is not empty
                copy[columnId] = { ...copy[columnId], filter: columnFilter?.length ? JSON.stringify(columnFilter) : null }
            }

            applyFilter({ filters: copy })
        }
    }

    const currentRowData = useMemo(() => {
        if (rowData) {
            setSelectedRows([])
            return rowData.filter(item => currentTab === 'all'
                ? true
                : Array.isArray(item[tabKey])
                    ? item[tabKey].includes(currentTab)
                    : (item[tabKey]?.toString() === currentTab?.toString()))
        }
        else {
            return []
        }
    }, [currentTab, rowData, tabKey])

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', }}>
            {filterBarData?.length > 0 && <div style={{
                display: 'flex', alignItems: 'center',
                background: '#F5F9FF', padding: '4px 12px',
            }}>
                <Typography style={{ fontSize: '13px', mr: 1.5, minWidth: 'max-content' }}>
                    Showing the result of the following :
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    {filterBarData?.map((item, index) => {
                        return <Typography key={index} style={{
                            display: 'flex', alignItems: 'center', maxWidth: 'max-content', fontSize: '12px',
                            minWidth: 'max-content', padding: '2px 8px', marginRight: '12px', color: '#0E60BF',
                            fontWeight: 400, background: '#F5F9FF', borderRadius: '12px', border: '1px solid #1414171A',
                            textTransform: 'capitalize'
                        }}>
                            {item?.label} <Cancel sx={{
                                cursor: 'pointer', ml: .5, fontSize: 14, color: 'black'
                            }} onClick={() => { removeSelectedFilter(item?.column, item?.value) }} />
                        </Typography>
                    })}
                </div>

                <Button sx={{
                    fontSize: '13px', mr: 1, color: '#0E60BF', textDecoration: 'underline',
                    minWidth: 'max-content', minWidth: 'max-content', fontWeight: 600,
                    ml: 'auto', py: .3
                }} onClick={handleFilterReset}>
                    Reset
                </Button>

            </div>
            }
            <div style={containerStyle}>
                <div style={gridStyle} className={`ag-theme-alpine ${style['ag-header']}`}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={currentRowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        overlayLoadingTemplate={`<img class='ag-grid-loader-image-gif'  style='height:20vh;width:20vh;' src='/images/loading.png'/>`}
                        suppressRowClickSelection={true}
                        paginationPageSizeSelector={false}
                        unSortIcon={true}
                        onRowClicked={(e) => { console.log('node', e.node.data); onRowClicked(/* e.node.data?.id || */ e.node.data?._id) }}
                        groupSelectsChildren={true}
                        rowSelection={'multiple'}
                        suppressPaginationPanel={true}
                        onRowSelected={handleRowSelection}
                        paginationPageSize={itemsPerPage ?? 10}

                        onFilterChanged={(props) => {
                            const nodes = [];
                            props.api.forEachNodeAfterFilter(item => nodes.push(item.data))
                            processRows(nodes, currentTab)
                        }}
                        pivotPanelShow={'always'}
                        pagination={true}
                        onGridReady={onGridReady}
                    />
                </div>

                {showTableAction && selectItemsRows.length > 0 && <CMSFloatingActionBar selectItemsRows={selectItemsRows}
                    title={title} handleCancelSelection={handleCancelSelection}
                    floatingActions={floatingActions} includesConcluded={includesConcluded}
                    includesJustConcluded={includesJustConcluded}
                    viewUrl={viewUrl} read={read} replied={replied} replyUrl={replyUrl}
                    markAsReadEndpoint={markAsReadEndpoint} cancelled={cancelled} cancelEndpoint={cancelEndpoint}
                    markAsUnreadEndpoint={markAsUnreadEndpoint} published={published} defaultEmail={defaultEmail}
                    publishEndpoint={publishEndpoint} unpublishEndpoint={unpublishEndpoint}
                    editUrl={editUrl} deleteEndpoint={deleteEndpoint} draft={draftId}
                />}

                {rowData?.length && <Filter closeFilter={closeFilter} filterTemplate={filterTemplate}
                    filterSubmit={applyFilter} filterRows={filterRows} dataset={rowData}
                    setSelectedFilters={setSelectedFilters} isEmpty={filterBarData?.length === 0}
                    showFilter={showFilter} isGrouped={filterisGrouped} searchEndPoint={searchEndPoint}
                />}

            </div>
        </div>

    );
};


export default Table