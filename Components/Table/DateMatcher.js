import moment from "moment";

const DateMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        if (filterText == null) {
            return false;
        }
        //Check if the value contains any of the entry in filterText
        filterText = JSON.parse(filterText)

        return filterText?.find(item => moment(item, 'yyyy-MM-DD').isSame(moment(value, 'DD/MM/yyyy'), 'date')) ? true : false
    }
}

export default DateMatcher