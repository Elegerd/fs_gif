import {SELECT_NAV_ID} from '../actions/navItemActions.js'


const initState = {
    selectedNavId: null,
    navItems: [
        {
            id: 0,
            title: 'DASHBOARD',
            children: [
                {id: 0, title: 'Overview', icon: 'home', path: ''},
            ]
        },
    ]
}

export function navItemReducer(state = initState, action) {
    switch (action.type) {
        case SELECT_NAV_ID: {
            return {
                ...state,
                selectedNavId: action.payload
            }
        }
        default:
            return state;
    }
}
