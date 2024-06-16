
import { Box, } from "@mui/material";
import { useEffect, useState } from "react";
import DropdownItemsBuilder from "@/Components/DropdownField/DropdownItemsBuilder";
import Dropdown from "@/Components/DropdownField/Dropdown";
import { durationStyle } from "../style";

export default function Duration({ item, finalFilter, handleChange, }) {
    const [fullDuration, setFullDuration] = useState({
        hours: (finalFilter[item?.value]?.filter ?? [{}])[0]?.hours,
        minutes: (finalFilter[item?.value]?.filter ?? [{}])[0]?.minutes
    });

    const hours = Array.from({ length: 24 }).map((item, index) => {
        return { value: index, label: index }
    })

    const minutes = Array.from({ length: 60 }).map((item, index) => {
        return { value: index, label: index }
    })

    useEffect(() => {
        setFullDuration({
            hours: (finalFilter[item?.value]?.filter ?? [{}])[0]?.hours,
            minutes: (finalFilter[item?.value]?.filter ?? [{}])[0]?.minutes
        })
    }, [finalFilter[item?.value]?.filter])

    return <Box sx={durationStyle.durationContainer}>
        <Box sx={durationStyle.wrapper}>
            {/* Drop down field */}
            <Box sx={durationStyle.dropdown}>
                <Dropdown
                    items={DropdownItemsBuilder({ items: hours ?? [], postFix: 'hours' })}
                    handleChange={(value) => {
                        handleChange({
                            type: 'duration', id: item?.value,
                            filterId: item?.filterId,
                            value: { hours: value, minutes: fullDuration?.minutes ?? 0 }
                        });
                    }}
                    placeholder={'Hours'} selectedItem={fullDuration?.hours}
                />
            </Box>

            {/* Drop down field */}
            <Box sx={durationStyle.dropdownField}>
                <Dropdown
                    items={DropdownItemsBuilder({ items: minutes ?? [], postFix: 'minutes' })}
                    handleChange={(value) => {
                        handleChange({
                            type: 'duration', id: item?.value,
                            filterId: item?.filterId,
                            value: { minutes: value, hours: fullDuration?.hours ?? 0 }
                        });
                    }}
                    placeholder={'Minutes'} selectedItem={fullDuration?.minutes}
                />
            </Box>
        </Box>
    </Box>
}