import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Input, Button, HStack } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet"; // Import LatLngTuple from Leaflet
import toast from "react-hot-toast";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// A helper component to programmatically move the map view
interface ChangeViewProps {
  center: LatLngTuple;
  zoom: number;
}

const ChangeView: React.FC<ChangeViewProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface LocationSearchProps {
  // This is a function the parent will provide
  onLocationChange: (position: LatLngTuple) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationChange,
}) => {
  // State for the search input
  const [searchQuery, setSearchQuery] = useState("");
  // State for the map's position [lat, lng]
  const [position, setPosition] = useState<LatLngTuple>([6.4238, -66.5897]); // Default: Center of Venezuela

  // Function to handle the search

  useEffect(() => {
    if (onLocationChange) {
      onLocationChange(position);
    }
  }, [position, onLocationChange]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    // Use Nominatim API for free geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}, Venezuela&format=json&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setPosition([parseFloat(lat), parseFloat(lon)] as LatLngTuple);
    } else {
      toast.error(
        "Ubicación no encontrada. No se pudo encontrar la ubicación especificada. Intente con otro nombre."
      );
    }
  };

  return (
    <Box w={["100%", "100%", "50%"]} px={[3, 5, 5, 10]} py={7}>
      <VStack align={"start"}>
        <Text color={"#000"} fontSize={"lg"} fontFamily={"AmsiProCond-Black"}>
          Ubicación en el Mapa
        </Text>

        <HStack w="100%">
          <Input
            border={"none"}
            bgColor={"#F4F4F4"}
            rounded={"lg"}
            py={6}
            _placeholder={{ color: "#929292" }}
            placeholder="Buscar ciudad o estado"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} colorScheme="teal">
            Buscar
          </Button>
        </HStack>
      </VStack>

      <Box mt={7} borderRadius="lg" overflow="hidden">
        <MapContainer
          center={position}
          zoom={6}
          style={{ height: "400px", width: "100%" }}
        >
          <ChangeView center={position} zoom={12} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}></Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};
