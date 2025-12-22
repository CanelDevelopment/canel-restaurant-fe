import {
  Button,
  Dialog,
  Grid,
  GridItem,
  Input,
  Text,
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useUpdateStaff } from "@/hooks/user/useupdatestaff";
import { type StaffMember } from "@/hooks/user/usefetchstaff";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember: StaffMember | null;
}

// Static collections for the role and status dropdowns
const roleCollection = createListCollection({
  items: [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Rider", value: "rider" },
  ],
});

const statusCollection = createListCollection({
  items: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ],
});

export const EditStaffModal = ({
  isOpen,
  onClose,
  staffMember,
}: EditStaffModalProps) => {
  const { mutate: updateStaff, isPending } = useUpdateStaff();

  // Form state
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("active"); // 'active' or 'inactive'

  // This effect populates the form whenever a different staff member is selected
  useEffect(() => {
    if (staffMember) {
      setFullName(staffMember.name || "");
      setRole(staffMember.role || "");
      setStatus(staffMember.banned ? "inactive" : "active");
    }
  }, [staffMember]);

  const handleSaveChanges = () => {
    if (!staffMember) return;

    updateStaff(
      {
        id: staffMember.id,
        fullName,
        role,
        banned: status === "inactive", // Convert status string back to a boolean
      },
      {
        onSuccess: () => onClose(), // Close the modal only on success
      }
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded={"2xl"} maxW="lg">
          <Dialog.Header
            fontSize="2xl"
            fontWeight="bold"
            bgColor={"Cgreen"}
            color={"Cbutton"}
            roundedTop={"2xl"}
            pb={5}
          >
            Editar Miembro del Personal
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body mt={4} px={6}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <Text mb={2} fontSize={"md"}>
                  Nombre Completo
                </Text>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </GridItem>

              <GridItem>
                <Text mb={2} fontSize={"md"}>
                  Rol
                </Text>
                <Select.Root
                  collection={roleCollection}
                  value={[role]}
                  onValueChange={(details) =>
                    details.value.length > 0 && setRole(details.value[0])
                  }
                >
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Seleccionar un rol" />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {roleCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </GridItem>

              <GridItem>
                <Text mb={2} fontSize={"md"}>
                  Estado
                </Text>
                <Select.Root
                  collection={statusCollection}
                  value={[status]}
                  onValueChange={(details) =>
                    details.value.length > 0 && setStatus(details.value[0])
                  }
                >
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Seleccionar un estado" />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {statusCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </GridItem>
            </Grid>
          </Dialog.Body>
          <Dialog.Footer p={6}>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              bgColor={"Cgreen"}
              color={"Cbutton"}
              onClick={handleSaveChanges}
              disabled={isPending}
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
