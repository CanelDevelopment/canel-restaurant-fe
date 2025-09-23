import {
  Button,
  Center,
  CloseButton,
  createListCollection,
  Dialog,
  Flex,
  Portal,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import type { OrderDetails } from "@/hooks/order/usefetchallorder";
import { useAssignRider } from "@/hooks/order/useassignorder";
import { useFetchRidersByBranch } from "@/hooks/user/usefetchbranchrider";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

interface AssignOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails;
}

export const AssignOrderModal: React.FC<AssignOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [selectedRiderId, setSelectedRiderId] = useState<string[]>([]);

  // 👇 Replace this with your actual branch ID logic
  const branchId = order.branchId;

  const { data: allRiders } = useFetchRidersByBranch(branchId);
  const { mutate: assignRider } = useAssignRider();

  const riderOptions = useMemo(() => {
    console.log(allRiders);
    if (!allRiders)
      return createListCollection<{ label: string; value: string }>({
        items: [],
      });
    const mapped = allRiders.map((rider) => ({
      label: `${rider.fullName}`,
      value: rider.id,
    }));
    return createListCollection<{ label: string; value: string }>({
      items: mapped,
    });
  }, [allRiders]);

  const createdAt = format(new Date(order.createdAt), "MMM dd, yyyy HH:mm:ss");
  const subtotal = order.orderItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );
  const tax = subtotal * 0.15;
  const delivery = 3.99;
  const totalPrice = subtotal + tax + delivery;

  const handleAssignClick = () => {
    if (!selectedRiderId.length) {
      toast.error("Por favor, seleccione un repartidor.");
      return;
    }

    assignRider(
      { orderId: order.id, riderId: selectedRiderId[0] },
      {
        onSuccess: () => {
          toast.success("¡Repartidor asignado!");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop zIndex={1100} />
        <Dialog.Positioner zIndex={1200}>
          <Dialog.Content
            width={["100%", "100%", "600px"]}
            rounded="2xl"
            bgColor="#fff"
            zIndex={1200}
            shadow="none"
            border="2px solid #DFDFDF"
          >
            <Dialog.Header
              bg="#e2f8ed"
              roundedTopLeft="2xl"
              roundedTopRight="2xl"
              p={8}
            >
              <Dialog.Title
                color="Cbutton"
                fontSize={["lg", "xl"]}
                fontFamily="AmsiProCond-Black"
              >
                Asignar Repartidor al Pedido# {order.id.slice(0, 6)}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Center
                mt={8}
                alignItems="center"
                flexDirection="column"
                w="420px"
                mx="auto"
                gap={2}
              >
                <Flex mr="auto" gap={1}>
                  <Text
                    fontSize="md"
                    fontFamily="AmsiProCond-Light"
                    color="#000"
                  >
                    Seleccione un Repartidor O
                  </Text>
                  <Text
                    cursor="pointer"
                    textDecoration="underline"
                    color="blue.400"
                    fontFamily="AmsiProCond-Light"
                    fontSize="md"
                  >
                    <Link to={"/dashboard/staff_management/add_new_staff"}>
                      Crear un Repartidor
                    </Link>
                  </Text>
                </Flex>

                <Select.Root
                  collection={riderOptions}
                  size="md"
                  width={["100%"]}
                  value={selectedRiderId}
                  onValueChange={(details) => {
                    // details.value is the selected item(s)
                    // If multi-select, details.value is an array; if single, it's an object
                    if (Array.isArray(details.value)) {
                      setSelectedRiderId(details.value.map((item) => item));
                    } else if (details.value) {
                      setSelectedRiderId([details.value]);
                    } else {
                      setSelectedRiderId([]);
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
                        {riderOptions.items.map((rider: any) => (
                          <Select.Item key={rider.value} item={rider}>
                            {rider.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>

                <Stack w={["100%"]} gap={0}>
                  <Stack mt={3} gap={1} bg="#f6f9e0" p={4} roundedTop="md">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="Cbutton"
                      >
                        Pedido#:
                      </Text>
                      <Text
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="black"
                      >
                        {order.id.slice(0, 6)}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="Cbutton"
                      >
                        Nom del Cliente:
                      </Text>
                      <Text
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="black"
                      >
                        {order.name}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="Cbutton"
                      >
                        Dirección:
                      </Text>
                      <Text
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="black"
                      >
                        {order.location || "-"}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="Cbutton"
                      >
                        Teléfono:
                      </Text>
                      <Text
                        fontSize="sm"
                        fontFamily="AmsiProCond"
                        color="black"
                      >
                        {order.phoneNumber}
                      </Text>
                    </Flex>
                    <Text
                      mt={2}
                      fontWeight="medium"
                      fontSize="sm"
                      fontFamily="AmsiProCond"
                      color="Cbutton"
                    >
                      Hora del Pedido: {createdAt}
                    </Text>
                  </Stack>
                  <Flex
                    roundedBottom="md"
                    bg="#ddef9e"
                    p={4}
                    justify="space-between"
                    fontFamily="AmsiProCond-Black"
                    color="Cbutton"
                  >
                    <Text>Montant à percevoir</Text>
                    <Text>Ref {totalPrice.toFixed(2)}</Text>
                  </Flex>
                </Stack>

                <Button
                  mt={2}
                  mb={6}
                  w="100%"
                  color="Cbutton"
                  bg="Cgreen"
                  onClick={handleAssignClick}
                >
                  Enviar a la Aplicación Móvil
                </Button>
              </Center>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                bg="#58615a"
                color="white"
                rounded="full"
                size="2xs"
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
