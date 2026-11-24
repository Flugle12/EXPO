// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { MarkerData, ImageData } from '../types';

// interface MarkerContextType {
//   markers: MarkerData[];
//   addMarker: (marker: MarkerData) => void;
//   updateMarkerImages: (markerId: string, images: ImageData[]) => void;
// }

// const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

// export const MarkerProvider = ({ children }: { children: ReactNode }) => {
//   const [markers, setMarkers] = useState<MarkerData[]>([]);

//   const addMarker = (marker: MarkerData) => {
//     setMarkers((prev) => [...prev, marker]);
//   };

//   const updateMarkerImages = (markerId: string, images: ImageData[]) => {
//     setMarkers((prev) =>
//       prev.map((m) => (m.id === markerId ? { ...m, images } : m))
//     );
//   };

//   return (
//     <MarkerContext.Provider value={{ markers, addMarker, updateMarkerImages }}>
//       {children}
//     </MarkerContext.Provider>
//   );
// };

// export const useMarkers = () => {
//   const context = useContext(MarkerContext);
//   if (!context) {
//     throw new Error('useMarkers must be used within a MarkerProvider');
//   }
//   return context;
// };