// @flow
import {rem} from 'polished';
import {colors, fontSizes, themes} from '../../globals/variables';

const getBorderColor = (isSelected, hasError) => {
    if (hasError) {
        return colors.danger;
    } else if (isSelected) {
        return themes.activeFormField.border;
    } else {
        return themes.inactiveFormField.border;
    }
};

export const select = (hasError: boolean = false) => ({
    container: (provided: Object) => ({
        ...provided,
        zIndex: 100
    }),
    control: (provided: Object, state: Object) => ({
        ...provided,
        border: `1px solid ${getBorderColor(state.isFocused, hasError)} !important`,
        boxShadow: 'none',
        borderRadius: rem(4),
        cursor: 'pointer',
        fontSize: rem(fontSizes.default),
        minHeight: 46,
        outline: 'none',
        padding: rem(3.5)
    }),
    dropdownIndicator: (provided: Object) => ({
        ...provided,
        color: colors.hippieBlue
    }),
    groupHeading: (provided: Object) => ({
        ...provided,
        color: themes.selectedFormField.heading,
        fontWeight: 700
    }),
    indicatorSeparator: () => ({
        display: 'none'
    }),
    multiValue: (provided: Object) => ({
        ...provided,
        alignItems: 'center',
        backgroundColor: themes.selectedFormField.background,
        borderRadius: rem(50),
        color: themes.selectedFormField.text,
        fontSize: rem(fontSizes.default),
        margin: `${rem(2)} ${rem(4)} ${rem(2)} 0`,
        padding: `${rem(2)} ${rem(8)}`
    }),
    multiValueRemove: (provided: Object) => ({
        ...provided,
        borderRadius: '100%',
        cursor: 'pointer',
        height: 20,
        width: 20
    }),
    option: (provided: Object, state: Object) => {
        let backgroundColor = themes.inactiveFormField.background;
        let color = themes.selectedFormField.text;

        if (state.isFocused) {
            backgroundColor = colors.greyLight;
            color = themes.activeFormField.text;
        } else if (state.isSelected) {
            backgroundColor = colors.sunglowYellow;
            color = colors.russetYellow;
        }

        return {
            ...provided,
            backgroundColor: `${backgroundColor} !important`,
            color,
            fontSize: rem(fontSizes.default),
            cursor: 'pointer'
        };
    }
});
