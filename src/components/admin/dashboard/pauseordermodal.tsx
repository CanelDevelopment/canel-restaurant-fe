import {
  Button,
  Dialog,
  Grid,
  Portal,
  Select,
  Textarea,
  VStack,
  createListCollection,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import {
  useUpdateBranchPauseStatus,
  useUpdateGlobalPauseStatus,
} from "@/hooks/order/useupdatepause";
import { FaXmark } from "react-icons/fa6";

export const PauseOrderModal = () => {
  const { data: user } = useFetchCurrentUser();
  const { data: allBranches } = useFetchBranch();

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");

  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [customReason, setCustomReason] = useState("");

  const { mutate: updateBranchStatus } = useUpdateBranchPauseStatus();
  const { mutate: updateGlobalStatus } = useUpdateGlobalPauseStatus();

  const availableBranches = useMemo(() => {
    if (!user || !allBranches) return [];

    if (user.role.toLowerCase() === "admin") {
      return allBranches;
    }

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
      ...(user && user.role.toLowerCase() === "admin"
        ? [{ key: "all", textValue: "All Branches", children: "All Branches" }]
        : []),
      ...(availableBranches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30, 60];

  const handlePause = () => {
    if (!selectedBranchId) {
      toast.error("Please select a branch.");
      return;
    }

    let reason = `Paused for ${selectedDuration} minutes.`;
    if (selectedDuration === 0) {
      if (!customReason) {
        toast.error("Please provide a reason for the custom pause.");
        return;
      }
      reason = customReason;
    }

    const payload = { isPaused: true, reason, duration: selectedDuration };

    if (selectedBranchId === "all") {
      updateGlobalStatus(payload, { onSuccess: resetAndClose });
    } else {
      updateBranchStatus(
        { branchId: selectedBranchId, payload },
        { onSuccess: resetAndClose }
      );
    }
  };

  const resetAndClose = () => {
    setSelectedBranchId(null);
    setSelectedDuration(10);
    setCustomReason("");
  };

  return (
    <Dialog.Root size={["lg", "lg", "xl"]}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          size="md"
          bg={"white"}
          color={"Cbutton"}
          fontFamily={"AmsiProCond"}
        >
          Pausar Pedidos
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop zIndex={900} />
        <Dialog.Positioner rounded={"2xl"} zIndex={1000}>
          <Dialog.Content
            width={["100%", "100%", "600px"]}
            rounded={"2xl"}
            border={"2px solid #DFDFDF"}
          >
            <Dialog.Header bg={"#e2f8ed"} p={4} roundedTop={"2xl"}>
              <Dialog.Title
                fontFamily={"AmsiProCond-Black"}
                color={"Cbutton"}
                fontSize={"2xl"}
              >
                Pause Ordering
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body bgColor={"#fff"} roundedBottom={"xl"} p={6}>
              <VStack align="stretch">
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {DURATION_OPTIONS.map((min) => (
                    <Button
                      key={min}
                      variant={selectedDuration === min ? "solid" : "outline"}
                      colorScheme={selectedDuration === min ? "green" : "gray"}
                      onClick={() => setSelectedDuration(min)}
                    >
                      {min} min(s)
                    </Button>
                  ))}
                  <Button
                    variant={selectedDuration === 0 ? "solid" : "outline"}
                    colorScheme={selectedDuration === 0 ? "green" : "gray"}
                    onClick={() => setSelectedDuration(0)}
                  >
                    Other
                  </Button>
                </Grid>

                {selectedDuration === 0 && (
                  <Textarea
                    placeholder="Specify reason for pausing (e.g., Out of stock)"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                )}

                <Select.Root
                  collection={branchOptions}
                  value={selectedBranchId ? [selectedBranchId] : []}
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
                  <Select.Control>
                    <Select.Trigger bg="#ebebeb" h="42px" border="none">
                      <Select.ValueText placeholder="Seleccionar Sucursal">
                        {selectedBranchText}
                      </Select.ValueText>
                      <Select.Indicator color={"#575757"} />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner zIndex={2000}>
                      <Select.Content zIndex={2000}>
                        {branchOptions.items.map((item) => (
                          <Select.Item key={item.key} item={item.key}>
                            {item.textValue}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>

                <HStack mt={4}>
                  <Button
                    flex={1}
                    colorScheme="red"
                    onClick={handlePause}
                    fontFamily={"AmsiProCond"}
                    fontSize={"lg"}
                    pb={1}
                  >
                    Confirm Pause
                  </Button>
                </HStack>
              </VStack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild cursor={"pointer"}>
              <Box bgColor={"Cgreen"} rounded={"full"} p={1.5} color={"#111"}>
                <FaXmark />
              </Box>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
