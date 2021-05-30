import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Alert
} from 'react-native';
import { Button } from 'react-native-elements'
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions/auth';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../contants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from '../../components/UI/Spinner';

const FORM_UPDATE = 'UPDATE';
const SUBMIT_START = 'SUBMIT_START';
const SUBMIT_END = 'SUBMIT_END';

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
                updatedFormValidity = updatedFormValidity && updatedValidities[key];
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

const submitReducer = (state, action) => {
    switch (action.type) {
        case SUBMIT_START:
            return {
                isLoading: true,
                error: null
            };

        case SUBMIT_END:
            return {
                isLoading: false,
                error: action.error
            };

        default:
            return state;
    }
};

const AuthScreen = props => {
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { navigate } = props.navigation;

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    const [submitState, dispatchSubState] = useReducer(submitReducer, {
        isLoading: false,
        error: null
    });

    const inputChangeHandler = useCallback((id, inputValue, inputIsValid) => {
        dispatchFormState({
            type: FORM_UPDATE,
            input: id,
            value: inputValue,
            isValid: inputIsValid
        })
    }, [dispatchFormState]);

    const dispatch = useDispatch();

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = actions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            );
        } else {
            action = actions.login(
                formState.inputValues.email,
                formState.inputValues.password
            );
        };
        try {
            dispatchSubState({ type: SUBMIT_START });
            // navigate('Shop');
            await dispatch(action);
        } catch (err) {
            dispatchSubState({ type: SUBMIT_END, error: err.message });
        };
    };

    useEffect(() => {
        if (submitState.error) {
            Alert.alert(
                'An Error Occurred!',
                submitState.error,
                [{ text: 'Okay' }]
            );
        };
    }, [submitState.error]);

    return (
        <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            errorText="Please enter a valid email address."
                            initialValue=""
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onInputChange={inputChangeHandler}
                            required
                            email
                        />
                        <Input
                            id="password"
                            label="Password"
                            errorText="Please enter a valid password."
                            initialValue=""
                            keyboardType="default"
                            secureTextEntry
                            autoCapitalize="none"
                            onInputChange={inputChangeHandler}
                            required
                            minLength={5}
                        />
                        <View style={styles.btnContainer}>
                            <Button
                                title={isSignup ? 'Sign Up' : 'Login'}
                                buttonStyle={{ backgroundColor: Colors.primary }}
                                onPress={authHandler}
                                loading={submitState.isLoading}
                            />
                        </View>
                        <View style={styles.btnContainer}>
                            <Button
                                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                buttonStyle={{ backgroundColor: Colors.accent }}
                                onPress={() => setIsSignup(prevState => !prevState)}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export const screenOptions = {
    headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    btnContainer: {
        marginTop: 10
    }
});

export default AuthScreen;