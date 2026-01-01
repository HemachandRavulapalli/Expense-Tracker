import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../theme';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSecure, setIsSecure] = useState(true);
    const { register, isLoading } = useContext(AuthContext);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, top: 0 }}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start tracking expenses</Text>
                    </View>

                    <Animatable.View animation="fadeInUpBig" duration={1000} style={styles.formContainer}>
                        {/* Full Name */}
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                                placeholderTextColor={theme.colors.textTertiary}
                            />
                        </View>

                        {/* Email */}
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputContainer, isValidEmail(email) && { borderColor: theme.colors.primary }]}>
                            <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.colors.textTertiary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password */}
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter password"
                                placeholderTextColor={theme.colors.textTertiary}
                                secureTextEntry={isSecure}
                            />
                            <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                                <Ionicons name={isSecure ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.button, (!name || !email || !password) && styles.buttonDisabled]}
                            onPress={() => register(name, email, password)}
                            disabled={!name || !email || !password || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
                            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Login</Text></Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },

    headerContainer: { marginBottom: 32, marginTop: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginTop: 40, fontFamily: theme.fonts.bold },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, fontFamily: theme.fonts.regular },

    formContainer: { width: '100%' },
    label: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4, fontFamily: theme.fonts.medium },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8,
        paddingHorizontal: 12, height: 56, marginBottom: 20
    },
    input: { flex: 1, color: theme.colors.text, fontSize: 16, fontFamily: theme.fonts.regular },

    button: {
        backgroundColor: theme.colors.primary, height: 48, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 3
    },
    buttonDisabled: { backgroundColor: theme.colors.textTertiary, elevation: 0 },
    buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },

    footerLink: { alignItems: 'center', marginTop: 30 },
    linkText: { color: theme.colors.text, fontSize: 14 },
    linkBold: { color: theme.colors.primary, fontWeight: 'bold' }
});

export default RegisterScreen;
