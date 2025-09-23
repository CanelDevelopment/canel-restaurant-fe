import {
  Box,
  CloseButton,
  Drawer,
  Flex,
  Heading,
  Icon,
  Image,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import React from "react";
import { TbMenu3 } from "react-icons/tb";
import Logo from "/Logos/logo.png";
import {
  useFetchLinks,
  useFetchName,
  useFetchPhoneNumber,
} from "@/hooks/branding/usefetchbranding";

const LocationDrawer: React.FC = () => {
  const { data: phoneNumber } = useFetchPhoneNumber();
  const { data: links } = useFetchLinks();
  const { data: name } = useFetchName();

  return (
    <Box>
      <Drawer.Root>
        <Drawer.Trigger
          asChild
          marginRight={[2, 10, 0]}
          className="cursor-pointer"
        >
          <TbMenu3 size={28} color="white" />
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner p={1}>
            <Drawer.Content
              rounded="xl"
              bg="black"
              color="white"
              maxWidth={["300px", "400px"]}
              position="relative"
            >
              <Drawer.Header mt="10">
                <Image loading="lazy" src={Logo} alt="Canel Restaurant Logo" />
              </Drawer.Header>
              <Drawer.Body>
                <Text fontWeight={"light"}>
                  Welcome to {name?.name}, where we serve the finest flavors of
                  Karachi. Our menu is crafted with fresh ingredients to offer a
                  variety of delicious dishes. Enjoy quick, fresh, and reliable
                  delivery straight to your doorstep.
                </Text>

                <Flex
                  height={"75%"}
                  flexDirection={["column"]}
                  justifyContent={"space-between"}
                  alignItems={"start"}
                >
                  <Box></Box>
                  {/* <Box>
                    <Heading size="lg" mt={2} color="Cgreen">
                      Address
                    </Heading>
                    <Text mt={2}>
                      {name?.name}, 123 Main Street, New York, USA
                    </Text>
                  </Box> */}

                  <Flex flexDirection={["row"]} gap={6}>
                    <Box>
                      <Heading fontWeight="bold" color="Cgreen">
                        Contact Us:
                      </Heading>
                      <Text>{phoneNumber?.phoneNumber}</Text>
                    </Box>
                    <Box>
                      <Heading color="Cgreen">Follow Us:</Heading>
                      <Box display="flex" gap={2}>
                        <Icon
                          as={FaInstagram}
                          color="white"
                          size={"md"}
                          href={links?.instagram}
                        />
                        <Icon
                          as={FaFacebook}
                          color="white"
                          size={"md"}
                          href={links?.facebook}
                        />
                      </Box>
                    </Box>
                  </Flex>
                </Flex>
              </Drawer.Body>
              <Drawer.Footer bg="gray.900" color="white" roundedBottom="xl">
                <Text fontSize={"12px"}>
                  Copyright &copy; 2025 {name?.name}. Powered by DotClick.llcc
                </Text>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton
                  size="xs"
                  bg="white"
                  color="black"
                  rounded="full"
                  position="absolute"
                  top={4}
                  right={4}
                  _hover={{
                    bg: "black",
                    color: "white",
                  }}
                  _active={{
                    bg: "black",
                    color: "white",
                  }}
                  _focus={{
                    boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.6)",
                  }}
                  boxShadow="sm"
                  p={1}
                  title="Close drawer"
                />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default LocationDrawer;
