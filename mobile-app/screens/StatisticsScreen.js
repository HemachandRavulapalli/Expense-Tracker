import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const screenWidth = Dimensions.get("window").width;

const StatisticsScreen = ({ navigation }) => {
    const { userToken, currency } = useContext(AuthContext);
    const theme = useAppTheme();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/expenses', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            const expenses = res.data.data;
            processStats(expenses);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (expenses) => {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        const avg = total / (expenses.length || 1);
        const sorted = expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        const chartData = sorted.slice(-5);
        const labels = chartData.map(e => new Date(e.date).getDate().toString());
        const dataPoints = chartData.map(e => e.amount);

        const categoryMap = {};
        expenses.forEach(e => {
            categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
        });

        const categories = Object.keys(categoryMap).map(cat => ({
            name: cat,
            amount: categoryMap[cat],
            percent: (categoryMap[cat] / total) * 100
        })).sort((a, b) => b.amount - a.amount).slice(0, 5);

        setStats({
            totalSpent: total,
            average: avg,
            categories: categories,
            graphData: {
                labels: labels.length > 0 ? labels : ["-"],
                datasets: [{ data: dataPoints.length > 0 ? dataPoints : [0] }]
            }
        });
    };

    const chartConfig = {
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => theme.colors.text,
    };

    if (loading) return (
        <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator color={theme.colors.primary} />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ position: 'absolute', left: 16, top: 50 }}>
                    <Ionicons name="menu-outline" size={32} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Analytics</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.periodParams}>
                    {['Week', 'Month', 'Year'].map(p => (
                        <TouchableOpacity
                            key={p}
                            style={[
                                styles.periodChip,
                                { borderColor: theme.colors.border },
                                period === p.toLowerCase() && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                            ]}
                            onPress={() => setPeriod(p.toLowerCase())}
                        >
                            <Text style={[
                                styles.periodText,
                                { color: theme.colors.textSecondary },
                                period === p.toLowerCase() && { color: '#fff' }
                            ]}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.summaryRow}>
                    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Spent</Text>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>{currency}{stats?.totalSpent.toFixed(0)}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Avg / Txn</Text>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>{currency}{stats?.average.toFixed(0)}</Text>
                    </View>
                </View>

                <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Spending Trend</Text>
                    <LineChart
                        data={stats?.graphData || { labels: [], datasets: [{ data: [0] }] }}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Categories</Text>
                <View style={styles.categoryRow}>
                    {stats?.categories?.length === 0 && <Text style={{ color: theme.colors.textSecondary }}>No data available</Text>}
                    {stats?.categories?.map((cat, index) => (
                        <View key={index} style={[styles.categoryItem, { backgroundColor: theme.colors.surface }]}>
                            <Text style={{ fontSize: 20 }}>🏷️</Text>
                            <Text style={[styles.catName, { color: theme.colors.text }]}>{cat.name}</Text>
                            <View style={[styles.barContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                                <View style={[
                                    styles.barFill,
                                    { width: `${cat.percent}%`, backgroundColor: index % 2 === 0 ? theme.colors.primary : theme.colors.secondary }
                                ]} />
                            </View>
                            <Text style={[styles.catAmount, { color: theme.colors.text }]}>{currency}{cat.amount.toLocaleString()}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        padding: 16, elevation: 2, paddingTop: 50, height: 100
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    periodParams: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 12 },
    periodChip: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1 },
    periodText: { fontWeight: '500' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: { width: '48%', padding: 16, borderRadius: 12, elevation: 2, alignItems: 'center' },
    statLabel: { fontSize: 12, marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    chartCard: { borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    chart: { marginVertical: 8, borderRadius: 16 },
    categoryRow: { marginTop: 0 },
    categoryItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, elevation: 1 },
    catName: { width: 60, marginLeft: 10, fontWeight: '500' },
    barContainer: { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 10 },
    barFill: { height: '100%', borderRadius: 4 },
    catAmount: { fontWeight: 'bold' }
});

export default StatisticsScreen;
