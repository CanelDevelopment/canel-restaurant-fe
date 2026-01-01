import { Image, Grid, createListCollection, HStack } from "@chakra-ui/react";
import {
  Dialog,
  Button,
  Input,
  Textarea,
  Text,
  Box,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useUpdateProduct } from "@/hooks/product/useupdateproduct";
import { useFetchCategories } from "@/hooks/category/usefetchcategory";
import type { ProductVariant } from "./newitemcontent";
import { SelectFood } from "./selectfood";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  photo: string;
  discount: string;
  categoryId: string[] | null;
  variants: ProductVariant[];
  addonItemIds?: string[];
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
}

export const EditProductModal = ({
  isOpen,
  onClose,
  product,
}: EditProductModalProps) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { data: categories } = useFetchCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCategoryText, setSelectedCategoryText] = useState(
    "Seleccionar categoría"
  );
  const [discount, setDiscount] = useState("0");
  const [variants, setVariants] = useState<{ name: string; price: number }[]>(
    []
  );

  const [addonItemIds, setAddonItemIds] = useState<string[]>([]);

  const categoryCollection = useMemo(
    () =>
      createListCollection({
        items:
          categories?.map((cat: any) => ({
            label: cat.name,
            value: cat.id,
          })) ?? [],
      }),
    [categories]
  );

  useEffect(() => {
    if (!product) return;

    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.replace("Ref ", ""));
    setImagePreview(product.photo);
    setNewImageFile(null);
    setDiscount(product.discount);

    setSelectedCategoryIds(product.categoryId ?? []);

    setAddonItemIds(product.addonItemIds ?? []);

    if (product.variants && product.variants.length > 0) {
      setVariants(product.variants);
    } else {
      setVariants([{ name: "", price: 0 }]);
    }

    if (categories && product.categoryId && product.categoryId.length > 0) {
      const firstId = product.categoryId[0];
      const currentCategory = categories.find((cat) => cat.id === firstId);
      setSelectedCategoryText(
        currentCategory ? currentCategory.name : "Seleccionar categoría"
      );
    } else {
      setSelectedCategoryText("Seleccionar categoría");
    }
  }, [product, categories]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddonSelectionChange = (selectedIds: string[]) => {
    setAddonItemIds(selectedIds);
  };

  const handleSaveChanges = () => {
    if (!product) return;

    updateProduct(
      {
        id: product.id,
        name,
        description,
        price,
        discount: Number(discount),
        categoryId: selectedCategoryIds,
        image: newImageFile,
        variants,
        addonItemIds,
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
      size="cover"
    >
      <Dialog.Backdrop bg="blackAlpha.500" />
      <Dialog.Positioner>
        <Dialog.Content
          rounded="2xl"
          maxW="4xl"
          w="100%"
          maxH="90vh"
          overflow="hidden"
          boxShadow="2xl"
          bg="white"
        >
          <Dialog.Header
            bg="Cgreen"
            color="Cbutton"
            py={6}
            px={6}
            fontSize="2xl"
            fontWeight="semibold"
          >
            Editar producto
          </Dialog.Header>

          <Dialog.CloseTrigger />

          <Dialog.Body px={6} py={5} overflowY="auto">
            <Grid
              templateColumns={["1fr", null, "1.2fr 2fr"]}
              gap={8}
              alignItems="flex-start"
            >
              {/* Left: image card */}
              <Box>
                <Image
                  src={imagePreview || "https://via.placeholder.com/400x300"}
                  alt="Imagen del producto"
                  objectFit="contain"
                  w="100%"
                  maxH="260px"
                  mb={4}
                />
                <Button as="label" width="100%" colorScheme="teal" size="sm">
                  Cambiar imagen
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Button>
              </Box>

              {/* Right: form */}
              <Box display="flex" flexDirection="column" gap={4}>
                {/* Nombre */}
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Nombre
                  </Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del producto"
                  />
                </Box>

                {/* Categoría */}
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Categoría
                  </Text>
                  <Select.Root
                    multiple
                    collection={categoryCollection}
                    value={selectedCategoryIds}
                    onValueChange={(details) => {
                      const next = details.value;
                      setSelectedCategoryIds(next);

                      if (next.length === 0) {
                        setSelectedCategoryText("Seleccionar categoría");
                      } else if (next.length === 1) {
                        const item = categoryCollection.items.find(
                          (opt) => opt.value === next[0]
                        );
                        setSelectedCategoryText(
                          item?.label ?? "Seleccionar categoría"
                        );
                      } else {
                        setSelectedCategoryText(
                          `${next.length} categorías seleccionadas`
                        );
                      }
                    }}
                  >
                    <Select.Control>
                      <Select.Trigger borderRadius="lg">
                        <Select.ValueText>
                          {selectedCategoryText}
                        </Select.ValueText>
                        <Select.Indicator />
                      </Select.Trigger>
                    </Select.Control>

                    {/* no extra Portal here to avoid removeChild issues */}
                    <Select.Positioner zIndex={1400}>
                      <Select.Content
                        bg="white"
                        borderRadius="md"
                        boxShadow="lg"
                      >
                        {categoryCollection.items.map((item) => (
                          <Select.Item
                            key={item.value}
                            item={item}
                            cursor="pointer"
                            px={3}
                            py={2}
                          >
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Box>

                {/* Precio y Descuento side by side */}
                <HStack>
                  <Box flex="1">
                    <Text mb={1} fontWeight="medium">
                      Precio
                    </Text>
                    <InputGroup>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="23.00"
                      />
                    </InputGroup>
                  </Box>

                  <Box flex="1">
                    <Text mb={1} fontWeight="medium">
                      Descuento
                    </Text>
                    <InputGroup>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="0"
                      />
                    </InputGroup>
                  </Box>
                </HStack>

                {/* Descripción */}
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Descripción
                  </Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del producto"
                    rows={4}
                    borderRadius="lg"
                  />
                </Box>

                {/* Variantes */}
                <Box>
                  <Text mb={2} fontWeight="medium">
                    Variantes
                  </Text>
                  {variants.map((variant, index) => (
                    <HStack key={index} mb={2} align="flex-start">
                      <Input
                        placeholder="Nombre variante"
                        value={variant.name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[index].name = e.target.value;
                          setVariants(updated);
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Precio"
                        value={variant.price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[index].price = Number(e.target.value);
                          setVariants(updated);
                        }}
                        maxW="140px"
                      />
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => {
                          const updated = variants.filter(
                            (_, i) => i !== index
                          );
                          setVariants(updated);
                        }}
                      >
                        Eliminar
                      </Button>
                    </HStack>
                  ))}
                  <Button
                    mt={2}
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setVariants([...variants, { name: "", price: 0 }])
                    }
                  >
                    + Añadir variante
                  </Button>
                </Box>

                {/* Addon items */}
                <Box>
                  <Text mb={2} fontWeight="medium">
                    Artículos de complemento
                  </Text>
                  <SelectFood
                    hidePortal={true}
                    selectedIds={addonItemIds}
                    onSelectionChange={handleAddonSelectionChange}
                  />
                </Box>
              </Box>
            </Grid>
          </Dialog.Body>

          <Dialog.Footer
            px={6}
            py={4}
            borderTopWidth="1px"
            bg="gray.50"
            justifyContent="flex-end"
          >
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSaveChanges}
              disabled={isPending}
              loadingText="Guardando..."
            >
              Guardar cambios
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
