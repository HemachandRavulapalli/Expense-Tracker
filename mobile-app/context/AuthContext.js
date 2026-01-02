import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosConfig';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [themeMode, setThemeMode] = useState('light');
    const [currency, setCurrency] = useState('₹');

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/auth/login', { email, password });
            const user = res.data.user;
            const token = res.data.token;

            setUserInfo(user);
            setUserToken(token);

            if (user.theme) setThemeMode(user.theme === 'dark' ? 'dark' : 'light');
            if (user.currency) setCurrency(user.currency);

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        } catch (e) {
            console.log("Login Error Detailed:", e.message, e.code, e.config?.url);
            const debugInfo = e.message === 'Network Error' ? '\n(Make sure your phone is on the same WiFi and firewall is off)' : '';
            Alert.alert('Login Failed', (e.response?.data?.message || e.message || 'Something went wrong') + debugInfo);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/auth/register', { name, email, password });
            const user = res.data.user;
            const token = res.data.token;

            setUserInfo(user);
            setUserToken(token);

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        } catch (e) {
            console.log("Register Error:", e);
            Alert.alert('Registration Failed', e.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUserToken(null);
        setUserInfo(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userInfo');
    };

    const updateUserInfo = async (newUser) => {
        try {
            // Get token from state or storage if missing
            let token = userToken;
            if (!token) {
                token = await AsyncStorage.getItem('userToken');
            }

            if (!token) {
                console.log("UpdateUserInfo: No token found");
                return;
            }

            const res = await axios.put('/auth/profile', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updated = res.data;
            const { token: newToken, ...infoWithoutToken } = updated;

            const mergedInfo = { ...userInfo, ...infoWithoutToken };
            setUserInfo(mergedInfo);

            if (newToken) {
                setUserToken(newToken);
                await AsyncStorage.setItem('userToken', newToken);
            }

            if (updated.theme) setThemeMode(updated.theme === 'dark' ? 'dark' : 'light');
            if (updated.currency) setCurrency(updated.currency);

            await AsyncStorage.setItem('userInfo', JSON.stringify(mergedInfo));
        } catch (e) {
            console.log("Update Profile Error:", e.response?.status, e.response?.data);
            if (e.response?.status === 401) {
                Alert.alert("Session Expired", "Please login again.");
                logout();
            }
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            let token = userToken || await AsyncStorage.getItem('userToken');
            await axios.put('/auth/change-password', { currentPassword, newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true };
        } catch (e) {
            return { success: false, message: e.response?.data?.message || "Failed to change password" };
        }
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const info = await AsyncStorage.getItem('userInfo');

            if (token && info) {
                // Try silent refresh/verify
                try {
                    const res = await axios.get('/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // If success, we got a fresh token and user data
                    const { user, token: newToken } = res.data;

                    setUserToken(newToken);
                    setUserInfo(user);

                    if (user.theme) setThemeMode(user.theme === 'dark' ? 'dark' : 'light');
                    if (user.currency) setCurrency(user.currency);

                    await AsyncStorage.setItem('userToken', newToken);
                    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
                } catch (verifyError) {
                    console.log("Token verification failed. URL:", verifyError.config?.url, "Error:", verifyError.message);
                    // Fallback to cached data if offline or verification fails (but doesn't 401)
                    if (verifyError.response?.status === 401) {
                        // Token truly dead
                        logout();
                    } else {
                        const parsedInfo = JSON.parse(info);
                        setUserToken(token);
                        setUserInfo(parsedInfo);
                        if (parsedInfo.theme) setThemeMode(parsedInfo.theme === 'dark' ? 'dark' : 'light');
                        if (parsedInfo.currency) setCurrency(parsedInfo.currency);
                    }
                }
            }
        } catch (e) {
            console.log('isLoggedIn Error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{
            login, register, logout,
            isLoading, userToken, userInfo, updateUserInfo, changePassword,
            themeMode, setThemeMode,
            currency, setCurrency
        }}>
            {children}
        </AuthContext.Provider>
    );
};
