import { Box, Button, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
import React from "react";
import { CartSummary } from "../cart/cartSummary";
import { useFetchCart } from "@/hooks/cart/usefetchcart";
import { usePaymentStore } from "@/store/paymentStore"; // Zustand store

interface OrderSummaryProps {
  isSubmitting: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ isSubmitting }) => {
  const { data } = useFetchCart();
  const { selectedPayment, conversionRate } = usePaymentStore(); // <- get conversionRate

  // Payment labels & symbols
  const paymentLabelMap: Record<string, string> = {
    cash: "Efectivo",
    online: "Bolivares",
    bolivars: "Zelle",
  };
  const currencySymbolMap: Record<string, string> = {
    cash: "Ref",
    online: "$",
    bolivars: "Ref",
  };
  const paymentLabel = paymentLabelMap[selectedPayment] || "Efectivo";
  const currencySymbol = currencySymbolMap[selectedPayment] || "Ref";

  return (
    <Box flex={0.6}>
      <Box color={"#111"} bg="Cgreen" p={4} px={6} py={6} rounded="2xl">
        {data?.map((item) => {
          const basePrice =
            item.variantPrice && item.variantPrice > 0
              ? item.variantPrice
              : item.product.price;
          const convertedPrice =
            selectedPayment === "cash" ? basePrice : basePrice * (conversionRate || 1);

          return (
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
                <Text fontSize={"xl"}>
                  {currencySymbol} {convertedPrice}
                </Text>
              </Flex>

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

              {item.selectedAddons && item.selectedAddons.length > 0 && (
                <VStack align="stretch" pl={4}>
                  {item.selectedAddons.map((addon, idx) => {
                    const addonPrice =
                      selectedPayment === "cash"
                        ? addon.addonItem.price
                        : addon.addonItem.price * (conversionRate || 1);

                    return (
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
                        <Text>
                          {currencySymbol} {addonPrice.toFixed(2)}
                        </Text>
                      </Flex>
                    );
                  })}
                </VStack>
              )}
            </VStack>
          );
        })}
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
        <Text mt={1} fontSize="md" color="gray.700">
          Método de Pago: {paymentLabel}
        </Text>
      </Box>

      <Box p={4} color={"#111"} bgColor={"#F9FFFC"} roundedBottom={"2xl"}>
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
        fontWeight={"semibold"}
      >
        {isSubmitting ? <Spinner size="sm" /> : "Ordenar"}
      </Button>
    </Box>
  );
};
