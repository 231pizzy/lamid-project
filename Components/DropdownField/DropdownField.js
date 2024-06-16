import { ArrowDropDown, ArrowDropUp, } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { dropdownFieldStyle, dropdownStyle } from "./style";

export default function DropdownField({ items, placeholder, selectedItem, handleChange, ...props }) {
    const [field, meta, helpers] = useField(props);

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


    return <Box sx={dropdownFieldStyle.container}>
        {/* Heading */}
        <Box sx={{
            ...dropdownFieldStyle.headingContainer,
            bgcolor: (selectedItem || typeof selectedItem === 'number') ? 'white' : '#F4F4F4',
        }}
            onClick={openMenu}>
            <Typography sx={dropdownStyle.headingLabel}>
                {(selectedItem || typeof selectedItem === 'number') ? items?.find(i => i?.value === selectedItem)?.component : placeholder}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {showOptions ? <ArrowDropUp sx={dropdownStyle.caret} /> :
                <ArrowDropDown sx={dropdownStyle.caret} />}
        </Box>

        {/* Items */}
        {showOptions && <Box id='dropdown-in-cms' sx={dropdownFieldStyle.content}>
            {items?.map((item, index) => {
                return <Box key={index}
                    sx={dropdownFieldStyle.item}
                    onClick={() => { handleChange(item?.value); setShowOptions(false) }}>
                    {item?.component}
                </Box>
            })}
        </Box>}

        {meta.error ? (
            <Typography style={dropdownFieldStyle.errorLabel}>{meta.error}</Typography>
        ) : null}
    </Box>
}