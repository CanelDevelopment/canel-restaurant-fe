import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgColor={"Cbutton"}
    >
      <VStack
        spaceY={6}
        p={10}
        bg="whiteAlpha.900"
        borderRadius="xl"
        boxShadow="2xl"
      >
        <Heading fontSize={{ base: "6xl", md: "8xl" }} color="Cbutton">
          404
        </Heading>
        <Text fontSize="2xl" color="gray.700" fontWeight="bold">
          Oops! Page not found.
        </Text>
        <Text color="gray.500" textAlign="center">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Text>
        <Button colorScheme="teal" size="lg" boxShadow="md">
          <Link to="/">Go to Home</Link>
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFoundPage;
