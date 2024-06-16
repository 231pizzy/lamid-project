import { OutlinedInput } from "@mui/material";

export default function TextInput({ type, placeholder, value, onChange, id }) {
    return <OutlinedInput
        onChange={onChange}
        id={id}
        placeholder={placeholder}
        value={value}
        type={type}
        sx={{ width: { xs: '100%', sm: '400px', md: '200px' }, fontSize: 14, height: '40px' }}
    />
}