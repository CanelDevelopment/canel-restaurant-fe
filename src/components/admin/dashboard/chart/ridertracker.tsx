import {
  Box,
  Center,
  Flex,
  Image,
  Text,
  Circle,
  Stack,
} from "@chakra-ui/react";
import type { DashboardSteps } from "@/pages/dashboard.page";
import type { OrderDetails } from "@/hooks/order/usefetchallorder";
import { useMemo } from "react";
import { differenceInSeconds } from "date-fns";

// --- GIF IMPORTS ---
import Pro1 from "/admin/gif1.gif";
import Pro2 from "/admin/gif2.gif";
import Pro3 from "/admin/gif3.gif";
import Pro4 from "/admin/gif4.gif";
import { useFetchStaff } from "@/hooks/user/usefetchstaff";

interface RiderTrackerProps {
  goToStep: (step: DashboardSteps) => void;
  trackedOrder: OrderDetails | null;
}

const riderSteps = [
  { apiStatus: "pending", label: "Pendiente", image: Pro1 },
  { apiStatus: "accepted", label: "Aceptado", image: Pro2 },
  { apiStatus: "on_the_way", label: "En Camino", image: Pro3 },
  { apiStatus: "delivered", label: "Entregado", image: Pro4 },
];

const formatDuration = (start: Date, end: Date): string => {
  const totalSeconds = differenceInSeconds(end, start);
  if (totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const RiderTracker = ({ trackedOrder }: RiderTrackerProps) => {
  const currentStatusIndex = trackedOrder
    ? riderSteps.findIndex(
        (step) => step.apiStatus === trackedOrder.status.toLowerCase()
      )
    : -1;

  const progressPercentage =
    currentStatusIndex > 0
      ? (currentStatusIndex / (riderSteps.length - 1)) * 100
      : 0;

  const { data: allStaff } = useFetchStaff("");

  // --- FIX APPLIED IN THIS BLOCK ---
  const riderName = useMemo(() => {
    if (!trackedOrder?.riderId || !allStaff) {
      return "Sin asignar";
    }
    // 1. Compare against `staff.id`, not `staff.value`
    const foundRider = allStaff.find(
      (staff) => staff.id === trackedOrder.riderId
    );

    // 2. Access the `name` property for display, not `label`
    return foundRider?.name || "Rider Desconocido";
  }, [trackedOrder, allStaff]);
  // --- END OF FIX ---

  const timings = useMemo(() => {
    if (!trackedOrder) {
      return { callCenterTime: "0:00", riderTime: "0:00" };
    }
    const created = new Date(trackedOrder.createdAt);
    const accepted = trackedOrder.acceptedAt
      ? new Date(trackedOrder.acceptedAt)
      : null;
    const delivered = trackedOrder.deliveredAt
      ? new Date(trackedOrder.deliveredAt)
      : null;

    const callCenterTime = accepted ? formatDuration(created, accepted) : "N/A";
    const riderTime =
      accepted && delivered ? formatDuration(accepted, delivered) : "N/A";

    return { callCenterTime, riderTime };
  }, [trackedOrder]);

  return (
    <Center
      w={["100%", "100%", "50%"]}
      rounded={"lg"}
      bg={"white"}
      px={5}
      py={3}
    >
      <Box w={"100%"}>
        <Center
          fontFamily={"AmsiProCond"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Text
            fontSize={"lg"}
            fontFamily={"AmsiProCond-Black"}
            color={"gray.700"}
          >
            Seguimiento del Repartidor
          </Text>
        </Center>

        <Box textAlign="center" mb={4}>
          <Text fontSize="md" fontWeight="bold" color="gray.800">
            Repartidor:{" "}
            <Text as="span" color="teal.500">
              {riderName}
            </Text>
          </Text>
        </Box>

        {!trackedOrder ? (
          <Center h="150px">
            <Text color="gray.500" textAlign="center">
              Seleccione un pedido de la tabla para ver su seguimiento.
            </Text>
          </Center>
        ) : (
          <>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              position="relative"
              px={2}
            >
              <Box
                position="absolute"
                top="41px"
                left="10%"
                right="10%"
                height="4px"
                bg="gray.200"
                zIndex={1}
              />
              <Box
                position="absolute"
                top="41px"
                left="10%"
                height="4px"
                bg="green.500"
                zIndex={1}
                width={`calc(${progressPercentage}% * 0.8)`}
                transition="width 0.4s ease-in-out"
              />

              {riderSteps.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                return (
                  <Flex
                    key={step.apiStatus}
                    direction="column"
                    alignItems="center"
                    position="relative"
                    zIndex={2}
                  >
                    <Image
                      loading="lazy"
                      src={step.image}
                      boxSize="60px"
                      objectFit="cover"
                      border={
                        isActive ? "2px solid #3b5545" : "2px solid transparent"
                      }
                      transition="border 0.3s ease"
                    />
                    <Circle
                      size="14px"
                      marginTop={4}
                      bg={isActive ? "green.500" : "gray.300"}
                      transition="background-color 0.4s ease"
                    />
                    <Text
                      mt={2}
                      color={isActive ? "black" : "gray.500"}
                      fontWeight={isActive ? "bold" : "medium"}
                      fontSize={"13px"}
                      fontFamily={"AmsiProCond"}
                    >
                      {step.label}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>

            <Center
              justifyContent={"center"}
              gap={16}
              alignItems={"center"}
              mt={6}
            >
              <Stack gap={0} justifyContent={"center"} alignItems={"center"}>
                <Text
                  fontSize={"18px"}
                  fontFamily={"AmsiProCond-Black"}
                  color={"#000"}
                >
                  {timings.callCenterTime}
                </Text>
                <Text fontSize="14px" fontFamily="AmsiProCond" color="#464646">
                  Min
                </Text>
                <Text
                  color={"#464646"}
                  fontSize={"13px"}
                  fontFamily={"AmsiProCond-Black"}
                >
                  Centro de Llamadas
                </Text>
              </Stack>
              <Stack gap={0} justifyContent={"center"} alignItems={"center"}>
                <Text
                  fontSize={"18px"}
                  fontFamily={"AmsiProCond-Black"}
                  color={"#000"}
                >
                  {timings.riderTime}
                </Text>
                <Text fontSize="14px" fontFamily="AmsiProCond" color="#464646">
                  Min
                </Text>
                <Text
                  color={"#464646"}
                  fontSize={"13px"}
                  fontFamily={"AmsiProCond-Black"}
                >
                  Repartidor
                </Text>
              </Stack>
            </Center>
          </>
        )}
      </Box>
    </Center>
  );
};
