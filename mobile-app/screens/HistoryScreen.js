import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const HistoryScreen = () => {
    const { userToken, currency, themeMode } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const isDark = themeMode === 'dark';
    const bgColor = isDark ? '#121212' : theme.colors.background;
    const textColor = isDark ? '#FFF' : theme.colors.text;
    const cardColor = isDark ? '#1E1E1E' : theme.colors.surface;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/expenses', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            // Reverse to show newest first
            setExpenses(res.data.data.reverse());
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.iconBox}>
                <Ionicons name="receipt-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.amount, { color: theme.colors.error }]}>
                -{currency}{item.amount}
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={[styles.header, { backgroundColor: cardColor }]}>
                <Text style={[styles.headerTitle, { color: textColor }]}>History</Text>
            </View>
            {loading ? (
                <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>
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
        padding: 16, paddingTop: 50, elevation: 2, alignItems: 'center', justifyContent: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    card: {
        flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1
    },
    iconBox: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center', alignItems: 'center'
    },
    title: { fontSize: 16, fontWeight: '500' },
    date: { fontSize: 12, color: '#888' },
    amount: { fontSize: 16, fontWeight: 'bold' }
});

export default HistoryScreen;
