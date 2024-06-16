'use client'

import { AvatarGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProfileAvatar } from "./ProfileAvatar";
import { getRequestHandler } from "./requestHandler";
//import { getProfilePictures } from "./ProjectGroup/projectDetails/projectDetailsLogic";

/* export function getProfilePictures({ emailArray, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-profile-pictures/?emailArray=${JSON.stringify(emailArray ?? [])}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
} */

export function ProfileAvatarGroup({ emailArray, color, bgcolor, diameter, max }) {
    const dispatch = useDispatch();

    const [state, setState] = useState({
        profilePictures: []
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    /*     useEffect(() => {
            getProfilePictures({
                emailArray: emailArray, dataProcessor: (result) => {
                    updateState({ profilePictures: result })
                }
            });
        }, []) */

    const maxImages = max ?? 3

    return <AvatarGroup max={30000} sx={{}}>
        {emailArray.slice(0, max + 1).map((email, index) => {
            const record = state.profilePictures?.find(item => item.email === email);
            const pictureSrc = record?.profilePicture;
            //   diameter = pictureSrc ? diameter : diameter / 2.3
            //   console.log

            return index < max ? <ProfileAvatar key={index} {...{
                src: email, diameter: diameter, fullName: record?.fullName, byEmail: true, styleProp: {
                    '&[class*="MuiAvatar-root"]': {
                        border: `2px solid ${color}`
                    }, letterSpacing: 0, bgcolor: bgcolor, color: color
                }
            }} />
                : emailArray?.length > max && <ProfileAvatar  {...{
                    src: null, diameter: diameter,
                    fullName: `+${emailArray?.length - max}`,
                    styleProp: {
                        color: color, bgcolor: bgcolor, zIndex: 12,
                        '&[class*="MuiAvatar-root"]': {
                            border: `2px solid ${color}`
                        }, letterSpacing: 0, fontSize: 12
                    }
                }} />
        })}
    </AvatarGroup>
}