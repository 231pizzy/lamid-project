import moment from "moment";

const DurationMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        if (filterText == null) {
            return false;
        }
        //Check if the value contains any of the entry in filterText
        filterText = JSON.parse(filterText)[0]

        return value === `${filterText?.hours ? (filterText?.hours + 'hours') : ''} ${filterText?.minutes ? (filterText?.minutes + ' minutes') : ''}`
        //filterText?.find(item => moment(item, 'yyyy-MM-DD').isSame(moment(value, 'DD/MM/yyyy'), 'date')) ? true : false
    }
}

export default DurationMatcher