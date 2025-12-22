import { Box, Card, Button, Stack, Image, Text } from "@chakra-ui/react";
import { BsCart3 } from "react-icons/bs";
import { ProductModal } from "@/components/cart/productModal";
import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAddCart } from "@/hooks/cart/useaddcart";
import { authClient } from "@/provider/user.provider";
import type { VolumeDiscountRules } from "@/store/calculationStore";

export interface ProductVariant {
  name: string;
  price: string;
}

export type ElevatedCardProps = {
  description?: string;
  imageSource: string;
  title: string;
  price: string;
  icon?: React.ReactElement;
  buttontext?: string;
  id: string;
  discount: number;
  addonItemIds: string[] | null;
  volumeDiscountRules?: VolumeDiscountRules | null;
  variants: ProductVariant[] | null;
  categoryId: string;
};

export const Elevatedcard: React.FC<ElevatedCardProps> = ({
  imageSource,
  title,
  description,
  price,
  buttontext,
  discount,
  addonItemIds,
  id,
  variants,
  volumeDiscountRules,
  categoryId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const { mutate: addCartMutation } = useAddCart();
  const session = authClient.useSession();

  // The state for the modal now includes variants
  const [selectedProduct, setSelectedProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    quantity: 1,
  });

  const openModal = () => {
    setSelectedProduct({
      title,
      price,
      image: imageSource,
      description: description || "",
      quantity: 1,
    });
    setIsOpen(true);
  };

  const handleAddToCart = (
    quantity: number,
    notes: string,
    selectedVariant: ProductVariant | null
  ) => {
    const isVariant = selectedVariant !== null;

    const finalPrice = selectedVariant
      ? parseFloat(selectedVariant.price)
      : parseFloat(price.replace(/[^0-9.]/g, ""));

    const finalName = selectedVariant
      ? `${title} (${selectedVariant.name})`
      : title;

    const finalId = selectedVariant ? `${id}-${selectedVariant.name}` : id;
    addToCart({
      id: finalId,
      name: finalName,
      price: finalPrice,
      image: imageSource,
      discount,
      quantity: Number(quantity),
      addonItemIds,
      isVariant, // Variable exists now
      volumeDiscountRules, // Variable exists now
      categoryId,
    });

    const payload = {
      productId: id,
      quantity: quantity,
      notes: notes,
      variantName: selectedVariant?.name ?? undefined,
      variantPrice: Number(selectedVariant?.price ?? null),
    };
    if (session.data?.session.userId) {
      addCartMutation(payload);
    }
  };

  return (
    <Stack position="relative">
      <Box height="100%" mx="auto" width="100%" maxW="260px">
        {/* Product Image */}
        <Box
          position="absolute"
          top={["-64px", "-60px"]}
          left="50%"
          transform="translateX(-50%)"
          zIndex={99}
          width={["120px", "160px"]}
          height={["120px", "160px"]}
          minW={"120px"}
        >
          <Image
            loading="lazy"
            src={imageSource}
            alt={title}
            width={"100%"}
            height="100%"
            objectFit="contain"
            objectPosition="center"
          />
        </Box>

        <Box
          p="1px"
          borderRadius="20px"
          background="linear-gradient(to right, rgba(216,210,210, 1), rgba(255,255,255,0))"
          width="100%"
          position={"relative"}
          zIndex={9}
        >
          <Card.Root
            width="100%"
            bg="#EFEFEF"
            rounded="20px"
            border="none"
            pt={["30px", "80px"]}
            pb={6}
            height="100%"
          >
            <Card.Body px={[2, 4]}>
              <Stack align="center" spaceY={[0.5, 2]}>
                <Card.Title
                  color="#24412E"
                  fontSize={["md", "lg"]}
                  fontFamily={"AmsiProCond"}
                  textAlign={"center"}
                  lineHeight={["1.2", "1.5"]}
                >
                  {title}
                </Card.Title>

                <Card.Title
                  color="Cbutton"
                  fontSize={["md", "2xl"]}
                  fontFamily={"AmsiProCond-Bold"}
                >
                  REF {price}
                </Card.Title>

                <Button
                  color="white"
                  bg="Cbutton"
                  borderRadius="lg"
                  width="100%"
                  onClick={openModal}
                  fontSize={["md", "lg"]}
                  size={["sm", "md"]}
                  fontFamily={"AmsiProCond"}
                >
                  <BsCart3 />
                  <Text pb={1}>{buttontext}</Text>
                </Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Box>
      </Box>

      {/* Product Modal */}
      <ProductModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedProduct.title}
        price={selectedProduct.price}
        image={selectedProduct.image}
        description={selectedProduct.description}
        onAddToCart={handleAddToCart}
        variants={variants}
      />
    </Stack>
  );
};
