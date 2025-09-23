import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Button } from "../ui/button";
import { MdLocalPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useFetchPhoneNumber } from "@/hooks/branding/usefetchbranding";
// import { Branch } from "@/types/branch";

interface Branch {
  id: string;
  name: string;
  city?: {
    id: string;
    name: string;
  };
  areas?: string[];
}

const Homenav: React.FC = () => {
  const [locationDisplay, setLocationDisplay] = useState(
    "No location selected"
  );

  const navigate = useNavigate();
  const { data: allBranches } = useFetchBranch();
  const { data: brandingData } = useFetchPhoneNumber();

  useEffect(() => {
    const city = localStorage.getItem("selectedCity");
    const branchId = localStorage.getItem("selectedBranch");
    const area = localStorage.getItem("selectedArea");
    const deliveryType = localStorage.getItem("deliveryType");

    if (city && branchId) {
      // fallback text before branches load
      let displayText = `${city}`;
      if (deliveryType === "delivery" || area) {
        displayText = `${area}, ${city}`;
      }

      setLocationDisplay(displayText);

      // when branches are loaded, replace with branch name
      if (allBranches) {
        const selectedBranch = allBranches.find(
          (branch: Branch) => branch.id === branchId
        );

        if (selectedBranch) {
          if (deliveryType === "delivery" && area) {
            setLocationDisplay(`${area}, ${selectedBranch.name}, ${city}`);
          } else {
            setLocationDisplay(`${selectedBranch.name}, ${city}`);
          }
        }
      }
    } else {
      setLocationDisplay("No location selected");
    }
  }, [allBranches]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems={["flex-start", "center"]}
      flexDirection={["column", "row"]}
      px={[3, 10]}
      py={3}
      bg="white"
      color="black"
      gap={[3, 0]}
    >
      {/* Left section: Location and Button */}
      <Box display="flex" alignItems="center" gap={[2, 4]}>
        <Box
          display="flex"
          alignItems="center"
          fontSize={["12px", "14px"]}
          gap={2}
        >
          <FaLocationDot color="#7a9f8a" />
          {/* {isLoadingBranches ? (
            <Spinner size="xs" />
          ) : (
            )} */}
          <Text
            fontSize={["10px", "12px"]}
            fontFamily={"AmsiProCond"}
            letterSpacing={0.7}
            fontWeight="bold"
          >
            {locationDisplay}
          </Text>
        </Box>

        <Button
          onClick={() => navigate("/?change=true")}
          px={2.5}
          py={0.5}
          fontSize={["10px", "12px"]}
          fontWeight="light"
          height="auto"
          rounded="sm"
          bg="Cbutton"
          color="#0A0A0A"
          alignSelf="center"
          fontFamily={"AmsiProCond"}
          letterSpacing={0.7}
          pb={1}
          _hover={{ bg: "gray.200" }}
        >
          Cambiar Sucursal
        </Button>
      </Box>

      {/* Right section: Phone (unchanged) */}
      <Box
        display="flex"
        fontSize={["14px", "15px"]}
        alignItems="center"
        justifyContent={["flex-start", "center"]}
        gap={2}
      >
        <MdLocalPhone color="#7a9f8a" />
        <Text
          fontSize={["10px", "14px"]}
          fontFamily={"AmsiProCond"}
          letterSpacing={0.7}
        >
          {brandingData?.phoneNumber || "+58 424-2197876"}
        </Text>
      </Box>
    </Box>
  );
};

export default Homenav;
