
import { CheckBox, CheckBoxOutlineBlank, } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";

import { style } from './style'

export default function CheckboxList({ items, wrap, width, handleChange, ...props }) {
    const [field, meta, helpers] = useField(props);

    const handleSelect = (value) => {
        const newValue = meta.value?.includes(value) ? meta.value?.filter(i => i !== value) : [...(meta.value ?? []), value]
        helpers.setValue(newValue)
    }

    return <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: { xs: 'wrap', lg: wrap ? 'wrap' : 'nowrap' } }}>
            {items?.map((item, index) => {
                return <Box key={index} sx={{ ...style.item, width: width || (wrap ? 'max-content' : '100%'), }}
                    onClick={() => { handleSelect(item?.value) }}>
                    {meta.value.includes(item?.value) ? <CheckBox sx={{ color: 'primary.main' }} />
                        : <CheckBoxOutlineBlank sx={{ color: '#8D8D8D' }} />}
                    {item?.icon}
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