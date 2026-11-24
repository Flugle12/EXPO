import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MapComponent } from '../components/Map';
import { useDatabase } from '../contexts/DatabaseContext';
import { Marker } from '../types';

export default function MapScreen() {
  const router = useRouter();
  const { getMarkers, addMarker, isLoading, error } = useDatabase();
  const [markers, setMarkers] = useState<Marker[]>([]);

  const loadMarkers = useCallback(async () => {
    try {
      console.log('Loading markers from database...');
      const data = await getMarkers();
      setMarkers(data);
      console.log(`Loaded ${data.length} markers successfully`);
    } catch (err) {
      console.error('Failed to load markers:', err);
      Alert.alert('Error', 'Failed to load markers from the database.');
    }
  }, [getMarkers]);

  // useFocusEffect загружает данные при первом рендере (когда isLoading станет false)
  // и ПЕРЕЗАГРУЖАЕТ их каждый раз, когда экран получает фокус
  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !error) {
        loadMarkers();
      }
    }, [isLoading, error, loadMarkers])
  );

  const handleLongPress = async (coordinate: { latitude: number; longitude: number }) => {
    try {
      console.log(`Adding marker at ${coordinate.latitude}, ${coordinate.longitude}`);
      await addMarker(coordinate.latitude, coordinate.longitude);
      await loadMarkers(); // Мгновенное обновление после добавления
      Alert.alert('Success', 'Marker saved to database.');
    } catch (err) {
      console.error('Failed to save marker:', err);
      Alert.alert('Error', 'Failed to save marker to database.');
    }
  };

  const handleMarkerPress = (markerId: number) => {
    try {
      router.push(`/marker/${markerId}`);
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to open details.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Initializing database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Critical database error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapComponent markers={markers} onLongPress={handleLongPress} onMarkerPress={handleMarkerPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});