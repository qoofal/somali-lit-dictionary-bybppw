
import React, { useEffect, useState } from 'react';
import { Platform, ImageBackground } from 'react-native';
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
    console.log('RootLayout: Setting up error logging...');
    setupErrorLogging();
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      console.log('RootLayout: Loading fonts...');
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
      console.log('RootLayout: Fonts loaded successfully');
      setFontsLoaded(true);
    } catch (error) {
      console.error('RootLayout: Error loading fonts:', error);
      // Continue without custom fonts if loading fails
      console.log('RootLayout: Continuing without custom fonts');
      setFontsLoaded(true);
    }
  };

  // Don't render anything until fonts are loaded (or failed to load)
  if (!fontsLoaded) {
    console.log('RootLayout: Waiting for fonts to load...');
    return null;
  }

  console.log('RootLayout: Rendering app with fonts loaded and background image');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/21e5d6bd-8b8d-40fb-bef7-a3ccf191bc4d.jpeg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </SafeAreaProvider>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}
