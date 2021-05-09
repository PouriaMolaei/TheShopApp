import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Button
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import AuthScreen from '../screens/user/AuthScreen';
import Colors from '../contants/Colors';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import { logout } from '../store/actions/auth';
import { Ionicons } from '@expo/vector-icons';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.primary
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: 'white'
};

const ProductsNavigator = createStackNavigator({
    ProductOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name='md-cart'
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name='md-list'
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const AdminNavigator = createStackNavigator({
    UserProduct: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name='md-create'
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

// let logout = false;

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name='md-exit'
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
    Logout: AuthNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary,
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={styles.statusBarMarginEdition}>
                {/* <SafeAreaView forceInset={{
                    top: 'always',
                    horizontal: 'never'
                }}> */}
                <DrawerItems
                    {...props}
                    onItemPress={({ route, focused }) => {
                        if (route.key === 'Logout') {
                            dispatch(logout());
                        } else {
                            props.onItemPress({ route, focused });
                        }
                    }}
                />
                {/* <Button
                        title="logout"
                        color={Colors.primary}
                        onPress={() => { 
                            dispatch(logout());
                            props.navigation.navigate('Auth');
                        }}
                    /> */}
                {/* </SafeAreaView> */}
            </View>
        );
    }
});

const styles = StyleSheet.create({
    statusBarMarginEdition: {
        marginTop: Constants.statusBarHeight,
    }
});

const MainNavigator = createSwitchNavigator({
    Auth: AuthNavigator,
    Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);