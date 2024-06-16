import moment from "moment";

const TimeMatcher = {
    textMatcher: ({ filterOption, value, filterText }) => {
        console.log({ value, filterText })

        if (filterText == null) {
            return false;
        }
        //Check if the value contains any of the entry in filterText
        filterText = moment(JSON.parse(filterText), 'hh:mm').format('h:mma').toString()

        return filterText === value //filterText?.find(item => moment(item, 'hh:mm').isSame(moment(value, 'h:mma'), 'date'))
    }
}

export default TimeMatcher