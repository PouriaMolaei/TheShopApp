import React from 'react';
import {
    View,
    ActivityIndicator,

} from 'react-native';
import Colors from '../../contants/Colors';
import Centered from './Centered';

export default props => {
    return (
        <Centered>
            <ActivityIndicator size='large' color={Colors.primary} />
        </Centered>
    );
};


