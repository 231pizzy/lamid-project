import { Box, OutlinedInput, Typography } from "@mui/material";
import { useField } from "formik"
import { useState } from "react";

export default function FormTextField({ placeholder, small, maxLength, min, noValidation, variant = 'outlined', ...props }) {
    const [field, meta, helpers] = useField(props);
    const [length, setLength] = useState(meta?.value?.length ?? 0);

    const numbersKeys = [(min === 1 && !meta?.value) ? '' : '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <OutlinedInput {...field} {...props} fullWidth variant={variant} inputProps={{
            min: min ?? 0,
            ...(maxLength ? { maxLength } : {})
        }}
            onKeyUp={(e) => { setLength(meta.value?.length) }}
            onKeyDown={(e) => { (e.target.type === 'number' && (!numbersKeys.includes(e.key))) && e.preventDefault() }}

            placeholder={placeholder} sx={{
                fontSize: 14, width: small ? '70px' : '100%', height: small ? '40px' : 'inherit',
                background: 'white', fontWeight: 500
            }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            {/* meta.touched && */!noValidation && meta.error ? (
                <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{meta.error}</Typography>
            ) : null}

            {maxLength && <Typography sx={{
                fontSize: 12, mt: 1, alignSelf: 'flex-end'
            }}>{length}/{maxLength}</Typography>}

        </Box>
    </Box>
}