import { Stack, ErrorBoundary } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../src/constants/theme';

// Custom error boundary shown when a screen crashes
export { ErrorBoundary };

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="leads/[id]"
          options={{
            headerShown: true,
            title: 'Lead Details',
            headerStyle: { backgroundColor: COLORS.card },
            headerTintColor: COLORS.foreground,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}
