import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const ProfileScreen = ({ navigation }) => {
    const { logout, userInfo } = useContext(AuthContext);

    const handleExport = async () => {
        try {
            const result = await Share.share({
                message: `Expense Report for ${userInfo?.name || 'User'}: \n\n (Data would be attached here in production)`,
            });
            if (result.action === Share.sharedAction) {
                // Shared
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const handlePreferences = () => {
        Alert.alert("Preferences", "Settings module coming soon!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <Animatable.View animation="fadeInUp" style={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{userInfo?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={styles.name}>{userInfo?.name || 'User Name'}</Text>
                    <Text style={styles.email}>{userInfo?.email || 'user@example.com'}</Text>

                    <TouchableOpacity style={styles.editBadge} onPress={() => navigation.navigate('EditProfile')}>
                        <Ionicons name="pencil" size={14} color="#fff" />
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={handlePreferences}>
                        <Ionicons name="settings-outline" size={22} color={theme.colors.textSecondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Preferences</Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.border} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleExport}>
                        <Ionicons name="cloud-download-outline" size={22} color={theme.colors.textSecondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Export Data</Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.border} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 20 },
    headerTitle: { fontSize: 20, color: '#fff', fontFamily: theme.fonts.bold },

    content: { padding: 20, alignItems: 'center' },

    avatarContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
    avatarCircle: {
        width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center',
        marginBottom: 15, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border
    },
    avatarText: { fontSize: 40, color: '#fff', fontFamily: theme.fonts.bold },
    name: { fontSize: 24, color: '#fff', fontFamily: theme.fonts.bold },
    email: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 5, fontFamily: theme.fonts.regular },

    editBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 15
    },
    editText: { color: '#fff', marginLeft: 5, fontSize: 12, fontFamily: theme.fonts.bold },

    menuContainer: { width: '100%', marginBottom: 30 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card,
        padding: 16, borderRadius: 12, marginBottom: 12
    },
    menuIcon: { marginRight: 15 },
    menuText: { flex: 1, color: '#fff', fontSize: 16, fontFamily: theme.fonts.medium },

    logoutBtn: { width: '100%', padding: 18, borderRadius: 12, backgroundColor: '#1C1C1E', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.error },
    logoutText: { color: theme.colors.error, fontSize: 16, fontFamily: theme.fonts.bold }
});

export default ProfileScreen;
