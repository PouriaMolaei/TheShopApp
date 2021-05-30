import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ShopNavigator, AuthNavigator } from './ShopNavigator';
import * as actions from '../store/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {
    const isAuth = useSelector(state => !!state.auth.token);

    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                return;
            };

            parsedUserData = JSON.parse(userData);
            const { token, userId, expDate } = parsedUserData;
            const expiryDate = new Date(expDate);
            if (expiryDate <= new Date || !token || !userId) {
                return;
            };

            const expTime = expiryDate.getTime() - new Date().getTime();
            dispatch(actions.authenticate(token, userId, expTime));
        }
        tryLogin();
    }, [dispatch]);

    return (
        <NavigationContainer>
            {!isAuth
                ? <AuthNavigator />
                : <ShopNavigator />
            }
        </NavigationContainer>
    );
};