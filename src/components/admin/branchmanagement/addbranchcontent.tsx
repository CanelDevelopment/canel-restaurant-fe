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
import type { LatLngTuple } from "leaflet";
import { useFetchCities } from "@/hooks/branch/usefetchcities"; // 1. Import the new hook
import { useAddSchedule } from "@/hooks/schedule/usecreateschedule";

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
  manager: string;
  cityName: string;
  state?: string;
  status: string;
  areas?: string[];
}

export const AddBranchContent: React.FC = () => {
  const [managers, setManagers] = useState<ManagerOption[]>([]);
  const collection = createListCollection({ items: managers });

  // --- 2. Call the hook to fetch cities and get loading state ---
  const { data: cityData, isLoading: isLoadingCities } = useFetchCities();
  const { mutate: addSchedule } = useAddSchedule();
  const [cityInputValue, setCityInputValue] = useState("");

  const [openTime, _setOpenTime] = useState(""); // e.g. "09:00"
  const [closeTime, _setCloseTime] = useState("");

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
          label: user.name ?? user.email ?? "Unnamed",
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
      areas: values.areas && values.areas.length > 0 ? values.areas : undefined,
    };
    console.log("Submitting data:", payload);
    mutate(payload, {
      onSuccess: (res) => {
        const branchId = res.id; // jo bhi response shape ho
        if (branchId && openTime && closeTime) {
          // sab days ke liye same schedule
          for (let day = 0; day < 7; day++) {
            addSchedule({
              branchId,
              dayOfWeek: day,
              isActive: true,
              timeSlots: [
                { openTime, closeTime },
                // agar 2nd slot bhi chahiye to yaha add kar
                // { openTime: "20:00", closeTime: "23:00" }
              ],
            });
          }
        }
      },
    });
  };

  const handleLocationChange = (position: LatLngTuple) => {
    setValue("location", JSON.stringify(position), { shouldValidate: true });
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

  return (
    <Box>
      <Box
        bgColor={"#fff"}
        display={"flex"}
        flexDirection={["column", "column", "row"]}
      >
        {/* Left side */}
        <Box w={["100%", "100%", "50%"]} px={[3, 5, 5, 10]} py={7}>
          <Box maxW="md">
            <VStack align="stretch" color={"#000"} spaceY={5}>
              {/* Branch Name */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Nom de Sucursal
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el nom de la sucursal"
                  {...register("name", { required: true })}
                />
              </Flex>

              {/* Full Address */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Dirección completa
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese la Dirección completa"
                  {...register("address", { required: true })}
                />
              </Flex>

              {/* Email Address */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Email Addresso
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el email Addresso"
                  type="email"
                  {...register("email", { required: true })}
                />
              </Flex>

              {/* Phone Number */}
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
                      value: /^[0-9+\s()-]+$/, // only digits, +, space, () and -
                      message: "Invalid phone number",
                    },
                  })}
                />
              </Flex>

              {/* Operating Hours */}
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
                  <Text alignSelf="center">to</Text>
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

              {/* Branch Manager */}
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

              {/* --- 4. Updated City Combobox --- */}
              <Flex flexDirection={["column", "row", "column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Ciudad
                </Text>
                <Combobox.Root
                  // 1. Allow custom values
                  allowCustomValue
                  collection={cityCollection}
                  onValueChange={(details) => {
                    const selectedCity = details.value?.[0];
                    if (selectedCity) {
                      // Update both the form value and the input text
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
                    // 2. Add onBlur to save custom input
                    onBlur={() => {
                      // If the input has text, make sure it's set as the form value
                      if (cityInputValue) {
                        setValue("cityName", cityInputValue, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <Combobox.Input
                      placeholder="Search or add a new city..."
                      value={cityInputValue} // Bind value to state
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
                        <Combobox.Empty>No city found</Combobox.Empty>
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

              <Flex>
                <Text minW={"150px"}>Domaines à livrer</Text>
                <Box w={"full"}>
                  <Input
                    placeholder="Enter a tag and press Enter"
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

        {/* Right side */}
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
