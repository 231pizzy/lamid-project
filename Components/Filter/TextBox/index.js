import { OutlinedInput } from "@mui/material"
import { textBoxStyle } from "../style"

export default function TextBox({ item, finalFilter, handleChange }) {
    return <div  >
        <OutlinedInput
            value={finalFilter[item?.value]?.filter ?? ''}
            placeholder={item?.label}
            sx={textBoxStyle.field}
            onChange={(event) => {
                handleChange({
                    type: 'textbox', id: item?.value,
                    filterId: item?.filterId,
                    value: event.currentTarget.value
                })
            }}
        />
    </div>
}