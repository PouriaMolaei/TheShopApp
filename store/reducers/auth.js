import * as actions from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
            };

        case actions.LOGUOT:
            return initialState;

        default:
            return state;
    }
};