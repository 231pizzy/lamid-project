import style from '../style.module.css'

export default function DateBox({ item, finalFilter, handleChange }) {
    return <div >
        <input
            value={finalFilter[item?.value]?.filter}
            placeholder={item?.label}
            type='date'
            className={style.dateField}
            onChange={(event) => { handleChange({ type: 'datebox', id: item?.value, value: event.currentTarget.value }) }}
        />
    </div>
}