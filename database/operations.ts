import * as SQLite from 'expo-sqlite';
import { Marker, MarkerImage } from '../types';

export const dbOperations = {
  getMarkers: async (db: SQLite.SQLiteDatabase): Promise<Marker[]> => {
    return await db.getAllAsync<Marker>('SELECT * FROM markers ORDER BY created_at DESC');
  },

  addMarker: async (db: SQLite.SQLiteDatabase, latitude: number, longitude: number): Promise<number> => {
    const result = await db.runAsync(
      'INSERT INTO markers (latitude, longitude) VALUES (?, ?)',
      latitude, longitude
    );
    return result.lastInsertRowId as number;
  },

  deleteMarker: async (db: SQLite.SQLiteDatabase, id: number): Promise<void> => {
    await db.withTransactionAsync(async () => {
      // delete image
      await db.runAsync('DELETE FROM marker_images WHERE marker_id = ?', id);
      // delete marker
      await db.runAsync('DELETE FROM markers WHERE id = ?', id);
    });
  },

  getMarkerImages: async (db: SQLite.SQLiteDatabase, markerId: number): Promise<MarkerImage[]> => {
    return await db.getAllAsync<MarkerImage>(
      'SELECT * FROM marker_images WHERE marker_id = ? ORDER BY created_at DESC',
      markerId
    );
  },

  addImage: async (db: SQLite.SQLiteDatabase, markerId: number, uri: string): Promise<void> => {
    await db.runAsync(
      'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)',
      markerId, uri
    );
  },

  deleteImage: async (db: SQLite.SQLiteDatabase, id: number): Promise<void> => {
    await db.runAsync('DELETE FROM marker_images WHERE id = ?', id);
  }
};