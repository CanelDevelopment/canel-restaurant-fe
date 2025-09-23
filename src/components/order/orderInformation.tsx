import {
  Box,
  Flex,
  HStack,
  Icon,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface OrderInformationProps {
  order: {
    name: string;
    location: string;
    phoneNumber: string;
    createdAt: string;
  };
}

export const OrderInformation: React.FC<OrderInformationProps> = ({
  order,
}) => {
  const orderDetails = [
    { label: "Nom:", value: order.name },
    {
      label: "Dirección:",
      value: order.location,
      textAlign: "right",
      maxW: "60%",
    },
    { label: "Teléfono:", value: order.phoneNumber },
    {
      label: "Hora del pedido:",
      value: new Date(order.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
  ];

  return (
    <Box flex={1} px={[3, 10]} pt={12} pb={3} position="relative">
      {/* Header with integrated divider */}
      <Box position="relative" mb={6}>
        <HStack fontSize={["lg", "26px"]}>
          <Icon as={FaMapMarkerAlt} boxSize={5} color="Cbutton" />
          <Text color="Cbutton" fontFamily="AmsiProCond-Black" pb={2}>
            Información de la orden
          </Text>
        </HStack>
        <Separator
          position="absolute"
          bottom="-16px"
          left={[-3, -10]}
          right={[-3, -10]}
          borderColor="blackAlpha.300"
          opacity={0.2}
          size={"md"}
        />
      </Box>

      {/* Content */}
      <VStack color="#111" align="stretch" fontSize={["xs", "md"]}>
        {orderDetails.map((item, index) => (
          <React.Fragment key={index}>
            <Flex
              justify="space-between"
              align="center"
              fontFamily={"AmsiProCond"}
              letterSpacing={0.7}
              fontSize={"md"}
            >
              <Text>{item.label}</Text>
              <Text
                textAlign={item.textAlign || "left"}
                maxW={item.maxW || "none"}
              >
                {item.value}
              </Text>
            </Flex>
            {index < orderDetails.length - 1 && (
              <Separator
                borderColor="blackAlpha.300"
                size={"md"}
                opacity={0.2}
                mx={[-3, -10]}
              />
            )}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};
