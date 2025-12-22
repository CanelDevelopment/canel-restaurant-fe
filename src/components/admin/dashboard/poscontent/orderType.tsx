// Component 1: OrderType.tsx
import { Box, Text, Image, Card, Center } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";
import type React from "react";

// Props for this component, making it controllable from the outside
interface OrderTypeProps {
  orderType: string;
  onOrderTypeChange: (type: string) => void;
}

export const OrderType: React.FC<OrderTypeProps> = ({
  orderType,
  onOrderTypeChange,
}) => {
  // Added an 'apiValue' to map the label to the value your backend expects
  const orderTypes = [
    {
      label: "Delivery",
      apiValue: "delivery",
      image: "/Icon/delivery_01.png",
      boxWidth: 20,
    },
    {
      label: "Pickup",
      apiValue: "pickup",
      image: "/Icon/pickup.png",
      boxWidth: 10,
    },
  ];

  const selectedBg = useColorModeValue("#D4F5CE", "#239113"); // Using a green similar to the screenshot
  const defaultBg = useColorModeValue("#F7FEE0", "#F7FEE0");

  return (
    <>
      <Center
        gap={4}
        justifyContent={"space-between"}
        py={8}
        px={[3, 5, 6]}
        flexDirection={["column", "column", "row"]}
        bg={"#fff"}
        alignItems="flex-start"
      >
        <Box width="100%">
          <Text
            fontSize="2xl"
            fontFamily={"AmsiProCond-Black"}
            color={"#000"}
            mb={4}
          >
            TIPO DE ORDEN
          </Text>

          <Box
            display={"flex"}
            flexDirection={["column", "row", "row", "row"]}
            flexWrap={"wrap"}
            gap={4}
          >
            {orderTypes.map((type) => {
              // The selected state is now determined by the prop from the parent
              const isSelected = orderType === type.apiValue;

              return (
                <Card.Root
                  key={type.apiValue}
                  cursor="pointer"
                  // Call the parent's handler on click
                  onClick={() => onOrderTypeChange(type.apiValue)}
                  bg={isSelected ? selectedBg : defaultBg}
                  transition="all 0.2s ease"
                  border={
                    isSelected ? "2px solid #94c18c" : "2px solid transparent"
                  }
                  borderRadius="lg"
                  px={4}
                  py={7}
                  w={{ base: "100%", sm: "48%", md: "auto" }}
                  minW={"260px"}
                  // flexGrow={1}
                >
                  <Card.Body
                    p={0}
                    display={"flex"}
                    gapX={4}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <Text
                      color={isSelected ? "#000" : "#555"}
                      fontWeight="bold"
                      fontFamily={"AmsiProCond"}
                      fontSize={"xl"}
                    >
                      {type.label}
                    </Text>
                    <Image
                      loading="lazy"
                      src={type.image}
                      alt={type.label}
                      boxSize="60px"
                      objectFit="contain"
                    />
                  </Card.Body>
                </Card.Root>
              );
            })}
          </Box>
        </Box>
      </Center>
    </>
  );
};
