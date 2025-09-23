import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { IoMdCart } from "react-icons/io";

interface OrderFoodItemProps {
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: string | number;
    orderAddons?: {
      quantity: number;
      addonItem: {
        id: string;
        name: string;
        price: string | number;
      };
    }[];
  }[];
}

export const OrderFoodItem: React.FC<OrderFoodItemProps> = ({ items }) => {
  console.log("items", items);
  return (
    <Box mt={5}>
      {/* Header */}
      <Box bg="#F7FEE0" color="Cbutton" px={[3, 10]} py={8} roundedTop="2xl">
        <HStack fontSize={["lg", "28px"]}>
          <Icon as={IoMdCart} />
          <Text fontFamily={"AmsiProCond-Black"} pb={2}>
            En esta orden:
          </Text>
        </HStack>
      </Box>

      {/* Table Header */}
      <Box bg="#E2F8ED" px={[3, 10]} py={3}>
        <Flex
          color="Cbutton"
          justifyContent={["normal", "space-between"]}
          fontFamily="AmsiProCond-Black"
          gap={4}
          fontSize={["sm", "lg"]}
        >
          <Text width="30%">Nom</Text>
          <Text width="30%" textAlign="center">
            Cantidad
          </Text>{" "}
          {/* Less space */}
          <Text width="20%" textAlign="right">
            Precio
          </Text>{" "}
        </Flex>
      </Box>

      {/* Table Row */}
      <Box bg="#F9FFFC" px={[3, 10]} py={3} roundedBottom={"2xl"}>
        {items &&
          items.map((item) => (
            <Box key={item.id} mb={3}>
              {/* Main Product Row */}
              <Flex
                color="Cbutton"
                justifyContent={["normal", "space-between"]}
                fontFamily={"AmsiProCond"}
                fontSize={["sm", "md"]}
                gap={4}
                py={2}
              >
                <Text width="30%">{item.productName}</Text>
                <Text width="30%" textAlign="center">
                  {item.quantity}
                </Text>
                <Text width="20%" textAlign="right">
                  {item.price}
                </Text>
              </Flex>

              {/* --- Addons --- */}
              {item.orderAddons && item.orderAddons.length > 0 && (
                <Box mt={1}>
                  {item.orderAddons.map((addon) => (
                    <Flex
                      key={addon.addonItem.id}
                      justify="space-between"
                      fontSize="sm"
                      color="gray.600"
                      py={1}
                    >
                      <Text width="30%">
                        ➤ {addon.addonItem.name}{" "}
                        <Text as="span" color="gray.500">
                          (x{addon.quantity})
                        </Text>
                      </Text>
                      <Text width="30%" textAlign="center">
                        {addon.quantity}
                      </Text>
                      <Text width="20%" textAlign="right">
                        {addon.addonItem.price}
                      </Text>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
          ))}
      </Box>
    </Box>
  );
};
