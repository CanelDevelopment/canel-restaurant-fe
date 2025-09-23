import { Box, Button, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
import React from "react";
import { CartSummary } from "../cart/cartSummary";
import { useFetchCart } from "@/hooks/cart/usefetchcart";

interface OrderSummaryProps {
  isSubmitting: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ isSubmitting }) => {
  const { data } = useFetchCart();

  return (
    <Box flex={0.6}>
      <Box color={"#111"} bg="Cgreen" p={4} px={6} py={6} rounded="2xl">
        {data?.map((item) => (
          <VStack key={item.id} align="stretch" mb={3}>
            <Flex
              justify="space-between"
              color={"#646464"}
              fontFamily={"AmsiProCond-Black"}
              mb={2}
            >
              <Text fontSize={"2xl"}>
                {item.product.name}{" "}
                <Text as="span" fontSize="md" color="gray.500">
                  (x{item.quantity})
                </Text>
              </Text>
              <Text fontSize={"xl"}>Ref. {item.product.price}</Text>
            </Flex>

            {/* Instructions agar di hui hain */}
            {item.instructions && (
              <Text
                fontSize="sm"
                color="gray.700"
                fontStyle="italic"
                pl={1}
                mt={-1}
              >
                "{item.instructions}"
              </Text>
            )}

            {/* --- Addons display --- */}
            {item.selectedAddons && item.selectedAddons.length > 0 && (
              <VStack align="stretch" pl={4}>
                {item.selectedAddons.map((addon, idx) => (
                  <Flex
                    key={idx}
                    justify="space-between"
                    color="gray.600"
                    fontSize="sm"
                  >
                    <Text>
                      ➤ {addon.addonItem.name}{" "}
                      <Text as="span" color="gray.500">
                        (x{addon.quantity})
                      </Text>
                    </Text>
                    <Text>Ref. {addon.addonItem.price}</Text>
                  </Flex>
                ))}
              </VStack>
            )}
          </VStack>
        ))}
      </Box>

      <Box
        bg="#E2F8ED"
        roundedTop={"2xl"}
        color={"Cbutton"}
        p={4}
        pl={5}
        mt={3}
        fontFamily={"AmsiProCond-Black"}
      >
        <Text fontSize={"2xl"}>Su Orden</Text>
      </Box>

      <Box p={4} color={"#111"} bgColor={"#F9FFFC"} roundedBottom={"2xl"}>
        {/* <VStack
          fontSize={"14px"}
          spaceY={0}
          align="stretch"
          fontFamily={"AmsiProCond"}
        >
          <Flex justify="space-between" fontSize={"md"}>
            <Text>Subtotal</Text>
            <Text>Ref 2</Text>
          </Flex>
          <Flex justify="space-between" fontSize={"md"}>
            <Text>I.V.A</Text>
            <Text>Ref 3</Text>
          </Flex>
          <Flex justify="space-between" fontSize={"md"}>
            <Text>Costo de envío</Text>
            <Text>Ref 3.99</Text>
          </Flex>
          <Flex justify="space-between" fontSize={"md"}>
            <Text color="Cgreen">Descuento</Text>
            <Text color="Cgreen">Ref 2</Text>
          </Flex>
          <Flex justify="space-between" fontFamily={"AmsiProCond-Bold"}>
            <Text>Total final</Text>
            <Text>Ref 21.39</Text>
          </Flex>
        </VStack> */}
        <CartSummary />
      </Box>

      <Button
        type="submit"
        colorScheme="green"
        bgColor={"Cbutton"}
        color={"#fff"}
        width="full"
        mt={4}
        fontFamily={"AmsiProCond"}
        pb={2}
        fontSize={"lg"}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner size="sm" /> : "Ordenar"}
      </Button>
    </Box>
  );
};
