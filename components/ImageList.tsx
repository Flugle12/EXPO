import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MarkerImage } from '../types';

interface ImageListProps {
  images: MarkerImage[];
  onDeleteImage: (imageId: number) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, onDeleteImage }) => {
  if (images.length === 0) {
    return <View style={styles.emptyContainer}><Text style={styles.emptyText}>No images. Add the first one!</Text></View>;
  }

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Delete this image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDeleteImage(id) },
    ]);
  };

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 10 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#888', fontStyle: 'italic', fontSize: 16 },
  imageContainer: { flex: 1, margin: 5, aspectRatio: 1, position: 'relative' },
  image: { flex: 1, borderRadius: 8, backgroundColor: '#e0e0e0' },
  deleteButton: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,59,48,0.9)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});