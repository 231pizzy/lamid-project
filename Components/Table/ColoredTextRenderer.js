const ColoredTextRenderer = (props) => {

    const colorCodes = {
        public: {
            color: '#6B9DFF',
            label: 'Public'
        },
        activists: {
            color: '#800080',
            label: 'Activists'
        },
        fixed: {
            color: '#FFA500',
            label: 'Fixed Deadline'
        },
        alwaysOpen: {
            color: '#008000',
            label: 'Always Open'
        },
        tempClosed: {
            color: '#FF0000',
            label: 'Temporarily Closed'
        },
    }

    // const color = colorData[props.column.colDef.field]; /* props.valueFormatted ? props.valueFormatted : props.value; */

    /*   const buttonClicked = () => {
          alert(`${cellValue} medals won!`)
      } */

    const obj = colorCodes[props?.value]
    return (
        <span style={{
            color: obj?.color, fontSize: '12px'
        }}>
            {obj?.label || '--------'}
        </span>
    );
}

export default ColoredTextRenderer