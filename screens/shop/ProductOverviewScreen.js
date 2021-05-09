import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Button,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../contants/Colors';
import Spinner from '../../components/UI/Spinner';
import Centered from '../../components/UI/Centered';

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadedProds = useCallback(async () => {
        setError(null);
        try {
            setIsRefreshing(true);
            await dispatch(productsActions.fetchProducts());
            setIsRefreshing(false);
        } catch (err) {
            setError(err.message);
        };
        return null;
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        setIsLoading(true);
        loadedProds()
            .then(() => setIsLoading(false));
    }, [loadedProds]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadedProds
        );
        return () => {
            willFocusSub.remove();
        };
    }, []);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if (isLoading) {
        return <Spinner />
    };

    if (error) {
        return (
            <Centered>
                <Text style={styles.text}>{error}</Text>
                <View style={{ marginTop: 10 }}>
                    <Button
                        title="Try Again"
                        onPress={loadedProds}
                        color={Colors.primary}
                    />
                </View>
            </Centered>
        );
    }

    if (products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.text}>No products found. Maybe start adding one!</Text>
            </View>
        );
    };

    return (
        <FlatList
            onRefresh={loadedProds}
            refreshing={isRefreshing}
            data={products}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                >
                    <View style={{ width: 110 }}>
                        <Button
                            color={Colors.primary}
                            title="View Details"
                            onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                        />
                    </View>
                    <View style={{ width: 110 }}>
                        <Button
                            color={Colors.primary}
                            title="To Cart"
                            onPress={() => dispatch(cartActions.addToCart(itemData.item))}
                        />
                    </View>
                </ProductItem>
            }
        />
    );
};

ProductOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
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
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName="md-cart"
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'open-sans',
    }
});

export default ProductOverviewScreen;