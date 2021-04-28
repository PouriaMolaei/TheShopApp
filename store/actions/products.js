export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const deleteProduct = (id) => {
    return {
        type: DELETE_PRODUCT,
        productId: id
    };
};

export const createProduct = (title, imageUrl, description, price) => {
    return {
        type: CREATE_PRODUCT,
        prodData: {title, imageUrl, description, price}
    };
};

export const updateProduct = (id, title, imageUrl, description) => {
    return {
        type: UPDATE_PRODUCT,
        pid: id,
        prodData: {title, imageUrl, description}
    };
};

