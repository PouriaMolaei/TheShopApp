import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ShopNavigator from './ShopNavigator';
import { NavigationActions } from 'react-navigation';

export default props => {
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.token);

    useEffect(() => {
        if (!isAuth) {
            navRef.current.dispatch(
                NavigationActions.navigate({ routeName: 'Auth' })
            );
        }
    }, [isAuth]);

    return <ShopNavigator ref={navRef} />;
};