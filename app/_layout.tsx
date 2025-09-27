
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useGlobalSearchParams } from 'expo-router';
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

const STORAGE_KEY = 'natively_emulate_safe_area';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const [emulate, setEmulate] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const params = useGlobalSearchParams();

  useEffect(() => {
    setupErrorLogging();
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
      });
      setFontsLoaded(true);
      console.log('Fonts loaded successfully');
    } catch (error) {
      console.error('Error loading fonts:', error);
      setFontsLoaded(true); // Continue without fonts if loading fails
    }
  };

  if (!fontsLoaded) {
    return null; // Or a loading screen
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
