import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => login(email, password)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>LOGIN</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                    <Text style={styles.linkText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    formContainer: { alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#333' },
    label: { alignSelf: 'flex-start', marginLeft: 10, marginTop: 10, color: '#666' },
    input: {
        width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        paddingHorizontal: 15, marginTop: 5, fontSize: 16
    },
    button: {
        width: '100%', height: 50, backgroundColor: '#1F88E5', borderRadius: 8,
        justifyContent: 'center', alignItems: 'center', marginTop: 20
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    linkText: { color: '#1F88E5' }
});

export default LoginScreen;
