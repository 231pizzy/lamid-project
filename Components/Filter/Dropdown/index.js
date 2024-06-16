
import Select from 'react-select';
import { useState } from 'react';
import { Close } from '@mui/icons-material';
import style from '../style.module.css'

export default function Dropdown({ data, item, finalFilter, handleChange, selectedItems, unSelect, siteSettings }) {

    const getValue = (value) => {
        return ((item?.useSetting
            ? siteSettings[item?.settingKey]?.map(i => item?.matchId ? i : i[item?.valueKey])
            : data[item?.value])?.map(i => {
                return item?.matchId ?
                    { label: i[item?.valueKey], value: i?.id }
                    : { label: i, value: i }
            }))?.find(i => i?.value === value)
    }



    const [selected, setSelected] = useState((finalFilter[item?.value]?.filter ?? [])[0]
        ? getValue((finalFilter[item?.value]?.filter ?? [])[0]) : null);

    const removeSelected = (id, value) => {
        unSelect(id, value)
    }

    return <div>
        <Select
            options={(item?.useSetting
                ? siteSettings[item?.settingKey]?.map(i => item?.matchId ? i : i[item?.valueKey])
                : data[item?.value])?.map(i => { return item?.matchId ? { label: i[item?.valueKey], value: i?.id } : { label: i, value: i } })}
            id={'id'}
            name={'id'}
            isMulti={false}
            onChange={option => {
                setSelected(option)
                handleChange({
                    type: 'dropdown', id: item?.value,
                    value: option.value
                })
            }}
            value={selected}
        />

        {/* Selected Items */}
        <div className={style.dropdownContent}>
            {selectedItems?.map((label, index) => {
                return <div key={index} className={style.dropdownItem}>
                    {label} <Close className={style.closeIcon}
                        onClick={() => { removeSelected(item?.value, label) }}
                    />
                </div>
            })}
        </div>
    </div>
}