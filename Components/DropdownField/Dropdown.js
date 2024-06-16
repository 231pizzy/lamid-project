import { ArrowDropDown, ArrowDropUp, } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { dropdownStyle } from "./style";

export default function Dropdown({ items, placeholder, selectedItem, handleChange }) {

    const [showOptions, setShowOptions] = useState(false)

    const openMenu = () => {
        setShowOptions(true)
    }

    useEffect(() => {
        const payload = (e) => {
            if (!document.getElementById('dropdown-in-cms').contains(e.target)) {
                setShowOptions(false)
            }
        }

        showOptions && document.addEventListener('click', payload)

        return () => {
            document.removeEventListener('click', payload)
        }
    }, [showOptions])



    return <Box id='dropdown-in-cms' sx={dropdownStyle.container}>
        {/* Heading */}
        <Box sx={{ ...dropdownStyle.headingContainer, bgcolor: selectedItem ? 'white' : '#F4F4F4', }}
            onClick={openMenu}>
            <Typography sx={dropdownStyle.headingLabel}>
                {selectedItem ? items?.find(i => i?.value === selectedItem)?.component : placeholder}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {showOptions ? <ArrowDropUp sx={dropdownStyle.caret} /> :
                <ArrowDropDown sx={dropdownStyle.caret} />}
        </Box>

        {/* Items */}
        {showOptions && <Box sx={dropdownStyle.itemContainer}>
            {items?.map((item, index) => {
                return <Box key={index}
                    sx={dropdownStyle.item}
                    onClick={() => { handleChange(item?.value); setShowOptions(false) }}>
                    {item?.component}
                </Box>
            })}
        </Box>}

    </Box>
}