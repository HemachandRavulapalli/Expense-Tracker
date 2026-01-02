import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions, ProgressBarAndroid, ProgressViewIOS, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
    const { userToken, userInfo, currency } = useContext(AuthContext);
    const theme = useAppTheme();
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const expenseRes = await axios.get('/expenses?limit=5', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setExpenses(expenseRes.data.data);

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

    const chartData = summary && summary.categoryBreakdown
        ? Object.keys(summary.categoryBreakdown).map((key, index) => ({
            name: key,
            population: summary.categoryBreakdown[key].total,
            color: theme.colors.chartColors[index % theme.colors.chartColors.length],
            legendFontColor: theme.colors.textSecondary,
            legendFontSize: 12
        }))
        : [];

    const renderBudgetProgress = () => {
        const limit = userInfo?.monthlyBudget || 0;
        if (limit === 0) return null;
        const total = summary?.totalSpent || 0;
        const progress = Math.min(total / limit, 1);
        const color = progress > 0.9 ? theme.colors.error : (progress > 0.7 ? theme.colors.warning : theme.colors.success);

        return (
            <View style={[styles.budgetBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={[styles.budgetLabel, { color: theme.colors.text }]}>Monthly Budget</Text>
                    <Text style={[styles.budgetPercent, { color: color }]}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={[styles.budgetSubText, { color: theme.colors.textSecondary }]}>Used: {currency}{total.toLocaleString()}</Text>
                    <Text style={[styles.budgetSubText, { color: theme.colors.textSecondary }]}>Limit: {currency}{limit.toLocaleString()}</Text>
                </View>
            </View>
        );
    };

    const renderItem = ({ item, index }) => (
        <Animatable.View animation="fadeInUp" duration={400} delay={index * 100}>
            <TouchableOpacity
                style={[styles.expenseItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('EditExpense', { expenseId: item._id })}
            >
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={[styles.expenseTitle, { color: theme.colors.text }]}>{item.title}</Text>
                    <Text style={[styles.expenseCategory, { color: theme.colors.textSecondary }]}>{item.category} • {new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.expenseAmount, { color: theme.colors.primary }]}>{currency}{item.amount.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                style={styles.header}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu-outline" size={32} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={{ color: '#eee', fontSize: 12 }}>Welcome Back,</Text>
                        <Text style={styles.headerTitle}>{userInfo?.name?.split(' ')[0] || 'User'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={[styles.profileIcon, { backgroundColor: '#fff' }]}>
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
                        <LinearGradient
                            colors={[theme.colors.secondary, theme.colors.secondaryDark]}
                            style={styles.totalCard}
                        >
                            <Text style={styles.totalLabel}>Total Spent This Month</Text>
                            <Text style={styles.totalAmount}>{currency} {summary?.totalSpent?.toFixed(2) || '0.00'}</Text>
                            <View style={styles.trendContainer}>
                                <Ionicons name="apps-outline" size={16} color="#fff" />
                                <Text style={styles.trendText}>Tracking Active</Text>
                            </View>
                        </LinearGradient>

                        {renderBudgetProgress()}

                        {chartData.length > 0 && (
                            <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Category Breakdown</Text>
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
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Expenses</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        elevation: 4
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    profileIcon: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)'
    },
    totalCard: {
        padding: 24, borderRadius: 16, elevation: 3, marginBottom: 20,
    },
    totalLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
    totalAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
    trendContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', padding: 4, borderRadius: 4 },
    trendText: { color: '#fff', fontSize: 11, marginLeft: 4 },

    budgetBox: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 20, elevation: 1 },
    budgetLabel: { fontSize: 15, fontWeight: 'bold' },
    budgetPercent: { fontSize: 15, fontWeight: 'bold' },
    progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    budgetSubText: { fontSize: 12 },

    chartContainer: {
        borderRadius: 16, padding: 20, marginBottom: 20,
        elevation: 2, borderWidth: 1
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    expenseItem: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        marginHorizontal: 20, marginBottom: 8, borderRadius: 12, elevation: 1,
        borderWidth: 1
    },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center'
    },
    expenseTitle: { fontSize: 15, fontWeight: '500' },
    expenseCategory: { fontSize: 12, marginTop: 2 },
    expenseAmount: { fontSize: 15, fontWeight: 'bold' },
    fab: {
        position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center', elevation: 6
    }
});

export default DashboardScreen;
