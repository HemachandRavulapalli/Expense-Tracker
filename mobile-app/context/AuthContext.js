import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/auth/login', { email, password });
            setUserInfo(res.data.user);
            setUserToken(res.data.token);
            await AsyncStorage.setItem('userToken', res.data.token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user));
        } catch (e) {
            console.log(e);
            alert('Login Failed: ' + (e.response?.data?.message || 'Something went wrong'));
        }
        setIsLoading(false);
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

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
