import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
    createDrawerNavigator, 
    DrawerItemList, 
    DrawerItem, 
    DrawerContentScrollView 
} from '@react-navigation/drawer';
import ProductOverviewScreen, {
    screenOptions as overviewOptions
} from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen, {
    screenOptions as detailOptions
} from '../screens/shop/ProductDetailScreen';
import CartScreen, {
    screenOptions as cartOptions
} from '../screens/shop/CartScreen';
import OrdersScreen, {
    screenOptions as ordersOptions
} from '../screens/shop/OrdersScreen';
import UserProductsScreen, {
    screenOptions as userOptions
} from '../screens/user/UserProductsScreen';
import EditProductScreen, {
    screenOptions as editOptions
} from '../screens/user/EditProductScreen';
import AuthScreen, {
    screenOptions as authOptions
} from '../screens/user/AuthScreen';
import Colors from '../contants/Colors';
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

const ProdsStackNav = createStackNavigator();
export const ProductsNavigator = () => {
    return (
        <ProdsStackNav.Navigator screenOptions={defaultNavOptions}>
            <ProdsStackNav.Screen
                name="ProductOverview"
                component={ProductOverviewScreen}
                options={overviewOptions}
            />
            <ProdsStackNav.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={detailOptions}
            />
            <ProdsStackNav.Screen
                name="Cart"
                component={CartScreen}
                options={cartOptions}
            />
        </ProdsStackNav.Navigator>
    );
};

// const ProductsNavigator = createStackNavigator({
//     ProductOverview: ProductOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name='md-cart'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

const OrdsStackNav = createStackNavigator();
export const OrdersNavigator = () => {
    return (
        <OrdsStackNav.Navigator screenOptions={defaultNavOptions}>
            <OrdsStackNav.Screen
                name="Orders"
                component={OrdersScreen}
                options={ordersOptions}
            />
        </OrdsStackNav.Navigator>
    );
};

// const OrdersNavigator = createStackNavigator({
//     Orders: OrdersScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name='md-list'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

const AdminStackNav = createStackNavigator();
export const AdminNavigator = () => {
    return (
        <AdminStackNav.Navigator screenOptions={defaultNavOptions}>
            <AdminStackNav.Screen
                name="UserProduct"
                component={UserProductsScreen}
                options={userOptions}
            />
            <AdminStackNav.Screen
                name="EditProduct"
                component={EditProductScreen}
                options={editOptions}
            />
        </AdminStackNav.Navigator>
    );
};

// const AdminNavigator = createStackNavigator({
//     UserProduct: UserProductsScreen,
//     EditProduct: EditProductScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name='md-create'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

const AuthStackNav = createStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNav.Navigator screenOptions={defaultNavOptions}>
            <AuthStackNav.Screen
                name="Auth"
                component={AuthScreen}
                options={authOptions}
            />
        </AuthStackNav.Navigator>
    );
};

// const AuthNavigator = createStackNavigator({
//     Auth: AuthScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name='md-exit'
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

const ShopDrawerNav = createDrawerNavigator();
export const ShopNavigator = () => {
    const dispatch = useDispatch();
    return (
        <ShopDrawerNav.Navigator
            drawerContent={props => (
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label="Logout"
                        icon={({color}) => 
                            <Ionicons color={color} size={23} name='md-exit' />
                        }
                        onPress={() => dispatch(logout())}
                    />
                </DrawerContentScrollView>
            )}
            drawerContentOptions={{
                activeTintColor: Colors.primary,
                activeBackgroundColor: 'white'
            }}
        >
            <ShopDrawerNav.Screen
                name="Products"
                component={ProductsNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name='md-cart'
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNav.Screen
                name="Orders"
                component={OrdersNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name='md-list'
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNav.Screen
                name="Admin"
                component={AdminNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name='md-create'
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
        </ShopDrawerNav.Navigator>
    );
};

// const ShopNavigator = createDrawerNavigator({
//     Products: ProductsNavigator,
//     Orders: OrdersNavigator,
//     Admin: AdminNavigator,
//     Logout: AuthNavigator
// }, {
//     contentOptions: {
//         activeTintColor: Colors.primary,
//     },
//     contentComponent: props => {
//         const dispatch = useDispatch();
//         return (
//             <View style={styles.statusBarMarginEdition}>
//                 {/* <SafeAreaView forceInset={{
//                     top: 'always',
//                     horizontal: 'never'
//                 }}> */}
//                 <DrawerItems
//                     {...props}
//                     onItemPress={({ route, focused }) => {
//                         if (route.key === 'Logout') {
//                             dispatch(logout());
//                         } else {
//                             props.onItemPress({ route, focused });
//                         }
//                     }}
//                 />
//                 {/* <Button
//                         title="logout"
//                         color={Colors.primary}
//                         onPress={() => { 
//                             dispatch(logout());
//                             props.navigation.navigate('Auth');
//                         }}
//                     /> */}
//                 {/* </SafeAreaView> */}
//             </View>
//         );
//     }
// });

// const MainNavigator = createSwitchNavigator({
//     Auth: AuthNavigator,
//     Shop: ShopNavigator,
// });

// export default createAppContainer(MainNavigator);