import { Avatar, Box, Typography } from "@mui/material"
import { dropdownItemStyle } from "./style"

export default function DropdownItemsBuilder({ items, capitalize, postFix, postFixCallback }) {
    return items.map((item, index) => {
        return {
            value: item?.link ?? item?.value, component: <Box key={index} sx={dropdownItemStyle.container}>
                {item?.icon && <Box sx={dropdownItemStyle.icon}>
                    {item?.icon}
                </Box>}

                {item?.image && <Avatar
                    src={item?.image}
                    sx={dropdownItemStyle.avatar}
                />}

                <Typography sx={{
                    textTransform: capitalize ? 'capitalize' : 'inherit',
                    fontSize: 14, px: (!item?.icon && !item?.image) ? 1 : 0, color: 'black'
                }}>
                    {item?.label} {postFixCallback ? postFixCallback(item?.label) : postFix}
                </Typography>

            </Box>
        }
    })
}