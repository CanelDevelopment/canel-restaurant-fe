import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Dialog, Button, Input, Textarea, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// The data for the category being edited
type CategoryData = {
  id: string;
  name: string;
  description: string;
};

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData | null;
  onUpdate: (payload: CategoryData) => void;
  isLoading: boolean;
}

export const EditModal = ({
  isOpen,
  onClose,
  category,
  onUpdate,
  isLoading,
}: EditCategoryModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Pre-fill the form whenever a new category is selected for editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleSave = () => {
    if (category) {
      onUpdate({ id: category.id, name, description });
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      //   placement={"center"}
      size={"md"}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded={"lg"}>
          <Dialog.Header
            color={"Cbutton"}
            bgColor={"Cgreen"}
            fontSize={"2xl"}
            fontFamily={"AmsiProCond-Black"}
            letterSpacing={0.5}
            roundedTop={"lg"}
            pb={8}
          >
            Edit Category
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Box w={"100%"} spaceY={8}>
              <FormControl isRequired>
                <FormLabel mb={6} letterSpacing={0.5}>
                  Name
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category Name"
                />
              </FormControl>
              <FormControl>
                <FormLabel mb={6} letterSpacing={0.5}>
                  Description
                </FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category Description"
                />
              </FormControl>
            </Box>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSave}
              disabled={isLoading}
              pb={1}
              letterSpacing={0.7}
            >
              Save Changes
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
