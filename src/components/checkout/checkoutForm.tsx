import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Textarea,
  Image,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// import { FaPlus } from "react-icons/fa6";
import { useFormContext } from "react-hook-form";
import { MdOutlinePayment } from "react-icons/md";
import OnlinePaymentUI from "./onlinepayment";

export interface OrderForm {
  name: string;
  location: string;
  phoneNumber: number;
  rif: string;
  nearestLandmark: string;
  email: string;
  changeRequest: string;
  cartId?: string;
  deliveryType: string;
  instructions?: string;
}

export const CheckoutForm: React.FC = () => {
  const { register } = useFormContext<OrderForm>();

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("cash");

  const handlePaymentSelection = (paymentMethod: string) => {
    setSelectedPayment(paymentMethod);
  };
  useEffect(() => {
    const savedArea = localStorage.getItem("selectedArea");
    if (savedArea) {
      setSelectedArea(savedArea);
    }
  }, []);

  return (
    <Box flex={1} bg="#F9FFFC" p={6} rounded="md">
      <Text
        color={"Cbutton"}
        fontSize="3xl"
        fontFamily={"AmsiProCond-Black"}
        mb={2}
      >
        Checkout
      </Text>
      <Text fontSize="md" color="gray.500" mb={6} fontFamily={"AmsiProCond"}>
        Introduzca sus datos para el pedido
      </Text>

      <Stack color={"#111"}>
        {/* First Row */}
        <Stack
          direction={{ base: "column", md: "row" }}
          fontFamily={"AmsiProCond"}
        >
          {/* <Box>
            <Text mb={1}>Title</Text>
            <Box
              w="100px"
              h="50px"
              border="1px solid #E2E8F0"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={4}
              cursor="pointer"
              bg="white"
            >
              <Text fontSize="md" color="#9F9C9C">
                Mr.
              </Text>
              <Box h="40%" w="1px" bg="gray.300" mx={2}></Box>
              <Icon w={5} h={5} color="#9F9C9C">
                <IoIosArrowDown />
              </Icon>
            </Box>
          </Box> */}

          <Box w="100%">
            <Text mb={1} display={"flex"} justifyContent={"space-between"}>
              Nom et prénom
              <Text
                as="span"
                color="red.500"
                fontFamily={"AmsiProCond-Black"}
                fontStyle={"italic"}
                letterSpacing={0.7}
              >
                *Obligatorio
              </Text>
            </Text>
            <Input
              placeholder="Nom et prénom"
              py={6}
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              {...register("name", {
                required: "El nombre completo es obligatorio",
              })}
            />
          </Box>
        </Stack>

        {/* Second row of inputs */}
        <Stack
          fontFamily={"AmsiProCond"}
          mt={4}
          direction={{ base: "column", md: "row" }}
        >
          <Box w="100%">
            <Text mb={1} display={"flex"} justifyContent={"space-between"}>
              Teléfono
              <Text
                as="span"
                color="red.500"
                fontFamily={"AmsiProCond-Black"}
                fontStyle={"italic"}
                letterSpacing={0.7}
              >
                *Obligatorio
              </Text>
            </Text>
            <Input
              placeholder="03xx- xxx xxxx"
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              py={6}
              type="tel"
              {...register("phoneNumber", {
                maxLength: 11,
                minLength: 11,
                pattern: /^[0-9]+$/,
              })}
            />
          </Box>

          <Box w="100%">
            <Text mb={1} display={"flex"} justifyContent={"space-between"}>
              Cédula o Rif
              <Text
                as="span"
                color="red.500"
                fontFamily={"AmsiProCond-Black"}
                fontStyle={"italic"}
                letterSpacing={0.7}
              >
                *Obligatorio
              </Text>
            </Text>
            <Input
              placeholder="Cédula o Rif"
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              py={6}
              {...register("rif")}
            />
          </Box>
        </Stack>

        {/* Delivery Input */}
        <Box fontFamily={"AmsiProCond"} bg="#F7FFFB" mt={4}>
          <Text mb={1} display={"flex"} justifyContent={"space-between"}>
            Adresse de livraison
            <Text
              as="span"
              color="red.500"
              fontFamily={"AmsiProCond-Black"}
              fontStyle={"italic"}
              letterSpacing={0.7}
            >
              *Obligatorio
            </Text>
          </Text>

          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            rounded="md"
            overflow="hidden"
          >
            <Input
              placeholder="Adresse de livraison"
              bg="#fff"
              roundedStart={{ md: "md" }}
              fontSize="sm"
              borderTop="1px solid #E2E8F0"
              borderBottom="1px solid #E2E8F0"
              borderLeft="1px solid #E2E8F0"
              borderRight={{ base: "1px solid #E2E8F0", md: "0 solid #E2E8F0" }}
              py={6}
              _focusVisible={{ boxShadow: "none" }}
              {...register("location")}
            />
            <Box
              bg="Cbutton"
              color="#fff"
              fontSize="sm"
              px={4}
              py={3.5}
              whiteSpace="nowrap"
              textAlign="center"
              cursor="pointer" // Make it look clickable
            >
              {selectedArea || "Seleccionar área"}
            </Box>
          </Box>
        </Box>

        {/* <Button
          colorScheme="blackAlpha"
          bgColor={"Cbutton"}
          color={"#fff"}
          w="fit-content"
          fontFamily={"AmsiProCond"}
          mt={4}
          fontSize={"md"}
        >
          <FaPlus />
          <Text mb={0.5}>Agregar nueva dirección</Text>
        </Button> */}

        {/* Landmark and Email */}
        <Stack
          fontFamily={"AmsiProCond"}
          direction={{ base: "column", md: "row" }}
          mt={4}
        >
          <Box w="100%">
            <Text mb={1}>Point de repère le plus proche</Text>
            <Input
              placeholder="Point de repère le plus proche"
              borderColor={"#eaeaea"}
              bgColor={"#fff"}
              py={6}
              rounded={"md"}
              {...register("nearestLandmark")}
            />
          </Box>
          <Box w="100%">
            <Text mb={1}>Adresse email</Text>
            <Input
              placeholder="Introduzca su adresse email "
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              py={6}
              rounded={"md"}
              type="email"
              {...register("email")}
            />
          </Box>
        </Stack>

        {/* Instructions */}
        <Box fontFamily={"AmsiProCond"} mt={4}>
          <Text mb={1}>Instrucciones para el delivery</Text>
          <Textarea
            placeholder="Instrucciones para el delivery"
            name="description"
            borderColor={"#eaeaea"}
            py={5}
            bgColor={"#fff"}
            rounded={"md"}
          />
        </Box>

        {/* Cash on Delivery */}
        <Flex gapX={4} fontFamily={"AmsiProCond"} mt={4}>
          <Button
            color={"#222"}
            bgColor={"#E7EEEB"}
            display={"flex"}
            flexDirection={"column"}
            height={"max-content"}
            size="lg"
            rounded={"lg"}
            py={2}
            onClick={() => handlePaymentSelection("cash")}
            borderWidth={selectedPayment === "cash" ? "2px" : "0px"}
            borderColor={
              selectedPayment === "cash" ? "blue.500" : "transparent"
            }
          >
            <Image src="/Background/cash_icon.png" loading="lazy" w={"30%"} />
            Cash on Delivery
          </Button>
          <Button
            color={"#222"}
            bgColor={"#E7EEEB"}
            display={"flex"}
            flexDirection={"column"}
            height={"max-content"}
            size="lg"
            rounded={"lg"}
            py={2}
            onClick={() => handlePaymentSelection("online")}
            borderWidth={selectedPayment === "online" ? "2px" : "0px"}
            borderColor={
              selectedPayment === "online" ? "blue.500" : "transparent"
            }
          >
            {/* <Image src="/Background/cash_icon.png" w={"30%"} /> */}
            <MdOutlinePayment />
            Online Payment
          </Button>
        </Flex>

        {selectedPayment === "cash" ? (
          <Box fontFamily={"AmsiProCond"} mt={4}>
            <Text fontWeight="medium" mb={2}>
              Demande de changement
            </Text>

            <Box
              display="flex"
              alignItems="center"
              border="1px solid #eaeaea"
              rounded="md"
              overflow="hidden"
            >
              <Box
                px={4}
                py={2}
                fontSize="sm"
                borderRight="1px solid #eaeaea"
                bg="#fff"
                whiteSpace="nowrap"
              >
                Ref
              </Box>
              <Input
                placeholder="50"
                border="none"
                borderRadius="0"
                _focusVisible={{ boxShadow: "none" }}
                fontSize="sm"
                bg={"#fff"}
                {...register("changeRequest")}
              />
            </Box>
          </Box>
        ) : (
          <OnlinePaymentUI />
        )}

        {/* Change Request */}
      </Stack>
    </Box>
  );
};
