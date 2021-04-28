import React from 'react';
import { FlatList, Button, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../contants/Colors';
import * as actions from '../../store/actions/products';

const UserProductScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {
            pid: id
        });
    };

    const deleteHandler = (id) => {
        Alert.alert(
            "Are You Sure?",
            "Do you really want to delete this item?",
            [
                { text: "NO", style: "default" },
                {
                    text: "YES",
                    style: "destructive",
                    onPress: () => {
                        dispatch(actions.deleteProduct(id));
                    }
                }
            ]
        );
    };

    return (
        <FlatList
            data={userProducts}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => editProductHandler(itemData.item.id)}
                >
                    <View style={{ width: 110 }}>
                        <Button
                            color={Colors.primary}
                            title="Edit"
                            onPress={() => editProductHandler(itemData.item.id)}
                        />
                    </View>
                    <View style={{ width: 110 }}>
                        <Button
                            color={Colors.primary}
                            title="Delete"
                            onPress={() => deleteHandler(itemData.item.id)}
                        />
                    </View>
                </ProductItem>
            }
        />
    );
};

UserProductScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Products',
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
                    title="Add"
                    iconName="md-create"
                    onPress={() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )
    };
};

export default UserProductScreen;