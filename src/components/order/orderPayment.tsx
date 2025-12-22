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
import {
  getCoordinatesFromAddress,
  getDeliveryPrice,
  getDistanceInKm,
} from "@/helper/calculationofdistance";

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
  product?: {
    id: string;
    name: string;
    categoryId?: string;
    volumeDiscountRules?: any;
    category?: {
      id: string;
      volumeDiscountRules?: any;
    };
  };
  categoryId?: string;
  volumeDiscountRules?: any;
}

export type TOrderType = "pickup" | "delivery";

interface OrderPaymentProps {
  order: {
    orderItems: OrderItem[];
    shippingFee?: number;
    location?: string;
    branch?: {
      location: string;
      deliveryRates?: any;
      [key: string]: any;
    };
  };

  orderType: TOrderType;
}

export const OrderPayment: React.FC<OrderPaymentProps> = ({
  order,
  orderType,
}) => {
  const { setItems, setDeliveryCost, setOrderType } = useCalculationStore();

  const summary = usePriceCalculations();
  const deliveryCost = useCalculationStore((state) => state.deliveryCost);

  useEffect(() => {
    const initializeOrder = async () => {
      if (!order || !order.orderItems) return;

      const transformedItems: CalculationItem[] = order.orderItems.map(
        (item, index) => {
          const categoryId =
            item.categoryId ||
            item.product?.categoryId ||
            item.product?.category?.id;

          const volumeDiscountRules =
            item.volumeDiscountRules ||
            item.product?.volumeDiscountRules ||
            item.product?.category?.volumeDiscountRules;
          console.log(item);
          return {
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
              categoryId,
              volumeDiscountRules,
            },
          };
        }
      );

      setItems(transformedItems);
      setOrderType(orderType);

      if (typeof order.shippingFee === "number" && order.shippingFee > 0) {
        setDeliveryCost(order.shippingFee);
        return;
      }

      if (orderType === "delivery" && order.branch && order.location) {
        try {
          const branchLocArray = JSON.parse(order.branch.location);
          const warehouseLocation = {
            lat: branchLocArray[0],
            lng: branchLocArray[1],
          };

          // B. Geocode User Address (String -> {lat, lng})
          const userLocation = await getCoordinatesFromAddress(order.location);

          if (userLocation) {
            // C. Get Distance
            const distance = await getDistanceInKm(
              warehouseLocation,
              userLocation
            );

            const rates = (order.branch as any).deliveryRates || [];

            const cost = getDeliveryPrice(distance, rates);

            setDeliveryCost(cost);
          }
        } catch (error) {
          console.error("Error calculating delivery cost:", error);
        }
      }
    };

    initializeOrder();
  }, [order, orderType, setItems, setOrderType, setDeliveryCost]);

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
          <Text>REF {summary.subtotal}</Text>
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
        {/* <Flex
          justify="space-between"
          mb={2.5}
          fontFamily="AmsiProCond"
          fontSize="md"
        >
          <Text>I.V.A (10%)</Text>
          <Text>REF {summary.tax.toFixed(2)}</Text>
        </Flex> */}

        {/* Shipping Fee */}
        {deliveryCost > 0 && (
          <Flex
            justify="space-between"
            mb={2.5}
            fontFamily="AmsiProCond"
            fontSize="md"
          >
            <Text>Costo de envío</Text>
            <Text>REF {deliveryCost}</Text>
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
