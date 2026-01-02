import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { sendLocalNotification } from '../utils/notifications';

const AddExpenseScreen = ({ navigation }) => {
    const { userToken, currency, userInfo } = useContext(AuthContext);
    const theme = useAppTheme();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = [
        { name: 'Food', icon: 'fast-food' },
        { name: 'Transport', icon: 'car' },
        { name: 'Entertainment', icon: 'film' },
        { name: 'Shopping', icon: 'cart' },
        { name: 'Utilities', icon: 'bulb' },
        { name: 'Health', icon: 'medkit' },
        { name: 'Education', icon: 'school' },
        { name: 'Other', icon: 'ellipsis-horizontal-circle' }
    ];

    const checkBudgets = async (expenseAmount, expenseCategory) => {
        try {
            const res = await axios.get('/expenses/summary', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            const summary = res.data.summary;
            const currentTotal = summary.totalSpent || 0;
            const currentCatTotal = summary.categoryBreakdown?.[expenseCategory]?.total || 0;

            const monthlyLimit = userInfo?.monthlyBudget || 0;
            const categoryLimit = userInfo?.categoryBudgets?.[expenseCategory] || 0;

            // Check Overall Budget
            if (monthlyLimit > 0 && (currentTotal + expenseAmount) > monthlyLimit) {
                sendLocalNotification(
                    "Monthly Budget Exceeded! ⚠️",
                    `Adding this will put you at ${currency}${currentTotal + expenseAmount}, which is over your ${currency}${monthlyLimit} limit.`
                );
            }

            // Check Category Budget
            if (categoryLimit > 0 && (currentCatTotal + expenseAmount) > categoryLimit) {
                sendLocalNotification(
                    `${expenseCategory} Limit Reached! 🏷️`,
                    `You've spent ${currency}${currentCatTotal + expenseAmount} on ${expenseCategory}, exceeding your ${currency}${categoryLimit} cap.`
                );
            }
        } catch (e) {
            console.log("Budget check failed", e);
        }
    };

    const handleAddExpense = async () => {
        if (!title || !amount || !category) {
            Platform.OS === 'web' ? alert('Missing Fields') : Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }

        const expenseAmount = parseFloat(amount);
        setLoading(true);
        try {
            const payload = {
                title,
                amount: expenseAmount,
                category: category.name,
                date: new Date().toISOString()
            };

            // Check budgets before final save (or after, but notifications are for user)
            if (userInfo?.budgetAlertEnabled) {
                await checkBudgets(expenseAmount, category.name);
            }

            await axios.post('/expenses', payload, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            if (userInfo?.pushNotificationsEnabled) {
                sendLocalNotification(
                    "Expense Added ✅",
                    `Saved "${title}" for ${currency}${expenseAmount}.`
                );
            }

            navigation.goBack();
        } catch (e) {
            const errMsg = e.response?.data?.error || e.message || 'Failed to add expense';
            Platform.OS === 'web' ? alert('Error: ' + errMsg) : Alert.alert('Error', errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add Expense</Text>
                <TouchableOpacity onPress={handleAddExpense} disabled={loading}>
                    {loading ? <ActivityIndicator color={theme.colors.primary} /> : <Ionicons name="checkmark" size={28} color={theme.colors.primary} />}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Expense title..."
                        placeholderTextColor={theme.colors.textTertiary}
                        maxLength={60}
                    />
                </View>

                <Text style={[styles.label, { color: theme.colors.text }]}>Amount</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.prefix, { color: theme.colors.textSecondary }]}>{currency}</Text>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>

                <Text style={[styles.label, { color: theme.colors.text }]}>Category</Text>
                <View style={styles.categoryGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.name}
                            style={[
                                styles.categoryCard,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                                category?.name === cat.name && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Ionicons
                                name={cat.icon}
                                size={22}
                                color={category?.name === cat.name ? '#fff' : theme.colors.primary}
                            />
                            <Text style={[
                                styles.categoryText,
                                { color: theme.colors.text },
                                category?.name === cat.name && { color: '#fff' }
                            ]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.colors.primary }, loading && { backgroundColor: theme.colors.textTertiary }]}
                    onPress={handleAddExpense}
                    disabled={loading}
                >
                    <Text style={styles.saveBtnText}>SAVE EXPENSE</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, elevation: 2, paddingTop: Platform.OS === 'ios' ? 50 : 30
    },
    cancelText: { fontSize: 16 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 56, marginBottom: 24
    },
    prefix: { fontSize: 20, marginRight: 8 },
    input: { flex: 1, fontSize: 16 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    categoryCard: {
        width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12,
        borderWidth: 1, borderRadius: 12, marginBottom: 12
    },
    categoryText: { marginLeft: 10, fontSize: 13, fontWeight: '500' },
    saveBtn: {
        height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 3, marginTop: 10
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default AddExpenseScreen;
