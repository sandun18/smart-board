import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||'AIzaSyBNC44FLqmrSWtJAzBOx6a0KHynO3HuxZ0';

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function Map({ center, makerTitle = "Location" }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
    >
      <Marker
        position={{ lat: center.lat, lng: center.lng }}
        title={makerTitle}
      />
    </GoogleMap>
  ) : (
    <>Loading...</>
  );
}
