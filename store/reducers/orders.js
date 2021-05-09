
import * as actions from '../actions/orders';
import Order from '../../models/order';

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_ORDERS:
            return {
                orders: action.orders
            };

        case actions.ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.totalAmount,
                action.orderData.date,
            );
            return {
                ...state, 
                orders: state.orders.concat(newOrder)
            };

        default:
            return state;
    };
};