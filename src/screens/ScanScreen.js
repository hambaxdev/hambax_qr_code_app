import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            console.log('Camera permission status:', status);
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        // setMessage('Scanning...');
        console.log('QR code scanned:', { type, data });

        try {
            const token = await AsyncStorage.getItem('token');
            console.log('Token retrieved from AsyncStorage:', token);

            const response = await axios.post(
                `${API_URL}/api/tickets/check_qr`,
                { qr_hash: data },
                { headers: { 'x-access-token': token } }
            );

            console.log('Response from API:', response.data);
            setMessage(response.data.message);

            // Показать зеленый экран на 1.5 секунды
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setScanned(false);
            }, 1500);
        } catch (error) {
            console.error('Error scanning QR code:', error);
            // setMessage('Error scanning QR code');
            

            // Показать красный экран на 1 секунду
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
                setScanned(false);
            }, 1000);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {showError ? (
                <View style={[styles.overlay, styles.errorContainer]}>
                    <Text style={styles.errorText}>Error</Text>
                </View>
            ) : showSuccess ? (
                <View style={[styles.overlay, styles.successContainer]}>
                    <Text style={styles.successText}>Success</Text>
                </View>
            ) : (
                <>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <Text style={styles.message}>{message}</Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: 'red',
    },
    errorText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    successContainer: {
        backgroundColor: 'green',
    },
    successText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ScanScreen;
