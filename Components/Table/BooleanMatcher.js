const BooleanMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        console.log('filter value', filterText, 'value available', value);
        //This is for matching text value 
        if (filterText == null) {
            return false;
        }

        //Check if the value contains any of the entry in filterText
        filterText = JSON.parse(filterText)

        return filterText?.filter(item => (item?.toString()?.trim() === value?.toString()?.trim()))?.length ? true : false
    }
}

export default BooleanMatcher