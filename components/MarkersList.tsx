import React from 'react';
import { Marker as MapMarker } from 'react-native-maps';
import { Marker } from '../types';

interface MarkerListProps {
  markers: Marker[];
  onMarkerPress: (markerId: number) => void;
}

export const MarkerList: React.FC<MarkerListProps> = ({ markers, onMarkerPress }) => {
  return (
    <>
      {markers.map((marker) => (
        <MapMarker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={`Marker #${marker.id}`}
          description={`${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}`}
          onPress={() => onMarkerPress(marker.id)}
          pinColor="#007AFF"
        />
      ))}
    </>
  );
};