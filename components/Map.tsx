import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps';
import { Marker } from '../types';
import { MarkerList } from './MarkersList';

interface MapProps {
  markers: Marker[];
  onLongPress: (coordinate: { latitude: number; longitude: number }) => void;
  onMarkerPress: (markerId: number) => void;
}

export const MapComponent: React.FC<MapProps> = ({ markers, onLongPress, onMarkerPress }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <View style={styles.container}>
      {!isMapLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading map...</Text>
        </View>
      )}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 55.7558, longitude: 37.6173, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
        onMapReady={() => setIsMapLoaded(true)}
        onLongPress={(e: LongPressEvent) => onLongPress(e.nativeEvent.coordinate)}
      >
        <MarkerList markers={markers} onMarkerPress={onMarkerPress} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
});