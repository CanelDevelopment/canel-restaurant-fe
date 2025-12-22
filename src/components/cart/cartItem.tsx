import React from "react";
import { Flex, HStack, Image, Text, Icon, Box } from "@chakra-ui/react";
import { Counter } from "@/components/common/counter";
import { useRemoveFromCart, useUpdateQuantity } from "@/store/cartStore";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRemoveCartItem } from "@/hooks/cart/usedeletecart";
import { useUpdateCartItem } from "@/hooks/cart/useupdatecart";
import { useRemoveAddonCartItem } from "@/hooks/cart/usedeleteaddoncart";

interface AddonItem {
  quantity: number;
  addonItem: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  addons?: AddonItem[];
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  imageUrl,
  quantity,
  addons = [],
}) => {
  const { mutate: removeFromCartMutation } = useRemoveCartItem();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateQuantity();
  const { mutate: updateCartMutation } = useUpdateCartItem();
  const { mutate: removeAddonMutation } = useRemoveAddonCartItem();

  const handleRemoveItem = () => {
    removeFromCart(id);
    removeFromCartMutation(id);
  };

  const handleRemoveAddon = (addonItemId: string) => {
    removeAddonMutation({
      cartItemId: id,
      addonItemId: addonItemId,
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
    updateCartMutation({
      productId: itemId,
      quantity: newQuantity,
    });
  };

  const renderCartRow = (
    item: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      quantity: number;
    },
    onRemove: () => void
  ) => (
    <HStack
      key={item.id}
      justify="space-between"
      align="center"
      width="full"
      py={2}
    >
      <HStack align="center">
        <Image
          loading="lazy"
          src={item.imageUrl}
          alt={item.name}
          boxSize="50px"
          objectFit="cover"
          borderRadius="md"
        />
        <Flex direction="column" justify="center">
          <Text fontSize="md" fontWeight="bold">
            {item.name}
          </Text>
          <Text fontSize="dm" color="gray.500">
            REF {item.price}
          </Text>
        </Flex>
      </HStack>

      <HStack>
        <Counter
          value={item.quantity}
          onChange={(val) => handleQuantityChange(item.id, val)}
          modalBorderColor="#E2E8F0"
        />
        <Icon
          as={FaRegTrashCan}
          cursor="pointer"
          color="gray.400"
          _hover={{ color: "red.500" }}
          onClick={onRemove}
        />
      </HStack>
    </HStack>
  );

  return (
    <Box>
      {/* main product */}
      {renderCartRow({ id, name, price, imageUrl, quantity }, handleRemoveItem)}

      {/* addons as products */}
      {addons.map((addon) =>
        renderCartRow(
          {
            id: addon.addonItem.id,
            name: addon.addonItem.name,
            price: addon.addonItem.price,
            imageUrl: addon.addonItem.image,
            quantity: addon.quantity,
          },
          () => handleRemoveAddon(addon.addonItem.id)
        )
      )}
    </Box>
  );
};
