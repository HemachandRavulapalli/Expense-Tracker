import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const EditExpenseScreen = ({ route, navigation }) => {
    const { userToken } = useContext(AuthContext);
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
                Alert.alert('Error', 'Could not load expense details.');
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
            Alert.alert('Error', 'Failed to update expense.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: 'destructive', onPress: async () => {
                        try {
                            await axios.delete(`/expenses/${expenseId}`, {
                                headers: { Authorization: `Bearer ${userToken}` }
                            });
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert("Error", "Failed to delete.");
                        }
                    }
                }
            ]
        );
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Expense</Text>
                <TouchableOpacity onPress={handleUpdate} disabled={saving}>
                    {saving ? <ActivityIndicator color={theme.colors.primary} /> : <Ionicons name="checkmark" size={28} color={theme.colors.primary} />}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Title */}
                <Text style={styles.label}>Title</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </View>

                {/* Amount */}
                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.prefix}>₹</Text>
                    <TextInput
                        style={[styles.input, { fontSize: 20, fontWeight: '500' }]}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* Categories */}
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.name}
                            style={[
                                styles.categoryCard,
                                category?.name === cat.name && styles.categorySelected
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Ionicons
                                name={cat.icon}
                                size={24}
                                color={category?.name === cat.name ? '#fff' : theme.colors.primary}
                            />
                            <Text style={[
                                styles.categoryText,
                                category?.name === cat.name && styles.categoryTextSelected
                            ]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.deleteBtnText}>DELETE EXPENSE</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface, elevation: 2, paddingTop: Platform.OS === 'ios' ? 50 : 16
    },
    cancelText: { color: theme.colors.primary, fontSize: 16 },
    headerTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.text },

    content: { padding: 20 },
    label: { fontSize: 14, color: theme.colors.text, marginBottom: 8, fontWeight: '500' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8,
        paddingHorizontal: 12, height: 56, marginBottom: 24
    },
    prefix: { fontSize: 20, color: theme.colors.textSecondary, marginRight: 8 },
    input: { flex: 1, color: theme.colors.text, fontSize: 16 },

    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    categoryCard: {
        width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12,
        backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border,
        borderRadius: 12, marginBottom: 12
    },
    categorySelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    categoryText: { marginLeft: 10, color: theme.colors.text },
    categoryTextSelected: { color: '#fff' },

    deleteBtn: {
        backgroundColor: theme.colors.error, height: 56, borderRadius: 8,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3, marginTop: 20
    },
    deleteBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default EditExpenseScreen;
