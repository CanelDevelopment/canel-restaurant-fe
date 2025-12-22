import React, { useEffect, useRef } from "react";
import { Box, VStack, Text, Input } from "@chakra-ui/react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

interface LocationSearchProps {
  onLocationChange: (data: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationChange,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const handleGeocode = (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: { lat, lng } }, (results) => {
      if (results && results[0]) {
        const address = results[0].formatted_address;
        // Send data back to the parent form
        onLocationChange({ lat, lng, address });
      }
    });
  };

  useEffect(() => {
    const initMap = async () => {
      setOptions({
        key: "AIzaSyCY5MxUqtqIJemAaumyyec7NpI8FeFNhBY",
        channel: "weekly",
        libraries: ["places", "maps", "marker", "geocoding"],
      });

      try {
        // Import required libraries
        const { Map } = (await importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { Marker } = (await importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;
        const { Autocomplete } = (await importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;
        const { Geocoder } = (await importLibrary(
          "geocoding"
        )) as google.maps.GeocodingLibrary;

        if (!mapRef.current) return;

        geocoderRef.current = new Geocoder();

        // 1. Initialize Map
        const _map = new Map(mapRef.current, {
          center: { lat: 10.4806, lng: -66.9036 },
          zoom: 12,
          mapId: "DEMO_MAP_ID",
          mapTypeControl: false,
          streetViewControl: false,
          clickableIcons: false,
        });

        mapInstanceRef.current = _map;

        const _marker = new Marker({
          position: _map.getCenter(),
          map: _map,
          draggable: true,
          title: "Drag me!",
        });

        markerRef.current = _marker;

        if (inputRef.current) {
          const _autocomplete = new Autocomplete(inputRef.current, {
            fields: ["geometry", "name", "formatted_address"],
            // componentRestrictions: { country: "ve" }, // Optional: Limit search to Venezuela
          });

          autocompleteRef.current = _autocomplete;
          _autocomplete.bindTo("bounds", _map);

          // EVENT: Place Selected from Dropdown
          _autocomplete.addListener("place_changed", () => {
            const place = _autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
              return;
            }

            // Move map and marker
            if (place.geometry.viewport) {
              _map.fitBounds(place.geometry.viewport);
            } else {
              _map.setCenter(place.geometry.location);
              _map.setZoom(17);
            }

            _marker.setPosition(place.geometry.location);

            // Send data to parent
            if (place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const address = place.formatted_address || "";
              onLocationChange({ lat, lng, address });
            }
          });
        }

        // EVENT: Marker Drag End
        _marker.addListener("dragend", () => {
          const pos = _marker.getPosition();
          if (pos) {
            handleGeocode(pos.lat(), pos.lng());
          }
        });

        // EVENT: Map Click
        _map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            _marker.setPosition(e.latLng);
            handleGeocode(e.latLng.lat(), e.latLng.lng());
          }
        });
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  return (
    <Box w={["100%", "100%", "50%"]} px={[3, 5, 5, 10]} py={7}>
      <VStack align={"start"} spaceY={4}>
        <Text color={"#000"} fontSize={"lg"} fontFamily={"AmsiProCond-Black"}>
          Ubicación en el Mapa
        </Text>

        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar dirección en Google Maps..."
          border={"none"}
          bgColor={"#F4F4F4"}
          rounded={"lg"}
          py={6}
          _placeholder={{ color: "#929292" }}
        />

        <Box
          ref={mapRef}
          borderRadius="lg"
          overflow="hidden"
          width="100%"
          height="400px"
          bg="gray.100"
          position="relative"
        ></Box>
      </VStack>
    </Box>
  );
};
