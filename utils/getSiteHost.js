export default function getSiteHost() {
    const siteHost = window.location.host;
    return `${siteHost.startsWith('localhost') ? process.env.NEXT_PUBLIC_SITE_URL_MAIN : `https://${siteHost}`}`
}