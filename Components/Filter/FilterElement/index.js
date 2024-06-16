import { Box, Typography } from "@mui/material"
import { FilterElementStyle } from "../style"

export default function FilterElement({ rows, data, finalFilter, typeMapping, handleChange, unSelect, selectedItems, siteSettings }) {
    return rows.map((item, indx) => {
        return <Box key={indx} sx={FilterElementStyle.container} >
            <Typography sx={FilterElementStyle.label}>
                Filter by  {item?.label}
            </Typography>
            {typeMapping[item?.type]?.element({ data: data, item: item, finalFilter: finalFilter, unSelect, selectedItems: selectedItems[item?.value], handleChange, siteSettings })}
        </Box>
    })
}