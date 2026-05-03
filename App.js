import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { onAuthStateChanged } from 'firebase/auth';

import LoginScreen from './components/LoginScreen';
import UsersScreen from './components/UsersScreen';
import Chat from './components/Chat';
import Settings from './components/Settings';
import { auth } from './firebase';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const BACKEND_GEO_API = 'https://geocode.maps.co/reverse';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => { detectProvinceLanguage(); }, []);

  const detectProvinceLanguage = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const { latitude, longitude } = (await Location.getCurrentPositionAsync()).coords;
    const res = await axios.get(`${BACKEND_GEO_API}?lat=${latitude}&lon=${longitude}`);
    const region = (res.data.address?.state?.toLowerCase() || "");
    setLanguage(region.includes("punjab") ? "en" :
                region.includes("sindh") ? "sd" :
                region.includes("khyber") || region.includes("pakhtunkhwa") ? "ps" : "ur");
  };

  return (
    <NavigationContainer>
      <View style={[styles.container, darkMode && styles.dark]}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ?
            <Stack.Screen name="Login" component={LoginScreen} /> :
            <>
              <Stack.Screen name="Users">
                {props => (
                  <UsersScreen
                    {...props}
                    darkMode={darkMode}
                    onOpenSettings={() => setShowSettings(true)}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Chat">
                {props => (
                  <Chat
                    {...props}
                    language={language}
                    setLanguage={setLanguage}
                    darkMode={darkMode}
                  />
                )}
              </Stack.Screen>
            </>
          }
        </Stack.Navigator>

        {showSettings && (
          <Settings
            visible={showSettings}
            language={language}
            setLanguage={setLanguage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onClose={() => setShowSettings(false)}
          />
        )}

        <Toast />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  dark: { backgroundColor: "#121212" },
});
