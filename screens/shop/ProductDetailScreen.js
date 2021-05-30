import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    Button,
    StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../contants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    const productId = props.route.params.productId;
    const selectedProduct = useSelector(
        state => state.products.availableProducts.find(p => p.id === productId)
    );
    const dispatch = useDispatch();
    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            <Button
                color={Colors.primary}
                title="Add To Cart"
                onPress={() => {
                    dispatch(cartActions.addToCart(selectedProduct));
                }}  
            />
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

export const screenOptions = navData => {
    return {
        headerTitle: navData.route.params.productTitle
    };
};


const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    }
});

export default ProductDetailScreen;