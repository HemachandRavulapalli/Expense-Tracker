import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const SecurityScreen = ({ navigation }) => {
    const { changePassword } = useContext(AuthContext);
    const theme = useAppTheme();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return Alert.alert('Error', 'Please fill all fields');
        }
        if (newPassword !== confirmPassword) {
            return Alert.alert('Error', 'New passwords do not match');
        }
        if (newPassword.length < 6) {
            return Alert.alert('Error', 'Password must be at least 6 characters');
        }

        setLoading(true);
        const result = await changePassword(currentPassword, newPassword);
        setLoading(false);

        if (result.success) {
            if (Platform.OS === 'web') alert('Password updated successfully!');
            else Alert.alert('Success', 'Password updated successfully!');
            navigation.goBack();
        } else {
            Alert.alert('Error', result.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Security</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Current Password</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor={theme.colors.textTertiary}
                />

                <Text style={[styles.label, { color: theme.colors.text, marginTop: 20 }]}>New Password</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={theme.colors.textTertiary}
                />

                <Text style={[styles.label, { color: theme.colors.text, marginTop: 20 }]}>Confirm New Password</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor={theme.colors.textTertiary}
                />

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: theme.colors.primary }]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>UPDATE PASSWORD</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, paddingTop: 50, elevation: 2
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 25 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    input: {
        height: 55, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, fontSize: 16
    },
    btn: {
        height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 40, elevation: 3
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default SecurityScreen;
