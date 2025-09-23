import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  useCalculationStore,
  usePriceCalculations,
  type CalculationItem,
} from "@/store/calculationStore";
import { useCartStore, type CartItem } from "@/store/cartStore";

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

  const summary = usePriceCalculations();

  useEffect(() => {
    if (cartFromStore) {
      const transformedItems: CalculationItem[] = cartFromStore.map(
        (item: CartItem) => {
          return {
            quantity: item.quantity,
            instructions: item.instructions || "",
            selectedAddons: item.selectedAddons || [],
            product: {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              discount: item.discount,
              addonItemIds: item.addonItemIds,
            },
          };
        }
      );
      setItems(transformedItems);
    }
  }, [cartFromStore, setItems]);

  return (
    <Box py={4}>
      <VStack align="stretch" fontSize={"sm"}>
        <SummaryItem
          label="Subtotal"
          value={`Ref ${summary.subtotal.toFixed(2)}`}
          fontFamily={"AmsiProCond-Bold"}
        />
        <SummaryItem
          label="Descuento"
          value={`- Ref ${summary.discount.toFixed(2)}`}
          labelColor="Cbutton"
          valueColor="Cbutton"
        />
        <SummaryItem
          label="I.V.A (10%)"
          value={`Ref ${summary.tax.toFixed(2)}`}
          fontFamily={"AmsiProCond"}
        />
        {summary.shippingCost > 0 && (
          <SummaryItem
            label="Costo de envío"
            value={`Ref ${summary.shippingCost.toFixed(2)}`}
            fontFamily={"AmsiProCond"}
          />
        )}
        <SummaryItem
          label="Total final"
          value={`Ref ${summary.finalTotal.toFixed(2)}`}
          fontFamily={"AmsiProCond-Bold"}
        />
      </VStack>
    </Box>
  );
};
