import { Typography } from "@mui/material";

export default function FieldLabel({ label }) {
    return <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        {label}
    </Typography>
}