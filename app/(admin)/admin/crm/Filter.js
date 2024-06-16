import {
    Avatar,
    Box, Button, Checkbox, Slide, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';

import { useEffect, useState, useMemo } from "react";

import { useDispatch, } from "react-redux";
import { uuid } from "uuidv4";


console.log('filter called');

const filterData = [
    {
        heading: 'Filter By Sector', children: [
            { heading: '', sourceKey: 'sectors', stateKey: 'sector' }
        ]
    },
    {
        heading: 'Filter By Location', children: [
            { heading: 'Country', sourceKey: 'countries', stateKey: 'country', image: true },
            { heading: 'State', sourceKey: 'states', stateKey: 'state' },
            { heading: 'City', sourceKey: 'cities', stateKey: 'city' },
        ]
    }
]

const sectors = ['IT', 'Agriculture', 'Finance', 'Entertainment'];
const countries = [{
    "name": "Afghanistan",
    "code": "af"
},
{
    "name": "Aland Islands",
    "code": "ax"
},
{
    "name": "Albania",
    "code": "al"
},
{
    "name": "Algeria",
    "code": "dz"
},
{
    "name": "American Samoa",
    "code": "as"
},];
const states = ['Lagos', 'Abuja'];
const cities = ['Ikeja', 'Benin City'];

function Filter(prop) {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        sectors: sectors, countries: countries, states: states, cities: cities
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    //generate unique name for text field
    const nameValue = useMemo(() => { return uuid() }, [])

    const closeFilter = (event) => {
        console.log('closing filter')
        prop.closeFilter();
    }

    const resetFilter = (event) => {
        console.log('reseting filter')
    }

    const applyFilter = (event) => {
        console.log('applying filters')
        prop.closeFilter();
    }

    return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
            height: '100%', transform: 'translate(-0%,-0%)', bgcolor: 'white', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
            boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
            position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '80%', md: '60%', lg: '40%', xl: '40%' },
        }}>
            {/* Heading */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1,
                display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 2, px: { xs: 1.5, sm: 4 }
            }}>
                {/* Heading label */}
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                    FILTER
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Reset button */}
                <Button variant='outlined' sx={{
                    color: '#5D5D5D', border: '1px solid #5D5D5D', borderRadius: '16px',
                    bgcolor: 'rgba(28, 29, 34, 0.1)', mr: { xs: 1, md: 3 }, py: { xs: .5, sm: 1 }, px: 2
                }} onClick={resetFilter}>
                    Reset
                </Button>

                {/* Apply button */}
                <Button variant='outlined' onClick={applyFilter}
                    sx={{ borderRadius: '16px', mr: { xs: 1, md: 4 }, py: { xs: .5, sm: 1 }, px: 2 }}>
                    Apply
                </Button>

                {/* Close filter icon */}
                <Close onClick={closeFilter} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 24 }} />
            </Box>

            {/* Content */}
            <Box sx={{ mt: '90px', maxHeight: '80%', overflowY: 'scroll' }}>
                {filterData.map((data, index1) =>
                    <Box key={index1}>
                        {/* Heading */}
                        <Typography sx={{ bgcolor: 'rgba(28, 29, 34, 0.06)', px: 3, pb: 1, mb: index1 }}>
                            {data.heading}
                        </Typography>

                        {/* Children */}
                        <Box>
                            {data.children.map((child, index2) =>
                                <Box key={index2}>
                                    {/* sub Heading */}
                                    {Boolean(child?.heading) &&
                                        <Typography sx={{ px: 3, py: .5, bgcolor: 'rgba(191, 6, 6, 0.04)' }}>
                                            {child?.heading}
                                        </Typography>}

                                    {/* Content */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', px: 4 }}>
                                        {state[child.sourceKey].map((item, index3) => {
                                            return <Box key={index3} sx={{ mr: 3, my: 2, display: 'flex', alignItems: 'center' }}>
                                                {/* Checkbox */}
                                                <Checkbox sx={{ p: 0, mr: 1 }} />

                                                {/* Flaf: if available */}
                                                {child?.image &&
                                                    <Avatar variant="square"
                                                        src={`https://flagcdn.com/h20/${item?.code}.png`}
                                                        sx={{ mr: 1, height: 20, width: 25 }} />}

                                                {/* Data to be displayed */}
                                                <Typography>
                                                    {child.sourceKey === 'countries' ? item?.name : item}
                                                </Typography>
                                            </Box>
                                        }

                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

        </Box>
    </Slide>)
}

export default Filter;