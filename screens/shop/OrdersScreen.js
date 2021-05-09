import React, { useEffect, useState } from 'react';
import {
    FlatList,
} from 'react-native';
import OrderItem from '../../components/shop/OrderItem';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import * as actions from '../../store/actions/orders';
import Spinner from '../../components/UI/Spinner';
import EmptyText from '../../components/UI/EmptyText';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(actions.fetchOrders())
            .then(() => setIsLoading(false));
    }, [dispatch]);

    if (isLoading) {
        return <Spinner />;
    };

    if (orders.length === 0) {
        return (
            <EmptyText>
                No products found, maybe start ordering some products?
            </EmptyText>
        );
    };

    return (
        <FlatList
            data={orders}
            renderItem={itemData =>
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                />
            }
        />
    );
};

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName="md-menu"
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    };
};

export default OrdersScreen;