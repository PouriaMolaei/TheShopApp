import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
} from 'react-native';
import Colors from '../../contants/Colors';
import CartItem from '../shop/CartItem';
import Card from '../UI/Card';

export default props => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button
                color={Colors.primary}
                title={showDetails ? 'Hide Details' : 'Show details'}
                onPress={() => setShowDetails(prevState => !prevState)}
            />
            {showDetails &&
                <View style={styles.detailItems}>
                    {props.items.map(cartItem =>
                        <CartItem
                            quantity={cartItem.quantity}
                            title={cartItem.productTitle}
                            amount={cartItem.sum}
                            key={cartItem.productId}
                        />
                    )}
                </View>
            }
        </Card>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    amount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 16,
        color: '#888'
    },
    detailItems: {
        width: '100%'
    }
});