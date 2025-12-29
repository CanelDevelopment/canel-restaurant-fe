import { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, Flex } from "@chakra-ui/react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: { address: string; lat: number; lng: number }) => void;
  initialCenter?: { lat: number; lng: number } | null;
}

export default function MapPicker({
  isOpen,
  onClose,
  onSelect,
  initialCenter,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const markerRef = useRef<google.maps.Marker | null>(null);

  const selectedCity = localStorage.getItem("selectedCity");

  useEffect(() => {
    if (!isOpen) return;

    const initMap = async () => {
      setOptions({
        key: import.meta.env.VITE_GOOGLE_MAP_KEY,
        channel: "weekly",
      });

      try {
        // 3. Import specific libraries using the new method
        const { Map } = (await importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { Marker } = (await importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;
        const { Geocoder } = (await importLibrary(
          "geocoding"
        )) as google.maps.GeocodingLibrary;

        if (!mapRef.current) return;

        // 4. Initialize Map
        const _map = new Map(mapRef.current, {
          center: { lat: 10.5, lng: -66.9 },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          clickableIcons: false,
          mapId: "DEMO_MAP_ID", // 'mapId' is required for Advanced Markers, use "DEMO_MAP_ID" for testing
        });

        // 5. Initialize Marker
        const _marker = new Marker({
          position: _map.getCenter(),
          map: _map,
          draggable: true,
        });

        markerRef.current = _marker;

        if (initialCenter) {
          _map.setCenter(initialCenter);
          _marker.setPosition(initialCenter);

          const geocoder = new Geocoder();
          geocoder.geocode({ location: initialCenter }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setCurrentAddress(results[0].formatted_address);
            }
          });
        } else if (selectedCity) {
          const geocoder = new Geocoder();
          geocoder.geocode({ address: selectedCity }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const loc = results[0].geometry.location;
              _map.setCenter(loc);
              _marker.setPosition(loc);
              setCurrentAddress(results[0].formatted_address);
            }
          });
        }

        // 6. Add Drag Listener
        _marker.addListener("dragend", () => {
          const pos = _marker.getPosition();
          const lat = pos?.lat();
          const lng = pos?.lng();

          if (lat && lng) {
            const geocoder = new Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results) => {
              if (results && results[0]) {
                setCurrentAddress(results[0].formatted_address);
              }
            });
          }
        });
      } catch (error) {
        console.error("Google Maps no se pudo cargar:", error);
      }
    };

    initMap();
  }, [isOpen]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      size="xl"
    >
      <Dialog.Backdrop zIndex={1500} />
      <Dialog.Positioner zIndex={1500}>
        <Dialog.Content>
          <Dialog.Body p={0}>
            <Box ref={mapRef} width="100%" height="400px" bg="gray.100" />

            <Flex justifyContent={"space-between"} p={4} w={"full"} bg="#fff">
              <Button
                width="90%"
                colorScheme="green"
                disabled={!currentAddress}
                onClick={() => {
                  const marker = markerRef.current;
                  if (!marker) return;

                  const pos = marker.getPosition();
                  if (pos) {
                    onSelect({
                      address: currentAddress,
                      lat: pos.lat(),
                      lng: pos.lng(),
                    });
                    onClose();
                  }
                }}
              >
                Utilice esta ubicación
              </Button>
              <Button onClick={onClose}>Cerrar</Button>
            </Flex>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
