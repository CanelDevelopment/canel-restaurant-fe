import React, { useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Separator,
} from "@chakra-ui/react";
import {
  useCalculationStore,
  usePriceCalculations,
  type CalculationItem,
} from "@/store/calculationStore";

interface ApiAddonItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
}

interface OrderAddon {
  quantity: number;
  addonItem: ApiAddonItem;
}

interface OrderItem {
  quantity: number;
  price: number;
  discount: number;
  orderAddons: OrderAddon[];
}

export type TOrderType = "pickup" | "delivery";

interface OrderPaymentProps {
  order: {
    orderItems: OrderItem[];
    shippingFee?: number;
  };
  orderType: TOrderType;
}

export const OrderPayment: React.FC<OrderPaymentProps> = ({
  order,
  orderType,
}) => {
  const setItems = useCalculationStore((state) => state.setItems);
  const setOrderType = useCalculationStore((state) => state.setOrderType);
  const summary = usePriceCalculations();
  console.log("payment summary", order);
  useEffect(() => {
    if (order && order.orderItems) {
      const transformedItems: CalculationItem[] = order.orderItems.map(
        (item, index) => ({
          quantity: item.quantity,
          selectedAddons: item.orderAddons.map((addon) => ({
            quantity: addon.quantity,
            addonItem: {
              id: addon.addonItem.id,
              name: addon.addonItem.name,
              price: addon.addonItem.price,
              discount: addon.addonItem.discount || 0,
            },
          })),

          product: {
            id: `order-item-${index}`,
            name: "Order Item",
            price: item.price,
            discount: item.discount,
          },
        })
      );

      setItems(transformedItems);
      setOrderType(orderType);
    }
  }, [order, setItems, setOrderType]);

  return (
    <Box flex={1} px={[3, 10]} pt={12} pb={3} position="relative">
      {/* Header */}
      <Box position="relative" mb={6}>
        <HStack fontSize={["lg", "26px"]}>
          <Icon color="Cbutton">
            <Image loading="lazy" src="/Icon/card.png" w="22px" />
          </Icon>
          <Text fontFamily="AmsiProCond-Black" color="Cbutton" pb={2}>
            Pago
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

      {/* Payment Items */}
      <VStack color="#111" align="stretch" fontSize={["xs", "sm"]} mt={8}>
        {/* Subtotal */}
        <Flex
          justify="space-between"
          mb={2.5}
          fontFamily="AmsiProCond"
          fontSize="md"
        >
          <Text>Subtotal</Text>
          <Text>REF {summary.subtotal.toFixed(2)}</Text>
        </Flex>

        {/* Discount (show percent + applied value) */}
        {summary.discount > 0 && (
          <Flex
            justify="space-between"
            mb={2.5}
            fontFamily="AmsiProCond"
            fontSize="md"
            color="Cbutton"
          >
            <Text>Descuento</Text>
            <Text>- REF {summary.discount.toFixed(2)}</Text>
          </Flex>
        )}

        {/* Tax */}
        <Flex
          justify="space-between"
          mb={2.5}
          fontFamily="AmsiProCond"
          fontSize="md"
        >
          <Text>I.V.A (10%)</Text>
          <Text>REF {summary.tax.toFixed(2)}</Text>
        </Flex>

        {/* Shipping Fee */}
        {summary.shippingCost > 0 && (
          <Flex
            justify="space-between"
            mb={2.5}
            fontFamily="AmsiProCond"
            fontSize="md"
          >
            <Text>Costo de envío</Text>
            <Text>REF {summary.shippingCost.toFixed(2)}</Text>
          </Flex>
        )}

        <Separator
          borderColor="blackAlpha.300"
          size={"md"}
          opacity={0.2}
          my={2}
        />

        {/* Final Total */}
        <Flex
          justify="space-between"
          fontFamily="AmsiProCond-Black"
          fontSize="lg"
        >
          <Text>Total final</Text>
          <Text>REF {summary.finalTotal.toFixed(2)}</Text>
        </Flex>
      </VStack>
    </Box>
  );
};
