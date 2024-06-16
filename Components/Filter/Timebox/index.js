import style from '../style.module.css'

export default function TimeBox({ item, finalFilter, handleChange }) {
    return <div>
        <input
            value={finalFilter[item?.value]?.filter}
            placeholder={item?.label}
            type='time'
            className={style.dateField}
            onChange={(event) => { handleChange({ type: 'timebox', id: item?.value, value: event.currentTarget.value }) }}
        />
    </div>
}