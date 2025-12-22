import React, { useEffect } from "react";
import { Box, Text, Heading, Icon, Button, VStack } from "@chakra-ui/react";
import { FaXmark } from "react-icons/fa6";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirect: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onRedirect,
}) => {
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

  return (
    <>
      {/* Fondo de pantalla */}
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

      {/* Contenido del modal */}
      <Box
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        maxW={{ base: "90%", sm: "450px" }}
        w="full"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={10000}
        onClick={(e) => e.stopPropagation()}
        border="2px solid #5EA988"
      >
        <Box p={{ base: 6, md: 8 }} position="relative">
          <Icon
            onClick={onClose}
            color="#fff"
            position="absolute"
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
            boxSize={{ base: 5, md: 4 }}
            cursor="pointer"
            background="#243F2D"
            rounded="full"
            p={0.5}
          >
            <FaXmark />
          </Icon>

          <VStack textAlign="center">
            <Heading
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="bold"
              color="Cbutton"
              as="h2"
              fontFamily="AmsiProCond-Bold"
            >
              Se requiere inicio de sesión
            </Heading>

            <Text fontFamily="AmsiProCond" color="gray.600" fontSize="lg">
              Por favor, inicia sesión o crea una cuenta para continuar con el
              pago.
            </Text>

            <Button
              w="full"
              mt={4}
              bgColor="Cbutton"
              color="white"
              _hover={{ bg: "Cgreen" }}
              fontFamily="AmsiProCond"
              fontSize="lg"
              onClick={onRedirect}
            >
              Ir a la página de inicio de sesión
            </Button>
          </VStack>
        </Box>
      </Box>
    </>
  );
};
