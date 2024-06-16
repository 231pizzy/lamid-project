'use client'

import { useDispatch } from "react-redux";
import { activateButton, disactivateButton } from "./redux/routeSlice";



export function startAnimation(buttonId, dispatch) {
    if (buttonId) dispatch(disactivateButton({ id: buttonId }));
}

export function stopAnimation(buttonId, dispatch) {
    console.log('stopping animation', buttonId)
    if (buttonId) dispatch(activateButton({ id: buttonId }));
}