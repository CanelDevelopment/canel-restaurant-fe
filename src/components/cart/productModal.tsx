import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Textarea,
  Heading,
  Spacer,
  Icon,
  Button,
} from "@chakra-ui/react";
import { Counter } from "../common/counter";
import { RiArrowRightFill } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";

interface ProductVariant {
  name: string;
  price: string;
}
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  price: string;
  description: string;
  variants: ProductVariant[] | null;
  onAddToCart: (
    quantity: number,
    notes: string,
    selectedVariant: ProductVariant
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  image,
  title,
  price,
  description,
  onAddToCart,
  variants,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const safeVariants = Array.isArray(variants) ? variants : [];

    if (safeVariants.length > 0) {
      setSelectedVariant(safeVariants[0]);
    } else {
      setSelectedVariant(null);
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, variants]);

  if (!isOpen) return null;

  const handleAdd = () => {
    onAddToCart(quantity, notes, selectedVariant!);
    toast.success("¡Artículo agregado al carrito!");
    onClose();
    setQuantity(1);
    setNotes("");
  };

  const displayPrice = selectedVariant ? selectedVariant.price : price;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="blackAlpha.600"
        zIndex={9999}
        onClick={onClose}
      />

      {/* Modal Content */}
      <Flex
        direction={{ base: "column", md: "row" }}
        bg="white"
        borderRadius="3xl"
        overflow="hidden"
        maxW={{ base: "95%", sm: "500px", md: "800px" }}
        maxH={{ base: "90vh", md: "800px" }}
        w="full"
        h={{ base: "90vh", md: "65%" }}
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={10000}
        onClick={(e) => e.stopPropagation()}
        borderX="3px solid #5EA988"
        borderY="1px solid #5EA988"
      >
        {/* Left section */}
        <Box
          flex={{ base: "1", md: "0 0 38%" }}
          px={{ base: 6, md: 8 }}
          py={{ base: 6, md: 0 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          position="relative"
          overflow="hidden"
          bgColor="#F2F2F2"
          minH={{ base: "200px", md: "auto" }}
        >
          {/* Inside Left Section: Replace Static Image */}
          <Image
            loading="lazy"
            src={image}
            alt={title}
            width={{ base: "60%", sm: "50%", md: "90%" }}
            mx="auto"
            mb={{ base: 3, md: 4 }}
          />

          <Box px={{ base: 2, md: 0 }}>
            <Text
              fontSize={{ base: "sm", sm: "sm", md: "md" }}
              lineHeight="shorter"
              letterSpacing={"0.7px"}
              color="#000"
              textAlign="justify"
              fontFamily={"AmsiProCond"}
              pb={{ sm: 4 }}
            >
              {description}
            </Text>
          </Box>
        </Box>

        {/* Right section */}
        <Box
          flex={{ base: "1", md: "0 0 62%" }}
          bg="white"
          position={["static", "static", "relative"]}
          pb={["10px", "80px"]}
          py={[0, 0, 4]}
        >
          <Box p={{ base: 4, md: 6 }}>
            <Flex justify="space-between" align="start" mb={2}>
              {/* Inside Right Section: Replace Static Title and Price */}
              <Heading
                fontSize={{ base: "2xl", md: "40px" }}
                fontWeight="bold"
                color="Cbutton"
                as="h2"
                fontFamily="AmsiProCond-Bold"
              >
                {title}
              </Heading>

              <Icon
                onClick={onClose}
                color="#fff"
                position="absolute"
                top={{ base: 3, md: 2.5 }}
                right={{ base: 3, md: 3 }}
                boxSize={{ base: 5, md: 4 }}
                cursor="pointer"
                background="#243F2D"
                rounded="full"
                p={0.5}
              >
                <FaXmark />
              </Icon>
            </Flex>

            <Flex
              mt={2}
              gap={5}
              align="center"
              fontSize={{ base: "lg", md: "22px" }}
              fontFamily="AmsiProCond-Bold"
              color="Cbutton"
            >
              <Text>REF {displayPrice}</Text>
            </Flex>

            {variants && variants.length > 0 && (
              <Box mt={{ base: 3, md: 5 }}>
                <Text
                  fontSize="md"
                  fontFamily="AmsiProCond"
                  color="#000"
                  mb={2}
                  fontWeight="bold"
                >
                  Elige una opción:
                </Text>
                <Flex wrap="wrap" gap={2}>
                  <Button
                    onClick={() => setSelectedVariant(null)}
                    size="sm"
                    fontFamily="AmsiProCond"
                    bg={selectedVariant === null ? "Cbutton" : "gray.200"}
                    color={selectedVariant === null ? "white" : "black"}
                    _hover={{
                      bg: selectedVariant === null ? "Cbutton" : "gray.300",
                    }}
                  >
                    Default
                  </Button>
                  {variants.map((variant) => (
                    <Button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant)}
                      size="sm"
                      fontFamily="AmsiProCond"
                      // Style the button differently if it's selected
                      // isActive={selectedVariant?.name === variant.name}
                      bg={
                        selectedVariant?.name === variant.name
                          ? "Cbutton"
                          : "gray.200"
                      }
                      color={
                        selectedVariant?.name === variant.name
                          ? "white"
                          : "black"
                      }
                      _hover={{
                        bg:
                          selectedVariant?.name === variant.name
                            ? "Cbutton"
                            : "gray.300",
                      }}
                    >
                      {variant.name}
                    </Button>
                  ))}
                </Flex>
              </Box>
            )}

            <Text
              fontSize={{ base: "sm", sm: "sm", md: "md" }}
              letterSpacing={"0.7px"}
              fontFamily="AmsiProCond"
              color="#000"
              mt={{ base: 3, md: 5 }}
              mb={2}
            >
              Observaciones para el producto:
            </Text>

            <Box position="relative">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escriba su observación"
                bg="#F5F5F5"
                color="#000"
                border="none"
                rounded="md"
                minH="96px"
                pl={6}
                _placeholder={{ color: "#646464" }}
                _focus={{ boxShadow: "outline" }}
                fontSize="xs"
                fontFamily="AmsiProCond-light"
                letterSpacing={"0.5px"}
                py={3}
                px={4}
              />
              <Box
                position="absolute"
                left="12px"
                top="12px"
                bottom="8px"
                height={"20px"}
                w="1px"
                bg="#646464"
                pointerEvents="none"
              />
            </Box>
          </Box>

          <Flex
            position={{ base: "static", md: "absolute" }}
            direction={{ base: "column", sm: "row" }}
            bottom={0}
            left={0}
            right={0}
            px={[3, 7]}
            py={[3, 5]}
            bgColor="Cbutton"
            align={["stretch", "center", "center"]}
            gap={{ base: 3, sm: 4 }}
            zIndex={10}
          >
            <Counter
              value={quantity}
              onChange={setQuantity}
              borderColor="none"
              incrementBg="#fff"
              incrementColor="Cbutton"
              decrementBg="#fff"
              decrementColor="Cbutton"
              decrementPadding={1.5}
              dBoxSizeSM={2.5}
              iBoxSizeSM={3}
              modalBorderColor={"#646464"}
              boxSize={3.5}
            />

            <Box
              bg="#fff"
              borderRadius="md"
              _hover={{ bg: "#fff", opacity: 0.5 }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={4}
              py={2}
              w={["100%", "80%", "80%"]}
              cursor="pointer"
              fontFamily="AmsiProCond"
              fontSize={["sm", "md"]}
              border="none"
              boxShadow="0 0 0 0.1px #EDEDED"
              textAlign="center"
              color="Black"
              onClick={handleAdd}
            >
              <Text fontWeight={600}>REF {displayPrice}</Text>
              <Spacer />
              <Text mr={1}>Agregar al carrito</Text>
              <Icon as={RiArrowRightFill} color="Cbutton" />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
