const FilterArrayMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        //This is for matching array value
        if (filterText == null) {
            return false;
        }
        //Check if the value contains all the entry in filterText
        const valueArr = value?.split(',');
        filterText = JSON.parse(filterText)

        console.log('value', valueArr, 'filterText', filterText)

        return valueArr?.filter(item => filterText.includes(item))?.length === filterText?.length ? true : false
    }
}

export default FilterArrayMatcher