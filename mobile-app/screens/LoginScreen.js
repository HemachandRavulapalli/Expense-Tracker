import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>

                <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
                    <Ionicons name="wallet-outline" size={60} color={theme.colors.primary} />
                    <Text style={styles.title}>Expense<Text style={{ color: theme.colors.primary }}>Track</Text></Text>
                    <Text style={styles.subtitle}>Manage your finances simply.</Text>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholderTextColor={theme.colors.textSecondary}
                            placeholder="name@example.com"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor={theme.colors.textSecondary}
                            placeholder="••••••••"
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={() => login(email, password)}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
                        <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
                    </TouchableOpacity>
                </Animatable.View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    innerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
    headerContainer: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 15 },
    subtitle: { color: theme.colors.textSecondary, fontSize: 16, marginTop: 5 },

    formContainer: { width: '100%' },
    inputGroup: { marginBottom: 20 },
    label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    input: {
        backgroundColor: theme.colors.card,
        color: '#fff',
        padding: 18,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colors.border
    },

    button: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    registerLink: { alignItems: 'center', marginTop: 30 },
    linkText: { color: theme.colors.textSecondary, fontSize: 14 },
    linkBold: { color: theme.colors.primary, fontWeight: 'bold' },
});

export default LoginScreen;
