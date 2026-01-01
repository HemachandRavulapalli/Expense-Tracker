import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import * as Animatable from 'react-native-animatable';
import { theme } from '../theme';

const AddExpenseScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Other');
    const [loading, setLoading] = useState(false);

    // Expanded category list
    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Rent', 'Other'];

    const handleAddExpense = async () => {
        if (!title || !amount) {
            Alert.alert('Missing Fields', 'Please fill in both title and amount.');
            return;
        }

        if (isNaN(parseFloat(amount))) {
            Alert.alert('Invalid Amount', 'Please enter a valid number.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/expenses', {
                title,
                amount: parseFloat(amount),
                category,
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            // Navigate back immediately on success
            navigation.goBack();

        } catch (e) {
            console.error("Add Expense Error", e);
            Alert.alert('Error', 'Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
                <Text style={styles.label}>TITLE</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="What did you buy?"
                    placeholderTextColor={theme.colors.textSecondary}
                    autoFocus={true}
                />

                <Text style={styles.label}>AMOUNT</Text>
                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <Text style={styles.label}>CATEGORY</Text>
                <View style={styles.categoryContainer}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryChip, category === cat && styles.activeCategory]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.categoryText, category === cat && styles.activeCategoryText]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity onPress={handleAddExpense} disabled={loading} activeOpacity={0.8} style={styles.saveBtn}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={styles.saveBtnText}>Save Transaction</Text>
                    )}
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'flex-start', padding: 20 },
    card: {
        backgroundColor: theme.colors.card, // Dark card
        padding: 25,
        borderRadius: 20,
        marginTop: 20
    },
    label: {
        fontSize: 12, fontWeight: '700', marginBottom: 8, color: theme.colors.textSecondary, letterSpacing: 0.5
    },
    input: {
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 25,
        color: '#fff',
        fontSize: 18,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30 },
    categoryChip: {
        paddingVertical: 10, paddingHorizontal: 16,
        backgroundColor: theme.colors.surface,
        borderRadius: 20, marginRight: 8, marginBottom: 10,
        borderWidth: 1, borderColor: theme.colors.border
    },
    activeCategory: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary
    },
    categoryText: { color: theme.colors.textSecondary, fontWeight: '500' },
    activeCategoryText: { color: '#fff', fontWeight: 'bold' },

    saveBtn: {
        backgroundColor: theme.colors.primary,
        padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddExpenseScreen;
