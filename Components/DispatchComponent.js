'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux"

console.log('called DispatchCOmpnent1 ')

export default function DispatchComponent({ action, payload }) {
    console.log('called DispatchCOmpnent')
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(action(payload))
    }, []);

    return <div></div>
} 