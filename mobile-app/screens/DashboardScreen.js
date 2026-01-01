import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
    const { userToken, userInfo } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setRefreshing(true);

            // Fetch Recent Expenses
            const expenseRes = await axios.get('/expenses?limit=5', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setExpenses(expenseRes.data.data);

            // Fetch Summary
            const summaryRes = await axios.get('/expenses/summary', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setSummary(summaryRes.data.summary);

        } catch (e) {
            console.log(e);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const chartConfig = {
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
    };

    // Safe chart data preparation
    const chartData = summary && summary.categoryBreakdown
        ? Object.keys(summary.categoryBreakdown).map((key, index) => ({
            name: key,
            population: summary.categoryBreakdown[key].total,
            color: theme.colors.chartColors[index % theme.colors.chartColors.length],
            legendFontColor: theme.colors.textSecondary,
            legendFontSize: 12
        }))
        : [];

    const renderItem = ({ item, index }) => (
        <Animatable.View animation="fadeInUp" duration={400} delay={index * 100}>
            <TouchableOpacity
                style={styles.expenseItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('EditExpense', { expenseId: item._id })}
            >
                <View style={[styles.iconContainer]}>
                    <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.expenseTitle}>{item.title}</Text>
                    <Text style={styles.expenseCategory}>{item.category} • {new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            {/* App Bar */}
            <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                style={styles.header}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => { }}>
                        <Ionicons name="menu" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Expense Tracker</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={styles.profileIcon}>
                            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{userInfo?.name?.charAt(0) || 'U'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <FlatList
                data={expenses}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor={theme.colors.primary} />
                }
                ListHeaderComponent={
                    <View style={{ padding: 20 }}>
                        {/* Total Spent Card */}
                        <LinearGradient
                            colors={[theme.colors.secondary, theme.colors.secondaryDark]}
                            style={styles.totalCard}
                        >
                            <Text style={styles.totalLabel}>Total Spent This Month</Text>
                            <Text style={styles.totalAmount}>₹ {summary?.totalSpent?.toFixed(2) || '0.00'}</Text>
                            <View style={styles.trendContainer}>
                                <Ionicons name="arrow-down" size={16} color={theme.colors.surface} />
                                <Text style={styles.trendText}>12% from last month</Text>
                            </View>
                        </LinearGradient>

                        {/* Quick Stats Row (Mock for now, could be dynamic) */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Ionicons name="fast-food" size={24} color={theme.colors.error} />
                                <Text style={styles.statLabel}>Food</Text>
                                <Text style={styles.statValue}>₹{summary?.categoryBreakdown?.Food?.total || 0}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="car" size={24} color={theme.colors.secondary} />
                                <Text style={styles.statLabel}>Trans</Text>
                                <Text style={styles.statValue}>₹{summary?.categoryBreakdown?.Transport?.total || 0}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="cart" size={24} color={theme.colors.warning} />
                                <Text style={styles.statLabel}>Shop</Text>
                                <Text style={styles.statValue}>₹{summary?.categoryBreakdown?.Shopping?.total || 0}</Text>
                            </View>
                        </View>

                        {/* Chart Section */}
                        {chartData.length > 0 && (
                            <View style={styles.chartContainer}>
                                <Text style={styles.sectionTitle}>Category Breakdown</Text>
                                <PieChart
                                    data={chartData}
                                    width={screenWidth - 80}
                                    height={200}
                                    chartConfig={chartConfig}
                                    accessor={"population"}
                                    backgroundColor={"transparent"}
                                    paddingLeft={"15"}
                                    center={[0, 0]}
                                    absolute
                                />
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>Recent Expenses</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        elevation: 4
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: '500', color: '#fff', fontFamily: theme.fonts.medium },
    profileIcon: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff',
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)'
    },

    totalCard: {
        padding: 24, borderRadius: 16, elevation: 3, marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
    },
    totalLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontFamily: theme.fonts.regular },
    totalAmount: { color: '#fff', fontSize: 36, fontFamily: theme.fonts.regular, marginVertical: 8 },
    trendContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', padding: 4, borderRadius: 4 },
    trendText: { color: '#fff', fontSize: 12, marginLeft: 4 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: {
        backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, width: '31%',
        alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: theme.colors.border
    },
    statLabel: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 },
    statValue: { color: theme.colors.text, fontSize: 16, fontWeight: 'bold', marginTop: 2 },

    chartContainer: {
        backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20, marginBottom: 20,
        elevation: 2, borderWidth: 1, borderColor: theme.colors.border
    },
    sectionTitle: { fontSize: 18, fontWeight: '500', color: theme.colors.text, marginBottom: 12, fontFamily: theme.fonts.medium },

    expenseItem: {
        flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: theme.colors.surface,
        marginHorizontal: 20, marginBottom: 8, borderRadius: 12, elevation: 1,
        borderWidth: 1, borderColor: theme.colors.border
    },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center', alignItems: 'center'
    },
    expenseTitle: { fontSize: 16, color: theme.colors.text, fontFamily: theme.fonts.medium },
    expenseCategory: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
    expenseAmount: { fontSize: 16, color: theme.colors.primary, fontWeight: 'bold' },

    fab: {
        position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
        backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 6
    }
});

export default DashboardScreen;
