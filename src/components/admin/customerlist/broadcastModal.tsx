import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useSendBroadcast } from "@/hooks/broadcast/sms";
import { useFetchAllOrders } from "@/hooks/order/usefetchallorder";
// import { useFetchAllUsers } from "@/hooks/user/usefetchalluser";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import {
  Dialog,
  Select,
  Box,
  Text,
  Button,
  createListCollection,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaXmark } from "react-icons/fa6";

const BroadcastModal = () => {
  const [_isOpen, setIsOpen] = useState(false);
  const MAX_CHARS = 220;
  const [message, setMessage] = useState("");
  const { mutate: sendWatiBroadcast } = useSendBroadcast();

  const { data: allBranches } = useFetchBranch();
  const { data: user } = useFetchCurrentUser();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");

  const { data: allOrders } = useFetchAllOrders();
  // const { mutate: sendSmsBroadcast } = useSendBroadcast();

  const availableBranches = useMemo(() => {
    if (!user || !allBranches) return [];
    if (user.role.toLowerCase() === "admin") return allBranches;
    if (user.role.toLowerCase() === "manager" && user.id) {
      const assignedBranch = allBranches.find(
        (branch) => branch.manager?.id === user.id
      );
      return assignedBranch ? [assignedBranch] : [];
    }
    return [];
  }, [user, allBranches]);

  const branchOptions = createListCollection({
    items: [
      ...(user?.role.toLowerCase() === "admin"
        ? [{ key: "all", textValue: "All Branches", children: "All Branches" }]
        : []),
      ...(availableBranches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  const { count, phoneNumbers } = useMemo(() => {
    if (!allOrders) {
      return { count: 0, phoneNumbers: [] };
    }

    const customerPhoneMap = new Map<string, string>();
    const relevantOrders =
      selectedBranchId === "all" || !selectedBranchId
        ? allOrders
        : allOrders.filter((order) => order.branchId === selectedBranchId);

    for (const order of relevantOrders) {
      if (order.phoneNumber) {
        const cleanedNumber = order.phoneNumber.replace(/\D/g, "");

        if (cleanedNumber.length >= 10) {
          customerPhoneMap.set(order.phoneNumber, order.phoneNumber);
        }
      }
    }

    return {
      count: customerPhoneMap.size,
      phoneNumbers: Array.from(customerPhoneMap.keys()),
    };
  }, [allOrders, selectedBranchId]);

  const handleSend = () => {
    if (!selectedBranchId) {
      toast.error("Por favor, seleccione una sucursal.");
      return;
    }
    if (!message.trim()) {
      toast.error("Por favor, ingrese un mensaje.");
      return;
    }
    if (phoneNumbers.length === 0) {
      toast.error("No hay clientes a quienes enviar el mensaje.");
      return;
    }

    sendWatiBroadcast(
      { message, phoneNumbers },
      {
        onSuccess: () => {
          setIsOpen(false);
          setMessage("");
          setSelectedBranchId("");
          setSelectedBranchText("");
        },
      }
    );
  };

  return (
    <Dialog.Root size={"md"}>
      <Dialog.Trigger>
        <Button
          rounded={"md"}
          bgColor={"#000"}
          color={"#fff"}
          fontFamily={"AmsiProCond"}
          w={"150px"}
          onClick={() => setIsOpen(true)}
          pb={1}
        >
          Difusión de SMS
        </Button>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bgColor={"#fff"}
          color={"#000"}
          height={"max-content"}
          shadow={"none"}
          border={"2px solid  #DFDFDF"}
          width="800px"
          rounded="2xl"
          p={6}
        >
          <Dialog.Header>
            <Dialog.Title
              position={"absolute"}
              top={0}
              left={0}
              p={6}
              w={"full"}
              roundedTop={"2xl"}
              bgColor={"#E2F8ED"}
              color="Cbutton"
              fontFamily={"AmsiProCond-Black"}
              fontSize="xl"
            >
              Enviar Difusión de SMS
              <Dialog.CloseTrigger
                bgColor={"#58615A"}
                rounded={"full"}
                h={5}
                w={5}
                p={1.5}
                _hover={{ bgColor: "#646464" }}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                cursor={"pointer"}
              >
                <FaXmark color="#fff" />
              </Dialog.CloseTrigger>
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body px={0}>
            {/* Branches input */}
            <Box width={"100%"} bg={"white"} p={6}>
              <Box>
                <Select.Root
                  collection={branchOptions}
                  value={[selectedBranchId]}
                  onValueChange={(details) => {
                    const selectedItem = branchOptions.items.find(
                      (item) => item.key === details?.value[0]
                    );
                    if (selectedItem) {
                      setSelectedBranchId(selectedItem.key);
                      setSelectedBranchText(selectedItem.textValue);
                    }
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control
                    bgColor={"#f3f3f3"}
                    borderRadius="md"
                    cursor={"pointer"}
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "green.400",
                      boxShadow: "0 0 0 1px green.400",
                    }}
                  >
                    <Select.Trigger cursor={"pointer"} border="none">
                      <Select.ValueText placeholder="Seleccionar Sucursal">
                        {selectedBranchText}
                      </Select.ValueText>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                      {/* <Select.ClearTrigger /> */}
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content bg="#fff" borderWidth="1px">
                      {branchOptions.items.map((item) => (
                        <Select.Item key={item.key} item={item.key}>
                          {item.textValue}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Box>

              <Box display={"flex"} alignItems={"center"} gapX={4} mt={6}>
                <Text fontFamily={"AmsiProCond"} fontSize={"md"}>
                  Enviar SMS a clientes seleccionados
                </Text>

                <Button
                  bgColor={"#000"}
                  clipPath={
                    "polygon(10% 0, 100% 0, 100% 100%, 9% 100%, 0 53%);"
                  }
                  color={"#fff"}
                  px={8}
                  py={4}
                >
                  {count} Clientes
                </Button>
              </Box>

              <Textarea
                rows={4}
                mt={4}
                bgColor={"#F4F4F4"}
                border={"none"}
                placeholder="Por favor, ingrese el mensaje aquí"
                py={3}
                px={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_CHARS}
              ></Textarea>
              <Text fontFamily={"AmsiProCond"}>
                SMS ({MAX_CHARS - message.length} Caracteres Restantes)
              </Text>
              <Button
                mt={6}
                w="100%"
                bgColor={"Cgreen"}
                color="Cbutton"
                _hover={{ opacity: 0.7 }}
                onClick={handleSend}
                // disabled={isLoading}
              >
                Enviar
              </Button>
            </Box>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default BroadcastModal;
