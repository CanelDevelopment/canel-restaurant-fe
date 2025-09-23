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
} from "@chakra-ui/react";
import { Counter } from "../common/counter";
import { RiArrowRightFill } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";
// import toast from "react-hot-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  price: string;
  description: string;
  onAddToCart: (quantity: number, notes: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  image,
  title,
  price,
  description,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    onAddToCart(quantity, notes);
    onClose();
    setQuantity(1);
    setNotes("");
  };

  console.log();
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
        h={{ base: "90vh", md: "55%" }}
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
              fontSize={{ base: "xs", sm: "sm", md: "sm" }}
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
                fontSize={{ base: "xl", md: "40px" }}
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
              fontSize={{ base: "md", md: "22px" }}
              fontFamily="AmsiProCond-Bold"
            >
              <Text color="Cgreen">REF {price}</Text>
            </Flex>

            <Text
              fontSize={{ base: "xs", sm: "xs", md: "md" }}
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
                bg="#C4C4C4"
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
              _hover={{ bg: "green.500" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={4}
              py={2}
              w={["100%", "80%", "80%"]}
              cursor="pointer"
              fontFamily="AmsiProCond"
              fontSize={["10px", "md"]}
              border="none"
              boxShadow="0 0 0 0.1px #EDEDED"
              textAlign="center"
              color="Black"
              onClick={handleAdd}
            >
              REF {price}
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
