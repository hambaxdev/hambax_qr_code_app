import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        console.log('API_URL:', API_URL); // Добавьте это для отладки
    }, []);

    const handleLogin = async () => {
        try {
            console.log('Sending login request to:', `${API_URL}/api/auth/login`);
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            console.log('Login response:', response.data);
            await AsyncStorage.setItem('token', response.data.token);
            navigation.replace('Scan');
        } catch (error) {
            if (error.response) {
                console.error('Login error response data:', error.response.data);
                console.error('Login error response status:', error.response.status);
                console.error('Login error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Login error request:', error.request);
            } else {
                console.error('Login error message:', error.message);
            }
            console.error('Login error config:', error.config);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default LoginScreen;
