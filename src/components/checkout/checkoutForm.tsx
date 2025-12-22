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
import { useFormContext } from "react-hook-form";
import { MdOutlinePayment } from "react-icons/md";
import { BsBank } from "react-icons/bs"; // Added icon for Bank
import OnlinePaymentUI from "./onlinepayment";
import { authClient } from "@/provider/user.provider";
import MapPicker from "./mappicker";
import { useCalculationStore } from "@/store/calculationStore";
import {
  getDeliveryPrice,
  getDistanceInKm,
} from "@/helper/calculationofdistance";
import toast from "react-hot-toast";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";
import { usePaymentStore } from "@/store/paymentStore";
import { useFetchConversion } from "@/hooks/payment/usefetchconversion";

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
  paymentSS?: File;
}

export const CheckoutForm: React.FC = () => {
  const userData = authClient.useSession();
  const userEmail = userData.data?.user.email;
  const userPhoneNumber = userData.data?.user.phoneNumber;

  const [_selectedArea, setSelectedArea] = useState<string | null>(null);
  
  // const [selectedPayment, setSelectedPayment] = useState("cash");
  const { selectedPayment, setSelectedPayment } = usePaymentStore();
  useFetchConversion()
  // console.log(first)

  const {
    register,
    setValue,
    unregister,
    formState: { errors },
  } = useFormContext<OrderForm>();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState("");

  const { setDeliveryCost } = useCalculationStore();

  const handlePaymentSelection = (paymentMethod: "cash" | "online" | "bolivars") => {
    setSelectedPayment(paymentMethod);

    // Cleanup: If switching AWAY from bolivars, remove the image validation and value
    if (paymentMethod !== "bolivars") {
      setValue("paymentSS", undefined); // Clear the file
      unregister("paymentSS"); // Remove validation rule
    }
  };

  useEffect(() => {
    const savedArea = localStorage.getItem("selectedArea");
    if (savedArea) {
      setSelectedArea(savedArea);
    }
  }, []);

  const branchDetailsRaw = localStorage.getItem("selectedBranch");
  let warehouseLocation = { lat: 0, lng: 0 };
  let branchDeliveryRate: any = [];

  if (branchDetailsRaw) {
    const branchDetails = JSON.parse(branchDetailsRaw);
    const locationArray = JSON.parse(branchDetails.location);
    branchDeliveryRate = branchDetails.deliveryRates;
    warehouseLocation = { lat: locationArray[0], lng: locationArray[1] };
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
              import.meta.env.VITE_GOOGLE_MAP_KEY
            }`
          );

          const data = await res.json();
          const address =
            data?.results?.[0]?.formatted_address || "Dirección no encontrada";

          setMapAddress(address);
          setValue("location", address);

          const distance = await getDistanceInKm(warehouseLocation, {
            lat,
            lng,
          });

          const cost = Math.ceil(distance * branchDeliveryRate);
          setDeliveryCost(cost);
        } catch (err) {
          console.error("Geo error:", err);
          toast.error("No se pudo obtener la dirección.");
        }
      },
      () => {
        toast.error("No se pudo obtener tu ubicación");
      }
    );
  };

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
        Introduzca sus datos para realizar el pedido
      </Text>

      <Stack color={"#111"}>
        {/* ... (First Row: Name) - Kept same ... */}
        <Stack
          direction={{ base: "column", md: "row" }}
          fontFamily={"AmsiProCond"}
        >
          <Box w="100%">
            <Text mb={1} display={"flex"} justifyContent={"space-between"}>
              Nombre y Apellido
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
              placeholder="Nombre y Apellido"
              py={6}
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              {...register("name", {
                required: "El nombre completo es obligatorio",
              })}
            />
          </Box>
        </Stack>

        {/* ... (Second Row: Phone & RIF) - Kept same ... */}
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
              defaultValue={userPhoneNumber || ""}
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
              Cédula o RIF
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
              placeholder="Cédula o RIF"
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              py={6}
              {...register("rif")}
            />
          </Box>
        </Stack>

        {/* ... (Delivery Address Section) - Kept same ... */}
        <Box fontFamily={"AmsiProCond"} bg="#F7FFFB" mt={4}>
          <Text mb={1} display={"flex"} justifyContent={"space-between"}>
            Dirección de entrega
            <Text as="span" color="red.500" fontFamily={"AmsiProCond-Black"}>
              *Obligatorio
            </Text>
          </Text>

          <Box display="flex" flexDirection="column" gap={3}>
            <Input
              placeholder="Dirección de entrega"
              value={mapAddress}
              bg="#fff"
              readOnly
              py={6}
              {...register("location")}
            />
            <Flex w={"full"} spaceX={3}>
              <Button
                bg="Cbutton"
                color="white"
                onClick={() => setIsMapOpen(true)}
              >
                Seleccionar ubicación en el mapa
              </Button>
              <Button bg="green.500" color="white" onClick={getCurrentLocation}>
                Usar mi ubicación actual
              </Button>
            </Flex>
          </Box>
        </Box>

        <Box position={"absolute"} w={"full"}>
          <MapPicker
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onSelect={async (loc) => {
              setMapAddress(loc.address);
              setValue("location", loc.address);
              const distance = await getDistanceInKm(warehouseLocation, {
                lat: loc.lat,
                lng: loc.lng,
              });
              const cost = getDeliveryPrice(distance, branchDeliveryRate);
              setDeliveryCost(cost);
            }}
          />
        </Box>

        <Stack
          fontFamily={"AmsiProCond"}
          direction={{ base: "column", md: "row" }}
          mt={4}
        >
          <Box w="100%">
            <Text mb={1}>Punto de referencia más cercano</Text>
            <Input
              placeholder="Punto de referencia más cercano"
              borderColor={"#eaeaea"}
              bgColor={"#fff"}
              py={6}
              rounded={"md"}
              {...register("nearestLandmark")}
            />
          </Box>
          <Box w="100%">
            <Text mb={1}>E-mail</Text>
            <Input
              placeholder="Introduzca su E-mail"
              bgColor={"#fff"}
              borderColor={"#eaeaea"}
              py={6}
              rounded={"md"}
              defaultValue={userEmail || ""}
              type="email"
              {...register("email")}
            />
          </Box>
        </Stack>

        <Box fontFamily={"AmsiProCond"} mt={4}>
          <Text mb={1}>Instrucciones para la entrega</Text>
          <Textarea
            placeholder="Instrucciones para la entrega"
            name="description"
            borderColor={"#eaeaea"}
            py={5}
            bgColor={"#fff"}
            rounded={"md"}
          />
        </Box>

        {/* ---- PAYMENT SELECTION SECTION ---- */}
        <Text mt={4} fontFamily={"AmsiProCond"} fontWeight="bold">
          Método de Pago
        </Text>
        <Flex gap={4} fontFamily={"AmsiProCond"} mt={2} flexWrap="wrap">
          {/* Option 1: Cash */}
          <Button
            color={"#222"}
            bgColor={"#E7EEEB"}
            display={"flex"}
            flexDirection={"column"}
            height={"max-content"}
            size="lg"
            rounded={"lg"}
            py={2}
            flex={1}
            onClick={() => handlePaymentSelection("cash")}
            borderWidth={selectedPayment === "cash" ? "2px" : "0px"}
            borderColor={
              selectedPayment === "cash" ? "blue.500" : "transparent"
            }
          >
            <Image
              src="/Background/cash_icon.png"
              loading="lazy"
              w={"30px"}
              mb={1}
            />
            Efectivo
          </Button>

          {/* Option 2: Online */}
          <Button
            color={"#222"}
            bgColor={"#E7EEEB"}
            display={"flex"}
            flexDirection={"column"}
            height={"max-content"}
            size="lg"
            rounded={"lg"}
            py={2}
            flex={1}
            onClick={() => handlePaymentSelection("online")}
            borderWidth={selectedPayment === "online" ? "2px" : "0px"}
            borderColor={
              selectedPayment === "online" ? "blue.500" : "transparent"
            }
          >
            <MdOutlinePayment size={24} style={{ marginBottom: 4 }} />
            Bolivares
          </Button>

          {/* Option 3: Bolivars (New) */}
          <Button
            color={"#222"}
            bgColor={"#E7EEEB"}
            display={"flex"}
            flexDirection={"column"}
            height={"max-content"}
            size="lg"
            rounded={"lg"}
            py={2}
            flex={1}
            onClick={() => handlePaymentSelection("bolivars")}
            borderWidth={selectedPayment === "bolivars" ? "2px" : "0px"}
            borderColor={
              selectedPayment === "bolivars" ? "blue.500" : "transparent"
            }
          >
            <BsBank size={24} style={{ marginBottom: 4 }} />
            Zelle
          </Button>
        </Flex>

        {/* ---- CONDITIONAL CONTENT BASED ON PAYMENT ---- */}

        {/* 1. Cash Content */}
        {selectedPayment === "cash" && (
          <Box fontFamily={"AmsiProCond"} mt={4}>
            <Text fontWeight="medium" mb={2}>
              Solicitud de cambio
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
        )}

        {/* 2. Online Content (This the component acutally bolivars ) */}
        {selectedPayment === "online" && <OnlinePaymentUI />}

        {/* 3. Bolivars Content (Moved from Child) */}
        {selectedPayment === "bolivars" && (
          <Box
            bg="white"
            borderRadius="md"
            shadow="sm"
            p={6}
            mt={4}
            border="1px solid #eaeaea"
          >
            <Text fontWeight="bold" fontSize="lg" mb={4}>
              Datos para Realizar su Pago
            </Text>
            <Text fontStyle="italic" mb={4} fontSize="sm" color="gray.600">
              Nuestros precios están expresados en Euros e incluyen IVA.
            </Text>

            {/* Bank Transfers */}
            <Box
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              mb={4}
              fontSize="sm"
            >
              <Text fontWeight="bold" fontSize="md" mb={2}>
                Transferencias Bancarias
              </Text>
              <Text>
                <strong>Beneficiario:</strong> CANEL GROUP, C.A.
              </Text>
              <Text>
                <strong>RIF:</strong> J-409416860
              </Text>
              <br />
              <Stack>
                <Text>
                  <strong>Banesco:</strong> N° 0134-0195-11-1951020358
                </Text>
                <Text>
                  <strong>Bancaribe:</strong> N° 0114-0560-60-5600064853
                </Text>
                <Text>
                  <strong>Banplus:</strong> N° 0174-0136-08-1364140564
                </Text>
                <Text>
                  <strong>Provincial:</strong> N° 0108-0300-47-0100164214
                </Text>
                <Text>
                  <strong>Mercantil:</strong> N° 0105-0067-25-1067575332
                </Text>
              </Stack>
            </Box>

            {/* Mobile Payment */}
            <Box
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              mb={4}
              fontSize="sm"
            >
              <Text fontWeight="bold" fontSize="md" mb={2}>
                Pago Móvil
              </Text>
              <Text>
                <strong>Banco:</strong> 0105 - Mercantil
              </Text>
              <Text>
                <strong>Teléfono:</strong> 0414-6730827
              </Text>
              <Text>
                <strong>Cédula / RIF:</strong> J-409416860
              </Text>
            </Box>

            {/* ---- VALIDATION: IMAGE UPLOAD ---- */}
            <FormControl isInvalid={!!errors.paymentSS} isRequired>
              <Text mb={2} fontWeight="bold">
                Subir comprobante de pago
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>
              <Input
                type="file"
                accept="image/*"
                pt={1} // Padding fix for Chakra Input type=file
                {...register("paymentSS", {
                  required: "Debe subir el comprobante de pago para continuar",
                })}
              />
              <FormErrorMessage _active={{ color: "red.500" }}>
                {errors.paymentSS && errors.paymentSS.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
