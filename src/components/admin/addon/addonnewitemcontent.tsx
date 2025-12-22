import {
  Box,
  Text,
  Input,
  Textarea,
  Select,
  HStack,
  Button,
  Image,
  Flex,
  createListCollection,
  Center,
  Separator,
  InputGroup,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TbRosetteDiscountFilled } from "react-icons/tb";
import { HeaderSection } from "../food Item/headersection";
import { useFetchAddonCategories } from "@/hooks/addoncategory/usefetchaddoncategory";
import { useForm } from "react-hook-form";
import { useAddAddonItem } from "@/hooks/addon/usecreateaddon";
import { useQueryClient } from "@tanstack/react-query";

interface addonForm {
  name: string;
  description: string;
  addonId: string;
  price: number;
  discount: number;
  addonImage: FileList;
}

export const AddonNewItemContent: React.FC = () => {
  const options = [
    { value: "false", label: "PENDING" },
    { value: "true", label: "PUBLICADO" },
  ];

  const visibilityCollection = createListCollection({ items: options });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: addonCategories } = useFetchAddonCategories();
  const { register, handleSubmit, setValue } = useForm<addonForm>();
  const [selectedCategoryText, setSelectedCategoryText] = useState(
    "Seleccionar Categoría"
  );
  const [addonCategoryOptions, setAddonCategoryOptions] = useState<any[]>([]);

  useEffect(() => {
    if (addonCategories) {
      const opts = addonCategories.map((cat: any) => ({
        key: cat.id,
        textValue: cat.name,
        children: cat.name,
      }));
      setAddonCategoryOptions(opts);
    }
  }, [addonCategories]);

  const categoryCollection = createListCollection({
    items: addonCategoryOptions,
  });

  const { onChange: onFileChange, ...restFileRegister } =
    register("addonImage");
  const [visibility, setVisibility] = useState<string>("false");
  const { mutate, isPending, isSuccess } = useAddAddonItem();

  async function onSubmit(values: addonForm) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("discount", String(values.discount));
    formData.append("addonId", values.addonId);

    if (values.addonImage && values.addonImage.length > 0) {
      formData.append("addonImage", values.addonImage[0]);
    }

    mutate(formData);
    if (isSuccess) queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  return (
    <Box bg={"#fff"}>
      <Box p={6} bg="white">
        <Center
          gap={4}
          alignItems={["start", "start", "center", "center"]}
          justifyContent={"space-between"}
          py={7}
          flexDirection={["column", "column", "row"]}
        >
          <Flex alignItems={"center"} gapX={5}>
            <Text color={"#000"}>Estado</Text>
            <Box w={"full"}>
              <Select.Root
                collection={visibilityCollection}
                value={[visibility]}
                onValueChange={(details) => {
                  if (details.value.length > 0) setVisibility(details.value[0]);
                }}
              >
                <Select.Control>
                  <Select.Trigger
                    bg="#f3f3f3"
                    border="none"
                    borderRadius="md"
                    cursor="pointer"
                  >
                    <Select.ValueText placeholder="Seleccionar estado" />
                    <Select.Indicator />
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#fff" borderWidth="1px">
                      {visibilityCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
          </Flex>
        </Center>
      </Box>

      <Separator opacity={0.1} />

      <HStack
        justifyContent={"space-between"}
        bgColor={"#fff"}
        p={6}
        align="stretch"
        flexDirection={["column", "column", "column", "row"]}
      >
        <Box color={"#000"} w={["100%", "100%", "100%", "50%"]}>
          <Flex flexDirection={["column", "column", "row"]} mb={4} gapX={4}>
            <Text minW={"180px"}>Elegir Categoría de Complemento</Text>
            <Select.Root
              collection={categoryCollection}
              onValueChange={(details) => {
                if (details) {
                  const selectedItem = categoryCollection.items.find(
                    (item) => item.key === details.value[0]
                  );
                  if (selectedItem) {
                    setValue("addonId", selectedItem.key, {
                      shouldValidate: true,
                    });
                    setSelectedCategoryText(selectedItem.textValue);
                  }
                }
              }}
            >
              <Select.HiddenSelect />
              <Select.Control
                bgColor="#f3f3f3"
                borderRadius="md"
                cursor="pointer"
              >
                <Select.Trigger cursor="pointer" border="none">
                  <Select.ValueText color={"#000"}>
                    {selectedCategoryText}
                  </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content rounded="lg" bg="#fff" borderWidth="1px">
                    {categoryCollection.items.map((item) => (
                      <Select.Item
                        key={item.key}
                        item={item.key}
                        cursor="pointer"
                      >
                        {item.textValue}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          <Flex flexDirection={["column", "column", "row"]} mb={4} gapX={4}>
            <Text minW={"180px"} textAlign={["start", "start", "end"]}>
              Descripción
            </Text>
            <Textarea
              bgColor={"#F4F4F4"}
              border={"none"}
              placeholder="Describa su complemento"
              rows={4}
              rounded={"lg"}
              {...register("description")}
            />
          </Flex>

          <Flex flexDirection={["column", "column", "row"]} gapX={4}>
            <Text minW={"180px"} textAlign={["start", "start", "end"]}>
              Nombre del Artículo
            </Text>
            <Input
              bgColor={"#F4F4F4"}
              border={"none"}
              rounded={"lg"}
              placeholder="Nombre del articulo"
              py={6}
              {...register("name")}
            />
          </Flex>
        </Box>

        <Box mt={[4, 0]}>
          <Flex flexDirection={"column"} alignItems={"left"}>
            <Flex
              flexDirection={["column", "row"]}
              alignItems={["start", "center"]}
            >
              <Text mb={[0, 2]} color={"#000"}>
                Imagen Destacada
              </Text>
              <Flex
                direction="column"
                align={["start", `${imagePreview ? "end" : "center"}`]}
                justify={["start", `${imagePreview ? "end" : "center"}`]}
                p={[2, `${imagePreview ? 0 : 6}`]}
                borderColor="gray.300"
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    objectFit="contain"
                    loading="lazy"
                    maxH="100%"
                    maxW="100%"
                    w={"300px"}
                    h={"300px"}
                  />
                ) : (
                  <>
                    <Button
                      as="label"
                      colorScheme="gray"
                      variant="outline"
                      mb={2}
                      bgColor={"#D9D9D9"}
                      border={"none"}
                      size={"md"}
                      px={10}
                    >
                      Elegir archivo
                      <Input
                        type="file"
                        accept="image/*"
                        display={"none"}
                        {...restFileRegister}
                        onChange={(e) => {
                          onFileChange(e);
                          const files = e.target.files;
                          if (files && files[0]) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string")
                                setImagePreview(reader.result);
                            };
                            reader.readAsDataURL(files[0]);
                          }
                        }}
                      />
                    </Button>
                    <Text color="gray.500" textAlign={"right"} fontSize={"xs"}>
                      Añadir imagen del plato con banner
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </HStack>

      <HeaderSection title="Código POS General del Artículo" />

      <Box bgColor={"#fff"} color={"#000"} p={6}>
        <HStack
          w={["100%", "100%", "100%", "60%"]}
          flexWrap={["wrap", "wrap", "wrap", "nowrap"]}
          flexDirection={["column", "column", "row"]}
          alignItems={"end"}
          gapX={8}
        >
          <Box flex={1} w={["100%", "100%", "50%"]}>
            <Text mb={3}>Precios</Text>
            <Input
              placeholder="Ref:"
              rounded={"md"}
              bgColor={"#F4F4F4"}
              border={"none"}
              {...register("price")}
              type="number"
            />
          </Box>
          <Box flex={1} w={["100%", "100%", "50%"]}>
            <Text mb={3}>Descuento</Text>
            <InputGroup startElement={<TbRosetteDiscountFilled />}>
              <Input
                rounded={"md"}
                bgColor={"#F4F4F4"}
                border={"none"}
                {...register("discount")}
              />
            </InputGroup>
          </Box>
        </HStack>
      </Box>

      <Separator opacity={0.1} mt={10} />

      <Box
        p={6}
        color={"#000"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"end"}
        flexDirection={["column", "column", "row"]}
      >
        <Box w={["100%", "100%", "50%"]}>
          <Flex
            flexDirection={["column", "row"]}
            alignItems={"center"}
            gapX={4}
          >
            <Text minW={"180px"} fontFamily={"AmsiProCond"} fontSize={"sm"}>
              Precio Final Después del Descuento
            </Text>
            <Input
              placeholder="Ref."
              bgColor={"#F4F4F4"}
              border={"none"}
              rounded={"md"}
            />
          </Flex>
        </Box>

        <Box>
          <Button
            bgColor={"Cgreen"}
            minW={["auto", "auto", "150px"]}
            color={"Cbutton"}
            rounded={"md"}
            mt={[4, 0]}
            w={["100%", "auto"]}
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Guardar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
