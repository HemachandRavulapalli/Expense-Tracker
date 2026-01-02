import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text } from 'react-native';
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
import { theme } from './theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60, paddingBottom: 10, paddingTop: 10,
          backgroundColor: '#fff', borderTopWidth: 0, elevation: 10
        },
        tabBarLabelStyle: { fontFamily: 'Poppins_500Medium', fontSize: 10 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Analytics') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'History') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Analytics" component={StatisticsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Stack.Navigator screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background }
      }}>
        {userToken !== null ? (
          <>
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{
                headerShown: false,
                presentation: 'modal'
              }}
            />
            <Stack.Screen
              name="EditExpense"
              component={EditExpenseScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: false
              }}
            />
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
