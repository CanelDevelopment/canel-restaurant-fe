import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Dialog,
  Button,
  Input,
  Textarea,
  Box,
  Checkbox,
  Flex,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface DiscountTier {
  minQty: number;
  discountAmount: number;
}

interface VolumeDiscountRules {
  enabled: boolean;
  type: string;
  tiers: DiscountTier[];
}

type CategoryData = {
  id: string;
  name: string;
  description: string;
  volumeDiscountRules?: VolumeDiscountRules | null;
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

  // Volume Discount State
  const [enableVolumeDiscount, setEnableVolumeDiscount] = useState(false);
  const [tier1Discount, setTier1Discount] = useState<string | number>("");
  const [tier2Discount, setTier2Discount] = useState<string | number>("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);

      if (
        category.volumeDiscountRules &&
        category.volumeDiscountRules.enabled
      ) {
        setEnableVolumeDiscount(true);

        const tiers = category.volumeDiscountRules.tiers || [];
        const t1 = tiers.find((t) => t.minQty === 2);
        const t2 = tiers.find((t) => t.minQty === 3);

        setTier1Discount(t1 ? t1.discountAmount : "");
        setTier2Discount(t2 ? t2.discountAmount : "");
      } else {
        setEnableVolumeDiscount(false);
        setTier1Discount("");
        setTier2Discount("");
      }
    }
  }, [category]);

  const handleSave = () => {
    if (category) {
      const volumeDiscountRules = enableVolumeDiscount
        ? {
            enabled: true,
            type: "fixed_amount_off",
            tiers: [
              {
                minQty: 2,
                discountAmount: Number(tier1Discount) || 0,
              },
              {
                minQty: 3,
                discountAmount: Number(tier2Discount) || 0,
              },
            ],
          }
        : null;

      onUpdate({
        id: category.id,
        name,
        description,
        volumeDiscountRules,
      });
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size={"lg"}
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
            Editar Categoría
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Stack gap={6} w={"100%"}>
              {/* Basic Info */}
              <FormControl isRequired>
                <FormLabel mb={2} letterSpacing={0.5}>
                  Nombre
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre de la categoría"
                />
              </FormControl>
              <FormControl>
                <FormLabel mb={2} letterSpacing={0.5}>
                  Descripción
                </FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la categoría"
                />
              </FormControl>

              <Separator />

              {/* Volume Discount Section */}
              <Box bg="#F9F9F9" p={4} rounded="md" border="1px dashed #d1d1d1">
                <Checkbox.Root
                  colorPalette={"green"}
                  checked={enableVolumeDiscount}
                  onCheckedChange={(e) => setEnableVolumeDiscount(!!e.checked)}
                  mb={3}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    bgColor={"#fff"}
                    border={"1px solid #949494"}
                  />
                  <Checkbox.Label
                    fontFamily={"AmsiProCond-Black"}
                    color="#000"
                    fontSize="md"
                  >
                    Activar Descuento por Volumen
                  </Checkbox.Label>
                </Checkbox.Root>

                {enableVolumeDiscount && (
                  <Flex gap={4} direction={["column", "row"]}>
                    <FormControl>
                      <FormLabel fontSize="sm" mb={1}>
                        Desc. por Unidad (Cant. 2)
                      </FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 1.00"
                        bg="white"
                        value={tier1Discount}
                        onChange={(e) => setTier1Discount(e.target.value)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" mb={1}>
                        Desc. por Unidad (Cant. 3+)
                      </FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 2.00"
                        bg="white"
                        value={tier2Discount}
                        onChange={(e) => setTier2Discount(e.target.value)}
                      />
                    </FormControl>
                  </Flex>
                )}
              </Box>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorPalette="teal"
              bg="Cgreen"
              color="Cbutton"
              onClick={handleSave}
              disabled={isLoading}
              pb={1}
              letterSpacing={0.7}
            >
              Guardar Cambios
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
