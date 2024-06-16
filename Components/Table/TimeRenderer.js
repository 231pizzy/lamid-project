import { getLocalTime } from "@/utils/getLocalTime";
import Link from "next/link";

const TimeRenderer = (prop) => {


    /*   const buttonClicked = () => {
          alert(`${cellValue} medals won!`)
      } */

    return (
        <span style={{
            fontSize: '12px',
        }}>
            {getLocalTime({
                date: prop?.data?.date, time: prop?.value, timeFormat: 'h:mma',
                dateFormat: 'DD/MM/yyyy', outputFormat: 'h:mma', type: 'time'
            })}
        </span>
    );
}

export default TimeRenderer