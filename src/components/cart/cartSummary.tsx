import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  useCalculationStore,
  usePriceCalculations,
  type CalculationItem,
} from "@/store/calculationStore";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { usePaymentStore } from "@/store/paymentStore"; // <- Zustand store

interface SummaryItemProps {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
  fontFamily?: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  label,
  value,
  labelColor = "black",
  valueColor = "black",
  fontFamily = "AmsiProCond",
}) => (
  <Flex justify="space-between">
    <Text color={labelColor} fontFamily={fontFamily} letterSpacing={0.7}>
      {label}
    </Text>
    <Text color={valueColor} fontFamily={fontFamily} letterSpacing={0.7}>
      {value}
    </Text>
  </Flex>
);

type CartSummaryProps = {
  includeDelivery?: boolean;
};

export const CartSummary: React.FC<CartSummaryProps> = () => {
  const cartFromStore = useCartStore((state) => state.cart);
  const setItems = useCalculationStore((state) => state.setItems);
  const deliveryCost = useCalculationStore((state) => state.deliveryCost);

  const summary = usePriceCalculations();

  const { selectedPayment, conversionRate } = usePaymentStore(); // <- Get payment & conversion
  console.log(conversionRate, selectedPayment)
  // Decide currency symbol
  const currencySymbol =
    selectedPayment === "cash"
      ? "Ref"
      : selectedPayment === "online"
      ? "VED"
      : "Ref"; // Example for Bolivars / Zelle

  // Convert all relevant values
  const convertedSubtotal =
    selectedPayment === "cash" ? summary.subtotal : summary.subtotal * (conversionRate || 1);
  const convertedDiscount =
    selectedPayment === "cash" ? summary.discount : summary.discount * (conversionRate || 1);
  const convertedDelivery =
    deliveryCost && selectedPayment !== "cash" ? deliveryCost * (conversionRate || 1) : deliveryCost;
  const convertedTotal =
    selectedPayment === "cash" ? summary.finalTotal : summary.finalTotal * (conversionRate || 1);

  useEffect(() => {
    if (cartFromStore) {
      const transformedItems: CalculationItem[] = cartFromStore.map(
        (item: CartItem) => {
          const priceToUse =
            item.variantPrice && item.variantPrice > 0 ? item.variantPrice : item.price;
          return {
            quantity: item.quantity,
            instructions: item.instructions || "",
            selectedAddons: item.selectedAddons || [],
            product: {
              id: item.id,
              name: item.name,
              price: priceToUse,
              image: item.image,
              discount: item.discount,
              addonItemIds: item.addonItemIds,
              categoryId:
                (item as any).categoryId || (item as any).category?.id,
              volumeDiscountRules:
                (item as any).volumeDiscountRules ||
                (item as any).category?.volumeDiscountRules,
            },
          };
        }
      );
      setItems(transformedItems);
    }
  }, [cartFromStore, setItems]);

  return (
    <Box py={4}>
      <VStack align="stretch" fontSize={"md"}>
        <SummaryItem
          label="Subtotal"
          value={`${currencySymbol} ${convertedSubtotal.toFixed(2)}`}
          fontFamily={"AmsiProCond-Bold"}
        />
        <SummaryItem
          label="Descuento"
          value={`- ${currencySymbol} ${convertedDiscount.toFixed(2)}`}
          labelColor="Cbutton"
          valueColor="Cbutton"
        />
        {deliveryCost > 0 && (
          <SummaryItem
            label="Costo de envío"
            value={`${currencySymbol} ${convertedDelivery.toFixed(2)}`}
            fontFamily={"AmsiProCond"}
          />
        )}
        <SummaryItem
          label="Total final"
          value={`${currencySymbol} ${convertedTotal.toFixed(2)}`}
          fontFamily={"AmsiProCond-Bold"}
        />
      </VStack>
    </Box>
  );
};
