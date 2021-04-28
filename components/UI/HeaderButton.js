import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

export default props => {
    return (
        <HeaderButton 
            {...props}
            IconComponent={Ionicons}
            color="white"
            iconSize={23}
        />
    );
};