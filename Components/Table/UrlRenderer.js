import Link from "next/link";

const UrlRenderer = (props) => {

    const colorData = {
        availableLanguages: '#6F3D17',
        publishedLanguages: '#008000',
        creator: '#4F92AB'
    }

    const linkFormatter = ({ link = '' }) => {

        // if(link.substring(0,4)==='https')
        return `https://${link.split('://').pop() ?? ''}`
        //else return link
    }
    /*   const buttonClicked = () => {
          alert(`${cellValue} medals won!`)
      } */

    return (<a href={linkFormatter({ link: props?.url ?? props?.value })} style={{

    }}>
        {props?.value}
    </a>
    );
}

export default UrlRenderer