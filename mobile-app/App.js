import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import EditExpenseScreen from './screens/EditExpenseScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import BudgetSettingsScreen from './screens/BudgetSettingsScreen';
import SecurityScreen from './screens/SecurityScreen';
import { useAppTheme } from './theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { logout, userInfo } = useContext(AuthContext);
  const theme = useAppTheme();

  const DrawerItem = ({ label, icon, onPress, color }) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color || theme.colors.textSecondary} />
      <Text style={[styles.drawerItemLabel, { color: color || theme.colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <View style={[styles.drawerHeader, { borderBottomColor: theme.colors.border }]}>
        <View style={[styles.drawerAvatar, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.drawerAvatarText, { color: theme.colors.primaryDark }]}>{userInfo?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={[styles.drawerName, { color: theme.colors.text }]}>{userInfo?.name || 'User'}</Text>
        <Text style={[styles.drawerEmail, { color: theme.colors.textSecondary }]}>{userInfo?.email || 'user@example.com'}</Text>
      </View>

      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItem
          label="Home Dashboard"
          icon="grid-outline"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Dashboard' })}
        />
        <DrawerItem
          label="Budget Planner"
          icon="calculator-outline"
          onPress={() => props.navigation.navigate('BudgetSettings')}
        />
        <DrawerItem
          label="Transaction History"
          icon="time-outline"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'History' })}
        />
        <DrawerItem
          label="Security & Password"
          icon="shield-checkmark-outline"
          onPress={() => props.navigation.navigate('Security')}
        />
        <DrawerItem
          label="App Settings"
          icon="settings-outline"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Profile' })}
        />
      </View>

      <View style={[styles.drawerFooter, { borderTopColor: theme.colors.border }]}>
        <DrawerItem
          label="Log Out"
          icon="log-out-outline"
          color={theme.colors.error}
          onPress={logout}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const HomeTabs = () => {
  const theme = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          height: 65, paddingBottom: 12, paddingTop: 12,
          backgroundColor: theme.colors.surface, borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 0,
        },
        tabBarLabelStyle: { fontFamily: 'Poppins_500Medium', fontSize: 11, marginTop: 4 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Analytics') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'History') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Analytics" component={StatisticsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Records' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

const MainDrawer = () => {
  const theme = useAppTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 300, backgroundColor: theme.colors.surface }
      }}
    >
      <Drawer.Screen name="MainTabs" component={HomeTabs} />
    </Drawer.Navigator>
  );
};

const AppNav = () => {
  const { isLoading, userToken, themeMode } = useContext(AuthContext);
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" translucent />
      <Stack.Navigator screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background }
      }}>
        {userToken !== null ? (
          <>
            <Stack.Screen name="MainDrawer" component={MainDrawer} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="EditExpense" component={EditExpenseScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="BudgetSettings" component={BudgetSettingsScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1F88E5" />
        <Text style={{ marginTop: 20 }}>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 25, paddingVertical: 45, borderBottomWidth: 1, alignItems: 'center'
  },
  drawerAvatar: {
    width: 75, height: 75, borderRadius: 38, justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },
  drawerAvatarText: { fontSize: 30, fontWeight: 'bold' },
  drawerName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  drawerEmail: { fontSize: 13, opacity: 0.7 },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center', padding: 18, paddingHorizontal: 25, gap: 15
  },
  drawerItemLabel: { fontSize: 16, fontWeight: '500' },
  drawerFooter: {
    padding: 20, borderTopWidth: 1, marginBottom: 10
  }
});
