const NullBooleanMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        // console.log('filter value', filterText, 'value available', value);
        //Check if the value contains any of the entry in filterText
        filterText = JSON.parse(filterText)

        return filterText?.filter(item => item === true
            ? value?.toString()?.trim() != 'false'
            : item?.toString()?.trim() == value?.toString()?.trim())?.length ? true : false
    }
}

export default NullBooleanMatcher