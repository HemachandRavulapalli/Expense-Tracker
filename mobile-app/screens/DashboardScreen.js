import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, RefreshControl, Modal, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ideally we'd use this, but for simplicity on web/expo standard we might use simple date logic or buttons.

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
    const { userToken, userInfo } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    // Filter State
    const [filterType, setFilterType] = useState('All'); // All, Daily, Monthly, Yearly
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);

    const fetchExpenses = async () => {
        try {
            setRefreshing(true);

            let queryParams = '';
            const now = new Date();
            let start = new Date();
            let end = new Date();

            if (filterType === 'Daily') {
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                queryParams = `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
            } else if (filterType === 'Monthly') {
                start.setDate(1); // First day of month
                start.setHours(0, 0, 0, 0);
                // End is today (or end of month)
            } else if (filterType === 'Yearly') {
                start.setMonth(0, 1); // Jan 1st
                start.setHours(0, 0, 0, 0);
            }

            // If filtering is applied (simple logic for now, utilizing backend query)
            if (filterType !== 'All') {
                queryParams = `?startDate=${start.toISOString()}`; // Fetch from start date until now
            }

            const res = await axios.get(`/expenses${queryParams}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setExpenses(res.data);
            processChartData(res.data);
        } catch (e) {
            console.log(e);
        } finally {
            setRefreshing(false);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`/expenses/${id}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            const updated = expenses.filter(item => item._id !== id);
            setExpenses(updated);
            processChartData(updated);
        } catch (e) {
            // Alert.alert("Error", "Failed to delete expense");
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchExpenses();
        }, [filterType])
    );

    const processChartData = (data) => {
        const categories = {};
        let total = 0;
        data.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + item.amount;
            total += item.amount;
        });
        setTotalAmount(total);

        const colors = theme.colors.chartColors;

        const chart = Object.keys(categories).map((key, index) => ({
            name: key,
            population: categories[key],
            color: colors[index % colors.length],
            legendFontColor: theme.colors.textSecondary,
            legendFontSize: 12
        }));

        setChartData(chart);
    };

    const FilterTab = ({ label }) => (
        <TouchableOpacity
            style={[styles.filterTab, filterType === label && styles.activeFilterTab]}
            onPress={() => setFilterType(label)}
        >
            <Text style={[styles.filterText, filterType === label && styles.activeFilterText]}>{label}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item, index }) => (
        <Animatable.View animation="fadeInUp" duration={400} delay={index * 50}>
            <TouchableOpacity
                style={styles.expenseItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('EditExpense', { expenseId: item._id })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#1C1C1E' }]}>
                    <Ionicons name="pricetag" size={18} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.expenseTitle}>{item.title}</Text>
                    <Text style={styles.expenseCategory}>{item.category} • {new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); deleteExpense(item._id); }}>
                        <Ionicons name="trash-outline" size={16} color={theme.colors.error} style={{ marginTop: 5, opacity: 0.7 }} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Total Spent ({filterType})</Text>
                        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
                        <Ionicons name="person-circle" size={42} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterContainer}>
                    {['All', 'Daily', 'Monthly', 'Yearly'].map(type => <FilterTab key={type} label={type} />)}
                </View>
            </View>

            <FlatList
                data={expenses}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchExpenses} tintColor={theme.colors.primary} />
                }
                ListHeaderComponent={
                    <View style={{ paddingHorizontal: 20 }}>
                        {chartData.length > 0 ? (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Analysis</Text>
                                <PieChart
                                    data={chartData}
                                    width={screenWidth - 80}
                                    height={200}
                                    chartConfig={{ color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }}
                                    accessor={"population"}
                                    backgroundColor={"transparent"}
                                    paddingLeft={"15"}
                                    center={[0, 0]}
                                    absolute
                                />
                            </View>
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Ionicons name="stats-chart" size={50} color={theme.colors.border} />
                                <Text style={styles.noDataText}>No data for this period</Text>
                            </View>
                        )}
                        <Text style={styles.listTitle}>Transactions</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.8}
            >
                <View style={styles.fabBtn}>
                    <Ionicons name="add" size={32} color="#000" />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        padding: 20, paddingTop: 50, backgroundColor: theme.colors.surface,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    greeting: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
    totalAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' },

    filterContainer: { flexDirection: 'row', backgroundColor: theme.colors.card, borderRadius: 10, padding: 4, justifyContent: 'space-between' },
    filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    activeFilterTab: { backgroundColor: theme.colors.primary }, // Or white? Primary stands out more.
    filterText: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: '600' },
    activeFilterText: { color: '#fff', fontWeight: 'bold' },

    chartContainer: {
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    chartTitle: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: 'bold', marginBottom: 10, alignSelf: 'flex-start' },

    listTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },

    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        marginBottom: 10
    },
    iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    expenseTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
    expenseCategory: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
    expenseAmount: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

    noDataContainer: { alignItems: 'center', padding: 40, opacity: 0.5 },
    noDataText: { color: theme.colors.textSecondary, fontSize: 16, marginTop: 10 },

    fab: { position: 'absolute', right: 20, bottom: 30 },
    fabBtn: {
        width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary,
        justifyContent: 'center', alignItems: 'center', shadowColor: theme.colors.primary,
        shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
        elevation: 5
    },
});

export default DashboardScreen;
