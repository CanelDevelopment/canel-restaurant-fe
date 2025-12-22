import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
// import { FiPlus } from "react-icons/fi";
import { BusinessHeader } from "./businessheader";
import { useState } from "react";
import { useAddBranding } from "@/hooks/branding/usecreatebranding";
import toast from "react-hot-toast";

export const InfoContent: React.FC = () => {
  const mutation = useAddBranding();

  // Form states
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  const handleUpdate = () => {
    const payload: any = {};

    if (name) payload.name = name;

    // Phone validation (must be 11 digits)
    if (phoneNumber) {
      const phoneRegex = /^\d{11}$/;
      if (!phoneRegex.test(phoneNumber)) {
        toast.error("Phone number must be exactly 11 digits.");
        return;
      }
      payload.phoneNumber = phoneNumber;
    }

    // Email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Enter a valid email.");
        return;
      }
      payload.email = email;
    }

    // Instagram URL validation
    if (instagram) {
      try {
        const url = new URL(instagram);
        payload.instagram = url.href;
      } catch {
        toast.error("Enter a valid Instagram link.");
        return;
      }
    }

    // Facebook URL validation
    if (facebook) {
      try {
        const url = new URL(facebook);
        payload.facebook = url.href;
      } catch {
        toast.error("Enter a valid Facebook link.");
        return;
      }
    }

    mutation.mutate(payload);
  };

  return (
    <Box bgColor={"#fff"} py={6}>
      <BusinessHeader
        title="Nombre e Información del Negocio"
        description="Informa a los clientes sobre tu negocio, incluye tu información de contacto y enlaza tus cuentas de redes sociales."
      />

      <Box
        display={"flex"}
        flexDirection={["column", "column", "row"]}
        justifyContent={"space-between"}
      >
        <Box width={["100%", "100%", "50%"]} px={[3, 10]} py={6} bg="white">
          <Stack align="stretch">
            {/* Business Name */}
            <Box display={"flex"} flexDirection={["column", "row"]}>
              <Text fontFamily={"AmsiProCond-Light"} color="#000" w={"300px"}>
                Nombre comercial
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduce el nombre de tu empresa"
                size="lg"
                borderColor="#EBEBEB"
                bgColor={"#F4F4F4"}
                rounded={"md"}
                _placeholder={{ color: "#929292" }}
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "none" }}
              />
            </Box>

            {/* Business Phone Number */}
            <Box display={"flex"} flexDirection={["column", "row"]}>
              <Text fontFamily={"AmsiProCond-Light"} color="#000" w={"300px"}>
                Teléfono empresarial
              </Text>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingrese al teléfono comercial"
                size="lg"
                borderColor="#EBEBEB"
                bgColor={"#F4F4F4"}
                rounded={"md"}
                _placeholder={{ color: "#929292" }}
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "none" }}
              />
            </Box>

            {/* Business Email */}
            <Box display={"flex"} flexDirection={["column", "row"]}>
              <Text fontFamily={"AmsiProCond-Light"} color="#000" w={"300px"}>
                E-mail empresarial
              </Text>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese el E-mail comercial"
                size="lg"
                borderColor="#EBEBEB"
                bgColor={"#F4F4F4"}
                rounded={"md"}
                _placeholder={{ color: "#929292" }}
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "none" }}
              />
            </Box>
          </Stack>
        </Box>

        <Separator
          orientation={["horizontal", "vertical"]}
          opacity={0.1}
          h={["100%", "100%", "300px"]}
        />

        {/* Social Media Section */}
        <Box
          h={"max-content"}
          display={"flex"}
          gapX={4}
          w={["100%", "100%", "50%"]}
          px={[3, 10]}
          py={[5, 6]}
        >
          <VStack align="stretch" w={"100%"}>
            {/* Instagram */}
            <HStack>
              <InputGroup
                children={
                  <Input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram"
                    size="lg"
                    borderColor="#EBEBEB"
                    bgColor={"#F4F4F4"}
                    rounded={"md"}
                    py={6}
                    _placeholder={{ color: "#929292" }}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                  />
                }
                startElement={<RiInstagramFill size={"26px"} color="#4C9F7B" />}
              />
            </HStack>

            {/* Facebook */}
            <HStack>
              <InputGroup
                children={
                  <Input
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="Facebook"
                    size="lg"
                    borderColor="#EBEBEB"
                    bgColor={"#F4F4F4"}
                    rounded={"md"}
                    py={6}
                    _placeholder={{ color: "#929292" }}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                  />
                }
                startElement={<FaFacebookF size={"26px"} color="#4C9F7B" />}
              />
            </HStack>
          </VStack>

          {/* Update Button */}
        </Box>
      </Box>
      <Box
        pr={10}
        w={"100%"}
        display={"flex"}
        alignItems={"end"}
        justifyContent={"end"}
      >
        <Button
          rounded={"md"}
          bgColor={"#4C9F7B"}
          w={"100px"}
          h={"40px"}
          pb={2}
          fontSize={"lg"}
          onClick={handleUpdate}
        >
          Ahorrar
        </Button>
      </Box>
    </Box>
  );
};
