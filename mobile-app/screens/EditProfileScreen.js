import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const EditProfileScreen = ({ navigation }) => {
    const { userInfo, updateUserInfo } = useContext(AuthContext);
    const theme = useAppTheme();
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateUserInfo({ ...userInfo, name, email });
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleUpdate} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color={theme.colors.primary} /> : <Text style={[styles.saveText, { color: theme.colors.primary }]}>Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.primaryLight }]}>
                        <Text style={[styles.avatarText, { color: theme.colors.primaryDark }]}>{name.charAt(0) || 'U'}</Text>
                    </View>
                </View>

                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Full Name</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>

                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Email Address</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, paddingTop: 50
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    saveText: { fontSize: 16, fontWeight: 'bold' },
    content: { padding: 24 },
    avatarContainer: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16
    },
    avatarText: { fontSize: 40, fontWeight: 'bold' },
    label: { fontSize: 14, marginBottom: 8, marginLeft: 4 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 56, marginBottom: 24
    },
    input: { flex: 1, fontSize: 16 },
});

export default EditProfileScreen;
