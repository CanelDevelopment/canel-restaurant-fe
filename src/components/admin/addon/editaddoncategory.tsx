import {
  Dialog,
  Button,
  Input,
  Textarea,
  Box,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface AddonCategoryData {
  id: string;
  name: string;
  description: string;
}

interface EditAddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AddonCategoryData | null;
  onUpdate: (data: AddonCategoryData) => void;
  isLoading: boolean;
}

export const EditAddonCategoryModal = ({
  isOpen,
  onClose,
  category,
  onUpdate,
  isLoading,
}: EditAddonModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [category]);

  const handleSave = () => {
    if (category) {
      onUpdate({
        id: category.id,
        name,
        description,
      });
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      size={"xl"}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded={"lg"} maxW="xl">
          <Dialog.Header
            color={"Cbutton"}
            bgColor={"Cgreen"}
            fontSize={"2xl"}
            fontFamily={"AmsiProCond-Black"}
            letterSpacing={0.5}
            roundedTop={"lg"}
            pb={8}
          >
            Editar Categoría de Complemento
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <VStack py={4}>
              <Box w="100%">
                <Text mb={2} fontWeight="medium">
                  Nombre de la Categoría
                </Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Escriba el nombre de la categoría"
                  size="lg"
                />
              </Box>
              <Box w="100%">
                <Text mb={2} fontWeight="medium">
                  Descripción
                </Text>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escriba una breve descripción para la categoría"
                  rows={4}
                  size="lg"
                />
              </Box>
            </VStack>
          </Dialog.Body>
          <Dialog.Footer display="flex" justifyContent="flex-end" gap={3}>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              bgColor={"Cgreen"}
              color={"Cbutton"}
              onClick={handleSave}
              disabled={isLoading}
              px={8}
            >
              Guardar Cambios
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
