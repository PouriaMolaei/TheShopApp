import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(
                `https://rn-based-shop-app-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json`
            );

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            const loadedOrders = [];
            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].items,
                    resData[key].totalAmount,
                    new Date(resData[key].date)
                ));
            };

            dispatch({ type: SET_ORDERS, orders: loadedOrders });

        } catch (err) {
            // send to custom analytics server
            throw err;
        };
    };
}

export const addOrder = (items, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date();
        const response = await fetch(
            `https://rn-based-shop-app-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items,
                    totalAmount,
                    date: date.toISOString()
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        };

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: { id: resData.name, items, totalAmount, date }
        });

        for (const item of items) {
            const pushToken = item.pushToken;

            fetch('https://exp.host/--/api/v2/push/send', {
                method: "POST",
                headers: {
                    "host": "exp.host",
                    "accept": "application/json",
                    "accept-encoding": "gzip, deflate",
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    to: pushToken,
                    title: 'Order was placed!',
                    body: `${item.productTitle} is ordered.`,
                })
            });
        };
    };
};