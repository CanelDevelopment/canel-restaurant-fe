import {
  Box,
  Button,
  Flex,
  Icon,
  Separator,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useCartItems, useCartActions } from "@/store/cartStore";

interface POSCartProps {
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
  changeRequest: string;
  onCommentChange: (comment: string) => void;
}

export const POSCart: React.FC<POSCartProps> = ({
  onPlaceOrder,
  isPlacingOrder,
  changeRequest,
  onCommentChange,
}) => {
  const cartItems = useCartItems();
  const { removeFromCart } = useCartActions();

  // --- Dynamic Calculations for Display ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  console.log(subtotal);

  const taxRate = 0.1; // 15%
  const tax = subtotal * taxRate;
  // Note: These would become dynamic if needed by adding them to the parent state
  const discount = 0;
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const grandTotal = subtotal + tax + deliveryFee - discount;

  // The local handlePlaceOrder function has been REMOVED.
  // We now use the `onPlaceOrder` function passed down as a prop.

  return (
    <Box
      bgColor={"#FBFFEE"}
      w={["100%", "100%", "300px", "400px"]}
      h="100vh"
      display="flex"
      flexDirection="column"
    >
      <Box p={8} flexShrink={0}>
        <Text color={"#000"} fontSize={"3xl"} fontFamily={"AmsiProCond-Black"}>
          Tu Carrito
        </Text>
      </Box>

      {/* Dynamic Cart Items List */}
      <Box flex="1" overflowY="auto" px={8}>
        {cartItems.length === 0 ? (
          <Text color="gray.500">El carrito esta vacío.</Text>
        ) : (
          cartItems.map((item) => (
            <Box key={item.id} mb={4}>
              <Flex justifyContent={"space-between"} alignItems="center">
                <Text
                  color={"Cbutton"}
                  fontFamily={"AmsiProCond-Black"}
                  textTransform="uppercase"
                  fontSize={"lg"}
                >
                  {item.name}
                </Text>
                <Text
                  color={"#58615A"}
                  fontSize={"md"}
                  fontFamily={"AmsiProCond"}
                >
                  REF {item.price.toFixed(2)}
                </Text>
              </Flex>

              <Flex
                color={"#58615A"}
                fontSize={"sm"}
                gapX={4}
                alignItems="center"
              >
                <Text
                  textDecoration={"underline"}
                  cursor="pointer"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </Text>
              </Flex>
            </Box>
          ))
        )}
        <Separator w={"full"} opacity={0.9} mb={4} />
        <Box py={4} flexShrink={0}>
          {/* This is now a controlled component, managed by the parent */}
          <Textarea
            bgColor={"#F4F4F4"}
            border={"none"}
            rows={3}
            rounded={"md"}
            placeholder="Comentarios e Instrucciones"
            mb={4}
            value={changeRequest}
            onChange={(e) => onCommentChange(e.target.value)}
          />

          <Box color={"#000"} fontSize={"xs"} spaceY={2}>
            <Flex justifyContent={"space-between"}>
              <Text>Total</Text>
              <Text>Ref {subtotal}</Text>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Text>Impuesto 15%</Text>
              <Text>Ref {tax.toFixed(2)}</Text>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Text>Costo de Entrega</Text>
              <Text>Ref {deliveryFee.toFixed(2)}</Text>
            </Flex>
            <Flex
              justifyContent={"space-between"}
              fontFamily={"AmsiProCond-Black"}
              mt={2}
            >
              <Text>Total General</Text>
              <Text>Ref {grandTotal.toFixed(2)}</Text>
            </Flex>
          </Box>
        </Box>
        <Box mt="auto" flexShrink={0}>
          <Button
            w="full"
            bgColor={"black"}
            color={"white"}
            fontFamily={"AmsiProCond"}
            letterSpacing={0.5}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            onClick={onPlaceOrder}
            disabled={cartItems.length === 0 || isPlacingOrder}
          >
            <Text mb={1} as={"span"}>
              Realizar Pedido
            </Text>
            <Icon as={FaLongArrowAltRight} size={"sm"} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
