import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Global App Preferences
    const [themeMode, setThemeMode] = useState('light'); // 'light' or 'dark'
    const [currency, setCurrency] = useState('₹'); // Default INR

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/auth/login', { email, password });
            const user = res.data.user;
            setUserInfo(user);
            setUserToken(res.data.token);

            // Set User Preferences
            setThemeMode(user.theme === 'dark' ? 'dark' : 'light');
            setCurrency(user.currency === 'USD' ? '$' : '₹'); // Simple logic for now

            await AsyncStorage.setItem('userToken', res.data.token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        } catch (e) {
            console.log(e);
            alert('Login Failed: ' + (e.response?.data?.message || 'Something went wrong'));
        }
        setIsLoading(false);
    };

    const updateUserInfo = async (newUser) => {
        setUserInfo(newUser);
        setThemeMode(newUser.theme === 'dark' ? 'dark' : 'light');
        // Update currency if we add it to user model fully later
        await AsyncStorage.setItem('userInfo', JSON.stringify(newUser));
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');

            if (userToken && userInfo) {
                userInfo = JSON.parse(userInfo);
                setUserToken(userToken);
                setUserInfo(userInfo);
                setThemeMode(userInfo.theme === 'dark' ? 'dark' : 'light');
            }
            setIsLoading(false);
        } catch (e) {
            console.log('isLogged in error ' + e);
        }
    };

    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/auth/register', { name, email, password });
            setUserInfo(res.data.user);
            setUserToken(res.data.token);
            await AsyncStorage.setItem('userToken', res.data.token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user));
        } catch (e) {
            console.log(e);
            alert('Registration Failed: ' + (e.response?.data?.message || 'Something went wrong'));
        }
        setIsLoading(false);
    };

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if (userToken) {
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            setIsLoading(false);
        } catch (e) {
            console.log('isLogged in error ' + e);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const updateUserInfo = async (newUser) => {
        setUserInfo(newUser);
        await AsyncStorage.setItem('userInfo', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{
            login, register, logout,
            isLoading, userToken, userInfo, updateUserInfo,
            themeMode, setThemeMode,
            currency, setCurrency
        }}>
            {children}
        </AuthContext.Provider>
    );
};
