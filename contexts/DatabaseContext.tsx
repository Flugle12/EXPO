import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from '../database/schema';
import { dbOperations } from '../database/operations';
import { Marker, MarkerImage } from '../types';

export interface DatabaseContextType {
  addMarker: (latitude: number, longitude: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<Marker[]>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const setupDb = async () => {
      try {
        console.log('Initializing database connection...');
        const database = await initializeDatabase();
        if (isMounted) {
          setDb(database);
          setIsLoading(false);
          console.log('Database connection established');
        }
      } catch (err) {
        console.error('Critical database initialization error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown database error'));
          setIsLoading(false);
        }
      }
    };
    setupDb();
    return () => { isMounted = false; };
  }, []);

  const safeOperation = async <T,>(operation: () => Promise<T>): Promise<T> => {
    if (!db) throw new Error('Database not initialized');
    try {
      return await operation();
    } catch (err) {
      console.error('Database operation error:', err);
      throw err;
    }
  };

  const value: DatabaseContextType = {
    getMarkers: () => safeOperation(() => dbOperations.getMarkers(db!)),
    addMarker: (lat, lng) => safeOperation(() => dbOperations.addMarker(db!, lat, lng)),
    deleteMarker: (id) => safeOperation(() => dbOperations.deleteMarker(db!, id)),
    getMarkerImages: (markerId) => safeOperation(() => dbOperations.getMarkerImages(db!, markerId)),
    addImage: (markerId, uri) => safeOperation(() => dbOperations.addImage(db!, markerId, uri)),
    deleteImage: (id) => safeOperation(() => dbOperations.deleteImage(db!, id)),
    isLoading,
    error,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};