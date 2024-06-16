'use client'

import { Avatar, Typography } from "@mui/material";

import { v4 as uuid } from 'uuid';
import { useEffect, useMemo } from "react";
import { useState } from "react";

export function ProfileAvatar({ diameter, src, styleProp, fullName, byEmail, onclick, thisUser }) {
    const [file, setFile] = useState(null)

    const imageKey = useMemo(() => { return uuid() }, []);

    const getFile = (filename) => {
        (filename || thisUser) && fetch(thisUser ? `/api/get-profile-picture-by-name/?thisUser=${true}` :
            byEmail ? `/api/get-profile-picture-by-name/?email=${filename}` :
                `/api/get-profile-picture-by-name/?filename=${filename}`,
            { method: 'GET' }).then((resp) => {
                resp.blob().then(blob => {
                    setFile(URL.createObjectURL(blob))
                })
            })
    }

    useEffect(() => {
        (src instanceof File) ? setFile(URL.createObjectURL(src)) : getFile(src)
    }, [])


    return src ? <Avatar key={imageKey} onClick={onclick} sx={{
        width: diameter, height: diameter, ...styleProp
    }} src={file} /> :
        <Avatar onClick={onclick} sx={{
            width: diameter, height: diameter,
            bgcolor: 'rgba(191, 6, 6, 0.08)', color: '#BF0606', ...styleProp
        }}>
            <Typography sx={{
                display: 'flex', letterSpacing: styleProp?.letterSpacing ?? 4, alignItems: 'center',
                textTransform: 'uppercase', fontWeight: 700, fontSize: styleProp?.fontSize ?? { xs: 14, md: 16 },
                color: styleProp?.color ?? '#BF0606'
            }}>
                {fullName?.length > 2 ? fullName?.toString()?.split(' ')?.map(word => word.charAt(0)).join('') : fullName}
            </Typography>

        </Avatar>
}