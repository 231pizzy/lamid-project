import { Typography } from "@mui/material";
import style from './style.module.css'

export default function ClampedText({ value, sx = {} }) {
    return <Typography sx={sx} className={`${style['clamp']}`}
        dangerouslySetInnerHTML={{ __html: value }}>
    </Typography>
}