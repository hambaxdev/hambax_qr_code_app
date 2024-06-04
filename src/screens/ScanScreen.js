import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setMessage('Scanning...');

        const token = await AsyncStorage.getItem('token');

        try {
            const response = await axios.post(
                `${API_URL}/api/tickets/check_qr`,
                { qr_hash: data },
                { headers: { 'x-access-token': token } }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error scanning QR code');
            console.error('Error scanning QR code', error);
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
            <Camera
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                barCodeScannerSettings={{
                    barCodeTypes: [Camera.Constants.BarCodeType.qr],
                }}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ScanScreen;
