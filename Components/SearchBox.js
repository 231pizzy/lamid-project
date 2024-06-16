'use client'

import { Box, InputAdornment, OutlinedInput, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/SearchOutlined';
import { v4 as uuid } from 'uuid';
import { useMemo, useState, useRef } from "react";

export function SearchBox({ findValue, menuClick, valueKey, placeholder, itemKey, mr, width }) {
    const [state, setState] = useState({
        searchResult: [], searchValue: '', searchAnchor: useRef(null)
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }
    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, []);


    const setSearchValue = (event) => {
        const value = event.currentTarget.value;
        if (value) {
            updateState({ searchValue: value });
            //   findContact(value);
            findValue(value, (valueArr) => { updateState({ searchResult: [...valueArr] }) })
        }
        else
            updateState({ searchResult: [], searchValue: '' })
    }


    const handleMenuClick = (id) => {
        // updateState({inMenu:false})
        // const value = event.target.id;
        console.log('cliked', id);
        menuClick(id)
    }

    const setSearchResult = (valueArr) => {
        console.log('updating search list')
        return valueArr.map(item =>
            <Typography id={valueKey} onClick={(event) => { handleMenuClick(item[valueKey]) }}
                sx={{
                    px: 1, py: .5, mb: 2, border: '1px solid black', borderRadius: '8px', fontSize: 13,
                    wordBreak: 'break-all', display: 'flex', flexWrap: 'wrap', cursor: 'pointer'
                }}
            >
                {item[itemKey]}
            </Typography>
        )
    }

    const closeSearchMenu = () => {
        updateState({ searchResult: [] })
    };

    const handleSearchBoxBlur = () => {
        setTimeout(() => {
            closeSearchMenu();
        }, 400)
    }


    return <Box sx={{ position: 'relative', width: width ?? { xs: '120px', xl: '200px' }, }}
        onBlur={handleSearchBoxBlur} >
        <OutlinedInput
            ref={state.searchAnchor}
            onChange={setSearchValue}
            placeholder={placeholder}
            name={nameValue}
            startAdornment={<InputAdornment>
                <SearchIcon sx={{ color: '#8D8D8D', fontSize: 20, mr: 1 }} />
            </InputAdornment>}
            type='text' value={state.searchValue}
            sx={{
                height: '40px', mr: mr ?? { xs: 2, md: 3 }, position: 'relative',
                color: '#8D8D8D', width: '100%',
                borderRadius: '16px', bgcolor: '#FBFBFB', fontSize: 14
            }} />

        {Boolean(state.searchResult.length) &&
            <Box sx={{
                bgcolor: "white", left: 0, maxHeight: '200px', overflowY: 'auto', px: 1, py: 1,
                right: 0, zIndex: 11, position: 'absolute', overflowX: 'hidden'
            }}>
                {setSearchResult(state.searchResult)}
            </Box>}
    </Box>
}