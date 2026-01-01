import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import EditExpenseScreen from './screens/EditExpenseScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import { theme } from './theme';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator screenOptions={{
      headerShown: false,
      drawerActiveTintColor: theme.colors.primary,
      drawerInactiveTintColor: theme.colors.textSecondary,
      drawerLabelStyle: { fontFamily: 'Poppins_500Medium' }
    }}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="Statistics" component={StatisticsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);
  console.log("AppNav: Render. isLoading:", isLoading, "userToken:", userToken);

  if (isLoading) {
    console.log("AppNav: Rendering Loading Spinner");
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
            <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
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
  console.log("App: Component Mounting...");

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  console.log("App: Fonts Loaded State:", fontsLoaded);

  if (!fontsLoaded) {
    console.log("App: Returning Loading Fonts View");
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
