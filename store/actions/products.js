import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(
                'https://rn-based-shop-app-default-rtdb.europe-west1.firebasedatabase.app/products.json'
            );

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadedProds = [];
            for (const key in resData) {
                loadedProds.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                ));
            };

            dispatch({ type: SET_PRODUCTS, products: loadedProds, userId });

        } catch (err) {
            // send to custom analytics server
            throw err;
        };
    };
};

export const deleteProduct = (id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-based-shop-app-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: DELETE_PRODUCT,
            productId: id
        });
    };
};

export const createProduct = (title, imageUrl, description, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(
            `https://rn-based-shop-app-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    imageUrl,
                    description,
                    price,
                    ownerId: userId
                })
            }
        );

        const resData = await response.json();

        dispatch({
            type: CREATE_PRODUCT,
            prodData: {
                id: resData.name,
                title,
                imageUrl,
                description,
                price,
                ownerId: userId
            }
        });
    };
};

export const updateProduct = (id, title, imageUrl, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-based-shop-app-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    imageUrl,
                    description,
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            prodData: { title, imageUrl, description }
        });
    };
};
