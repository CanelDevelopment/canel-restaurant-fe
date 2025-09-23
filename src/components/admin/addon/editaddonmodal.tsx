import {
  Dialog,
  Button,
  Input,
  Textarea,
  Box,
  Text,
  Select,
  createListCollection,
  Portal,
  Spinner,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState, useEffect, type ChangeEvent } from "react";
import { useUpdateAddonItem } from "@/hooks/addon/useupdateaddon";
import { useFetchGroupedAddons } from "@/hooks/addon/usefetchgroupedaddon";

// Define the shape of a single category from the fetch hook
interface AddonCategory {
  addonId: string;
  addonName: string;
}

// Updated data shape for the addon item, including the image
type AddonData = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addonCategoryId: string | null;
};

interface EditAddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  addon: AddonData | null;
}

export const EditAddonModal = ({
  isOpen,
  onClose,
  addon,
}: EditAddonModalProps) => {
  const { mutate: updateAddon, isPending: isUpdating } = useUpdateAddonItem();
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchGroupedAddons();

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [addonCategoryId, setAddonCategoryId] = useState<string>("");

  // New state for image handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // State for the custom Select component
  const [addonCategoryOptions, setAddonCategoryOptions] = useState<any[]>([]);
  const [selectedCategoryText, setSelectedCategoryText] =
    useState("Select category");

  const categoryCollection = createListCollection({
    items: addonCategoryOptions,
  });

  useEffect(() => {
    // Populate category options
    if (categories) {
      const opts = categories.map((cat: AddonCategory) => ({
        key: cat.addonId,
        textValue: cat.addonName,
        children: cat.addonName,
      }));
      setAddonCategoryOptions(opts);
    }

    if (addon) {
      console.log("This is addon", addon.image);
      setName(addon.name);
      setPrice(addon.price);
      setDescription(addon.description);
      setAddonCategoryId(addon.addonCategoryId || "");
      setImagePreview(addon.image);
      setNewImageFile(null);

      if (categories && addon.addonCategoryId) {
        const currentCategory = categories.find(
          (cat: AddonCategory) => cat.addonId === addon.addonCategoryId
        );
        setSelectedCategoryText(
          currentCategory ? currentCategory.addonName : "Select category"
        );
      } else {
        setSelectedCategoryText("Select category");
      }
    }
  }, [addon, categories]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = () => {
    if (addon) {
      updateAddon(
        {
          id: addon.id,
          name,
          price,
          description,
          addonCategoryId: addonCategoryId || undefined,
          image: newImageFile, // Pass the new file to the hook
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
      size={"xl"}
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
            Edit Addon Item
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            {/* Grid layout for image and form fields */}
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              <GridItem colSpan={2}>
                <Box>
                  <Text mb={2} fontWeight="medium">
                    Addon Image
                  </Text>
                  <Image
                    src={imagePreview || "https://via.placeholder.com/250"}
                    alt="Addon image"
                    loading="lazy"
                    borderRadius="md"
                    boxSize="250px"
                    objectFit="cover"
                    border="1px solid"
                    borderColor="gray.200"
                  />
                  <Button as="label" mt={3} size="sm" width="100%">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" // Hide the default input
                      style={{ display: "none" }}
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
                  <Text mb={1} letterSpacing={0.5}>
                    Name
                  </Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Addon Name"
                  />
                </Box>

                <Box>
                  <Text mb={1} letterSpacing={0.5}>
                    Price
                  </Text>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </Box>

                <Box>
                  <Text mb={1} letterSpacing={0.5}>
                    Category
                  </Text>
                  <Select.Root
                    collection={categoryCollection}
                    value={[addonCategoryId]}
                    onValueChange={(details) => {
                      if (details.value.length > 0) {
                        const newId = details.value[0];
                        const selectedItem = addonCategoryOptions.find(
                          (opt) => opt.key === newId
                        );
                        if (selectedItem) {
                          setAddonCategoryId(newId);
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
                  <Text mb={1} letterSpacing={0.5}>
                    Description
                  </Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Addon Description"
                    rows={3}
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
              onClick={handleSave}
              disabled={isUpdating}
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
