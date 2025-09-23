import React from "react";
import { Box, Text, Button, Image } from "@chakra-ui/react";

export const TraditionalBox: React.FC = () => {
  return (
    <>
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        height="full"
      >
        <Box flex={1} />

        <Box
          flex={1}
          bgImage={`url('/Home/cake.png')`}
          bgSize="cover"
          bgPos={"bottom"}
          color="white"
          borderLeft="1px solid Cgreen"
          borderRight="1px solid Cgreen"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          maxWidth={["320px", "300px", "350px"]}
          position={"absolute"}
          top={"0"}
          right={"32"}
        >
          {/* Heading */}
          <Box lineHeight="1" ml={6} mt={6}>
            <Text
              m={0}
              fontSize="53px"
              color={"Cgreen"}
              fontWeight={"extrabold"}
              display={"flex"}
              position={"relative"}
            >
              DELICIOUS
              <Image
                src="/Background/designElement-crown.png"
                width={"12%"}
                position={"absolute"}
                right={-4}
                top={-8}
              />
            </Text>

            <Text
              m={0}
              fontSize={"36px"}
              letterSpacing={"3.6px"}
              color={"#fff"}
              fontWeight={"light"}
            >
              TRADITIONAL
            </Text>
          </Box>

          <Box ml={"6"} mt={2}>
            <Text letterSpacing={"3px"} fontSize={"lg"} mt={6}>
              CANEL RESTAURANTE
            </Text>

            <Text fontSize="13px" fontWeight={"light"} mt={2} width={"80%"}>
              Indulge in authentic, flavorful traditional desserts and meals.
              Order now and enjoy a taste of tradition!
            </Text>

            <Image
              src="/Background/designElement-arrow.png"
              width={{ md: 10 }}
              position={"absolute"}
              right={16}
            />
          </Box>

          <Button
            mt={{ md: 8 }}
            ml={6}
            backgroundColor="black"
            color="white"
            width={"50%"}
            fontSize={"16px"}
            rounded={"lg"}
            _hover={{ backgroundColor: "gray.700" }}
          >
            Ordenar ahora
          </Button>

          {/* Design Elements */}
          <Box position={"absolute"} top={0} left={-40} zIndex={999}>
            <Image src="/Background/designElement-new.png" width={"70%"} />
          </Box>

          <Box position={"absolute"} left={-16} zIndex={999} mt={32}>
            <Image src="/Background/designElement-heart.png" width={"70%"} />
          </Box>
        </Box>
      </Box>
    </>
  );
};
