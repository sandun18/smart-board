import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { FaCrosshairs, FaMapMarkerAlt, FaSearch, FaSpinner } from 'react-icons/fa';

// ✅ Use the existing ENV variable
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg';
const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 6.9271, // Colombo
  lng: 79.8612
};

const SRI_LANKA_BOUNDS = {
  north: 9.9,
  south: 5.8,
  west: 79.3,
  east: 82.0,
};

const LocationPicker = ({ lat, lng, onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script-picker',
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [loadingLocation, setLoadingLocation] = useState(false); // ✅ Loading State
  const searchBoxRef = useRef(null);

  // Sync state if editing
  useEffect(() => {
    if (lat && lng) {
      setMarkerPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng]);

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const onSearchLoad = (autocomplete) => {
    searchBoxRef.current = autocomplete;
    autocomplete.setComponentRestrictions({ country: "lk" });
  };

  const onPlaceChanged = () => {
    if (searchBoxRef.current) {
      const place = searchBoxRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const newPos = { lat: newLat, lng: newLng };
        
        setMarkerPosition(newPos);
        map?.panTo(newPos);
        map?.setZoom(16);
        onLocationSelect(newLat, newLng);
      }
    }
  };

  const handleLocationChange = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    onLocationSelect(newLat, newLng);
  };

  const handleUseMyLocation = (e) => {
    e.preventDefault();
    setLoadingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPosition(pos);
          map?.panTo(pos);
          map?.setZoom(18); // Zoom in closer for accuracy
          onLocationSelect(pos.lat, pos.lng);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get precise location. Please ensure GPS is on.");
          setLoadingLocation(false);
        },
        
        {
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
    }
  };

  if (!isLoaded) return <div className="h-96 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">Loading Map...</div>;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted flex items-center gap-2">
           <FaMapMarkerAlt className="text-accent"/> Pin Location
        </label>

        <button
          onClick={handleUseMyLocation}
          disabled={loadingLocation}
          className="flex items-center gap-2 text-[10px] font-bold text-accent hover:text-primary transition-colors bg-white px-3 py-2 rounded-lg border border-light shadow-sm disabled:opacity-50"
        >
          {loadingLocation ? <FaSpinner className="fa-spin"/> : <FaCrosshairs />} 
          {loadingLocation ? "Locating..." : "Use My Precise Location"}
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border-4 border-white shadow-custom relative">
        
        <div className="absolute top-4 left-4 right-14 z-10">
            <Autocomplete onLoad={onSearchLoad} onPlaceChanged={onPlaceChanged}>
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Search for a city or place..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-lg text-sm font-medium border-0 focus:ring-2 focus:ring-accent outline-none text-text-dark"
                    />
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                </div>
            </Autocomplete>
        </div>
        
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleLocationChange}
          options={{
             streetViewControl: false,
             mapTypeControl: false,
             fullscreenControl: true,
             zoomControl: true,
             restriction: {
                latLngBounds: SRI_LANKA_BOUNDS,
                strictBounds: false,
             },
          }}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleLocationChange}
            animation={window.google.maps.Animation.DROP}
          />
        </GoogleMap>
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-[10px] font-mono font-bold shadow-md text-text border border-light">
          {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
        </div>
      </div>
      <p className="text-[10px] font-medium italic text-muted text-center">
        * Drag the red marker to the exact entrance of your boarding place.
      </p>
    </div>
  );
};

export default LocationPicker;
