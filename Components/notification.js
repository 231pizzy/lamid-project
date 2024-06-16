'use client'

import { useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { alterNotification } from '@/Components/redux/userDataSlice';
import { getRequestHandler } from './requestHandler';

const url = (process.env.NODE_ENV === 'production') ? '' : 'http://localhost:3000'

const getNotificationCount = ({ dataProcessor }) => {
    getRequestHandler({
        route: '/api/sse',
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            // console.log('Something went wrong', err)
        }
    })
}


export default function NotificationChannel() {
    const dispatch = useDispatch()

    useEffect(() => {
        let loop = null;
        let returned = true;

        loop = setInterval(() => {
            if (returned) {
                getNotificationCount({
                    dataProcessor: (result) => {
                        //  console.log('new notification', result?.message, result?.notificationCount);
                        dispatch(alterNotification({ count: result?.notificationCount }))
                        returned = true;
                    }
                });
                returned = false;
            }
        }, 5000)

        return () => {
            clearInterval(loop);
        }
    }, [])

    return <div></div>
}
