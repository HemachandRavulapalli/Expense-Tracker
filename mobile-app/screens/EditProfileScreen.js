import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { theme } from '../theme';

const EditProfileScreen = ({ navigation }) => {
    const { userInfo, userToken, updateUserInfo } = useContext(AuthContext); // Assuming we add updateUserInfo to context or refresh
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await axios.put('/auth/profile', { name, email }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            // In a real app we'd update the global context state here.
            // For now, let's just assume success and alert.
            Alert.alert("Success", "Profile updated successfully");
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor={theme.colors.textSecondary}
            />

            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.btn} onPress={handleUpdate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Changes</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
    label: { color: theme.colors.textSecondary, fontFamily: theme.fonts.bold, fontSize: 12, marginBottom: 8, marginTop: 15 },
    input: {
        backgroundColor: theme.colors.card,
        color: '#fff',
        fontFamily: theme.fonts.medium,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    btn: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 40
    },
    btnText: {
        color: '#fff',
        fontFamily: theme.fonts.bold,
        fontSize: 16
    }
});

export default EditProfileScreen;
