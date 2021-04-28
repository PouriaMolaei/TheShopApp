import * as actions from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;
            let updatedOrNewCartItem;
            if (state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice,
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
            }
            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            };

        case actions.REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.id];
            const quantity = selectedCartItem.quantity;
            const price = selectedCartItem.productPrice;
            const title = selectedCartItem.productTitle;
            const sum = selectedCartItem.sum;
            let updatedCartItems;
            if (quantity === 1) {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.id];
            } else {
                const updatedCartItem = new CartItem(
                    quantity - 1,
                    price,
                    title,
                    sum - price,
                );
                updatedCartItems = {
                    ...state.items,
                    [action.id]: updatedCartItem
                }
            };
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - price
            };

        case ADD_ORDER:
            return initialState;

        case DELETE_PRODUCT:
            if (!state.items[action.productId]) {
                return state;
            }
            const remainedCartItems = { ...state.items };
            delete remainedCartItems[action.productId];
            const deletedItemPrice = state.items[action.productId].sum;
            return {
                ...state,
                items: remainedCartItems,
                totalAmount: state.totalAmount - deletedItemPrice
            };

        default:
            return state;
    }
};