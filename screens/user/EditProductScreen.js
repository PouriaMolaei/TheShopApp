import React, { useCallback, useEffect, useReducer } from 'react';
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
    const pid = props.navigation.getParam('pid');
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

    const submitProdHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert(
                'Wrong input!',
                'Please check the errors in the form.',
                [{ text: 'Okay' }]
            );
            return;
        }
        if (userProd) {
            dispatch(actions.updateProduct(
                pid,
                formState.inputValues.title,
                formState.inputValues.imageUrl,
                formState.inputValues.description,
            ));
        } else {
            dispatch(actions.createProduct(
                formState.inputValues.title,
                formState.inputValues.imageUrl,
                formState.inputValues.description,
                +formState.inputValues.price,
            ));
        }
        props.navigation.goBack();
    }, [dispatch, pid, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitProdHandler });
    }, [submitProdHandler]);

    const inputChangeHandler = useCallback((id, inputValue, inputIsValid) => {
        dispatchFormState({
            type: FORM_UPDATE,
            value: inputValue,
            input: id,
            isValid: inputIsValid
        })
    }, [dispatchFormState]);

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

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('pid')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName="md-checkmark"
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
});

export default EditProductScreen;