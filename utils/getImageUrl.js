import getSiteHost from "./getSiteHost"

export default function generateFileUrl(filename) {
    if (!filename) return null
    return ((filename instanceof Blob) || filename?.startsWith('http')) ? filename : `${getSiteHost()}/api/image?name=${filename}`
}