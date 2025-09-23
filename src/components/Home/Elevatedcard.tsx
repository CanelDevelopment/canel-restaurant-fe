import { Box, Card, Button, Stack, Image, Text } from "@chakra-ui/react";
import { BsCart3 } from "react-icons/bs";
import { ProductModal } from "@/components/cart/productModal";
import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAddCart } from "@/hooks/cart/useaddcart";
import { authClient } from "@/provider/user.provider";

export type ElevatedCardProps = {
  description?: string;
  imageSource: string;
  title: string;
  price: string;
  icon?: React.ReactElement;
  buttontext?: string;
  id: string;
  discount: number;
  // itemW?: string | string[];
};

export const Elevatedcard: React.FC<ElevatedCardProps> = ({
  imageSource,
  title,
  description,
  price,
  buttontext,
  discount,
  // itemW,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const addToCart = useCartStore((state) => state.actions.addToCart);
  const { mutate: addCartMutation } = useAddCart();
  const session = authClient.useSession();

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

  const handleAddToCart = (quantity: number, notes: string) => {
    const payload = {
      productId: id,
      quantity: quantity,
      notes: notes,
    };

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

    addToCart({
      id,
      name: title,
      price: numericPrice,
      image: imageSource,
      discount,
      quantity: Number(quantity),
    });

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
          // width={itemW || ["100px", "200px"]}
          width={["120px", "160px"]}
          height={["120px", "160px"]}
          minW={"120px"}
          // bg={"white"}
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
                  fontSize={["xs", "lg"]}
                  fontFamily={"AmsiProCond"}
                  textAlign={"center"}
                  lineHeight={["1.2", "1.5"]}
                >
                  {title}
                </Card.Title>

                <Card.Title
                  color="Cbutton"
                  fontSize={["14px", "2xl"]}
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
                  fontSize={["10px", "lg"]}
                  size={["xs", "md"]}
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
      />
    </Stack>
  );
};
