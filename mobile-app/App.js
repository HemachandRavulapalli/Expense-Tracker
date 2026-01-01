import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import EditExpenseScreen from './screens/EditExpenseScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import { theme } from './theme';

const Stack = createStackNavigator();

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
      <Stack.Navigator screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background }
      }}>
        {userToken !== null ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{
                headerShown: true,
                title: 'Add Transaction',
                headerStyle: { backgroundColor: theme.colors.surface, borderBottomWidth: 0, shadowColor: 'transparent' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontFamily: theme.fonts.bold }
              }}
            />
            <Stack.Screen
              name="EditExpense"
              component={EditExpenseScreen}
              options={{
                headerShown: true,
                title: 'Edit Transaction',
                headerStyle: { backgroundColor: theme.colors.surface, borderBottomWidth: 0 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontFamily: theme.fonts.bold }
              }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: true,
                title: 'Edit Profile',
                headerStyle: { backgroundColor: theme.colors.surface, borderBottomWidth: 0 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontFamily: theme.fonts.bold }
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
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNav />
    </AuthProvider>
  );
}
