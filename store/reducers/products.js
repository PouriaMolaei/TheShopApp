import PRODUCTS from '../../data/dummy-data';
import * as actions from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(p => p.ownerId === 'u1')
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.DELETE_PRODUCT:
            return {
                ...state,
                availableProducts: state.availableProducts.filter(
                    p => p.id !== action.productId
                ),
                userProducts: state.userProducts.filter(
                    p => p.id !== action.productId
                )
            };

        case actions.CREATE_PRODUCT:
            const newProd = new Product(
                new Date().toString(),
                'u1',
                action.prodData.title,
                action.prodData.imageUrl,
                action.prodData.description,
                action.prodData.price,
            );

            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProd),
                userProducts: state.userProducts.concat(newProd)
            };

        case actions.UPDATE_PRODUCT:
            const prodIndex = state.availableProducts.findIndex(
                prod => prod.id === action.pid
            );
            const userProdIndex = state.userProducts.findIndex(
                prod => prod.id === action.pid
            );
            const updatedProd = new Product(
                action.pid,
                state.availableProducts[prodIndex].ownerId,
                action.prodData.title,
                action.prodData.imageUrl,
                action.prodData.description,
                state.availableProducts[prodIndex].price
            );
            const updatedProds = [...state.availableProducts];
            updatedProds[prodIndex] = updatedProd;
            const updatedUserProds = [...state.userProducts];
            updatedUserProds[userProdIndex] = updatedProd;

            return {
                ...state,
                availableProducts: updatedProds,
                userProducts: updatedUserProds
            };

        default:
            return state;
    }
};