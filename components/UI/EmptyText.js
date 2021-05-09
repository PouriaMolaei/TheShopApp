import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Centered from './Centered';

export default props => {
    return (
        <Centered>
            <Text style={styles.msg}>{props.children}</Text>
        </Centered>
    );
};

const styles = StyleSheet.create({
    msg: {
        fontFamily: 'open-sans'
    }
});