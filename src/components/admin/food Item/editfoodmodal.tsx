// src/components/product/EditProductModal.tsx

import {
  Image,
  Spinner,
  Grid,
  GridItem,
  createListCollection,
  Portal,
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

// Define the shape of the product data the modal needs
interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  photo: string;
  categoryId: string | null;
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
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [selectedCategoryText, setSelectedCategoryText] =
    useState("Select category");

  const categoryCollection = createListCollection({
    items: categoryOptions,
  });

  useEffect(() => {
    if (categories) {
      const opts = categories.map((cat: any) => ({
        key: cat.id,
        textValue: cat.name,
        children: cat.name,
      }));
      setCategoryOptions(opts);
    }
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.replace("Ref ", ""));
      setImagePreview(product.photo);
      setCategoryId(product.categoryId || "");

      setNewImageFile(null);

      if (categories && product.categoryId) {
        const currentCategory = categories.find(
          (cat) => cat.id === product.categoryId
        );
        setSelectedCategoryText(
          currentCategory ? currentCategory.name : "Select category"
        );
      } else {
        setSelectedCategoryText("Select category");
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

    updateProduct(
      {
        id: product.id,
        name,
        description,
        price,
        categoryId,
        image: newImageFile,
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
            Edit Product
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              <GridItem colSpan={2}>
                <Box>
                  <Text mb={2}>Product Image</Text>
                  <Image
                    loading="lazy"
                    src={imagePreview || "https://via.placeholder.com/150"}
                    alt="Product image"
                    borderRadius="md"
                    boxSize="250px"
                    objectFit="cover"
                  />
                  {/* --- NEW: Button and hidden input for changing image --- */}
                  <Button as="label" mt={3} size="sm" width="100%">
                    Change Image
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
                  <Text mb={2}>Name</Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                  />
                </Box>
                <Box>
                  <Text mb={2}>Category</Text>
                  <Select.Root
                    collection={categoryCollection}
                    value={[categoryId]}
                    onValueChange={(details) => {
                      console.log(details.value[0]);
                      console.log(categoryOptions);
                      if (details.value.length >= 0) {
                        const newId = details.value[0];
                        const selectedItem = categoryOptions.find(
                          (opt) => opt.key === newId
                        );
                        if (selectedItem) {
                          setCategoryId(newId);
                          setSelectedCategoryText(selectedItem.textValue);
                        }
                      }
                    }}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText>
                          {selectedCategoryText}
                        </Select.ValueText>
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {isLoadingCategories ? (
                            <Box p={4} textAlign="center">
                              <Spinner size="md" />
                            </Box>
                          ) : (
                            categoryCollection.items.map((item) => (
                              // console.log("THis is item:", item),
                              <Select.Item key={item.key} item={item.key}>
                                {item.children}
                              </Select.Item>
                            ))
                          )}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>
                <Box>
                  <Text mb={2}>Price</Text>
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
                  <Text mb={2}>Description</Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                    rows={4}
                  />
                </Box>
              </GridItem>
            </Grid>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSaveChanges}
              disabled={isPending}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
