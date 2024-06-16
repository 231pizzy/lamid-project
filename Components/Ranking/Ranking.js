
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";

import { style } from './style'

export default function Ranking({ items, wrap, width, handleChange, ...props }) {
    const [field, meta, helpers] = useField(props);

    const handleSelect = (value) => {
        handleChange ? handleChange(value) : helpers.setValue(value)
    }

    return <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: { xs: 'wrap', lg: wrap ? 'wrap' : 'nowrap' } }}>
            {items?.map((item, index) => {
                return <Box key={index} sx={{ ...style.item, width: width || (wrap ? 'max-content' : '100%'), }}
                    onClick={() => { handleSelect(item?.value) }}>
                    <Typography sx={{
                        maxWidth: 'max-content', px: 2, py: .8, mb: 1, fontSize: 12, fontWeight: 600,
                        bgcolor: meta.value?.toString() === item?.value?.toString() ? '#BF0606' : '#FAFAFA', border: '1px solid #1C1D221A',
                        ":hover": { background: '#BF060633' },
                        color: meta.value?.toString() === item?.value?.toString() ? 'white' : 'black',
                    }}>
                        {item?.value}
                    </Typography>
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