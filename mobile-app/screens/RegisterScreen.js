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
    const { register, isLoading } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>

                    <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
                        <Ionicons name="person-add-outline" size={60} color={theme.colors.secondary} />
                        <Text style={styles.title}>Create Account</Text>
                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={theme.colors.textSecondary}
                                placeholder="John Doe"
                            />
                        </View>

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
                            onPress={() => register(name, email, password)}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Log In</Text></Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    innerContainer: { flex: 1, padding: 24 },
    headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 15 },

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
        backgroundColor: theme.colors.secondary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    loginLink: { alignItems: 'center', marginTop: 30 },
    linkText: { color: theme.colors.textSecondary, fontSize: 14 },
    linkBold: { color: theme.colors.secondary, fontWeight: 'bold' },
});

export default RegisterScreen;
