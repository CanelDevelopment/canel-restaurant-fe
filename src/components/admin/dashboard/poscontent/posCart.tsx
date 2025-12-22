import {
  Box,
  Button,
  Flex,
  Icon,
  Separator,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useCartItems, useRemoveFromCart } from "@/store/cartStore";
import type { Branch } from "./posContent";

interface POSCartProps {
  onPlaceOrder: () => void;
  placePrintOrder: () => void;
  isPlacingOrder: boolean;
  changeRequest: string;
  onCommentChange: (comment: string) => void;
  selectedBranch?: Branch;
}

export const POSCart: React.FC<POSCartProps> = ({
  onPlaceOrder,
  placePrintOrder,
  isPlacingOrder,
  changeRequest,
  onCommentChange,
  selectedBranch,
}) => {
  const cartItems = useCartItems();
  const removeFromCart = useRemoveFromCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = 0;
  const deliveryFee = useMemo(() => {
    if (subtotal === 0 || !selectedBranch) {
      return 0;
    }
    console.log("selectedBranch");

    return selectedBranch.deliveryRate ?? 0;
  }, [subtotal, selectedBranch]);

  const grandTotal = subtotal + deliveryFee - discount;

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

      {/* Lista dinámica de artículos del carrito */}
      <Box flex="1" overflowY="auto" px={8}>
        {cartItems.length === 0 ? (
          <Text color="gray.500">El carrito está vacío.</Text>
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
                  REF {item.price}
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
                  Eliminar
                </Text>
              </Flex>
            </Box>
          ))
        )}
        <Separator w={"full"} opacity={0.9} mb={4} />
        <Box py={4} flexShrink={0}>
          {/* Comentarios controlados por el estado del padre */}
          <Textarea
            bgColor={"#F4F4F4"}
            border={"none"}
            rows={3}
            rounded={"md"}
            placeholder="Comentarios e instrucciones"
            mb={4}
            value={changeRequest}
            onChange={(e) => onCommentChange(e.target.value)}
          />

          <Box color={"#000"} fontSize={"xs"} spaceY={2}>
            <Flex justifyContent={"space-between"}>
              <Text>Subtotal</Text>
              <Text>Ref {subtotal.toFixed(2)}</Text>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Text>Costo de entrega</Text>
              <Text>Ref {deliveryFee}</Text>
            </Flex>
            <Flex
              justifyContent={"space-between"}
              fontFamily={"AmsiProCond-Black"}
              mt={2}
            >
              <Text>Total general</Text>
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
              Realizar pedido
            </Text>
            <Icon as={FaLongArrowAltRight} size={"sm"} />
          </Button>

          <Button
            w="full"
            mt={3}
            bgColor={"#38A169"}
            color={"white"}
            fontFamily={"AmsiProCond"}
            letterSpacing={0.5}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            onClick={placePrintOrder}
            disabled={cartItems.length === 0 || isPlacingOrder}
            _hover={{ bgColor: "#2F855A" }}
          >
            <Text mb={1} as={"span"}>
              Realizar y Imprimir
            </Text>
            <Icon as={FaLongArrowAltRight} size={"sm"} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
