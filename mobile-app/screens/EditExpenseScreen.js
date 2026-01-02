import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const EditExpenseScreen = ({ route, navigation }) => {
    const { userToken, currency } = useContext(AuthContext);
    const theme = useAppTheme();
    const { expenseId } = route.params;

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const res = await axios.get(`/expenses/${expenseId}`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                const exp = res.data.expense;
                setTitle(exp.title);
                setAmount(exp.amount.toString());
                const cat = categories.find(c => c.name === exp.category) || { name: exp.category, icon: 'pricetag' };
                setCategory(cat);
            } catch (e) {
                Platform.OS === 'web' ? alert('Error loading expense') : Alert.alert('Error', 'Could not load expense details.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchExpense();
    }, [expenseId]);

    const handleUpdate = async () => {
        if (!title || !amount || !category) return;

        setSaving(true);
        try {
            await axios.put(`/expenses/${expenseId}`, {
                title,
                amount: parseFloat(amount),
                category: category.name
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            navigation.goBack();
        } catch (e) {
            Platform.OS === 'web' ? alert('Error updating') : Alert.alert('Error', 'Failed to update expense.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const performDelete = async () => {
            try {
                await axios.delete(`/expenses/${expenseId}`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                navigation.goBack();
            } catch (e) {
                Platform.OS === 'web' ? alert('Error deleting') : Alert.alert("Error", "Failed to delete.");
            }
        };

        if (Platform.OS === 'web') {
            if (confirm("Are you sure you want to delete this expense?")) {
                performDelete();
            }
        } else {
            Alert.alert(
                "Delete Expense",
                "Are you sure you want to delete this expense?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: 'destructive', onPress: performDelete }
                ]
            );
        }
    };

    if (loading) return (
        <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator color={theme.colors.primary} />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Expense</Text>
                <TouchableOpacity onPress={handleUpdate} disabled={saving}>
                    {saving ? <ActivityIndicator color={theme.colors.primary} /> : <Ionicons name="checkmark" size={28} color={theme.colors.primary} />}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>

                <Text style={[styles.label, { color: theme.colors.text }]}>Amount</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.prefix, { color: theme.colors.textSecondary }]}>{currency}</Text>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }]}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
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

                <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: theme.colors.error }]} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.deleteBtnText}>DELETE EXPENSE</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    deleteBtn: {
        height: 56, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3, marginTop: 10
    },
    deleteBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default EditExpenseScreen;
