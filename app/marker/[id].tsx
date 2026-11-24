import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ImageList } from '../../components/ImageList';
import { useDatabase } from '../../contexts/DatabaseContext';
import { MarkerImage } from '../../types';

export default function MarkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMarkerImages, addImage, deleteImage, deleteMarker } = useDatabase();
  
  const [images, setImages] = useState<MarkerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const markerId = parseInt(id, 10);
  
  if (isNaN(markerId)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Invalid marker identifier</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Return to map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    loadImages();
  }, [id]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      console.log(`Loading images for marker ${markerId}...`);
      const data = await getMarkerImages(markerId);
      setImages(data);
      console.log(`Loaded ${data.length} images`);
    } catch (err) {
      console.error('Failed to load images:', err);
      Alert.alert('Error', 'Failed to load images from database.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to the photo library in settings.');
      return false;
    }
    return true;
  };

  const handleAddImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        console.log(`Adding image to marker ${markerId}`);
        await addImage(markerId, result.assets[0].uri);
        await loadImages();
      }
    } catch (err) {
      console.error('Failed to save image:', err);
      Alert.alert('Error', 'Failed to save image to database.');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      console.log(`Deleting image ${imageId}`);
      await deleteImage(imageId);
      await loadImages();
    } catch (err) {
      console.error('Failed to delete image:', err);
      Alert.alert('Error', 'Failed to delete image from database.');
    }
  };

  const handleDeleteMarker = async () => {
    Alert.alert('Delete marker', 'Are you sure? This action is irreversible and will delete all associated images.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          setIsDeleting(true);
          try {
            console.log(`Deleting marker ${markerId} and its images`);
            await deleteMarker(markerId);
            // После успешного удаления возвращаемся на карту. 
            // useFocusEffect на экране карты автоматически вызовет loadMarkers() и обновит карту.
            router.back();
          } catch (err) {
            console.error('Failed to delete marker:', err);
            Alert.alert('Error', 'Failed to delete marker due to database integrity violation.');
            setIsDeleting(false);
          }
        }
      }
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to map</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Marker #{markerId}</Text>
        <TouchableOpacity style={styles.deleteMarkerButton} onPress={handleDeleteMarker} disabled={isDeleting}>
          <Text style={styles.deleteMarkerText}>{isDeleting ? 'Deleting...' : 'Delete marker'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddImage} disabled={isDeleting}>
        <Text style={styles.addButtonText}>+ Add image</Text>
      </TouchableOpacity>

      <ImageList images={images} onDeleteImage={handleDeleteImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { marginBottom: 10 },
  backButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  deleteMarkerButton: { marginTop: 10, padding: 10, backgroundColor: '#ffebee', borderRadius: 8, alignItems: 'center' },
  deleteMarkerText: { color: '#d32f2f', fontWeight: 'bold' },
  addButton: { backgroundColor: '#007AFF', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});