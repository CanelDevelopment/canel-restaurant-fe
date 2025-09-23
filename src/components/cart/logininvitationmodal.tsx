import React, { useEffect } from "react";
import { Box, Text, Heading, Icon, Button, VStack } from "@chakra-ui/react";
import { FaXmark } from "react-icons/fa6";

// Props for the Login Prompt Modal
interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirect: () => void; // A function to handle the redirection
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onRedirect,
}) => {
  // This effect disables body scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // If the modal is not open, render nothing
  if (!isOpen) return null;

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
              Login Required
            </Heading>

            <Text fontFamily="AmsiProCond" color="gray.600" fontSize="lg">
              Please log in or create an account to proceed to checkout.
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
              Go to Login Page
            </Button>
          </VStack>
        </Box>
      </Box>
    </>
  );
};
