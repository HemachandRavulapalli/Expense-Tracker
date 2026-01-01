import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const AddExpenseScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    // Expanded category list from spec
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

    const handleAddExpense = async () => {
        console.log("AddExpense: handleAddExpense called");
        console.log("Inputs:", { title, amount, category });

        if (!title || !amount || !category) {
            console.log("AddExpense: Validation Failed");
            if (Platform.OS === 'web') {
                alert('Missing Fields: Please fill in title, amount, and category.');
            } else {
                Alert.alert('Missing Fields', 'Please fill in title, amount, and category.');
            }
            return;
        }

        setLoading(true);
        try {
            console.log("AddExpense: Sending request...");
            const payload = {
                title,
                amount: parseFloat(amount),
                category: category.name,
                date: new Date().toISOString()
            };
            console.log("payload:", payload);

            await axios.post('/expenses', payload, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log("AddExpense: Success");
            navigation.goBack();
        } catch (e) {
            console.error("AddExpense: Error", e);
            if (Platform.OS === 'web') {
                alert('Error: Failed to add expense.');
            } else {
                Alert.alert('Error', 'Failed to add expense.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Expense</Text>
                <TouchableOpacity onPress={handleAddExpense} disabled={loading}>
                    {loading ? <ActivityIndicator color={theme.colors.primary} /> : <Ionicons name="checkmark" size={28} color={theme.colors.primary} />}
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
                        placeholder="Expense title..."
                        placeholderTextColor={theme.colors.textTertiary}
                        maxLength={60}
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
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={theme.colors.textTertiary}
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

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.disabledBtn]}
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
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface, elevation: 2, paddingTop: Platform.OS === 'ios' ? 50 : 16
    },
    cancelText: { color: theme.colors.primary, fontSize: 16, fontFamily: theme.fonts.medium },
    headerTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.text, fontFamily: theme.fonts.medium },

    content: { padding: 20 },
    label: { fontSize: 14, color: theme.colors.text, marginBottom: 8, fontWeight: '500', fontFamily: theme.fonts.medium },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8,
        paddingHorizontal: 12, height: 56, marginBottom: 24
    },
    prefix: { fontSize: 20, color: theme.colors.textSecondary, marginRight: 8 },
    input: { flex: 1, color: theme.colors.text, fontSize: 16, fontFamily: theme.fonts.regular },

    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    categoryCard: {
        width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12,
        backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border,
        borderRadius: 12, marginBottom: 12
    },
    categorySelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    categoryText: { marginLeft: 10, color: theme.colors.text, fontFamily: theme.fonts.medium },
    categoryTextSelected: { color: '#fff' },

    saveBtn: {
        backgroundColor: theme.colors.primary, height: 56, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center', elevation: 3
    },
    disabledBtn: { backgroundColor: theme.colors.textTertiary },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default AddExpenseScreen;
