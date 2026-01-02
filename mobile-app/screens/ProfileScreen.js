import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Modal, FlatList, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { requestNotificationPermissions } from '../utils/notifications';

const CURRENCIES = [
    { label: 'Indian Rupee', symbol: '₹', code: 'INR' },
    { label: 'US Dollar', symbol: '$', code: 'USD' },
    { label: 'Euro', symbol: '€', code: 'EUR' },
    { label: 'British Pound', symbol: '£', code: 'GBP' },
    { label: 'Japanese Yen', symbol: '¥', code: 'JPY' },
];

const ProfileScreen = ({ navigation }) => {
    const { logout, userInfo, updateUserInfo, currency, setCurrency, themeMode, setThemeMode } = useContext(AuthContext);
    const theme = useAppTheme();

    const [isDark, setIsDark] = useState(themeMode === 'dark');
    const [pushEnabled, setPushEnabled] = useState(userInfo?.pushNotificationsEnabled ?? true);
    const [budgetEnabled, setBudgetEnabled] = useState(userInfo?.budgetAlertEnabled ?? true);
    const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

    useEffect(() => {
        setIsDark(themeMode === 'dark');
    }, [themeMode]);

    const toggleSwitch = async (val, setFunc, key) => {
        if (key === 'pushNotificationsEnabled' && val) {
            const granted = await requestNotificationPermissions();
            if (!granted && Platform.OS !== 'web') {
                Alert.alert('Permission Rejected', 'Please enable notifications in your device settings.');
                return;
            }
        }

        // Local State Update for instant feedback
        if (key === 'theme') {
            const newTheme = val ? 'dark' : 'light';
            setThemeMode(newTheme);
            setIsDark(val);
        } else {
            setFunc(val);
        }

        // Sync with backend
        const updatePayload = { ...userInfo };
        if (key === 'theme') updatePayload.theme = val ? 'dark' : 'light';
        else updatePayload[key] = val;

        try {
            await updateUserInfo(updatePayload);
        } catch (e) {
            console.log("Toggle Switch Sync Failed", e);
        }
    };

    const handleSelectCurrency = (selected) => {
        setCurrency(selected.symbol);
        setCurrencyModalVisible(false);
        if (updateUserInfo) {
            updateUserInfo({ ...userInfo, currency: selected.symbol });
        }
    };

    const SettingItem = ({ icon, label, hasArrow, isToggle, value, onToggle, valueText }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={22} color={theme.colors.textSecondary} />
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {valueText && <Text style={{ marginRight: 10, color: theme.colors.primary, fontWeight: 'bold' }}>{valueText}</Text>}
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
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ position: 'absolute', left: 16, top: 45 }}>
                    <Ionicons name="menu-outline" size={32} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>ACCOUNT</Text>
                <TouchableOpacity
                    style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <View style={[styles.avatar, { backgroundColor: theme.colors.primaryLight }]}>
                        <Text style={[styles.avatarText, { color: theme.colors.primaryDark }]}>{userInfo?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.profileName, { color: theme.colors.text }]}>{userInfo?.name}</Text>
                        <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>{userInfo?.email}</Text>
                    </View>
                    <Ionicons name="pencil" size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>SECURITY</Text>
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('Security')}>
                        <SettingItem
                            icon="shield-checkmark-outline"
                            label="Change Password"
                            hasArrow
                        />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>APP PREFERENCES</Text>
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <SettingItem
                        icon="moon-outline"
                        label="Dark Theme"
                        isToggle
                        value={isDark}
                        onToggle={(val) => toggleSwitch(val, setIsDark, 'theme')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                    <TouchableOpacity onPress={() => setCurrencyModalVisible(true)}>
                        <SettingItem icon="cash-outline" label="Currency" valueText={currency} hasArrow />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>NOTIFICATIONS</Text>
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <SettingItem
                        icon="notifications-outline"
                        label="Push Notifications"
                        isToggle
                        value={pushEnabled}
                        onToggle={(val) => toggleSwitch(val, setPushEnabled, 'pushNotificationsEnabled')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
                    <SettingItem
                        icon="alert-circle-outline"
                        label="Budget Alert"
                        isToggle
                        value={budgetEnabled}
                        onToggle={(val) => toggleSwitch(val, setBudgetEnabled, 'budgetAlertEnabled')}
                    />
                </View>

                <TouchableOpacity
                    onPress={logout}
                    style={[styles.logoutBtn, { borderColor: theme.colors.error, borderWidth: 1 }]}
                >
                    <Text style={[styles.logoutText, { color: theme.colors.error }]}>LOGOUT</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={currencyModalVisible}
                onRequestClose={() => setCurrencyModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setCurrencyModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Currency</Text>
                        <FlatList
                            data={CURRENCIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.currencyOption, { borderBottomColor: theme.colors.border }]}
                                    onPress={() => handleSelectCurrency(item)}
                                >
                                    <Text style={[styles.currencySymbol, { color: theme.colors.primary }]}>{item.symbol}</Text>
                                    <Text style={[styles.currencyLabel, { color: theme.colors.text }]}>{item.label} ({item.code})</Text>
                                    {currency === item.symbol && (
                                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        padding: 16, elevation: 2, paddingTop: 50, height: 100
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionHeader: { fontSize: 12, marginBottom: 8, marginTop: 16, fontWeight: 'bold' },
    profileCard: {
        flexDirection: 'row', alignItems: 'center',
        padding: 16, borderRadius: 12, elevation: 1, marginBottom: 8, borderWidth: 1
    },
    avatar: {
        width: 48, height: 48, borderRadius: 24,
        justifyContent: 'center', alignItems: 'center', marginRight: 16
    },
    avatarText: { fontSize: 20, fontWeight: 'bold' },
    profileName: { fontSize: 16, fontWeight: 'bold' },
    profileEmail: { fontSize: 14 },
    card: { borderRadius: 12, elevation: 1, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingLabel: { fontSize: 16 },
    divider: { height: 1, marginLeft: 52 },
    logoutBtn: {
        borderRadius: 8, height: 48,
        justifyContent: 'center', alignItems: 'center', marginTop: 32
    },
    logoutText: { fontSize: 14, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
    },
    modalContent: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%'
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    currencyOption: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1
    },
    currencySymbol: { fontSize: 24, width: 40, fontWeight: 'bold' },
    currencyLabel: { flex: 1, fontSize: 16 }
});

export default ProfileScreen;
