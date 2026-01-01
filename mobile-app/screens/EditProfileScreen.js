import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const EditProfileScreen = ({ navigation }) => {
    const { userToken, userInfo, updateUserInfo } = useContext(AuthContext);
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await axios.put('/auth/profile', { name, email }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            updateUserInfo(res.data); // Update context
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleUpdate} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color={theme.colors.primary} /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{name.charAt(0) || 'U'}</Text>
                    </View>
                    <TouchableOpacity style={styles.changePhotoBtn}>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
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
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface, paddingTop: 50
    },
    headerTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.text },
    saveText: { fontSize: 16, color: theme.colors.primary, fontWeight: 'bold' },

    content: { padding: 24 },
    avatarContainer: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16
    },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: theme.colors.primaryDark },
    changePhotoBtn: {},
    changePhotoText: { color: theme.colors.primary, fontSize: 14, fontWeight: '500' },

    label: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8,
        paddingHorizontal: 12, height: 56, marginBottom: 24
    },
    input: { flex: 1, color: theme.colors.text, fontSize: 16 },
});

export default EditProfileScreen;
