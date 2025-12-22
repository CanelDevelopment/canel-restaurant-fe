import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  Flex,
  Portal,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { Select, createListCollection } from "@chakra-ui/react";
import { FaMoneyBillWave, FaMotorcycle } from "react-icons/fa";
import { useFetchRiders } from "@/hooks/user/usefetchriders";
// import { useFetchRiderTips } from "@/hooks/user/usefetchridertip";
import { useFetchEarnedMoney } from "@/hooks/order/usefetchearnedmoney";

export const RiderPerformanceCard = () => {
  const {
    data: allRiders,
    isLoading: isAllRidersLoading,
    isError: isAllRidersError,
  } = useFetchRiders();

  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  useEffect(() => {
    if (allRiders && allRiders.length > 0 && !selectedRiderId) {
      setSelectedRiderId(allRiders[0].id);
    }
  }, [allRiders, selectedRiderId]);

  const {
    data: riderTips,
    isLoading: isRiderTipsLoading,
    isError: isRiderTipsError,
  } = useFetchEarnedMoney(selectedRiderId);

  const riderOptions = useMemo(() => {
    if (isAllRidersLoading || isAllRidersError || !allRiders)
      return createListCollection<{ label: string; value: string }>({
        items: [],
      });

    const mappedRiders = allRiders.map((rider) => ({
      label: `${rider.fullName}`,
      value: rider.id,
    }));
    return createListCollection<{ label: string; value: string }>({
      items: mappedRiders,
    });
  }, [allRiders, isAllRidersLoading, isAllRidersError]);

  const isLoading = isAllRidersLoading || isRiderTipsLoading;
  const isError = isAllRidersError || isRiderTipsError;

  if (isError) {
    return (
      <Center h="200px">
        <Text color="red.500">Failed to load rider data or tips.</Text>
      </Center>
    );
  }

  const totalEarnings = riderTips?.totalEarned;
  const deliveredOrders = riderTips?.deliveredOrdersCount;

  return (
    <Card.Root borderRadius="lg" variant="outline" w={"full"}>
      {isLoading ? (
        <Center h="200px">
          <Spinner size="lg" />
        </Center>
      ) : (
        <>
          <Card.Header pb={3} borderBottom="1px solid #E5F1EC">
            <Flex justify="space-between" align="center">
              <Heading size="md" fontWeight="600" w={"20%"}>
                Rendimiento Semanal
              </Heading>

              <Select.Root
                collection={riderOptions}
                size="md"
                width={["100%", "auto"]}
                value={selectedRiderId ? [selectedRiderId] : []}
                onValueChange={(details) => {
                  if (details.value && details.value.length > 0) {
                    setSelectedRiderId(details.value[0] as string);
                  } else {
                    setSelectedRiderId("");
                  }
                }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger
                    bg="#ebebeb"
                    color="#575757"
                    height="42px"
                    rounded="md"
                    border="none"
                    width="180px"
                  >
                    <Select.ValueText placeholder="Seleccionar Repartidor" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator color="#575757" />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner border="none" zIndex={2000}>
                    <Select.Content zIndex={2000}>
                      {riderOptions.items.map((riderItem) => (
                        <Select.Item
                          key={riderItem.value}
                          item={riderItem.value}
                        >
                          {riderItem.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Flex>
          </Card.Header>

          <Card.Body>
            <HStack justify="space-around">
              <VStack>
                <Icon as={FaMoneyBillWave} boxSize={10} color="green.700" />
                <Text fontSize="3xl" fontWeight="bold" lineHeight="1.2">
                  REF. {totalEarnings}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Ganancias por Viajes
                </Text>
              </VStack>

              <VStack>
                <Icon as={FaMotorcycle} boxSize={10} color="blue.700" />
                <Text fontSize="3xl" fontWeight="bold" lineHeight="1.2">
                  {deliveredOrders}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Orders Delivered
                </Text>
              </VStack>
            </HStack>
          </Card.Body>
        </>
      )}
    </Card.Root>
  );
};
