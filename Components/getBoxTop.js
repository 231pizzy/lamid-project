'use client'

export const getBoxTop = (ref) => {
    if (ref?.current) {
        return ref.current.getBoundingClientRect().top;
    }
}