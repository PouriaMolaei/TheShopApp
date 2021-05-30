import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Spinner from '../../components/UI/Spinner';

const FORM_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    switch (action.type) {
        case FORM_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            };
            let updatedFormValidity = true;
            for (const key in updatedValidities) {
                updatedFormValidity = updatedFormValidity && updatedValidities[key]
            };

            return {
                inputValues: updatedValues,
                inputValidities: updatedValidities,
                formIsValid: updatedFormValidity
            };

        default:
            return state;
    }
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const routeParams = props.route.params ? props.route.params : {};
    const pid = routeParams.pid;
    const userProd = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === pid)
    );

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: userProd ? userProd.title : '',
            imageUrl: userProd ? userProd.imageUrl : '',
            description: userProd ? userProd.description : '',
            price: ''
        },
        inputValidities: {
            title: userProd ? true : false,
            imageUrl: userProd ? true : false,
            description: userProd ? true : false,
            price: userProd ? true : false,
        },
        formIsValid: userProd ? true : false,
    });

    const submitProdHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert(
                'Wrong input!',
                'Please check the errors in the form.',
                [{ text: 'Okay' }]
            );
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (userProd) {
                await dispatch(actions.updateProduct(
                    pid,
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    formState.inputValues.description,
                ));
            } else {
                await dispatch(actions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    formState.inputValues.description,
                    +formState.inputValues.price,
                ));
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, pid, formState]);

    useEffect(() => {
        if (error) {
            Alert.alert(
                'An error occurred!',
                error,
                [{ text: 'Okay' }]
            );
        };
    }, [error]);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title="Save"
                        iconName="md-checkmark"
                        onPress={submitProdHandler}
                    />
                </HeaderButtons>
            )
        });
    }, [submitProdHandler]);

    const inputChangeHandler = useCallback((id, inputValue, inputIsValid) => {
        dispatchFormState({
            type: FORM_UPDATE,
            value: inputValue,
            input: id,
            isValid: inputIsValid
        })
    }, [dispatchFormState]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title!'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        initialValue={userProd ? userProd.title : ''}
                        initiallyValid={!!userProd}
                        required
                        onInputChange={inputChangeHandler}
                    />
                    <Input
                        id='imageUrl'
                        label='Image URL'
                        errorText='Please enter a valid image url!'
                        returnKeyType='next'
                        initialValue={userProd ? userProd.imageUrl : ''}
                        initiallyValid={!!userProd}
                        required
                        onInputChange={inputChangeHandler}
                    />
                    {
                        !pid ?
                            <Input
                                id='price'
                                label='Price'
                                errorText='Please enter a valid price!'
                                keyboardType='decimal-pad'
                                returnKeyType='next'
                                initialValue=''
                                required
                                min={0.1}
                                onInputChange={inputChangeHandler}
                            />
                            : null
                    }
                    <Input
                        id='description'
                        label='Description'
                        errorText='Please enter a valid description!'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        initialValue={userProd ? userProd.description : ''}
                        initiallyValid={!!userProd}
                        required
                        minLength={5}
                        onInputChange={inputChangeHandler}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const screenOptions = navData => {
    const routeParams = navData.route.params ? navData.route.params : {};
    return {
        headerTitle: routeParams.pid
            ? 'Edit Product'
            : 'Add Product',
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
});

export default EditProductScreen;