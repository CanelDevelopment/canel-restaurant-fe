import {
  Box,
  Button,
  Checkbox,
  Combobox,
  createListCollection,
  Flex,
  Portal,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import type React from "react";
// --- 1. Import useMemo ---
import { useState, useMemo } from "react";

// Import the hooks
import { useFetchStaff } from "@/hooks/user/usefetchstaff";
import { useAssignPermissions } from "@/hooks/user/useassignrole";

// Import the single source of truth for permissions
import { permissionValues, formatPermissionLabel } from "@/lib/allowedactions";
import toast from "react-hot-toast";

interface StaffItem {
  label: string;
  value: string;
}

export const AddRoleContent: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffItem | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: staffList, isLoading: isLoadingStaff } =
    useFetchStaff(inputValue);
  const { mutate: savePermissions } = useAssignPermissions();

  const mappedStaff = useMemo(() => {
    if (!staffList) return [];

    return staffList.map((staffMember) => ({
      label: staffMember.name,
      value: staffMember.id,
    }));
  }, [staffList]);

  const staffCollection = createListCollection<StaffItem>({
    items: mappedStaff,
  });

  const handlePermissionChange = (permission: string, isChecked: boolean) => {
    setSelectedPermissions((prev) =>
      isChecked ? [...prev, permission] : prev.filter((p) => p !== permission)
    );
  };

  const handleSave = () => {
    if (!selectedStaff) {
      toast.error("Please select the staff");
      return;
    }
    savePermissions({
      userId: selectedStaff.value,
      permissions: selectedPermissions,
    });
  };

  return (
    <>
      <Box bgColor={"#fff"} px={[3, 5, 10]} py={8} color={"#000"}>
        <Box w={["100%", "100%", "100%", "50%"]}>
          <Flex
            w={["100%", "100%", "100%", "70%"]}
            align="center"
            mb={10}
            spaceX={2}
          >
            <Text>Nom: </Text>
            <Combobox.Root
              collection={staffCollection}
              onValueChange={(details) => {
                const selectedValue = details.value?.[0];
                if (selectedValue) {
                  // Find the full object from our mapped array to set the state
                  const staffObject = mappedStaff.find(
                    (item) => item.value === selectedValue
                  );
                  setSelectedStaff(staffObject ?? null);
                } else {
                  setSelectedStaff(null);
                }
              }}
              width="100%"
              disabled={isLoadingStaff}
            >
              <Combobox.Control>
                <Combobox.Input
                  placeholder="Search for a staff member..."
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Combobox.IndicatorGroup>
                  {isLoadingStaff && <Spinner size="sm" />}
                  <Combobox.ClearTrigger
                    onClick={() => setSelectedStaff(null)}
                  />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content>
                    <Combobox.Empty>No staff found</Combobox.Empty>
                    {/* The collection now contains correctly shaped items */}
                    {staffCollection.items.map((item) => (
                      <Combobox.Item item={item} key={item.value}>
                        {item.label}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>
          </Flex>

          <Box>
            <Text w="120px" mt={1} fontWeight="medium">
              Permiso:
            </Text>
            <SimpleGrid columns={2} spaceY={3} flex={"1"}>
              {permissionValues.map((permission, index) => (
                <Checkbox.Root
                  key={index}
                  checked={selectedPermissions.includes(permission)}
                  onCheckedChange={(details) =>
                    handlePermissionChange(permission, !!details.checked)
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control bgColor={"#F2F2F2"} color={"Cbutton"} />
                  <Checkbox.Label>
                    <Text
                      fontFamily={"AmsiProCond-Light"}
                      ml={2}
                      color={"#4B4848"}
                    >
                      {formatPermissionLabel(permission)}
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>

      <Box bgColor={"#fff"} px={[3, 5, 10]} py={4} color={"#000"}>
        <Flex justifyContent={"end"}>
          <Button
            bgColor={"Cgreen"}
            color={"Cbutton"}
            onClick={handleSave}
            disabled={!selectedStaff}
            px={16}
          >
            Guardar
          </Button>
        </Flex>
      </Box>
    </>
  );
};
