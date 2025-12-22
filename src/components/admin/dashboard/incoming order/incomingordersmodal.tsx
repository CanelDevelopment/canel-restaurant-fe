import {
  Avatar,
  Box,
  Button,
  Center,
  CloseButton,
  DataList,
  Dialog,
  Flex,
  Image,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmark } from "react-icons/io5";
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { AssignOrderModal } from "./assingordermodal";
import type { OrderDetails } from "@/hooks/order/usefetchallorder";
import { useUpdateOrder } from "@/hooks/order/useupdateorder";
import { useFetchSpecificBranch } from "@/hooks/branch/usefetchspecificbranch";
import {
  calculateTotals,
  type CalculationItem,
} from "@/store/calculationStore";
import type { TOrderType } from "@/components/order/orderPayment";
import {
  getCoordinatesFromAddress,
  getDistanceInKm,
  getDeliveryPrice,
} from "@/helper/calculationofdistance";

interface IncomingOrdersModalProps {
  order: OrderDetails;
  branchName?: string;
}

export const IncomingOrdersModal: React.FC<IncomingOrdersModalProps> = ({
  order,
  branchName,
}) => {
  const { mutate: updateOrder } = useUpdateOrder();
  const { data: branch } = useFetchSpecificBranch(order.branchId);

  // New state to hold the calculated price
  const [calculatedDeliveryCost, setCalculatedDeliveryCost] = useState(0);

  useEffect(() => {
    async function computeDelivery() {
      if (order.type !== "delivery") {
        setCalculatedDeliveryCost(0);
        return;
      }

      if (branch?.location && order.location) {
        try {
          const locRaw = branch.location as any;
          let branchLat = 0;
          let branchLng = 0;

          if (typeof locRaw === "string") {
            const parsed = JSON.parse(locRaw);
            if (Array.isArray(parsed)) {
              branchLat = parsed[0];
              branchLng = parsed[1];
            } else {
              branchLat = parsed.lat;
              branchLng = parsed.lng;
            }
          } else {
            branchLat = locRaw.lat;
            branchLng = locRaw.lng;
          }

          const branchLocation = {
            lat: Number(branchLat),
            lng: Number(branchLng),
          };

          const userLocation = await getCoordinatesFromAddress(order.location);

          if (userLocation) {
            const distance = await getDistanceInKm(
              branchLocation,
              userLocation
            );

            // Use the rates from the fetched branch data
            const deliveryRates = branch.deliveryRates || [];
            const price = getDeliveryPrice(distance, deliveryRates);

            setCalculatedDeliveryCost(price);
          }
        } catch (error) {
          console.error("Error calculating modal delivery price:", error);
        }
      }
    }

    if (branch && order) {
      computeDelivery();
    }
  }, [branch, order]);

  const handleAcceptOrder = (id: string) => {
    updateOrder({
      id,
      status: "confirmed",
    });
  };

  const handleCancelOrder = (id: string) => {
    updateOrder({
      id,
      status: "cancelado",
    });
  };

  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);

  const handleOpenAssignModal = () => {
    setOrderModalOpen(false);
    setAssignModalOpen(true);
  };

  const calculatedTotals = useMemo(() => {
    const transformedItems: CalculationItem[] = order.orderItems.map(
      (item) => ({
        quantity: item.quantity,
        product: {
          id: item.id || "unknown",
          name: item.productName || "Producto",
          price: Number(item.price), // Ensure Number
          discount: Number(item.discount || 0),
        },
        selectedAddons:
          item.orderAddons?.map((addon) => ({
            quantity: addon.quantity,
            addonItem: {
              id: addon.addonItem?.id || "",
              name: addon.addonItem?.name || "",
              price: Number(addon.price), // Ensure Number
              discount: Number(addon.addonItem?.discount || 0),
            },
          })) || [],
      })
    );

    // Pass the calculated state variable here
    const summary = calculateTotals(
      transformedItems,
      order.type as TOrderType,
      calculatedDeliveryCost
    );

    return {
      subtotal: summary.subtotal,
      discount: summary.discount,
      // tax: summary.tax,
      deliveryCost: summary.shippingCost,
      grandTotal: summary.finalTotal,
    };
  }, [order, calculatedDeliveryCost]);

  const [deliveryTime, setDeliveryTime] = useState(
    new Date("2025-05-29T21:25:00")
  );

  const adjustTime = (minutes: number) =>
    setDeliveryTime(new Date(deliveryTime.getTime() + minutes * 60000));

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const selectedLocationStats = [
    { label: "Ciudad", value: branch?.city.name || "N/A" },
    { label: "Sucursal", value: branchName || order.branchId || "N/A" },
    { label: "Área", value: branch?.areas || "N/A" },
  ];

  return (
    <>
      <Dialog.Root
        open={isOrderModalOpen}
        onOpenChange={(details) => setOrderModalOpen(details.open)}
        size={["lg", "lg", "lg"]}
        placement={"top"}
      >
        <Dialog.Trigger asChild>
          <Image
            loading="lazy"
            width={"20px"}
            height={"22px"}
            style={{ marginLeft: "5px" }}
            src="/admin/pencil.svg"
            alt="Editar Pedido"
            cursor={"pointer"}
          />
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop zIndex={900} />
          <Dialog.Positioner zIndex={1000}>
            <Dialog.Content
              rounded={"3xl"}
              zIndex={1000}
              width={["100%", "90%", "1000px"]}
              maxWidth={["100%", "90%", "1050px"]}
              bgColor={"#fff"}
              shadow={"none"}
              border={"2px solid #DFDFDF"}
            >
              <Dialog.Body p={4}>
                <Flex
                  flexDirection={["column", "column", "row"]}
                  justifyContent={"space-between"}
                  alignItems={"start"}
                  mt={6}
                  width={"100%"}
                  gap={4}
                >
                  <Box width={["100%", "100%", "65%"]} height={"full"}>
                    <Flex gapX={4}>
                      <Text
                        rounded={"xl"}
                        bg={"#e2f8ed"}
                        p={5}
                        color={"Cbutton"}
                        fontSize={"24px"}
                        fontFamily={"AmsiProCond-Black"}
                        w={"40%"}
                        mb={3}
                      >
                        Pedido ID# {order.id.slice(0, 6).toUpperCase()}
                      </Text>
                      <Button
                        rounded="md"
                        textAlign={"center"}
                        color={"white"}
                        bg={
                          order.status === "pending"
                            ? "TrafficYellow"
                            : order.status === "cancelado"
                            ? "TrafficRed"
                            : "TrafficGreen"
                        }
                        fontSize={"14px"}
                        width={"100px"}
                        mt={3}
                        textTransform="capitalize"
                        pb={1}
                      >
                        {order.status === "delivered"
                          ? "Entregado"
                          : order.status === "pending"
                          ? "Pendiente"
                          : order.status}
                      </Button>
                    </Flex>

                    <Flex flexDirection={"column"} gap={2}>
                      <Flex gap={2} alignItems={"center"} flexWrap="wrap">
                        <Box
                          bg={"#EFF0F1"}
                          rounded={"md"}
                          fontFamily={"AmsiProCond"}
                          px={2}
                          py={2}
                          width={"150px"}
                          mb={3}
                        >
                          <Text
                            fontSize={"md"}
                            textAlign="center"
                            color={"Cbutton"}
                          >
                            Fecha/Hora
                          </Text>
                          <Text
                            textAlign={"center"}
                            color={"#000"}
                            fontSize={"md"}
                          >
                            {format(
                              new Date(order.createdAt),
                              "MMM dd, yy HH:mm"
                            )}
                          </Text>
                        </Box>
                        <Button
                          bgColor={"#E85C54"}
                          w={100}
                          fontFamily={"AmsiProCond"}
                          color={"white"}
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <RxCross2 />
                          <Text pb={0.5}>Cancelar</Text>
                        </Button>

                        {order.status === "pending" ? (
                          <Button
                            bgColor={"#7AA18A"}
                            w={100}
                            color={"#fff"}
                            fontFamily={"AmsiProCond"}
                            onClick={() => handleAcceptOrder(order.id)}
                          >
                            <IoCheckmark />
                            <Text pb={0.5}>Aceptar</Text>
                          </Button>
                        ) : null}
                      </Flex>
                    </Flex>

                    <Box rounded={"lg"}>
                      <Flex gap={2} flexDirection={["column", "null", "row"]}>
                        <Stack
                          mt={3}
                          gap={3}
                          w={["100%", "100%", "67%"]}
                          bgColor={"Dgreen"}
                          rounded={"lg"}
                          p={3}
                        >
                          {/* --- Bucle de artículos principales --- */}
                          {order.orderItems.map((item) => (
                            <Box
                              key={item.id}
                              borderBottom="1px dashed"
                              borderColor="gray.300"
                              pb={2}
                              mb={2}
                            >
                              {/* 1. Producto principal */}
                              <Flex
                                justifyContent="space-between"
                                fontFamily="AmsiProCond-Black"
                              >
                                <Text>
                                  {item.productName} (x{item.quantity})
                                </Text>
                                <Text>
                                  Ref. {Number(item.price).toFixed(2)}
                                </Text>
                              </Flex>

                              {/* 2. Instrucciones */}
                              {typeof item.instructions === "string" &&
                                item.instructions.trim() !== "" && (
                                  <Text
                                    fontSize="sm"
                                    fontStyle="italic"
                                    color="gray.600"
                                    mt={1}
                                  >
                                    {`"${item.instructions}"`}
                                  </Text>
                                )}

                              {/* 3. Addons */}
                              {item.orderAddons &&
                                item.orderAddons.length > 0 && (
                                  <Stack pl={4} mt={1}>
                                    {item.orderAddons.map((addon) => (
                                      <Flex
                                        key={addon.id}
                                        justifyContent="space-between"
                                        fontFamily="AmsiProCond"
                                        fontSize="sm"
                                        color="gray.700"
                                      >
                                        <Text>
                                          + {addon.addonItem?.name} (x
                                          {addon.quantity})
                                        </Text>
                                        <Text>
                                          Ref. {Number(addon.price).toFixed(2)}
                                        </Text>
                                      </Flex>
                                    ))}
                                  </Stack>
                                )}
                            </Box>
                          ))}

                          <Stack
                            gap={1}
                            mt={4}
                            borderTop="1px dashed gray"
                            pt={3}
                            fontFamily="AmsiProCond"
                            fontSize="sm"
                          >
                            <Flex justify="space-between">
                              <Text>Subtotal</Text>
                              <Text>
                                Ref {calculatedTotals.subtotal.toFixed(2)}
                              </Text>
                            </Flex>
                            {/* <Flex justify="space-between">
                              <Text>Impuesto</Text>
                              <Text>Ref {calculatedTotals.tax.toFixed(2)}</Text>
                            </Flex> */}
                            <Flex justify="space-between">
                              <Text>Costo de Entrega</Text>
                              <Text>Ref {calculatedTotals.deliveryCost}</Text>
                            </Flex>
                            {calculatedTotals.discount > 0 && (
                              <Flex justify="space-between" color="Cbutton">
                                <Text>Descuento</Text>
                                <Text>
                                  -Ref {calculatedTotals.discount.toFixed(2)}
                                </Text>
                              </Flex>
                            )}
                            <Flex
                              justify="space-between"
                              fontFamily="AmsiProCond-Black"
                              fontSize="md"
                            >
                              <Text>Total General</Text>
                              <Text>
                                Ref {calculatedTotals.grandTotal.toFixed(2)}
                              </Text>
                            </Flex>
                          </Stack>
                        </Stack>

                        <Stack w={["100%", "100%", "43%"]} h={"full"}>
                          <Stack
                            mt={3}
                            gap={1}
                            bg={"Dgreen"}
                            p={2}
                            rounded={"md"}
                            fontFamily={"AmsiProCond"}
                            fontSize="sm"
                          >
                            <Flex justify="space-between">
                              <Text>Nombre de Sucursal:</Text>
                              <Text>{branchName}</Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text>Tipo de Pago:</Text>
                              <Text>Contra Reembolso</Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text>Plataforma:</Text>
                              <Text textTransform="capitalize">
                                {order.type}
                              </Text>
                            </Flex>
                          </Stack>
                          <Center
                            justifyContent="space-evenly"
                            minH="80px"
                            mt={6}
                            rounded="md"
                            bg="Dgreen"
                            p={4}
                            w="100%"
                            mx="auto"
                            transition="all 0.3s"
                          >
                            <Stack direction="row" align="center" gap={5}>
                              <Stack gap={1}>
                                <Button
                                  rounded="full"
                                  size="sm"
                                  bg="white"
                                  w="30px"
                                  h="35px"
                                  fontSize="2xl"
                                  color="gray.700"
                                  _hover={{ bg: "gray.100" }}
                                  _active={{ bg: "gray.200" }}
                                  onClick={() => adjustTime(-5)}
                                  aria-label="Disminuir la hora de entrega en 5 minutos"
                                  fontFamily={"AmsiProCond-Bold"}
                                  pb={1.5}
                                >
                                  -
                                </Button>
                                <Text
                                  fontSize="sm"
                                  color="gray.700"
                                  textAlign="center"
                                  fontFamily={"AmsiProCond"}
                                >
                                  -5 Min
                                </Text>
                              </Stack>
                            </Stack>
                            <Stack gap={2} textAlign="center">
                              <Text
                                fontSize="md"
                                color="gray.700"
                                fontFamily={"AmsiProCond"}
                              >
                                Hora de Entrega
                              </Text>
                              <Text
                                fontSize="xl"
                                color="gray.800"
                                fontFamily={"AmsiProCond-Black"}
                              >
                                {formatTime(deliveryTime)}
                              </Text>
                            </Stack>

                            <Stack gap={1}>
                              <Button
                                rounded="full"
                                size="sm"
                                bg="white"
                                w="30px"
                                h="35px"
                                fontSize="2xl"
                                fontWeight="bold"
                                color="gray.700"
                                _hover={{ bg: "gray.100" }}
                                _active={{ bg: "gray.200" }}
                                onClick={() => adjustTime(5)}
                                aria-label="Aumentar la hora de entrega en 5 minutos"
                                pb={1.5}
                              >
                                +
                              </Button>
                              <Text
                                fontSize="sm"
                                color="gray.700"
                                textAlign="center"
                                fontFamily={"AmsiProCond"}
                              >
                                +5 Min
                              </Text>
                            </Stack>
                          </Center>

                          <Button
                            fontFamily={"AmsiProCond-Light"}
                            fontSize={"md"}
                            bg={"Cgreen"}
                            color={"#000"}
                            pb={1}
                            onClick={handleOpenAssignModal}
                            mt={4}
                          >
                            Asignar un Repartidor
                          </Button>
                        </Stack>
                      </Flex>
                    </Box>

                    {/* --- Delivery / Payment Image --- */}
                    {order.onlinePaymentProveImage ? (
                      <Box p={5}>
                        <Text
                          fontSize={"16px"}
                          fontFamily={"AmsiProCond-Black"}
                          mb={2}
                        >
                          Comprobante de Entrega / Pago
                        </Text>
                        <Image
                          src={order.onlinePaymentProveImage}
                          alt="Imagen del Pedido"
                          borderRadius="md"
                          maxH="250px"
                          objectFit="cover"
                        />
                      </Box>
                    ) : null}
                  </Box>

                  {/* --- PANEL DERECHO --- */}
                  <Box
                    width={["100%", "100%", "35%"]}
                    bg={"Dgreen"}
                    rounded={"3xl"}
                    height={"full"}
                    color={"#000"}
                  >
                    <Center flexDirection={"column"}>
                      <Avatar.Root width={"150px"} height={"150px"} mt={4}>
                        <Avatar.Fallback name={order.name} />
                        <Avatar.Image alt={order.name} />
                      </Avatar.Root>
                      <Text
                        fontFamily={"AmsiProCond"}
                        fontSize={"22px"}
                        fontWeight={"bold"}
                        marginTop={4}
                      >
                        {order.name}
                      </Text>
                    </Center>
                    <Box p={5}>
                      <Text fontSize={"16px"} fontFamily={"AmsiProCond-Black"}>
                        Detalles del Cliente
                      </Text>
                      <Stack mt={3} gap={2} fontFamily={"AmsiProCond"}>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Text>Nombre:</Text>
                          <Text cursor="pointer" display="flex" gap={2}>
                            {order.name}
                          </Text>
                        </Flex>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Text>Teléfono:</Text>
                          <Text cursor="pointer" display="flex" gap={2}>
                            {order.phoneNumber}
                          </Text>
                        </Flex>
                        <Flex justifyContent="space-between" alignItems="start">
                          <Text>Dirección:</Text>
                          <Text
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            gap={2}
                            maxW="70%"
                            textAlign="right"
                          >
                            {order.location}
                          </Text>
                        </Flex>
                      </Stack>
                    </Box>
                    <Box p={5}>
                      <Text fontSize={"16px"} fontFamily={"AmsiProCond-Black"}>
                        Ubicación Seleccionada
                      </Text>
                      <DataList.Root
                        gap={2}
                        orientation="horizontal"
                        mt={3}
                        fontFamily={"AmsiProCond"}
                      >
                        {selectedLocationStats.map((item) => (
                          <DataList.Item key={item.label}>
                            <DataList.ItemLabel>
                              {item.label}
                            </DataList.ItemLabel>
                            <DataList.ItemValue>
                              {item.value}
                            </DataList.ItemValue>
                          </DataList.Item>
                        ))}
                      </DataList.Root>
                    </Box>
                  </Box>
                </Flex>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  bg={"#58615a"}
                  color={"white"}
                  rounded={"full"}
                  size="2xs"
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <AssignOrderModal
        isOpen={isAssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        order={order}
      />
    </>
  );
};
