'use client'

import {
    Box, Checkbox, FormControl, Grid, InputLabel, List, ListItemButton, MenuItem, OutlinedInput,
    Radio, RadioGroup, Select, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';

import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSubHeading, updateProjectGroupFilter, updateSubheadingData } from "@/Components/redux/newProjectGroup";

import { v4 as uuid } from 'uuid';
import { setPageTitle } from "@/Components/redux/routeSlice";
import { SubHeading } from "../SubHeading";
import Heading from "../Heading";
import { useRouter } from "next/navigation";

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


export default function FilterStep() {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const router = useRouter();

    // const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    const [state, setState] = useState({
        currentStep: null, color: '', purpose: '', name: '', ref: null,
        filters: Object.keys(savedFilters).length ? savedFilters : {
            skills: [], age: { operator: '', value: '' }, education: '',
            language: [], role: { operator: '', value: '', years: "" },
            experience: []
        },
        selectedFilter: 'filters', suggestions: ['sugges1', 'sugges3sugges3sugges3sugges3sugges3sugges3sugges3sugges3'],
        textInputValue: '', suggestionAnchor: useRef(), showSuggestions: false,
        firstValue: '', filterType: '', secondValue: '', lastValue: false, thirdValue: ""
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const isObjectFilled = (object) => {
        const emptyEntries = Object.values(object).filter(item => item?.length === 0)
        console.log('emptyEntries', emptyEntries)
        return !Boolean(emptyEntries?.length);
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


    useEffect(() => {
        /* Send subheading to the redux state for subheading*/
        /*   const subHeading = {
              currentStep: 2, info: 'Skill set Required', isFilterEmpty: !Boolean(filterWithData?.length),
              label: 'Add Skill set, educational background, field of expert and years of expience for this project group',
              requiredData: { projectName: state.name, purpose: state.purpose, color: state.color }
          };
          dispatch(setSubHeading({ ...subHeading })) */

        dispatch(setPageTitle({ pageTitle: 'Project Group' }))
        updateState({ ref: ref })

        //   prop.setSubHeading(subHeading)
    }, [])


    //Update the redux filter store whenever the filter state is modified 
    /* useMemo(() => {
         dispatch(updateSubheadingData({ isFilterEmpty: !Boolean(filterWithData?.length), }))  
        dispatch(updateProjectGroupFilter({ update: { ...state.filters } }))
    }, [state.filters]) */


    const getBoxTop = () => {
        if (state.ref?.current) {
            return state.ref.current.getBoundingClientRect().top;
        }
    }

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [state.selectedFilter])

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
        /*   updateState({
              filters: {
                  ...state.filters, experience: [...state.filters.experience, {
                      value: value ?? state.filters.experience?.value,
                      operator: operator ?? state.filters.experience?.operator,
                      years: years ?? state.filters.experience?.years,
                  }]
              }
          }) */
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

        // const result = suggestions[state.selectedFilter].filter((item) => pattern2.test(item))


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

    const suggestionElement = () => {
        console.log('suggestion clicked')
        return <List sx={{ width: '100%', border: '1px solid rgba(28, 29, 34, 0.1)' }}
            /*  open={state.showSuggestions}
             onClose={() => { updateState({ showSuggestions: false }) }} */
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
                <Close />
            </Box>

        </Box>
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

    const handleNext = () => {
        dispatch(updateProjectGroupFilter({ update: { ...state.filters } }))

        setTimeout(() => {
            router.push('/admin/project-group/new-project/tasks')
        }, 1000)
    }


    /*   useEffect(() => {
          prop.filterEmpty(!Boolean(filterWithData?.length))
      }, [filterWithData]) */

    console.log('non empty filters', filterWithData);

    console.log('state', state);

    return (
        <Box sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}>

            <Box sx={{ maxHeight: 'max-content' }}>
                {/* Heading */}
                <Heading />

                {/* Sub heading */}
                <SubHeading {...{
                    currentStep: 2,
                    infoUnderCurrentStep: 'Add Skill set, educational background, field of expert and years of expience for this project group',
                    infoBesideCurrentStep: '(Skill set Required)',
                    buttonVariant: !Boolean(filterWithData?.length) ? 'outlined' : 'contained',
                    buttonCaption: !Boolean(filterWithData?.length) ? 'Skip' : 'Next',
                    buttonFontSize: { xs: 12, md: 13 }, buttonFontWeight: 600,
                    buttonClickAction: handleNext, showBackButton: true
                }} />
            </Box>

            <Box ref={state.ref} sx={{
                maxHeight: `calc(100vh - ${getBoxTop()}px)`, height: '100%', overflowY: 'scroll',
                maxWidth: '100%', pl: 2
            }}>

                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={12} md={5} xl={5} sx={{ borderRight: { xs: '', md: '1px solid rgba(28, 29, 34, 0.1)' } }}>
                        {/* Form */}
                        <Box sx={{ mx: 'auto', p: 2 }}>
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
                    </Grid>

                    <Grid item xs={12} md={7} xl={7} sx={{}}>
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

                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
}
