
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";

import { style } from './style'

export default function RadioList({ items, wrap, width, bgcolor, handleChange, ...props }) {
    const [field, meta, helpers] = useField(props);

    const handleSelect = (value) => {
        handleChange ? handleChange(value) : helpers.setValue(value)
    }

    return <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: { xs: 'wrap', lg: wrap ? 'wrap' : 'nowrap' } }}>
            {items?.map((item, index) => {
                return <Box key={index} sx={{
                    ...style.item, bgcolor: bgcolor || 'inherit',
                    width: width || (wrap ? 'max-content' : '100%'),
                }}
                    onClick={() => { handleSelect(item?.value) }}>
                    {meta.value === item?.value ? <RadioButtonChecked sx={{ color: 'primary.main' }} />
                        : <RadioButtonUnchecked sx={{ color: '#8D8D8D' }} />}
                    <Typography sx={{ ...style.label, color: item?.color || 'black' }}>
                        {item?.label}
                    </Typography>
                </Box>
            })}
        </Box>
        {/* meta.touched && */ meta.error ? (
            <Typography style={style.errorLabel}>{meta.error}</Typography>
        ) : null}
    </Box>
}