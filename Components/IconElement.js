export default function IconElement({ src, style, onclick, id }) {
    return <img src={src} alt='icon' style={{ ...style }} onClick={onclick} />
}