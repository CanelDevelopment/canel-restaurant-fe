import {
  Box,
  Button,
  Combobox,
  createListCollection,
  Flex,
  Input,
  Portal,
  Select,
  Spinner,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type React from "react";
import { authClient } from "@/provider/user.provider";
import { useEffect, useMemo, useState } from "react";
import { LocationSearch } from "./locationsearch";
import { useForm } from "react-hook-form";
import { useAddBranch } from "@/hooks/branch/usecreatebranch";
import { useFetchCities } from "@/hooks/branch/usefetchcities"; // 1. Import the new hook
import { useAddSchedule } from "@/hooks/schedule/usecreateschedule";
import { FaChevronDown } from "react-icons/fa6";

interface ManagerOption {
  label: string;
  value: string;
}
interface BranchFormData {
  name: string;
  address: string;
  location: string;
  phoneNumber: number;
  email: string;
  openingTime: string;
  closingTime: string;
  operationHours?: string;
  manager: string;
  cityName: string;
  state?: string;
  status: string;
  deliveryRates: { min: number; max: number; price: number }[];
  areas?: string[];
  orderType: string;
}

export const AddBranchContent: React.FC = () => {
  const [managers, setManagers] = useState<ManagerOption[]>([]);
  const collection = createListCollection({ items: managers });

  const { data: cityData, isLoading: isLoadingCities } = useFetchCities();
  const { mutate: addSchedule } = useAddSchedule();
  const [cityInputValue, setCityInputValue] = useState("");
  const [orderType, setOrderType] = useState("");
  const [deliveryRates, setDeliveryRates] = useState([
    { min: 0, max: 1, price: 0 },
  ]);

  // const [openTime, _setOpenTime] = useState("");
  // const [closeTime, _setCloseTime] = useState("");

  const cityCollection = useMemo(() => {
    const formattedCities =
      cityData?.map((city) => ({
        label: city.name,
        value: city.name,
      })) || [];

    const filtered = formattedCities.filter((city) =>
      city.label.toLowerCase().includes(cityInputValue.toLowerCase())
    );

    return createListCollection({ items: filtered });
  }, [cityData, cityInputValue]);

  useEffect(() => {
    const fetchManagers = async () => {
      const response = await authClient.admin.listUsers({
        query: {
          filterField: "role",
          filterOperator: "eq",
          filterValue: "manager",
        },
      });

      if (response?.data) {
        const options = response.data.users.map((user) => ({
          label: user.name ?? user.email ?? "Sin nombre",
          value: user.id,
        }));

        setManagers(options);
      } else {
        setManagers([]);
      }
    };

    fetchManagers();
  }, []);

  const { register, setValue, handleSubmit, watch } = useForm<BranchFormData>({
    defaultValues: {
      areas: [],
    },
  });

  const { mutate, isPending } = useAddBranch();

  const onSubmit = (values: BranchFormData) => {
    const payload = {
      ...values,
      orderType: values.orderType,
      operationHours: values.openingTime + " - " + values.closingTime,
      deliveryRates: deliveryRates,
      areas: values.areas && values.areas.length > 0 ? values.areas : undefined,
    };

    console.log("rates", deliveryRates);
    console.log("payload", payload);

    mutate(payload, {
      onSuccess: (res) => {
        const branchId = res.id;
        if (branchId && values.openingTime && values.closingTime) {
          for (let day = 0; day < 7; day++) {
            addSchedule({
              branchId,
              dayOfWeek: day,
              isActive: true,
              timeSlots: [
                { openTime: values.openingTime, closeTime: values.closingTime },
              ],
            });
          }
        }
      },
    });
  };

  console.log(deliveryRates);

  const handleLocationChange = (data: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    const coords = [data.lat, data.lng];
    setValue("location", JSON.stringify(coords), { shouldValidate: true });

    setValue("address", data.address, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const [inputValue, setInputValue] = useState("");
  const tags = watch("areas") || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setValue("areas", [...tags, newTag], { shouldDirty: true });
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "areas",
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true }
    );
  };

  const orderTypeOptions = [
    { label: "Both", value: "both" },
    { label: "Pickup", value: "pickup" },
    { label: "Delivery", value: "delivery" },
  ];
  const orderTypeCollection = createListCollection({ items: orderTypeOptions });

  return (
    <Box>
      <Box
        bgColor={"#fff"}
        display={"flex"}
        flexDirection={["column", "column", "row"]}
      >
        {/* Lado izquierdo */}
        <Box w={["100%", "100%", "50%"]} px={[3, 5, 5, 10]} py={7}>
          <Box maxW="md">
            <VStack align="stretch" color={"#000"} spaceY={5}>
              {/* Nombre de Sucursal */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Nombre de Sucursal
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el nombre de sucursal"
                  {...register("name", { required: true })}
                />
              </Flex>

              {/* Dirección completa */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Dirección completa
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese la dirección completa"
                  {...register("address", { required: true })}
                />
              </Flex>

              {/* Email */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  E-mail
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el E-mail"
                  type="email"
                  {...register("email", { required: true })}
                />
              </Flex>

              {/* Número de Teléfono */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Número de Teléfono
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="+1"
                  type="tel"
                  pattern="[0-9+]*"
                  {...register("phoneNumber", {
                    required: true,
                    pattern: {
                      value: /^[0-9+\s()-]+$/,
                      message: "Número de teléfono inválido",
                    },
                  })}
                />
              </Flex>

              {/* Delivery rate */}
              <Flex flexDirection={"column"}>
                <Text mb="2">Delivery Rate Slabs</Text>

                {deliveryRates.map((slab, index) => (
                  <Flex key={index} gap={3} mb={2}>
                    <Input
                      type="number"
                      placeholder="Min KM"
                      bg="#F4F4F4"
                      value={slab.min}
                      onChange={(e) => {
                        const updated = [...deliveryRates];
                        updated[index].min = Number(e.target.value);
                        console.log("updated", updated);
                        // console.log("updated",...deluver )
                        setDeliveryRates(updated);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Max KM"
                      bg="#F4F4F4"
                      value={slab.max}
                      onChange={(e) => {
                        const updated = [...deliveryRates];
                        updated[index].max = Number(e.target.value);
                        setDeliveryRates(updated);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      bg="#F4F4F4"
                      value={slab.price}
                      onChange={(e) => {
                        const updated = [...deliveryRates];
                        updated[index].price = Number(e.target.value);
                        setDeliveryRates(updated);
                      }}
                    />
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        const updated = deliveryRates.filter(
                          (_, i) => i !== index
                        );
                        setDeliveryRates(updated);
                      }}
                    >
                      X
                    </Button>
                  </Flex>
                ))}

                <Button
                  mt={2}
                  onClick={() =>
                    setDeliveryRates([
                      ...deliveryRates,
                      { min: 0, max: 0, price: 0 },
                    ])
                  }
                >
                  Add New Slab
                </Button>
              </Flex>

              {/* Order Type */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Tipo de orden
                </Text>
                <Select.Root
                  collection={orderTypeCollection}
                  value={orderType ? [orderType] : []}
                  onValueChange={(details) => {
                    const selected = details.value[0] ?? "";

                    if (selected) {
                      setOrderType(selected);
                      setValue("orderType", selected, { shouldValidate: true });
                    }
                  }}
                >
                  <Select.Control>
                    <Select.Trigger
                      // Using your established styling for consistency
                      css={{
                        width: "100%",
                        height: "40px",
                        paddingInline: "1rem",
                        backgroundColor: "#EBEBEB",
                        borderRadius: "lg",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Select.ValueText placeholder="Seleccione un tipo" />
                      <Select.Indicator>
                        <FaChevronDown />
                      </Select.Indicator>
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {/* 4. Map over the collection's items */}
                        {orderTypeCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
                {/* <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el tipo de orden de sucursal"
                  type="number"
                  {...register("orderType", {
                    required: true,
                  })}
                /> */}
              </Flex>

              {/* Horario de Operación */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Horario de Operación
                </Text>
                <Flex gap={3} w="full">
                  <Input
                    type="time"
                    border={"none"}
                    bgColor={"#F4F4F4"}
                    rounded={"lg"}
                    _placeholder={{ color: "#929292" }}
                    {...register("openingTime", { required: true })}
                  />
                  <Text alignSelf="center">a</Text>
                  <Input
                    type="time"
                    border={"none"}
                    bgColor={"#F4F4F4"}
                    rounded={"lg"}
                    _placeholder={{ color: "#929292" }}
                    {...register("closingTime", { required: true })}
                  />
                </Flex>
              </Flex>

              {/* Gerente de Sucursal */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Gerente de Sucursal
                </Text>
                <Select.Root
                  collection={collection}
                  {...register("manager", { required: true })}
                  onValueChange={(details) =>
                    setValue("manager", details.value[0])
                  }
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger
                      border={"none"}
                      bgColor={"#EBEBEB"}
                      rounded={"lg"}
                      _placeholder={{ color: "#929292" }}
                    >
                      <Select.ValueText placeholder="Seleccionar" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {collection.items.map((framework) => (
                          <Select.Item item={framework} key={framework.value}>
                            {framework.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Flex>

              {/* Ciudad */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Ciudad
                </Text>
                <Combobox.Root
                  allowCustomValue
                  collection={cityCollection}
                  onValueChange={(details) => {
                    const selectedCity = details.value?.[0];
                    if (selectedCity) {
                      setValue("cityName", selectedCity, {
                        shouldValidate: true,
                      });
                      setCityInputValue(selectedCity);
                    }
                  }}
                  width="100%"
                  disabled={isLoadingCities}
                >
                  <Combobox.Control
                    border={"none"}
                    bgColor={"#EBEBEB"}
                    rounded={"lg"}
                    onBlur={() => {
                      if (cityInputValue) {
                        setValue("cityName", cityInputValue, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <Combobox.Input
                      placeholder="Buscar o agregar una nueva ciudad..."
                      value={cityInputValue}
                      onChange={(e) => setCityInputValue(e.target.value)}
                      _placeholder={{ color: "#929292" }}
                    />
                    <Combobox.IndicatorGroup>
                      {isLoadingCities && <Spinner size="sm" />}
                      <Combobox.ClearTrigger
                        onClick={() => {
                          setCityInputValue("");
                          setValue("cityName", "", { shouldValidate: true });
                        }}
                      />
                      <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                  </Combobox.Control>
                  <Portal>
                    <Combobox.Positioner>
                      <Combobox.Content>
                        <Combobox.Empty>No se encontró ciudad</Combobox.Empty>
                        {cityCollection.items.map((item) => (
                          <Combobox.Item item={item} key={item.value}>
                            {item.label}
                            <Combobox.ItemIndicator />
                          </Combobox.Item>
                        ))}
                      </Combobox.Content>
                    </Combobox.Positioner>
                  </Portal>
                </Combobox.Root>
              </Flex>

              {/* Áreas a cubrir */}
              <Flex>
                <Text minW={"150px"}>Áreas a cubrir</Text>
                <Box w={"full"}>
                  <Input
                    placeholder="Seleccionar tag"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    border={"none"}
                    bgColor={"#EBEBEB"}
                    rounded={"lg"}
                    _placeholder={{ color: "#929292" }}
                  />
                  <Wrap mt={3}>
                    {tags.map((tag, index) => (
                      <WrapItem key={index}>
                        <Tag.Root
                          colorScheme="blue"
                          px={4}
                          py={2}
                          h={"full"}
                          borderRadius="full"
                        >
                          <Tag.Label fontSize={"md"}>{tag}</Tag.Label>
                          <Tag.EndElement>
                            <Tag.CloseTrigger onClick={() => removeTag(tag)} />
                          </Tag.EndElement>
                        </Tag.Root>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              </Flex>
            </VStack>
          </Box>
        </Box>

        {/* Lado derecho */}
        <LocationSearch onLocationChange={handleLocationChange} />
      </Box>
      <Flex justifyContent={"end"} bgColor={"#fff"} px={[3, 5, 5, 10]} py={7}>
        <Button
          bgColor={"Cgreen"}
          color={"Cbutton"}
          rounded={"lg"}
          fontSize={"md"}
          fontFamily={"AmsiProCond-Black"}
          px={16}
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Guardar"}
        </Button>
      </Flex>
    </Box>
  );
};
