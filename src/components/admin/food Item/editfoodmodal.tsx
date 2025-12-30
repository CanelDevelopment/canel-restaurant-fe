import {
  Image,
  Grid,
  GridItem,
  createListCollection,
  Portal,
  HStack,
} from "@chakra-ui/react";
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

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  photo: string;
  discount: string;
  categoryId: string[] | null;
  variants: ProductVariant[];
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

  // Memoize collection so items reference is stable while dialog is open
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

  const handleSaveChanges = () => {
    if (!product) return;

    updateProduct(
      {
        id: product.id,
        name,
        description,
        price,
        discount: Number(discount),
        // send array of category ids to backend
        categoryId: selectedCategoryIds,
        image: newImageFile,
        variants,
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
      size={"xl"}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded={"3xl"}>
          <Dialog.Header
            fontSize="3xl"
            fontWeight="bold"
            bgColor={"Cgreen"}
            py={7}
            roundedTop={"3xl"}
          >
            Editar Producto
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              <GridItem colSpan={2}>
                <Box>
                  <Text mb={2}>Imagen del Producto</Text>
                  <Image
                    loading="lazy"
                    src={imagePreview || "https://via.placeholder.com/150"}
                    alt="Imagen del producto"
                    borderRadius="md"
                    boxSize="250px"
                    objectFit="cover"
                  />
                  <Button as="label" mt={3} size="sm" width="100%">
                    Cambiar Imagen
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Button>
                </Box>
              </GridItem>

              <GridItem
                colSpan={3}
                display="flex"
                flexDirection="column"
                gap={4}
              >
                <Box>
                  <Text mb={2}>Nombre</Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del Producto"
                  />
                </Box>

                <Box>
                  <Text mb={2}>Categoría</Text>
                  <Select.Root
                    // single select here; for multi in edit modal, add `multiple`
                    collection={categoryCollection}
                    value={selectedCategoryIds}
                    onValueChange={(details) => {
                      const next = details.value; // string[]
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
                      <Select.Trigger>
                        <Select.ValueText>
                          {selectedCategoryText}
                        </Select.ValueText>
                        <Select.Indicator />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner zIndex={1400}>
                        <Select.Content zIndex={1400} bg="white">
                          {categoryCollection.items.map((item) => (
                            <Select.Item
                              key={item.value}
                              item={item} // pass the collection item
                              cursor="pointer"
                            >
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box>
                  <Text mb={2}>Precio</Text>
                  <InputGroup left={"Ref"}>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="10.99"
                    />
                  </InputGroup>
                </Box>

                <Box>
                  <Text mb={2}>descuento</Text>
                  <InputGroup left={"Ref"}>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="10.99"
                    />
                  </InputGroup>
                </Box>

                <Box>
                  <Text mb={2}>Descripción</Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del Producto"
                    rows={4}
                  />
                </Box>

                <Box>
                  <Text mb={2}>Variantes</Text>
                  {variants.map((variant, index) => (
                    <HStack key={index} mb={2}>
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
                      />

                      <Button
                        colorScheme="red"
                        onClick={() => {
                          const updated = variants.filter(
                            (_, i) => i !== index
                          );
                          setVariants(updated);
                        }}
                      >
                        Delete
                      </Button>
                    </HStack>
                  ))}

                  <Button
                    mt={2}
                    size="sm"
                    onClick={() =>
                      setVariants([...variants, { name: "", price: 0 }])
                    }
                  >
                    + Add Variant
                  </Button>
                </Box>
              </GridItem>
            </Grid>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSaveChanges}
              disabled={isPending}
              loadingText="Guardando..."
            >
              Guardar Cambios
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
