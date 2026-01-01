import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSecure, setIsSecure] = useState(true);
    const { login, isLoading } = useContext(AuthContext);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.logoContainer}>
                        <Animatable.View animation="bounceIn" duration={1500} style={styles.logoCircle}>
                            <Ionicons name="wallet" size={40} color={theme.colors.primary} />
                        </Animatable.View>
                        <Animatable.Text animation="fadeInDown" delay={500} style={styles.welcomeText}>Welcome Back</Animatable.Text>
                        <Animatable.Text animation="fadeInUp" delay={800} style={styles.subtitleText}>Manage your expenses</Animatable.Text>
                    </View>

                    <Animatable.View animation="fadeInUpBig" duration={1000} style={styles.formContainer}>
                        {/* Email Field */}
                        <Text style={styles.label}>Email Address</Text>
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

                        {/* Password Field */}
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

                        {/* Login Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.button, (!email || !password) && styles.buttonDisabled]}
                            onPress={() => login(email, password)}
                            disabled={!email || !password || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>LOGIN</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Social Login */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Ionicons name="logo-google" size={24} color={theme.colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
                            <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign up</Text></Text>
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

    logoContainer: { alignItems: 'center', marginBottom: 40 },
    logoCircle: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.surface,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
        elevation: 4, shadowColor: theme.colors.primary, shadowOpacity: 0.2, shadowRadius: 8
    },
    welcomeText: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8, fontFamily: theme.fonts.bold },
    subtitleText: { fontSize: 16, color: theme.colors.textSecondary, fontFamily: theme.fonts.regular },

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

    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
    divider: { flex: 1, height: 1, backgroundColor: theme.colors.border },
    dividerText: { marginHorizontal: 10, color: theme.colors.textTertiary },

    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 30 },
    socialBtn: {
        width: 48, height: 48, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border,
        justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface
    },

    footerLink: { alignItems: 'center' },
    linkText: { color: theme.colors.text, fontSize: 14 },
    linkBold: { color: theme.colors.primary, fontWeight: 'bold' }
});

export default LoginScreen;
