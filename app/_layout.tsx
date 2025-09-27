
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { setupErrorLogging } from '../utils/errorLogger';
import * as Font from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    setupErrorLogging();
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      console.log('Loading fonts...');
      await Font.loadAsync({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
      });
      console.log('Fonts loaded successfully');
      setFontsLoaded(true);
    } catch (error) {
      console.error('Error loading fonts:', error);
      // Continue without custom fonts if loading fails
      setFontsLoaded(true);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0F172A' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
