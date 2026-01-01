import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';

const EditExpenseScreen = ({ route, navigation }) => {
    const { userToken } = useContext(AuthContext);
    const { expenseId } = route.params;

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Other'];

    useEffect(() => {
        fetchExpense();
    }, []);

    const fetchExpense = async () => {
        try {
            const res = await axios.get(`/expenses/${expenseId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setTitle(res.data.title);
            setAmount(res.data.amount.toString());
            setCategory(res.data.category);
        } catch (e) {
            Alert.alert('Error', 'Failed to fetch expense details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateExpense = async () => {
        if (!title || !amount) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setSaving(true);
        try {
            await axios.put(`/expenses/${expenseId}`, {
                title,
                amount: parseFloat(amount),
                category,
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to update expense');
            console.log(e);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Lunch"
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g. 15.50"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Category</Text>
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

            <TouchableOpacity style={styles.button} onPress={handleUpdateExpense} disabled={saving}>
                <Text style={styles.buttonText}>{saving ? 'Updating...' : 'Update Expense'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    categoryChip: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    activeCategory: {
        backgroundColor: '#007BFF',
    },
    categoryText: {
        color: '#333',
    },
    activeCategoryText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditExpenseScreen;
