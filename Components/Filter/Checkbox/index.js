
import { CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import CheckBoxFilled from '@mui/icons-material/CheckBox'
import { Box, Typography } from "@mui/material";
import StatusRenderer from "../StatusRenderer";
import AvatarWithName from "../AvatarWithName";
import ServiceRenderer from "../ServiceRenderer";
import MediaRenderer from "../MediaRenderer";
import { checkboxStyle } from "../style";

export default function Checkbox({ data, item, finalFilter, handleChange, siteSettings }) {
    let usedValue = []

    const dataList = item?.deDuplicate ?
        data[item?.value]?.filter(i => !usedValue?.includes(i?.value) && usedValue?.push(i?.value))
        : data[item?.value]

    usedValue = [];

    const rendererMapping = {
        status: StatusRenderer,
        avatarWithName: AvatarWithName,
        serviceType: ServiceRenderer,
        media: MediaRenderer,
    }

    return <Box sx={checkboxStyle.container}>
        {(item?.useSetting
            ? siteSettings[item?.settingKey]?.map(i => i[item?.valueKey])
            : dataList)?.map((itm, index) => {
                const isObject = typeof itm === 'object';
                const label = isObject ? itm?.label : itm;
                const value = isObject ? itm?.value : itm;
                const renderer = rendererMapping[item?.renderer]

                return <Box key={index} sx={checkboxStyle.itemContainer} onClick={() => {
                    handleChange({
                        type: 'checkbox', id: item?.value,
                        value, filterId: item?.filterId
                    })
                }}>
                    {finalFilter[item?.value]?.filter?.includes(value) ?
                        <CheckBoxFilled sx={checkboxStyle.filled} />
                        : <CheckBoxOutlineBlankOutlined sx={checkboxStyle.notFilled} />
                    }
                    {!renderer && <Typography sx={checkboxStyle.label}>
                        {label}
                    </Typography>}

                    {Boolean(renderer) && <Box sx={checkboxStyle.renderer}>
                        {renderer({ value: label })}
                    </Box>}
                </Box>
            })}
    </Box>
}