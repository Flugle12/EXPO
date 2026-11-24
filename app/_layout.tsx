import { Stack } from 'expo-router';
import { DatabaseProvider } from '../contexts/DatabaseContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="marker/[id]" options={{ title: 'Marker Details', headerBackTitle: 'Back' }} />
      </Stack>
    </DatabaseProvider>
  );
}