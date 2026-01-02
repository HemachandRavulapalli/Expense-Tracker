import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const HistoryScreen = ({ navigation }) => {
    const { userToken, currency } = useContext(AuthContext);
    const theme = useAppTheme();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/expenses', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setExpenses(res.data.data.reverse());
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="receipt-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.amount, { color: theme.colors.error }]}>
                -{currency}{item.amount}
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ position: 'absolute', left: 16, top: 45 }}>
                    <Ionicons name="menu-outline" size={32} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Transaction History</Text>
            </View>
            {loading ? (
                <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                    <ActivityIndicator color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: theme.colors.textSecondary }}>No transactions found.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        padding: 16, paddingTop: 50, elevation: 2, alignItems: 'center', justifyContent: 'center', height: 100
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    card: {
        flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1
    },
    iconBox: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center'
    },
    title: { fontSize: 16, fontWeight: '500' },
    date: { fontSize: 12 },
    amount: { fontSize: 16, fontWeight: 'bold' }
});

export default HistoryScreen;
