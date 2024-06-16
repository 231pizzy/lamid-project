const NumberBooleanMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        //This is for matching array value
        if (filterText == null) {
            return false;
        }
        //Check if the value evaluates to true
        //filterText = JSON.parse(filterText)
        console.log('value', value, 'filterText', filterText)
        return Number(value) ? true : false

        //console.log('value', valueArr, 'filterText', filterText)

        // return valueArr?.filter(item => filterText.includes(item))?.length === filterText?.length ? true : false
    }
}

export default NumberBooleanMatcher