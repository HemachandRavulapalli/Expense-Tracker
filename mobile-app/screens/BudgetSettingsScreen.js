import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Education', 'Other'];

const BudgetSettingsScreen = ({ navigation }) => {
    const { userInfo, updateUserInfo, currency } = useContext(AuthContext);
    const theme = useAppTheme();

    const [totalBudget, setTotalBudget] = useState(userInfo?.monthlyBudget?.toString() || '0');
    const [catBudgets, setCatBudgets] = useState(userInfo?.categoryBudgets || {});
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserInfo({
                ...userInfo,
                monthlyBudget: parseFloat(totalBudget) || 0,
                categoryBudgets: catBudgets
            });
            if (Platform.OS === 'web') alert('Budgets saved successfully!');
            else Alert.alert('Success', 'Budgets saved successfully!');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to save budgets');
        } finally {
            setLoading(false);
        }
    };

    const updateCatBudget = (cat, val) => {
        setCatBudgets({ ...catBudgets, [cat]: parseFloat(val) || 0 });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Budget Settings</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overall Monthly Budget</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.currencyPrefix, { color: theme.colors.textSecondary }]}>{currency}</Text>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        value={totalBudget}
                        onChangeText={setTotalBudget}
                        keyboardType="numeric"
                        placeholder="Set limit..."
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Category-wise Limits</Text>
                {CATEGORIES.map(cat => (
                    <View key={cat} style={styles.catRow}>
                        <Text style={[styles.catName, { color: theme.colors.text }]}>{cat}</Text>
                        <View style={[styles.catInputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Text style={[styles.catCurrency, { color: theme.colors.textTertiary }]}>{currency}</Text>
                            <TextInput
                                style={[styles.catInput, { color: theme.colors.text }]}
                                value={catBudgets[cat]?.toString() || ''}
                                onChangeText={(val) => updateCatBudget(cat, val)}
                                keyboardType="numeric"
                                placeholder="None"
                                placeholderTextColor={theme.colors.textTertiary}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
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
    content: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', height: 60,
        borderRadius: 12, borderWidth: 1, paddingHorizontal: 15
    },
    currencyPrefix: { fontSize: 20, fontWeight: 'bold', marginRight: 10 },
    input: { flex: 1, fontSize: 18, fontWeight: 'bold' },
    catRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, backgroundColor: 'transparent'
    },
    catName: { fontSize: 15 },
    catInputContainer: {
        flexDirection: 'row', alignItems: 'center', width: 120, height: 45,
        borderRadius: 8, borderWidth: 1, paddingHorizontal: 10
    },
    catCurrency: { fontSize: 14, marginRight: 5 },
    catInput: { flex: 1, fontSize: 14, fontWeight: '500' }
});

export default BudgetSettingsScreen;
