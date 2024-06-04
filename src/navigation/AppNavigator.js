// src/navigation/AppNavigator.js

import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import ScanScreen from '../screens/ScanScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const navigationRef = useRef();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigationRef.current?.navigate('Scan');
            }
        };
        checkToken();
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
