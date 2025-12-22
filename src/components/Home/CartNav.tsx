import React, { useRef } from "react";
import {
  Box,
  Button,
  Image,
  Drawer,
  IconButton,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { Cart } from "@/components/cart/cart";
import { CustomCartIcon } from "../ui/cartIcon";
import { FaCircleXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Online } from "@/provider/online";
import { Offline } from "@/provider/offline";
import { authClient } from "@/provider/user.provider";
import { useFetchLogo } from "@/hooks/branding/usefetchbranding";
import { useCartTotalQuantity } from "@/store/cartStore";

export const CartNav: React.FC = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate("/home");
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const { data: logoData, isLoading: isLogoLoading } = useFetchLogo();
  const totalQuantity = useCartTotalQuantity();

  return (
    <Drawer.Root initialFocusEl={() => triggerRef.current} size={["xs", "sm"]}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={[3, 10]}
        py={2}
        color="white"
        minHeight="10vh"
      >
        <Box display="flex" width={"20%"} alignItems="center" gap={4}>
          {isLogoLoading ? (
            <Spinner />
          ) : (
            <Link to="/home">
              <Image
                loading="lazy"
                width={["20vw", "20vw", "8vw"]}
                src={logoData?.logo || "./Logos/foterlogo.png"}
                alt="Logo"
              />
            </Link>
          )}
        </Box>

        <Flex alignItems={"center"} justifyContent={"center"}>
          <Button
            onClick={() => navigate("/?change=true")}
            // px={2.5}
            // py={}
            mt={{ md: 8 }}
            fontSize={["10px", "16px"]}
            fontWeight="light"
            // height="auto"
            rounded="lg"
            bg="Cbutton"
            color="#f4f4f4"
            fontFamily={"AmsiProCond"}
            letterSpacing={0.7}
            pb={1}
            _hover={{ bg: "gray.200" }}
          >
            Cambiar Sucursal
          </Button>
          {/* Sign-out */}
          <Online>
            <Button
              mt={{ md: 8 }}
              ml={6}
              backgroundColor="transparent"
              color="red"
              border={"1px solid red"}
              fontSize={"16px"}
              rounded={"lg"}
              _hover={{ backgroundColor: "red.400", color: "white" }}
              boxShadow={"0px 2px 5px rgba(255, 0, 0, 0.2)"}
              fontFamily={"AmsiProCond"}
              letterSpacing={0.7}
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Online>

          {/* Sign-in  */}
          <Offline>
            <Link to="/signin">
              <Button
                mt={{ md: 8 }}
                ml={6}
                backgroundColor="Cbutton"
                color="Cgreen"
                border={"1px solid green"}
                fontSize={"16px"}
                rounded={"lg"}
                _hover={{ backgroundColor: "green.400", color: "white" }}
                boxShadow={"0px 2px 5px rgba(0, 255, 0, 0.2)"}
                fontFamily={"AmsiProCond"}
                letterSpacing={0.7}
                w={"100px"}
              >
                Iniciar sesión
              </Button>
            </Link>
          </Offline>
        </Flex>

        <Drawer.Trigger
          as={IconButton}
          ref={triggerRef}
          aria-label="Open cart"
          position={"fixed"}
          bottom={32}
          right={5}
          rounded={"full"}
          zIndex={1000}
          boxSize={6}
          w={16}
          h={16}
          bgColor={"Cbutton"}
        >
          {totalQuantity > 0 && (
            <Box
              position="absolute"
              top="-5px"
              right="-5px"
              bg="red.500"
              color="white"
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              w={5}
              h={5}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {totalQuantity}
            </Box>
          )}
          <Box position="relative">
            <CustomCartIcon boxSize={[6, 8]} color="Cgreen" />
          </Box>
        </Drawer.Trigger>
      </Box>

      <Drawer.Backdrop />

      <Drawer.Positioner>
        <Drawer.Content
          bgColor="#FAFAFA"
          bgPos={"center"}
          bgSize={"cover"}
          border="3px solid"
          borderColor="#DEE5CC"
          borderRadius="2xl"
          boxShadow="lg"
          color={"#111"}
          marginY={4}
          marginRight={[0, 4]}
          position={"relative"}
          zIndex={-2}
        >
          <Box
            position="absolute"
            inset="0"
            borderRadius="2xl"
            // bg="url(/Background/cartBg.png)"
            opacity={0.05}
            zIndex={-1}
          />

          <Drawer.CloseTrigger
            as={Button}
            color={"Cbutton"}
            aria-label="Close cart"
            bg={"transparent"}
          >
            <FaCircleXmark />
          </Drawer.CloseTrigger>

          <Drawer.Header>
            <Drawer.Title fontSize={"3xl"} fontFamily={"AmsiProCond-Black"}>
              Carrito
            </Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Cart />
          </Drawer.Body>

          <Drawer.Footer></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
