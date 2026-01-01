import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const ProfileScreen = ({ navigation }) => {
    const { logout, userInfo, updateUserInfo } = useContext(AuthContext);

    // Local State (initialized from userInfo if available, else defaults)
    const [isDark, setIsDark] = useState(userInfo?.theme === 'dark');
    const [pushEnabled, setPushEnabled] = useState(userInfo?.pushNotificationsEnabled ?? true);
    const [budgetEnabled, setBudgetEnabled] = useState(userInfo?.budgetAlertEnabled ?? true);

    const toggleSwitch = (val, setFunc, key) => {
        setFunc(val);
        // Update Context/Storage
        if (updateUserInfo) {
            updateUserInfo({ ...userInfo, [key]: val });
        }
    };

    const handleExport = () => {
        Alert.alert("Export Data", "Your expenses have been exported to CSV (Mock). Check your email.");
    };

    const SettingItem = ({ icon, label, hasArrow, isToggle, value, onToggle }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={24} color={theme.colors.textSecondary} />
                <Text style={styles.settingLabel}>{label}</Text>
            </View>
            {isToggle ? (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                    thumbColor={value ? theme.colors.primary : '#f4f3f4'}
                />
            ) : (
                hasArrow && <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Account Section */}
                <Text style={styles.sectionHeader}>ACCOUNT</Text>
                <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('EditProfile')}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userInfo?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>{userInfo?.name}</Text>
                        <Text style={styles.profileEmail}>{userInfo?.email}</Text>
                    </View>
                    <Ionicons name="pencil" size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                {/* Preferences */}
                <Text style={styles.sectionHeader}>APP PREFERENCES</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="moon-outline"
                        label="Dark Theme"
                        isToggle
                        value={isDark}
                        onToggle={(val) => toggleSwitch(val, setIsDark, 'theme')}
                    />
                    <View style={styles.divider} />
                    <SettingItem icon="cash-outline" label="Currency (₹)" hasArrow />
                </View>

                {/* Notifications */}
                <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="notifications-outline"
                        label="Push Notifications"
                        isToggle
                        value={pushEnabled}
                        onToggle={(val) => toggleSwitch(val, setPushEnabled, 'pushNotificationsEnabled')}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon="alert-circle-outline"
                        label="Budget Alert"
                        isToggle
                        value={budgetEnabled}
                        onToggle={(val) => toggleSwitch(val, setBudgetEnabled, 'budgetAlertEnabled')}
                    />
                </View>

                {/* Data & Privacy */}
                <Text style={styles.sectionHeader}>DATA & PRIVACY</Text>
                <View style={styles.card}>
                    <TouchableOpacity onPress={handleExport}>
                        <SettingItem icon="cloud-download-outline" label="Export Data" hasArrow />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <SettingItem icon="document-text-outline" label="Privacy Policy" hasArrow />
                </View>

                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, backgroundColor: theme.colors.surface, elevation: 2, paddingTop: 50
    },
    headerTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.text, fontFamily: theme.fonts.medium },

    content: { padding: 20 },
    sectionHeader: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8, marginTop: 16, fontWeight: 'bold' },

    profileCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        padding: 16, borderRadius: 12, elevation: 1, marginBottom: 8
    },
    avatar: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center', alignItems: 'center', marginRight: 16
    },
    avatarText: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primaryDark },
    profileName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
    profileEmail: { fontSize: 14, color: theme.colors.textSecondary },

    card: { backgroundColor: theme.colors.surface, borderRadius: 12, elevation: 1, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingLabel: { fontSize: 16, color: theme.colors.text, fontFamily: theme.fonts.regular },
    divider: { height: 1, backgroundColor: theme.colors.divider, marginLeft: 52 },

    logoutBtn: {
        backgroundColor: theme.colors.error, borderRadius: 8, height: 48,
        justifyContent: 'center', alignItems: 'center', marginTop: 32, marginBottom: 20
    },
    logoutText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});

export default ProfileScreen;
