import moment from "moment/moment";

const DateRenderer = (props) => {

    const colorData = {
        availableLanguages: '#6F3D17',
        publishedLanguages: '#008000',
        creator: '#4F92AB'
    }

    // const color = colorData[props.column.colDef.field]; /* props.valueFormatted ? props.valueFormatted : props.value; */

    /*   const buttonClicked = () => {
          alert(`${cellValue} medals won!`)
      } */

    return (
        <span style={{
            fontSize: '12px'
        }}>
            {props?.value ? moment(props?.value).format('DD/MM/yyyy') : '------'}
        </span>
    );
}

export default DateRenderer