import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

import style from './style.module.css'
import { dropdown2Style } from "./style";
import { Circle } from "@mui/icons-material";

export default function Dropdown({ value, prefix, items = [{ label: '', value: '', color: '' }],
    label = "Page", handleItemClick = (id) => { } }) {

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null);

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleClick = (event) => {
        const id = event.target?.id
        if (id) {
            setSelected(items.find(item => item.value?.toString() === id?.toString())?.label)
            setOpen(false)
            handleItemClick(id)
        }
    }

    useEffect(() => {
        !value && (typeof value !== 'string') && setSelected(null)
    }, [value])

    useEffect(() => {
        value && setSelected(items.find(item => item.value === value)?.label)
    }, [])

    useEffect(() => {
        const removeDropdown = (event) => {
            if (!document.getElementById('dropdown-content')?.contains(event.target)) {
                handleClose()
            }
        }

        if (open) {
            document.addEventListener('click', removeDropdown)
        }
        else {
            try {
                document.removeEventListener('click', removeDropdown)
            } catch (error) {
            }
        }

        return () => {
            try {
                document.removeEventListener('click', removeDropdown)
            } catch (error) {
            }
        }
    }, [open])

    return <div className={style.container}>
        <div className={style.mainContainer} onClick={open ? handleClose : handleOpen}>
            <Typography sx={dropdown2Style.heading}>
                {prefix && `${prefix} :`} <Typography
                    sx={{ ...dropdown2Style.headingLabel, ml: prefix ? .5 : 0 }}>
                    {selected ?? label}
                </Typography>
            </Typography>

            {open ? <svg width="9" height="9" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.74184 1.09431C7.40318 0.301895 8.59682 0.301894 9.25816 1.09431L15.5979 8.69054C16.5192 9.79451 15.7554 11.5 14.3397 11.5L1.6603 11.5C0.244553 11.5 -0.519218 9.79451 0.402138 8.69054L6.74184 1.09431Z" fill="#8D8D8D" />
            </svg>
                : <svg width="9" height="9" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.25816 10.9057C8.59682 11.6981 7.40318 11.6981 6.74184 10.9057L0.402137 3.30946C-0.51922 2.20549 0.244552 0.5 1.6603 0.5H14.3397C15.7554 0.5 16.5192 2.20549 15.5979 3.30946L9.25816 10.9057Z" fill="#8D8D8D" />
                </svg>}


            {open && <div id='dropdown-content' className={style.content}>
                {items.map((item, index) => {
                    return <Typography key={index} id={item.value}
                        sx={dropdown2Style.value} onClick={handleClick}>
                        {item?.color && <Circle sx={{ fontSize: 10, color: item?.color }} />} {item.label}
                    </Typography>
                })}
            </div>}
        </div>

    </div >
}