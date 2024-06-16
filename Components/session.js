'use server'

import jwt from "jsonwebtoken"
import { cookies } from 'next/headers';

const secret = 'data for store secret 1234111'

export async function setSession(dataToStoreInSession, key) {
    console.log('setting session', dataToStoreInSession)
    const token = jwt.sign(dataToStoreInSession, secret);

    cookies().set(key ?? 'session', token, {
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 24, //one day in seconds
        sameSite: 'strict',
        path: '/'
    });

    return true;
}

export async function getSession(key) {
    const session = cookies().get(key ?? 'session');

    if (!session) return null

    try {
        return jwt.verify(session?.value, secret)
    } catch (error) {
        console.log('error at getsession', error)
        return null
    }
}

export async function isLoggedIn() {
    //true means logged in.
    //A session object with email key says that the user is logged in
    //A session object has email,full name,designation(staff/admin) and profile picture

    const session = await getSession();

    if (session?.email) {
        console.log('logged in')
        return session?.designation ?? 'staff'
    }
    else {
        console.log('not logged in')
        return false
    }
}

export async function logOut() {
    //true means logged out
    //A session object without email key says that the user is not logged in.
    //Session is used for more than authentication. Hence do not delete the full session.
    // Just delete the information that identified the user (email, full name,designation(staff/admin) and profile picture) 

    const session = await getSession();

    if (session?.email) {
        delete session?.email;
        delete session?.userId;
        delete session?.fullName;
        delete session?.profilePicture
        delete session?.designation

        return setSession(session)
    }

    return true
}

export async function deleteSession(keys) {
    keys.map(key => {
        cookies().delete(key ?? 'session')
    })
    return true
}