import {
  Box,
  Button,
  Center,
  createListCollection,
  Flex,
  Input,
  Select,
  Separator,
  Spinner,
  Text,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAddCategory } from "@/hooks/category/usecreatecategory";
import { useState } from "react";

interface CategoryForm {
  name: string;
  description: string;
  volumeDiscountTier1?: number;
  volumeDiscountTier2?: number;
}

export const NewFoodCategoryContent = () => {
  const options = [
    { key: "1", label: "PUBLICADO", value: true },
    { key: "2", label: "PENDING", value: false },
  ];

  const collection = createListCollection({
    items: options.map((opt) => ({
      key: opt.key,
      textValue: opt.label,
    })),
  });

  const { register, handleSubmit, reset } = useForm<CategoryForm>();
  const { mutate, isPending } = useAddCategory();

  // default Pending (false)
  const [availability, setAvailability] = useState("2");

  // State to toggle the discount section
  const [enableVolumeDiscount, setEnableVolumeDiscount] = useState(false);

  async function onSubmit(values: CategoryForm) {
    // Construct the payload based on the "Aggregate & Apply" theory
    const payload = {
      ...values,
      visibility: availability === "1",
      // We structure the rules as a JSON object for the backend
      volumeDiscountRules: enableVolumeDiscount
        ? {
            enabled: true,
            type: "fixed_amount_off",
            tiers: [
              {
                minQty: 2,
                discountAmount: Number(values.volumeDiscountTier1) || 0,
              },
              {
                minQty: 3,
                discountAmount: Number(values.volumeDiscountTier2) || 0,
              },
            ],
          }
        : null, // Send null if disabled
    };

    // Clean up flat fields before sending if you prefer not to send them flat
    // delete payload.volumeDiscountTier1;
    // delete payload.volumeDiscountTier2;

    mutate(payload as any, {
      onSuccess: () => {
        reset();
        setAvailability("2");
        setEnableVolumeDiscount(false);
      },
    });
  }

  return (
    <>
      {/* Availability Select */}
      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[3, 5, 5, 10]}
        py={7}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Flex gapX={4} gapY={4} flexWrap={["wrap", "nowrap"]}>
          <Flex alignItems={"center"} gapX={5}>
            <Text color={"#000"}>Estado</Text>

            <Box w={"full"}>
              <Select.Root
                w={["60vw", "20vw", "40vw", "10vw"]}
                collection={collection}
                value={[availability]}
                onValueChange={(details) => {
                  if (details) {
                    setAvailability(details.value[0]); // "1" or "2"
                  }
                }}
              >
                <Select.HiddenSelect />
                <Select.Control
                  bgColor={"#f3f3f3"}
                  borderRadius="md"
                  cursor={"pointer"}
                >
                  <Select.Trigger cursor={"pointer"} border="none">
                    <Select.ValueText color="gray.600" fontWeight={"Black"}>
                      {options.find((opt) => opt.key === availability)?.label ||
                        "Seleccionar"}
                    </Select.ValueText>
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
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
            </Box>
          </Flex>
        </Flex>
      </Center>

      <Separator w={"full"} orientation={"horizontal"} opacity={0.1} />

      {/* Category Form */}
      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[0, 0, 5, 5]}
        py={7}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Box p={[6, 6, 2, 6]} display={"flex"} gapX={16} w="full">
          <Flex flexDirection={"column"} gapY={5} wrap="wrap" flex={1}>
            {/* Food Category */}
            <Box
              display={"flex"}
              flexDirection={["column", "column", "row"]}
              alignItems={["start", "start", "center"]}
              gapX={6}
            >
              <Box
                flex="1"
                display={"flex"}
                flexDirection={["column", "column", "row", "row"]}
                alignItems={["start", "start", "center"]}
                minW={["200px", "500px"]}
              >
                <Text fontFamily={"AmsiProCond"} color={"#000"} minW="150px">
                  Nombre de la categoría
                </Text>
                <Input
                  placeholder="Ej: Cheesecakes"
                  border={"none"}
                  bg="gray.100"
                  {...register("name", { required: true })}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box
              display={"flex"}
              flexDirection={["column", "column", "row"]}
              alignItems={["start", "start", "center"]}
              minW={["200px", "500px"]}
            >
              <Text minW="150px" color={"#000"}>
                Descripción
              </Text>
              <Textarea
                border={"none"}
                placeholder="Ingrese la descripción de la categoría"
                bg="gray.100"
                rows={4}
                {...register("description")}
              />
            </Box>

            {/* --- NEW VOLUME DISCOUNT SECTION --- */}
            <Separator orientation="horizontal" my={2} />
            <Box
              display={"flex"}
              flexDirection="column"
              gap={3}
              bg="#F9F9F9"
              p={4}
              rounded="md"
              border="1px dashed #d1d1d1"
            >
              <Checkbox.Root
                colorPalette={"green"}
                checked={enableVolumeDiscount}
                onCheckedChange={(e) =>
                  setEnableVolumeDiscount(e.checked as boolean)
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control
                  bgColor={"#fff"}
                  border={"1px solid #949494"}
                />
                <Checkbox.Label
                  fontFamily={"AmsiProCond-Black"}
                  color="#000"
                  fontSize="lg"
                >
                  Activar Descuento por Volumen (Mix & Match)
                </Checkbox.Label>
              </Checkbox.Root>

              <Text fontSize="sm" color="gray.500" mb={2}>
                Si se activa, el precio bajará automáticamente cuando el cliente
                compre múltiples productos de esta categoría, sin importar el
                sabor.
              </Text>

              {enableVolumeDiscount && (
                <Flex gap={6} direction={["column", "row"]}>
                  <Box flex={1}>
                    <Text
                      fontFamily={"AmsiProCond"}
                      fontSize="sm"
                      mb={1}
                      color="black"
                    >
                      Descuento por Unidad (Cant. 2)
                    </Text>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 1.00 (baja $1)"
                      bg="white"
                      borderColor="gray.300"
                      {...register("volumeDiscountTier1")}
                    />
                    <Text fontSize="xs" color="gray.400" mt={1}>
                      Se aplica si compran 2 items.
                    </Text>
                  </Box>

                  <Box flex={1}>
                    <Text
                      fontFamily={"AmsiProCond"}
                      fontSize="sm"
                      mb={1}
                      color="black"
                    >
                      Descuento por Unidad (Cant. 3+)
                    </Text>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 2.00 (baja $2)"
                      bg="white"
                      borderColor="gray.300"
                      {...register("volumeDiscountTier2")}
                    />
                    <Text fontSize="xs" color="gray.400" mt={1}>
                      Se aplica si compran 3 o más items.
                    </Text>
                  </Box>
                </Flex>
              )}
            </Box>
            {/* --- END VOLUME DISCOUNT SECTION --- */}
          </Flex>

          <Box>
            {/* Hide Category Display Name in Menu */}
            <Box
              display="flex"
              mt={[3, 5, 0]}
              alignItems={["start", "start", "center"]}
            >
              <Checkbox.Root colorPalette={"green"}>
                <Checkbox.HiddenInput />
                <Checkbox.Label
                  fontFamily={"AmsiProCond"}
                  color={["#646464", "#646464", "#000"]}
                  mb="0"
                  whiteSpace="nowrap"
                >
                  Ocultar Nombre de Categoría en el Menú
                </Checkbox.Label>
                <Checkbox.Control
                  bgColor={"#EBEBEB"}
                  border={"1px solid #949494"}
                  color={"#111"}
                />
              </Checkbox.Root>
            </Box>
          </Box>
        </Box>
      </Center>

      {/* Save Button */}
      <Box
        bgColor={"#fff"}
        h={"100px"}
        display={"flex"}
        justifyContent={"flex-end"}
        py={5}
        px={10}
        onClick={handleSubmit(onSubmit)}
      >
        <Button
          color={"Cbutton"}
          bgColor={"Cgreen"}
          w={["100%", "100%", "10%"]}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Guardar"}
        </Button>
      </Box>
    </>
  );
};
