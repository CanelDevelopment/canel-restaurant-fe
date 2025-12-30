import {
  Box,
  Text,
  Input,
  Textarea,
  Select,
  HStack,
  Button,
  // Checkbox,
  Image,
  Flex,
  createListCollection,
  Center,
  Separator,
  InputGroup,
  Portal,
  Spinner,
} from "@chakra-ui/react";
// import { FaPlus } from "react-icons/fa";
// import { IoListOutline } from "react-icons/io5";
// import { TbRosetteDiscountFilled } from "react-icons/tb";
// import { AiOutlinePlus } from "react-icons/ai";
import React, { useEffect, useMemo, useState } from "react";
import { HeaderSection } from "./headersection";
import { SelectFood } from "./selectfood";
import { useAddProduct } from "@/hooks/product/usecreateproduct";
import { useFieldArray, useForm } from "react-hook-form";
import { useFetchCategories } from "@/hooks/category/usefetchcategory";
import { TbRosetteDiscountFilled } from "react-icons/tb";
import { FaTrash } from "react-icons/fa6";

export interface ProductVariant {
  name: string;
  price: number;
}

interface productForm {
  name: string;
  description: string;
  productImage: FileList;
  price: number;
  discount: number;
  categoryId: string[];
  addonItemIds: string[];
  availability: boolean;
  tax: number;
  variants: ProductVariant[];
}

export const NewItemContent: React.FC = () => {
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const { data: categoryData } = useFetchCategories();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategoryText, setSelectedCategoryText] = useState(
    "Seleccionar Categoría"
  );

  const [statusKey, setStatusKey] = useState("true");

  const options = [
    { key: "true", label: "PUBLICADO" },
    { key: "false", label: "PENDING" },
  ];

  const collection = createListCollection({
    items: options.map((opt) => ({
      key: opt.key,
      textValue: opt.label,
    })),
  });

  const { register, handleSubmit, setValue, reset, watch, control } =
    useForm<productForm>({
      defaultValues: {
        variants: [{ name: "", price: 0 }],
        categoryId: [],
      },
    });

  const { mutate, isPending } = useAddProduct();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const { onChange: onFileChange, ...restFileRegister } =
    register("productImage");

  useEffect(() => {
    if (categoryData) {
      const opts = categoryData.map((cat: any) => ({
        label: cat.name,
        value: cat.id,
      }));
      setCategoryOptions(opts);
    }
  }, [categoryData]);

  const categoryCollection = createListCollection({
    items: categoryOptions,
  });

  const selectedCategories = watch("categoryId") || [];

  const handleAddonSelectionChange = (selectedIds: string[]) => {
    setValue("addonItemIds", selectedIds, { shouldValidate: true });
  };

  const priceValue = watch("price");
  const discountValue = watch("discount");

  const totalPrice = useMemo(() => {
    const price = Number(priceValue) || 0;
    const discountPercent = Number(discountValue) || 0;

    const discountAmount = price * (discountPercent / 100);
    const finalPrice = price - discountAmount;

    return finalPrice > 0 ? finalPrice : 0;
  }, [priceValue, discountValue]);

  const handleClearForm = () => {
    reset({
      variants: [{ name: "", price: 0 }],
      categoryId: [],
    });
    setStatusKey("true");
    setImagePreview(null);
    setSelectedCategoryText("Seleccionar Categoría");
  };

  async function onSubmit(values: productForm) {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("discount", String(values.discount));

    if (values.categoryId && values.categoryId.length > 0) {
      values.categoryId.forEach((id) => {
        formData.append("categoryId", id);
      });
    }

    // formData.append("categoryId", values.categoryId);
    // formData.append("tax", String(values.tax));

    if (values.availability !== undefined) {
      formData.append("availability", values.availability.toString());
    } else {
      formData.append("availability", "true");
    }

    if (values.productImage && values.productImage.length > 0) {
      formData.append("productImage", values.productImage[0]);
    }

    if (values.addonItemIds && values.addonItemIds.length > 0) {
      values.addonItemIds.forEach((id) => {
        formData.append("addonItemIds", id);
      });
    }

    const validVariants = values.variants.filter(
      (variant) => variant.name && variant.name.trim() !== ""
    );

    // 2. If there are valid variants, stringify and append them.
    if (validVariants.length > 0) {
      formData.append("variants", JSON.stringify(validVariants));
    }

    mutate(formData, {
      onSuccess: () => {
        handleClearForm();
      },
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box bg={"#fff"}>
          <Box p={6} bg="white">
            <Center
              gap={4}
              alignItems={["start", "start", "center", "center"]}
              justifyContent={"space-between"}
              // px={[3, 5, 5, 10]}
              py={7}
              flexDirection={["column", "column", "row"]}
              bgColor={"#FFF"}
            >
              <Flex alignItems={"center"} gapX={5}>
                <Text color={"#000"}>Statu</Text>

                <Box w={"full"}>
                  <Select.Root
                    w={["60vw", "20vw", "40vw", "10vw"]}
                    collection={collection}
                    value={[statusKey]}
                    onValueChange={(details) => {
                      if (details) {
                        const selectedKey = details.value[0]; // "true" or "false"
                        setStatusKey(selectedKey);

                        // Convert string → boolean
                        setValue("availability", selectedKey === "true", {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <Select.HiddenSelect />
                    <Select.Control
                      bgColor={"#f3f3f3"}
                      borderRadius="md"
                      cursor={"pointer"}
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{
                        borderColor: "green.400",
                        boxShadow: "0 0 0 1px green.400",
                      }}
                    >
                      <Select.Trigger cursor={"pointer"} border="none">
                        <Select.ValueText color="gray.600" fontWeight={"Black"}>
                          {options.find((opt) => opt.key === statusKey)
                            ?.label || "Select"}
                        </Select.ValueText>
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                        {/* <Select.ClearTrigger /> */}
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content bg="#fff" borderWidth="1px">
                        {collection.items.map((item) => (
                          <Select.Item
                            cursor="pointer"
                            bgColor="#fff"
                            color="gray.800"
                            key={item.key}
                            item={item.key}
                          >
                            {item.textValue}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                  {/* </Box> */}
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
            {/* Food Item Section */}
            <Box color={"#000"} w={["100%", "100%", "100%", "50%"]}>
              <Box>
                <Flex flexDirection={["column", "row"]} mb={4}>
                  <Text minW={"150px"}>Nombre del Artículo</Text>
                  <Input
                    bgColor={"#F4F4F4"}
                    border={"none"}
                    rounded={"lg"}
                    placeholder="Nombre del articulo"
                    py={6}
                    {...register("name")}
                  />
                </Flex>

                <Flex flexDirection={["column", "row"]} mb={4}>
                  <Text minW={"150px"}>Descripción</Text>
                  <Textarea
                    bgColor={"#F4F4F4"}
                    border={"none"}
                    placeholder="Describa su artículo de comida"
                    rows={5}
                    rounded={"lg"}
                    {...register("description")}
                  />
                </Flex>

                <Flex flexDirection={["column", "row"]}>
                  <Text minW={"150px"}>Categoría de Comida</Text>
                  <Select.Root
                    multiple
                    collection={categoryCollection}
                    value={selectedCategories}
                    onValueChange={(details) => {
                      if (!details) return;

                      const next = details.value; // string[]

                      setValue("categoryId", next, { shouldValidate: true });

                      if (next.length === 0) {
                        setSelectedCategoryText("Seleccionar Categoría");
                      } else if (next.length === 1) {
                        const item = categoryCollection.items.find(
                          (i) => i.value === next[0]
                        );
                        setSelectedCategoryText(item?.label ?? "1 categoría");
                      } else {
                        setSelectedCategoryText(
                          `${next.length} categorías seleccionadas`
                        );
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
                        <Select.ValueText color="#000">
                          {selectedCategoryText}
                        </Select.ValueText>
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content
                          rounded="lg"
                          bg="#fff"
                          borderWidth="1px"
                        >
                          {categoryCollection.items.map((item) => (
                            <Select.Item
                              key={item.value}
                              item={item.value}
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
                </Flex>
              </Box>
            </Box>

            {/* Image section */}
            <Box mt={[4, 0]}>
              <Flex flexDirection={"column"} alignItems={"left"}>
                <Flex
                  flexDirection={["column", "column", "row"]}
                  alignItems={["start", "start", "center"]}
                >
                  <Text mb={[0, 2]} color={"#000"}>
                    Imagen Destacada
                  </Text>

                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    p={6}
                    borderColor="gray.300"
                    borderRadius="md"
                  >
                    {/* Conditionally render the image preview or placeholder text */}
                    {imagePreview ? (
                      <Image
                        loading="lazy"
                        src={imagePreview}
                        alt="Vista previa"
                        objectFit="contain"
                        w={"300px"}
                        h={"300px"}
                      />
                    ) : (
                      <Text
                        color="gray.500"
                        textAlign={"center"}
                        fontSize={"xs"}
                        mb={2}
                      >
                        Añadir Imagen del Plato con Banner
                      </Text>
                    )}

                    {/* This button is now always visible */}
                    <Button
                      as="label"
                      colorScheme="gray"
                      variant="outline"
                      mt={4} // Add margin-top for spacing
                      bgColor={"#D9D9D9"}
                      border={"none"}
                      size={"md"}
                      px={10}
                      color={"#000"}
                      cursor="pointer"
                    >
                      {/* The text changes based on whether an image is selected */}
                      {imagePreview ? "Change Image" : "Choose File"}
                      <Input
                        type="file"
                        accept="image/*"
                        display={"none"}
                        {...restFileRegister}
                        onChange={(e) => {
                          onFileChange(e);
                          const files = e.target.files;
                          if (files && files[0]) {
                            const file = files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") {
                                setImagePreview(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </HStack>

          <HeaderSection title="Código POS General del Artículo" />

          <Box bgColor={"#fff"} color={"#000"} p={6}>
            <HStack
              w={["100%", "100%", "100%", "60%"]}
              alignItems={"center"}
              flexDirection={["column", "column", "row"]}
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
                />
              </Box>
              <Box flex={1} w={["100%", "100%", "50%"]}>
                <Text mb={3}>Descuento</Text>
                <InputGroup startElement={<TbRosetteDiscountFilled />}>
                  <Input
                    rounded={"md"}
                    bgColor={"#F4F4F4"}
                    border={"none"}
                    type="number"
                    {...register("discount")}
                  />
                </InputGroup>
              </Box>

              {/* <Box flex={1} w={["100%", "100%", "35%"]}>
                <Text mb={3}>Tasa Impositiva</Text>
                <InputGroup startElement={<TbRosetteDiscountFilled />}>
                  <Input
                    rounded={"md"}
                    bgColor={"#F4F4F4"}
                    border={"none"}
                    type="number"
                    {...register("tax")}
                  />
                </InputGroup>
              </Box> */}
              {/* <Box flex={1} w={["100%", "100%", "50%"]}>
                <Box
                  rounded="full"
                  color={"Cbutton"}
                  bgColor={"Cgreen"}
                  w={"50px"}
                  h={"50px"}
                  boxSize={10}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <AiOutlinePlus />
                </Box>
              </Box> */}
            </HStack>
          </Box>

          <Separator opacity={0.1} mt={10} />

          <Box
            p={6}
            color={"#000"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"end"}
            flexDirection={["column", "column", "column", "row"]}
          >
            <Box w={["100%", "100%", "100%", "50%"]}>
              {/* Final price input */}
              <Flex
                flexDirection={["column", "column", "row"]}
                alignItems={"center"}
                gapX={4}
              >
                <Text minW={"180px"} fontFamily={"AmsiProCond"} fontSize={"sm"}>
                  Precio Final Después del Descuento
                </Text>
                <Input
                  placeholder="Ref."
                  bgColor={"#EBEBEB"}
                  border={"none"}
                  rounded={"md"}
                  readOnly
                  value={totalPrice.toFixed(2)}
                />
              </Flex>

              {/* show tag price */}
              {/* <Flex alignItems={"center"} gapX={4} mt={4}>
                <Checkbox.Root
                  display={"flex"}
                  justifyContent={"space-between"}
                  w={["100%", "100%", "30%"]}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Label
                    fontSize={"sm"}
                    fontFamily={"AmsiProCond"}
                    fontWeight={"normal"}
                  >
                    Mostrar Precio en Etiqueta
                  </Checkbox.Label>
                  <Checkbox.Control
                    bgColor={"#F4F4F4"}
                    border={"0.3px solid #949494"}
                    rounded={"md"}
                    // mr={}
                  />
                </Checkbox.Root>
              </Flex> */}
            </Box>

            {/* Right side button */}
            <Box mt={[5, 5, 8, 0]}>
              <Button
                bgColor={"Cgreen"}
                minW={"150px"}
                color={"Cbutton"}
                rounded={"md"}
                type="submit"
                disabled={isPending}
              >
                {isPending ? <Spinner size="sm" /> : "Guardar"}
              </Button>
            </Box>
          </Box>

          <HeaderSection title="Variantes y Precios" />

          <Box p={6}>
            {fields.map((field, index) => (
              <HStack
                key={field.id} // Important for React's reconciliation
                w={["100%", "100%", "100%", "70%"]}
                alignItems={"center"}
                flexDirection={["column", "column", "row"]}
                gapX={4}
                mb={4}
              >
                <Box flex={1} w="100%">
                  <Text mb={2}>
                    Nombre de la Variante (ej. 1/2 KG, Pequeño)
                  </Text>
                  <Input
                    placeholder="Nombre de la Variante"
                    rounded={"md"}
                    bgColor={"#F4F4F4"}
                    border={"none"}
                    {...register(`variants.${index}.name`)}
                  />
                </Box>
                <Box flex={1} w="100%">
                  <Text mb={2}>Precio de esta Variante</Text>
                  <Input
                    placeholder="Ref:"
                    rounded={"md"}
                    bgColor={"#F4F4F4"}
                    border={"none"}
                    type="number"
                    step="0.01"
                    {...register(`variants.${index}.price`)}
                  />
                </Box>

                <Button
                  mt="auto"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <FaTrash />
                </Button>
              </HStack>
            ))}

            <Button
              mt={4}
              // colorPalette="green"
              bgColor={"Cbutton"}
              onClick={() => append({ name: "", price: 0 })}
            >
              Añadir Variante
            </Button>
          </Box>

          <HeaderSection title="Artículos de Complemento" />

          <Box p={6}>
            <Flex
              alignItems={"center"}
              flexDirection={["column", "column", "row"]}
              w={["100%", "100%", "100%", "30%"]}
            >
              <Text minW={"150px"} mb={3} color={"#000"}>
                Elegir Artículos
              </Text>
              <SelectFood onSelectionChange={handleAddonSelectionChange} />
            </Flex>
          </Box>
        </Box>
      </form>
    </>
  );
};
