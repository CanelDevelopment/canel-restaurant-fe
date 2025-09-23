import {
  Button,
  Dialog,
  Grid,
  GridItem,
  Input,
  Spinner,
  Text,
  Select,
  createListCollection,
  Portal,
  VStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { useUpdateBranch } from "@/hooks/branch/useupdatebranch";
import { useFetchCities } from "@/hooks/branch/usefetchcities";
import { useFetchAllUsers } from "@/hooks/user/usefetchalluser";
// --- 1. Import icons for the new UI ---
import { FiPlus } from "react-icons/fi";
import { BiSolidTrash } from "react-icons/bi";

interface BranchData {
  id: string;
  name: string;
  address: string;
  cityId: string | null;
  managerId: string | null;
  status: boolean;
  operatingHours: string;
  phoneNumber: string;
}

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchData | null;
}

type SelectItem = { label: string; value: string };

export const EditBranchModal = ({
  isOpen,
  onClose,
  branch,
}: EditBranchModalProps) => {
  const { mutate: updateBranch, isPending } = useUpdateBranch();
  const { data: cities, isLoading: isLoadingCities } = useFetchCities();
  const { data: allUsers, isLoading: isLoadingUsers } = useFetchAllUsers();

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState(true);
  const [cityId, setCityId] = useState("");
  const [managerId, setManagerId] = useState("");

  // --- 2. Replace operatingHours state with state for shifts array ---
  const [shifts, setShifts] = useState([{ openTime: "", closeTime: "" }]);

  // (This logic for cities and managers remains the same)
  const cityCollection = createListCollection<SelectItem>({
    items:
      cities?.map((city: any) => ({ label: city.name, value: city.id })) || [],
  });

  const managerOptions = useMemo(() => {
    if (!allUsers) return [];
    return allUsers
      .filter((user) => user.role.toLowerCase() === "manager")
      .map((user) => ({
        label: user.fullName ?? user.email ?? "Unnamed Manager",
        value: user.id,
      }));
  }, [allUsers]);

  const managerCollection = createListCollection({ items: managerOptions });

  useEffect(() => {
    if (branch) {
      setName(branch.name || "");
      setAddress(branch.address || "");
      setPhoneNumber(branch.phoneNumber || "");
      setStatus(branch.status);
      setCityId(branch.cityId || "");
      setManagerId(branch.managerId || "");

      // --- 3. Parse the operatingHours string into the shifts array ---
      if (branch.operatingHours) {
        const parsedShifts = branch.operatingHours.split(",").map((part) => {
          const times = part.trim().split(" - ");
          return { openTime: times[0] || "", closeTime: times[1] || "" };
        });
        // Only set parsed shifts if the parsing was successful
        if (parsedShifts.length > 0 && parsedShifts[0].openTime) {
          setShifts(parsedShifts);
        } else {
          setShifts([{ openTime: "", closeTime: "" }]); // Default on failure
        }
      } else {
        setShifts([{ openTime: "", closeTime: "" }]); // Default if no hours exist
      }
    }
  }, [branch]);

  const handleSaveChanges = () => {
    if (!branch) return;

    // --- 4. Format the shifts array back into a single string for the backend ---
    const operatingHoursString = shifts
      .filter((shift) => shift.openTime && shift.closeTime) // Filter out incomplete shifts
      .map((shift) => `${shift.openTime} - ${shift.closeTime}`) // Format each shift
      .join(", "); // Join them with a comma

    updateBranch(
      {
        id: branch.id,
        name,
        address,
        operatingHours: operatingHoursString, // Use the new formatted string
        phoneNumber,
        status,
        cityId,
        manager: managerId,
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded={"2xl"}>
          <Dialog.Header
            fontSize="2xl"
            fontWeight="bold"
            bgColor={"Cgreen"}
            color={"Cbutton"}
            roundedTop={"2xl"}
            pb={5}
          >
            Edit Branch
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body mt={4} px={6}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text mb={2} fontSize={"md"}>
                  Branch Name
                </Text>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </GridItem>

              <GridItem>
                <Text mb={2} fontSize={"md"}>
                  City
                </Text>
                <Select.Root
                  collection={cityCollection}
                  value={[cityId]}
                  onValueChange={(details) =>
                    details.value.length > 0 && setCityId(details.value[0])
                  }
                  disabled={isLoadingCities}
                >
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select city" />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {isLoadingCities ? (
                          <Spinner />
                        ) : (
                          cityCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                            </Select.Item>
                          ))
                        )}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </GridItem>

              <GridItem colSpan={2}>
                <Text mb={2} fontSize={"md"}>
                  Address
                </Text>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </GridItem>

              {/* --- 5. Replace the simple input with the dynamic shifts UI --- */}
              <GridItem colSpan={2}>
                <Text mb={2} fontSize={"md"}>
                  Operating Hours
                </Text>
                <VStack align="stretch" spaceY={4}>
                  {shifts.map((shift, index) => (
                    <Flex key={index} align="center" gap={4}>
                      <Input
                        type="time"
                        value={shift.openTime}
                        onChange={(e) => {
                          const updated = [...shifts];
                          updated[index].openTime = e.target.value;
                          setShifts(updated);
                        }}
                      />
                      <Text>-</Text>
                      <Input
                        type="time"
                        value={shift.closeTime}
                        onChange={(e) => {
                          const updated = [...shifts];
                          updated[index].closeTime = e.target.value;
                          setShifts(updated);
                        }}
                      />
                      {shifts.length > 1 && (
                        <Icon
                          as={BiSolidTrash}
                          bgColor="#FFD3D3"
                          color="#EF4B4B"
                          p={2}
                          rounded="full"
                          fontSize="3xl"
                          cursor="pointer"
                          onClick={() => {
                            const updated = shifts.filter(
                              (_, i) => i !== index
                            );
                            setShifts(updated);
                          }}
                        />
                      )}
                    </Flex>
                  ))}
                  <Button
                    size="sm"
                    bgColor="#F4F4F4"
                    color="#373B3F"
                    rounded="md"
                    onClick={() =>
                      setShifts([...shifts, { openTime: "", closeTime: "" }])
                    }
                  >
                    <Icon as={FiPlus} mr={2} />
                    Add another shift
                  </Button>
                </VStack>
              </GridItem>

              <GridItem>
                <Text mb={2} fontSize={"md"}>
                  Contact Number
                </Text>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </GridItem>

              <GridItem>
                <Text mb={2} fontSize={"md"}>
                  Manager
                </Text>
                <Select.Root
                  collection={managerCollection}
                  value={[managerId]}
                  onValueChange={(details) => {
                    if (details.value.length > 0) {
                      setManagerId(details.value[0]);
                    }
                  }}
                  disabled={isLoadingUsers}
                >
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Assign a manager" />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {isLoadingUsers ? (
                          <Spinner />
                        ) : (
                          managerCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                            </Select.Item>
                          ))
                        )}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </GridItem>
            </Grid>
          </Dialog.Body>
          <Dialog.Footer p={6}>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bgColor="Cgreen"
              color="Cbutton"
              onClick={handleSaveChanges}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
