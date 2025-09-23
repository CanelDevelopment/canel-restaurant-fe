import { Box, Flex, Icon, Text, useBreakpointValue } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FrequentCard } from "./frequentCard";
import { useState } from "react";
import { useCartActions } from "@/store/cartStore";
import { useCreateAddonToCart } from "@/hooks/cart/usecreateaddoncart";

interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
  productId: string;
  quantity: number;
}

interface Addon {
  addonId: string;
  addonName: string;
  items: {
    id: string;
    name: string;
    price: number;
    image: string;
    discount?: number;
    productId: string;
    quantity: number;
  }[];
}

interface FrequentOrderProps {
  addons: Addon[];
}

export const FrequentOrder: React.FC<FrequentOrderProps> = ({ addons }) => {
  const numberOfCards = useBreakpointValue({ base: 2, md: 3, lg: 4 }) || 2;

  const [currentIndex, setCurrentIndex] = useState(0);

  const { addToCart } = useCartActions();
  const { mutate: createAddonToCartMutation } = useCreateAddonToCart();

  const handleAddToCart = (item: Item) => {
    // const qty = ;

    const itemForCart = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      addonItemIds: [],
      isAddon: true,
      quantity: item.quantity ?? 1,
      discount: item.discount ?? 0,
    };

    createAddonToCartMutation(
      {
        productId: item.productId,
        addonItemId: item.id,
        quantity: item.quantity ?? 1,
      },
      {
        onSuccess: () => {
          addToCart(itemForCart);
        },
      }
    );
  };

  if (!addons || addons.length === 0) {
    return null;
  }

  const allRelevantItems = addons.flatMap((group) => group.items);
  const totalItems = allRelevantItems.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + numberOfCards;
      return nextIndex >= totalItems ? prevIndex : nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - numberOfCards;
      return nextIndex < 0 ? 0 : nextIndex;
    });
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + numberOfCards >= totalItems;

  return (
    <Box py={4}>
      <Flex align="center" justify="space-between" mb={8}>
        <Box>
          <Text
            fontFamily={"AmsiProCond-Black"}
            color="Cbutton"
            fontSize={"lg"}
          >
            Llevados en conjunto
          </Text>
          <Text
            fontFamily={"AmsiProCond"}
            letterSpacing={0.7}
            fontSize="14px"
            color="gray.600"
          >
            Pedidos frecuentemente por nuestros clientes
          </Text>
        </Box>

        <Flex gap={3}>
          {/* 5. Attach handlers and add disabled states to the buttons */}
          <Box
            border={"1px solid"}
            borderColor={isPrevDisabled ? "gray.300" : "black"}
            py={1}
            px={2}
            rounded={"md"}
            onClick={!isPrevDisabled ? handlePrev : undefined}
            cursor={isPrevDisabled ? "not-allowed" : "pointer"}
            opacity={isPrevDisabled ? 0.5 : 1}
          >
            <Icon
              as={FaChevronLeft}
              boxSize={3}
              mb={1}
              color={isPrevDisabled ? "gray.300" : "black"}
            />
          </Box>
          <Box
            border={"1px solid"}
            borderColor={isNextDisabled ? "gray.300" : "black"}
            py={1}
            px={2}
            rounded={"md"}
            onClick={!isNextDisabled ? handleNext : undefined}
            cursor={isNextDisabled ? "not-allowed" : "pointer"}
            opacity={isNextDisabled ? 0.5 : 1}
          >
            <Icon
              as={FaChevronRight}
              boxSize={3}
              mb={1}
              color={isNextDisabled ? "gray.300" : "black"}
            />
          </Box>
        </Flex>
      </Flex>

      <Flex gapX={4} flexWrap="nowrap">
        {" "}
        {allRelevantItems
          .slice(currentIndex, currentIndex + numberOfCards)
          .map((item) => (
            <FrequentCard
              key={item.id}
              imageSource={item.image || "/default-image.png"} // Added a fallback image
              title={item.name}
              price={Number(item.price)}
              onAdd={() => handleAddToCart(item)}
            />
          ))}
      </Flex>
    </Box>
  );
};
