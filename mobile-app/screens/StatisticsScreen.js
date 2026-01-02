import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const screenWidth = Dimensions.get("window").width;

const StatisticsScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month'); // month, year
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // Mocking advanced analytics logic for now since backend endpoint might be simple
            // In a real app, this would hit /expenses/analytics?period=${period}
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

        // Group by Date for Line Chart (Last 5 days simple logic)
        // Sort by date first
        const sorted = expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        const chartData = sorted.slice(-5); // Last 5 txns/days

        const labels = chartData.map(e => new Date(e.date).getDate().toString());
        const dataPoints = chartData.map(e => e.amount);

        // Group by Category
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
        color: (opacity = 1) => `rgba(31, 136, 229, ${opacity})`, // Primary Blue
        strokeWidth: 2,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analytics</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Period Selector */}
                <View style={styles.periodParams}>
                    {['Week', 'Month', 'Year'].map(p => (
                        <TouchableOpacity
                            key={p}
                            style={[styles.periodChip, period === p.toLowerCase() && styles.periodActive]}
                            onPress={() => setPeriod(p.toLowerCase())}
                        >
                            <Text style={[styles.periodText, period === p.toLowerCase() && styles.periodTextActive]}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Spent</Text>
                        <Text style={styles.statValue}>₹{stats?.totalSpent.toFixed(0)}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Avg / Txn</Text>
                        <Text style={styles.statValue}>₹{stats?.average.toFixed(0)}</Text>
                    </View>
                </View>

                {/* Spending Trend Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.sectionTitle}>Spending Trend</Text>
                    <LineChart
                        data={stats?.graphData || { labels: [], datasets: [{ data: [0] }] }}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />
                </View>

                {/* Top Categories */}
                <Text style={styles.sectionTitle}>Top Categories</Text>
                <View style={styles.categoryRow}>
                    {stats?.categories?.length === 0 && <Text style={{ color: theme.colors.textSecondary }}>No data available</Text>}
                    {stats?.categories?.map((cat, index) => (
                        <View key={index} style={styles.categoryItem}>
                            <Text style={{ fontSize: 20 }}>🏷️</Text>
                            <Text style={styles.catName}>{cat.name}</Text>
                            <View style={styles.barContainer}>
                                <View style={[
                                    styles.barFill,
                                    { width: `${cat.percent}%`, backgroundColor: index % 2 === 0 ? theme.colors.primary : theme.colors.secondary }
                                ]} />
                            </View>
                            <Text style={styles.catAmount}>₹{cat.amount.toLocaleString()}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, backgroundColor: theme.colors.surface, elevation: 2, paddingTop: 50
    },
    headerTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.text },

    content: { padding: 20 },
    periodParams: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 12 },
    periodChip: {
        paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20,
        borderWidth: 1, borderColor: theme.colors.border
    },
    periodActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    periodText: { color: theme.colors.textSecondary, fontWeight: '500' },
    periodTextActive: { color: '#fff' },

    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: {
        width: '48%', backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, elevation: 2,
        alignItems: 'center'
    },
    statLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },

    chartCard: {
        backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 },
    chart: { marginVertical: 8, borderRadius: 16 },

    categoryRow: { marginTop: 0 },
    categoryItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        padding: 12, borderRadius: 12, marginBottom: 8, elevation: 1
    },
    catName: { width: 60, marginLeft: 10, fontWeight: '500' },
    barContainer: { flex: 1, height: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: 4, marginHorizontal: 10 },
    barFill: { height: '100%', borderRadius: 4 },
    catAmount: { fontWeight: 'bold', color: theme.colors.text }
});

export default StatisticsScreen;
