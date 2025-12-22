import { Box, Button, Card, Image, Stack, Text } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { BsCart3 } from "react-icons/bs";
import { useState } from "react";
import { ProductModal } from "../cart/productModal";
import { useCartStore } from "@/store/cartStore";
import { useAddCart } from "@/hooks/cart/useaddcart";
import { authClient } from "@/provider/user.provider";
import type { ProductVariant } from "./Elevatedcard";
// import { BsCart3 } from "react-icons/bs";

export type SolidCardProps = {
  description?: string;
  imageSource: string;
  title: string;
  price: string;
  icon?: React.ReactElement;
  buttontext?: string;
  id: string;
  discount: number;
  addonItemIds: string[] | null;
  imageSize?: string;
  variants: ProductVariant[] | null;
};

export const SolidCard: React.FC<SolidCardProps> = ({
  imageSource,
  title,
  description,
  price,
  discount,
  addonItemIds,
  id,
  variants,
  // imageSize,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { mutate: addCartMutation } = useAddCart();
  const session = authClient.useSession();

  const [selectedProduct, setSelectedProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    quantity: 1,
    variants: null as ProductVariant[] | null,
  });

  const openModal = () => {
    setSelectedProduct({
      title,
      price,
      image: imageSource,
      description: description || "",
      quantity: 1,
      variants,
    });
    setIsOpen(true);
  };

  const handleAddToCart = (quantity: number, notes: string) => {
    const payload = {
      productId: id,
      quantity: quantity,
      notes: notes,
    };

    // const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

    addToCart({
      id,
      name: title,
      price: Number(price),
      image: imageSource,
      discount,
      quantity: Number(quantity),
      addonItemIds,
    });

    if (session.data?.session.userId) {
      addCartMutation(payload);
    }
  };

  return (
    <Stack position="relative">
      <Box mx="auto" width="100%" maxW="260px">
        <Box
          p="1px"
          borderRadius="20px"
          background="linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0))"
          position={"relative"}
          zIndex={9}
        >
          {/* Actual card with transparent background */}
          <Card.Root
            bg="#264C33"
            backdropFilter="blur(10px)"
            border="none"
            rounded="20px"
            py={[6, 8, 2]}
            overflow="hidden"
            position={"relative"}
            zIndex={99}
            height={"100%"}
            // minH={"20vh"}
            h={["290px", "340px"]}
          >
            <Card.Body
              gap={"2"}
              py={[0, 2, 0]}
              px={[2, 4, 3]}
              bg="transparent"
              position="relative"
              zIndex={1}
            >
              {/* CARD IMAGE */}
              <Box display="flex" justifyContent="center">
                <Image
                  loading="lazy"
                  src={imageSource}
                  width={["120px", "140px"]}
                  height={["120px", "140px"]}
                  minW={"120px"}
                  objectFit="contain"
                  objectPosition="center"
                />
              </Box>

              {/* CARD TITLE & PRICE */}
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Card.Title
                  color="white"
                  fontSize={["md", "sm", "xl"]}
                  fontFamily={"AmsiProCond"}
                  fontWeight={400}
                  textAlign={"center"}
                >
                  {title}
                </Card.Title>
                <Card.Header
                  color="Cgreen"
                  p={0}
                  fontSize={["md", "sm", "20px"]}
                  fontFamily={"AmsiProCond-Black"}
                  letterSpacing={1}
                >
                  REF {price}
                </Card.Header>
              </Box>

              {/* CARD DESCRIPTION */}
              <Card.Description
                textAlign="center"
                color="white"
                fontSize={["xs", "xs", "14px"]}
                px={["2", "0"]}
                fontFamily={"AmsiProCond"}
                lineHeight={"1.2"}
                letterSpacing={"1px"}
              >
                <Tooltip content={description}>
                  <Text truncate>{description}</Text>
                </Tooltip>
              </Card.Description>
              <Button
                bg="Cbutton"
                color="#fff"
                fontFamily={"AmsiProCond"}
                fontSize={["sm", "lg"]}
                rounded={"md"}
                borderRadius="lg"
                width="100%"
                size={["xs", "md"]}
                onClick={openModal}
                my={2}
              >
                <BsCart3 />
                Agregar al carrito
              </Button>
            </Card.Body>
          </Card.Root>
        </Box>
      </Box>

      <ProductModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedProduct.title}
        price={selectedProduct.price}
        image={selectedProduct.image}
        description={selectedProduct.description}
        onAddToCart={handleAddToCart}
        variants={selectedProduct.variants}
      />
    </Stack>
  );
};
