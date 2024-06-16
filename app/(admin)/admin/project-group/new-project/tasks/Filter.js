'use client'

import {
    Box, Button, Checkbox, FormControl, InputLabel, List, ListItemButton, MenuItem,
    OutlinedInput, Radio, RadioGroup, Select, Typography,
} from "@mui/material";

import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectGroupFilter } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';

const filters = [
    { name: 'Filters', value: '', },
    { name: 'Skills', value: '', list: true, stateKey: 'skills', secondaryKey: 'level', filterType: 'twoStep' },
    { name: 'Language', value: '', list: true, stateKey: 'language', secondaryKey: 'level', filterType: 'twoStep' },
    { name: 'Education', value: '', list: true, stateKey: 'experience', secondaryKey: 'level', filterType: 'twoStep' },
    { name: 'Age', value: '', stateKey: 'age', filterType: 'compare' },
    { name: 'Role', value: '', stateKey: 'role', list: true, secondaryKey: 'duration', filterType: 'twoStep' },
    { name: 'Experience', value: '', stateKey: 'experience', list: true, secondaryKey: 'duration', filterType: 'twoStep' },
]

const examples = {
    'skills': 'Sage', 'language': 'Hausa', 'role': 'Manager', age: '30', education: 'Masters', experience: 'Auditor'
};

const suggestables = ['skills', 'language', 'role', 'education', 'experience'];

const textInputRequired = ['skills', 'language', 'role', 'age', 'education', 'experience'];

const proficiency = ['basic', 'intermediate', 'expert'];

const requiresProficiency = ['skills', 'language']

const requiresComparison = ['age', 'role', 'experience'];

const singleFilters = ['education'];

const twoStepFilters = ['skills', 'language', 'age',];
const threeStepFilters = ['role', 'experience'];

const comparison = ['Equals', 'Above', 'Below']

const acceptsMultipleValues = ['skills', 'language'];
const acceptSingleObject = ['age', 'role']
const acceptsMultipleObjects = ['experience']


const suggestions = {
    skills: ['Figma', 'Falling', 'Football', 'Frisby', 'Finishing', 'Facebook', 'Photoshop', 'Microsoft office', 'hacking'],
    language: ['English', 'French', 'Yoruba'],
    role: ['Human Resource manager', 'Designer', 'Auditor', 'Secretary'],
    education: ['Basic', 'Secondary School', 'Degree', 'Diploma', 'Masters', 'PHD'],
    experience: ['Human Resource manager', 'Designer', 'Auditor', 'Secretary']
}


function Filter(prop) {
    //props are closeFilter(), filter

    const dispatch = useDispatch();

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    useEffect(() => {
        console.log("already saved form data is ", savedFormData);
        console.log("already saved filter is", savedFilters);
    }, [savedFilters, savedFormData])


    const [state, setState] = useState({
        currentStep: null, color: '', purpose: '', name: '',
        filters: { ...savedFilters },
        selectedFilter: 'filters', suggestions: ['sugges1', 'sugges3sugges3sugges3sugges3sugges3sugges3sugges3sugges3'],
        textInputValue: '', suggestionAnchor: useRef(), showSuggestions: false,
        firstValue: '', filterType: '', secondValue: '', lastValue: false, thirdValue: ""
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const selectFilter = (event) => {
        updateState({
            selectedFilter: event.target.value,
            firstValue: '', secondValue: '',
            textInputValue: ''
        })
    }

    const addSingleFilter = () => {
        updateState({ filters: { ...state.filters, [state.selectedFilter]: state.firstValue } })
    }

    const addListFilter = (value) => {
        if (!state.filters[state.selectedFilter].filter(item => item.value === state.firstValue).length) {
            console.log('item does not exist in the array so we create a new one')
            updateState({
                filters: {
                    ...state.filters,
                    [state.selectedFilter]: [...state.filters[state.selectedFilter], value]
                }
            })
        }
        else {
            console.log('item already exists in the array so we ovewrite the existing one')
            const index = state.filters[state.selectedFilter].findIndex(item => item.value === state.firstValue)
            const stateValueOf = [...state.filters[state.selectedFilter]];
            stateValueOf[index] = value;

            updateState({
                filters: {
                    ...state.filters,
                    [state.selectedFilter]: stateValueOf
                }
            })
        }
    }

    const addTwoStepFilter = (secondValue) => {
        addListFilter({ value: state.firstValue, level: secondValue ?? state.secondValue })
    }


    const buildSelectMenu = (itemList, value, onChangeHandle, stateKey, checkbox) => {
        //const value=()=>filter?state.filters:secondaryKey?state.filters[stateKey][secondaryKey]:state.filters[stateKey];
        //specify value,onchange handler
        return <Box sx={{
            display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <FormControl
                size='small'
                variant='outlined'
                sx={{ width: 'max-content', pr: 2, mb: 2 }}>
                <InputLabel  >   </InputLabel>
                <Select sx={{
                    fontSize: { xs: 12, md: 13 },
                    fontWeight: 500, border: '2px solid rgba(28, 29, 34, 0.1)',

                    color: '#333333',
                }}
                    value={value}
                    //onChange={ (event)=>{addFilter(stateKey,item.name.toLowerCase())}}
                    onChange={onChangeHandle}
                    size='small' >
                    {itemList.map((item, indx) =>
                        <MenuItem key={indx}
                            value={item.name.toLowerCase()}
                            sx={{
                                fontSize: { xs: 12, md: 16 }, bgcolor: item.color,
                                fontWeight: 500, color: '#333333',
                            }}>
                            {checkbox && <Checkbox checked={Boolean(state.filters[stateKey] === item.name.toLowerCase())} />}
                            <Typography sx={{
                                fontSize: { xs: 12, md: 13 }, fontWeight: 600,
                            }}>
                                {item.name}
                            </Typography>

                        </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    }

    const handleTextInput = (event) => {
        const id = event.currentTarget.id;
        const value = event.currentTarget.value;
        const showSuggestions = id === 'years' ? false : true;
        // const firstValue = id === 'years' ?  state.firstValue: (suggestables.includes(state.selectedFilter)) ? '' : state.firstValue
        console.log('text inputted', value, id, showSuggestions);

        updateState({
            textInputValue: id === 'years' ? state.firstValue : value, showSuggestions: showSuggestions,
            firstValue: (suggestables.includes(state.selectedFilter) && id !== 'years') ? '' : state.firstValue,
            secondValue: requiresProficiency.includes(state.selectedFilter) ? '' : state.secondValue,
            thirdValue: (id === 'years') ? value : state.thirdValue
        })
        if (state.selectedFilter === 'age') {
            setAge(value);
        }
        else if (state.selectedFilter === 'role' || state.selectedFilter === 'experience') {
            const years = id === 'years' ? value : null;

            state.selectedFilter === 'role' ? setRole({ value: null, operator: null, years: years })
                : setExperience({ value: null, operator: null, years: years })
        }


    }

    const handleFilter = (secondValue) => {
        //  console.log('value', value)
        if (singleFilters.includes(state.selectedFilter)) {
            addSingleFilter(state.firstValue);
        }
        else if (twoStepFilters.includes(state.selectedFilter)) {
            addTwoStepFilter(secondValue)
        }
    }

    const closeSuggestionSheet = (event) => {
        updateState({ showSuggestions: false })
    }

    const textInputOnBlur = (event) => {
        if (state.firstValue) {
            closeSuggestionSheet(event);
        }
    }

    const suggestionClick = (value) => {
        console.log('suggestion value', value)
        updateState({ firstValue: value, showSuggestions: false, textInputValue: value });

        if (state.selectedFilter === 'role') {
            setRole({ years: null, operator: null, value: value })
        }
        else if (state.selectedFilter === 'education') {
            setEducation({ value: value })
        }
        if (state.selectedFilter === 'experience') {
            setExperience({ years: null, operator: null, value: value })
        }
    }

    const setAge = (value, operator) => {
        console.log('setting age')
        updateState({
            filters: {
                ...state.filters,
                age: { value: value, operator: operator ?? state.firstValue }
            }
        })
    }

    const setRole = ({ value, operator, years }) => {
        console.log('setting role', operator, value, years);
        updateState({
            filters: {
                ...state.filters, role: {
                    value: value ?? state.filters.role.value,
                    operator: operator ?? state.filters.role.operator,
                    years: years ?? state.filters.role.years,
                }
            }
        })
    }

    const setExperience = ({ value, operator, years }) => {
        console.log('setting experience', operator, value, years);
        addListFilter({
            value: value ?? state.firstValue ?? '',
            operator: operator ?? state.secondValue ?? '',
            years: years ?? state.thirdValue ?? ''
        })
    }

    const setEducation = ({ value }) => {
        updateState({ filters: { ...state.filters, education: value } });
    }

    const setOperator = (operator, isLastValue) => {
        if (state.selectedFilter === 'age') {
            console.log('operator for age', operator)
            updateState({ firstValue: operator, lastValue: isLastValue });
            setAge(state.textInputValue, operator)
        }
        else {
            // addTwoStepFilter(operator);
            console.log('Operator for', state.selectedFilter, operator)
            updateState({ secondValue: operator, lastValue: isLastValue })
        }

        if (state.selectedFilter === 'role') {
            setRole({ value: null, years: null, operator: operator })
        }
        else if (state.selectedFilter === 'experience') {
            setExperience({ value: null, years: null, operator: operator })
        }

        if (isLastValue) {
            console.log('is last value')
            handleFilter(operator)
        }
        /*  const value = state.selectedFilter === 'age' ? { firstValue: operator } : { secondValue: operator }
         updateState(value) */
    }

    const findSuggestions = () => {

        const pattern = RegExp(`^\\S*\\b${state.textInputValue}\\w*\\b\\S*$`, 'i')

        const result = state.textInputValue ?
            suggestions[state.selectedFilter].filter((item) => item.match(pattern))
            : []

        console.log('result', result)
        return result.sort((a, b) => a.localeCompare(b))?.slice(0, 4)
    }

    /* UI elements */
    const comparisonElement = (list, onclickHandler, checkedValue, isLastValue) => {
        console.log('checked value', checkedValue);

        return <RadioGroup >
            {list.map(item =>
                <Typography
                    onClick={() => { onclickHandler(item.toLowerCase(), isLastValue) }}
                    sx={{ display: 'flex', alignItems: 'center' }}>
                    <Radio value={item.toLowerCase()}
                        checked={checkedValue === item.toLowerCase()} />
                    {item}
                </Typography>
            )}
        </RadioGroup>
    }

    const textInputElement = (ref, disabled, value, placeholder, width, id, type) => {
        return <OutlinedInput
            ref={ref}
            disabled={disabled}
            value={value}
            id={id}
            type={type}
            name={nameValue}
            onBlur={textInputOnBlur}
            onEmptied={closeSuggestionSheet}
            sx={{
                minHeight: 0, height: 40, maxWidth: '100%',
                minWidth: 0, width: width
            }}
            onChange={handleTextInput}
            placeholder={placeholder} />
    }

    //Update the redux filter store whenever the filter state is modified 
    useEffect(() => {
        dispatch(updateProjectGroupFilter({ update: { ...state.filters } }))
    }, [state.filters])


    const suggestionElement = () => {
        console.log('suggestion clicked')
        return <List sx={{ width: '100%', border: '1px solid rgba(28, 29, 34, 0.1)' }}
            anchorEl={state.suggestionAnchor.current}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
            <ListItemButton
                sx={{ borderBottom: '1px solid rgba(28, 29, 34, 0.1)' }}
                onClick={(event) => { suggestionClick(state.textInputValue) }}>
                <Typography sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-word' }}>
                    {state.textInputValue}
                </Typography>
            </ListItemButton>
            {findSuggestions()?.map(item =>
                <ListItemButton
                    sx={{ borderBottom: '1px solid rgba(28, 29, 34, 0.1)' }}
                    onClick={(event) => { suggestionClick(item) }}>
                    <Typography sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-word' }}>
                        {item}
                    </Typography>
                </ListItemButton>
            )
            }
        </List>
    }

    const closeFilter = (event) => {
        console.log('closing filter')
        prop.closeFilter();
    }

    const resetFilter = (event) => {
        console.log('reseting filter')
        updateState({
            filters: {
                skills: [], age: { operator: '', value: '' }, education: '',
                language: [], role: { operator: '', value: '', years: "" },
                experience: []
            },
            selectedFilter: 'filters'
        })
    }

    const applyFilter = (event) => {
        console.log('applying filters')
        prop.closeFilter();
    }

    const filterElements = (item, key) => {
        console.log('rendering filter values', key, item)
        return <Box sx={{
            mx: 3, mt: 2,
            borderRadius: '10px',
            display: 'flex', bgcolor: 'rgba(28, 29, 34, 0.04)',
            alignItems: 'center', border: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            <Box sx={{ p: 1, borderRight: '1px solid rgba(28, 29, 34, 0.1)' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'center', }}>
                    {singleFilters.includes(key) ? item : item?.value} {key === 'age' ? 'years' : ''}
                </Typography>

                <Typography sx={{ display: 'flex', justifyContent: 'center', color: '#BF0606', }}>
                    {requiresProficiency.includes(key) && `(${item?.level})`}
                    {key === 'age' && item?.operator !== 'equals' && `(${item?.operator})`}
                    {(key === 'role' || key === 'experience') &&
                        `(${item?.operator === 'equals' ? '' : item?.operator} ${item?.years} years)`}
                </Typography>
            </Box>

            <Box onClick={() => {
                key === 'education' ? removeFilter({ key: key, value: item }) :
                    removeFilter({ key: key, value: item?.value })
            }}
                sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Close sx={{ cursor: 'pointer', }} />
            </Box>

        </Box>
    }

    const isObjectFilled = (object) => {
        const emptyEntries = Object.values(object).filter(item => item?.length === 0)
        console.log('emptyEntries', emptyEntries)
        return !Boolean(emptyEntries?.length);
    }

    const removeFilter = ({ key, value }) => {
        console.log('remove filter from the filters');
        if (acceptSingleObject.includes(key)) {
            console.log('object filter')
            const object = { ...state.filters.age }
            const targetKeys = Object.keys(state.filters.age);
            for (let item of targetKeys) {
                console.log('item', item)
                object[item] = '';
            }
            updateState({ filters: { ...state.filters, [key]: object }, selectedFilter: 'filters' })
        }
        else if (acceptsMultipleValues.includes(key) || acceptsMultipleObjects.includes(key)) {
            console.log('array filter');
            updateState({
                filters: {
                    ...state.filters,
                    [key]: state.filters[key].filter(item => item.value !== value)
                },
                selectedFilter: 'filters'
            })
        }
        else if (singleFilters.includes(key)) {
            console.log('removing single filter');
            updateState({
                filters: { ...state.filters, [key]: '' },
                selectedFilter: 'filters'
            })
        }
    }

    const filterWithData = useMemo(() => {
        console.log('filterWithData called');
        const array = Object.keys(state.filters).map(key => {
            if (acceptSingleObject.includes(key)) {
                return isObjectFilled(state.filters[key]) ? key : ''
            }
            else if (acceptsMultipleValues.includes(key)) {
                return state.filters[key].length ? key : ''
            }
            else if (singleFilters.includes(key)) {
                return state.filters[key] ? key : ''
            }
            else if (acceptsMultipleObjects.includes(key)) {
                return state.filters[key].filter(item => isObjectFilled(item)).length ? key : ''
            }

            console.log('filterWithData', filterWithData);
        })

        return array.filter(item => item.length > 0)
    }, [state.filters])

    console.log('non empty filters', filterWithData);

    console.log('state', state);

    return (
        <Box sx={{
            height: '80%', transform: 'translate(-50%,-50%)', bgcolor: 'white',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '90%', sm: '60%', md: '50%', lg: '35%', xl: '32%' },
        }}>
            {/* Heading */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1,
                display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 2, px: { xs: 1.5, sm: 4 }
            }}>
                {/* Heading label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                    FILTER STAFF
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Reset button */}
                <Button variant='outlined' sx={{
                    color: '#5D5D5D', border: '1px solid #5D5D5D', borderRadius: '16px',
                    bgcolor: 'rgba(28, 29, 34, 0.1)', mr: { xs: 1, md: 3 }, p: { xs: .5, sm: 1.5 }
                }} onClick={resetFilter}>
                    Reset
                </Button>

                {/* Apply button */}
                <Button variant='outlined' onClick={applyFilter}
                    sx={{ borderRadius: '16px', mr: { xs: 1, md: 4 }, p: { xs: .5, sm: 1.5 } }}>
                    Apply
                </Button>

                {/* Close filter icon */}
                <Close onClick={closeFilter} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 24 }} />
            </Box>

            {/* Content */}
            <Box sx={{ mt: '80px', maxHeight: '80%', overflowY: 'scroll' }}>
                {/* Form */}
                <Box sx={{ mx: 'auto', pl: { xs: 1.5, sm: 4 }, pr: { xs: 1.5, sm: 4, lg: 0 }, py: 2 }}>
                    <Typography sx={{ pb: 1, display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-start', xl: 'flex-start' } }}>
                        Filter by
                    </Typography>

                    <Box sx={{
                        display: 'flex', alignItems: 'flex-start',
                        justifyContent: { xs: 'space-between', xl: 'flex-start' }, flexWrap: 'wrap'
                    }}>
                        {/* 'Filter by' selction list  */}
                        {buildSelectMenu(filters, state.selectedFilter, selectFilter, null, false)}
                        {/* Comparison for age*/}
                        {state.selectedFilter === 'age' &&
                            <Box sx={{ pr: 2, mb: 2 }}>
                                {comparisonElement(comparison, setOperator, state.firstValue, false)}
                            </Box>
                        }

                        {/* Filter value text */}
                        <Box sx={{
                            mb: 2,
                            width: state.selectedFilter === 'age' ? 100 : { xs: '250px', xl: '330px' }
                        }}>
                            {/* Text field for only filters that need text input*/}
                            {(textInputRequired.includes(state.selectedFilter)) &&
                                textInputElement(state.suggestionAnchor,
                                    state.selectedFilter !== 'age' ? false : !Boolean(state.firstValue),
                                    state.textInputValue,
                                    `Eg. ${examples[state.selectedFilter]}`, 'auto', 'text', 'text')
                            }

                            {/* Suggestion list for only filters that can be suggested*/}
                            {state.showSuggestions && state.textInputValue && state.selectedFilter !== 'age' &&
                                suggestionElement()}
                        </Box>
                    </Box>

                    {/* Request Other related data such as level of proficiency*/}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/* Proficiency */}
                        {requiresProficiency.includes(state.selectedFilter) && state.firstValue &&
                            <Box>
                                <Typography>
                                    Proficiency
                                </Typography>
                                {comparisonElement(proficiency, setOperator, state.secondValue, true)}
                            </Box>}

                        {/* Comparison for years of experience*/}
                        {(state.selectedFilter === 'role' || state.selectedFilter === 'experience')
                            && state.firstValue &&
                            <Box sx={{ pr: 2, mb: 2 }}>
                                <Typography  >
                                    Years of experience
                                </Typography>
                                {comparisonElement(comparison, setOperator, state.secondValue, false)}
                            </Box>}

                        {state.selectedFilter === 'role'
                            && state.firstValue &&
                            textInputElement(null, !Boolean(state.firstValue), state.filters.role.years,
                                `Eg. 5`, 100, 'years', 'text')
                        }
                        {state.selectedFilter === 'experience'
                            && state.firstValue &&
                            textInputElement(null, !Boolean(state.firstValue), state.thirdValue,
                                `Eg. 5`, 100, 'years', 'text')
                        }
                    </Box>

                </Box>

                {/* Label: filter selection */}
                {filterWithData.length ? <Typography sx={{
                    px: { xs: 1, sm: 3 }, py: 1.5, mb: 1, fontWeight: 600,
                    bgcolor: 'rgba(191, 6, 6, 0.06)', color: '#BF0606'
                }}>
                    Filter Selection
                </Typography> : null}



                {Object.keys(state.filters).map(filterKey => {
                    return filterWithData.includes(filterKey) && <Box sx={{ mb: 2 }}>
                        <Typography sx={{
                            display: 'flex', alignItems: 'center',
                            bgcolor: 'rgba(28, 29, 34, 0.04)',
                            justifyContent: 'flex-start', px: 3, py: 1
                        }}>
                            {filterKey.toUpperCase()}
                        </Typography>
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            bgcolor: 'white', flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                        }}>
                            {(acceptsMultipleValues.includes(filterKey) || acceptsMultipleObjects.includes(filterKey)) &&
                                state.filters[filterKey].map(item => filterElements(item, filterKey)
                                )}

                            {isObjectFilled(state.filters[filterKey]) && acceptSingleObject.includes(filterKey) &&
                                filterElements(state.filters[filterKey], filterKey)}

                            {singleFilters.includes(filterKey) && filterElements(state.filters[filterKey], filterKey)}
                        </Box>
                    </Box>
                }
                )}
            </Box>


        </Box>)
}

export default Filter;