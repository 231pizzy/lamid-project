'use client'

import { useEffect } from "react"

export default function authStarter({ successCallback }) {
    const handleMessageFromIframe = (event) => {
        if (event.origin !== window.origin) return
        const message = event.data;
        console.log('message received by AuthStarter', event.data)
        if (message?.success) {
            successCallback()
        }
    }

    //  useEffect(() => {
    if (typeof window !== undefined) {
        console.log(' setting listener in Auth starter')
        window.addEventListener('message', handleMessageFromIframe, false)

        return () => {
            console.log('cleaning up Authstarter')
            window.removeEventListener('message', handleMessageFromIframe)
        }
    }


    // }, [])

    //  return <div></div>
}