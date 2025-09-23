import React, { useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  Separator,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { IoPrintSharp } from "react-icons/io5";
import { OrderInformation } from "@/components/order/orderInformation";
import { OrderPayment, type TOrderType } from "@/components/order/orderPayment";
import { OrderFoodItem } from "@/components/order/orderFoodItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetchOrder } from "@/hooks/order/usefetchorder";
import { useFetchLogo } from "@/hooks/branding/usefetchbranding";
import { useReactToPrint } from "react-to-print";

const Order: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useFetchOrder(id);
  const { data: logoData, isLoading: isLogoLoading } = useFetchLogo();

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Order_${id}`,
  });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError || !order) {
    return (
      <Center h="100vh">
        <Text>Could not load order details. Please try again.</Text>
      </Center>
    );
  }

  return (
    <>
      <Box p={6}>
        {isLogoLoading ? (
          <Spinner />
        ) : (
          <Link to="/">
            <Image
              src={logoData?.logo || "/Logos/foterlogo.png"}
              maxW="100px"
            />
          </Link>
        )}
      </Box>

      <Box p={6} position={"relative"}>
        {/* Order Status */}
        <Box bg="green.50" p={4} roundedTop="2xl">
          <Flex
            justify="space-between"
            flexDirection={["column", "row"]}
            align="center"
            px={[0, 6]}
            py={2}
          >
            <Box w={["100%", "auto"]}>
              <Text
                fontSize={["md", "2xl"]}
                display={"flex"}
                fontFamily={"AmsiProCond-Black"}
                letterSpacing={0.7}
                color="Cbutton"
              >
                Estado de orden:
                <Box display={"flex"} alignItems={"center"}>
                  <Box
                    as="span"
                    bg={order.status === "pending" ? "orange" : "Cgreen"}
                    color="#111"
                    fontSize={["10px", "14px"]}
                    fontFamily={"AmsiProCond"}
                    px={[2, 5]}
                    py={2}
                    rounded="md"
                    ml={2}
                  >
                    {order.status}
                  </Box>
                  <Box as="span" ml={2}>
                    <Image src="/Background/red_icon.png" w={["40%", "56%"]} />
                  </Box>
                </Box>
              </Text>
              <Text
                color="gray.600"
                fontFamily={"AmsiProCond"}
                letterSpacing={0.7}
                mt={2}
                fontSize={["xs", "lg"]}
              >
                Orden #: {order.id.slice(0, 6)}
              </Text>
            </Box>
            <Button
              colorScheme="blackAlpha"
              px={[3, 8]}
              py={[4, 6]}
              bgColor={"#111"}
              color={"#fff"}
              rounded={"md"}
              mt={[4, 0]}
              fontFamily={"AmsiProCond"}
              letterSpacing={0.7}
              fontSize={["10px", "lg"]}
              onClick={handlePrint}
            >
              <IoPrintSharp />
              <Text pb={1}>Imprimir</Text>
            </Button>
          </Flex>
        </Box>

        <Box
          // display={"flex"}
          // flexDirection={["column", "column", "row"]}
          // bgColor={"#F9FFFC"}
          // position={"relative"}
          ref={printRef}
        >
          <Box
            display={"flex"}
            flexDirection={["column", "column", "row"]}
            bgColor={"#F9FFFC"}
            position={"relative"}
          >
            {/* Order Information */}
            <OrderInformation order={order} />

            <Separator orientation={"vertical"} opacity={0.05} />
            {/* Payment Summary */}
            <OrderPayment
              order={{
                ...order,
                orderItems: order.orderItems.map((item: any) => ({
                  ...item,
                  discount: item.discount,
                  price:
                    typeof item.price === "string"
                      ? parseFloat(item.price)
                      : item.price,
                })),
              }}
              orderType={order.type as TOrderType}
            />
          </Box>

          {/* Food Item Table */}
          <OrderFoodItem items={order.orderItems} />
        </Box>

        {/* Place Button */}
        <Flex justify="flex-end" mt={6}>
          <Button
            colorScheme="green"
            px={6}
            bgColor={"Cbutton"}
            color={"#fff"}
            pb={1}
            fontFamily={"AmsiProCond"}
            // letterSpacing={0.7}
            fontSize={["10px", "md"]}
            onClick={() => navigate("/home")}
          >
            Realizar nueva orden
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default Order;
