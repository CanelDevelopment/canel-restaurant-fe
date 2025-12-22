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
import { useState, useEffect } from "react";
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
  categoryId: string | null;
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
  console.log(product);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [selectedCategoryText, setSelectedCategoryText] = useState(
    "Seleccionar categoría"
  );
  const [discount, setDiscount] = useState("0");
  const [variants, setVariants] = useState<{ name: string; price: number }[]>(
    []
  );

  const categoryCollection = createListCollection({ items: categoryOptions });

  useEffect(() => {
    if (categories) {
      setCategoryOptions(
        categories.map((cat: any) => ({
          value: cat.id,
          label: cat.name,
        }))
      );
    }

    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.replace("Ref ", ""));
      setImagePreview(product.photo);
      setCategoryId(product.categoryId ? [product.categoryId] : []);
      setNewImageFile(null);
      setDiscount(product.discount);

      if (product?.variants) {
        setVariants(product.variants);
      } else {
        setVariants([{ name: "", price: 0 }]);
      }

      if (categories && product.categoryId) {
        const currentCategory = categories.find(
          (cat) => cat.id === product.categoryId
        );
        setSelectedCategoryText(
          currentCategory ? currentCategory.name : "Seleccionar categoría"
        );
      } else {
        setSelectedCategoryText("Seleccionar categoría");
      }
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

    const finalCategoryId = categoryId[0] || null;

    updateProduct(
      {
        id: product.id,
        name,
        description,
        price,
        discount: Number(discount),
        categoryId: finalCategoryId,
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
                    collection={categoryCollection}
                    value={categoryId}
                    onValueChange={(details) => {
                      setCategoryId(details.value);

                      const selectedItem = categoryOptions.find(
                        (opt) => opt.value === details.value[0]
                      );
                      if (selectedItem)
                        setSelectedCategoryText(selectedItem.label);
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
                              key={item.key}
                              item={item.value}
                              cursor="pointer"
                            >
                              {item.label}
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
