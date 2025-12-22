import { Box, Text } from "@chakra-ui/react";
import { FaArrowRightLong } from "react-icons/fa6";

interface LocationInputProps {
  onCitySelect: (cityName: string) => void;
  cities: string[];
}

const Locationinput: React.FC<LocationInputProps> = ({
  onCitySelect,
  cities,
}) => {
  if (!cities || cities.length === 0) {
    return <Box color={"white"}>No se encontraron ciudades con sucursales disponibles.</Box>;
  }
  return (
    <Box
      display={"grid"}
      gridTemplateColumns={[
        "repeat(1, 1fr)",
        "repeat(1, 1fr)",
        "repeat(1, 1fr)",
        "repeat(1, 1fr)",
        "repeat(2, 1fr)",
      ]}
      justifyContent={"center"}
      alignItems="center"
      gap={6}
      padding={4}
      paddingLeft={0}
      mt={4}
      w={"100%"}
    >
      {cities?.map((city: string) => (
        <Box
          key={city}
          width={["80vw", "100%", "310px"]}
          maxWidth={{ md: "100%", lg: "310px" }}
          bg="#fff"
          rounded={"md"}
          border={"1px solid #7a9f8a"}
          color={"#7a9f8a"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          px={4}
          py={2}
          fontSize={"xl"}
          cursor={"pointer"}
          onClick={() => onCitySelect(city)}
          _hover={{
            borderColor: "#5a7d6a",
            color: "#5a7d6a",
          }}
        >
          <Text mb={1} fontFamily={"AmsiProCond"}>
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </Text>
          <FaArrowRightLong color="#7a9f8a" size={18} />
        </Box>
      ))}
    </Box>
  );
};

export default Locationinput;
