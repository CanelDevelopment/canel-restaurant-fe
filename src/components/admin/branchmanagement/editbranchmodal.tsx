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
  Grid,
  GridItem,
  Dialog,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useUpdateBranch } from "@/hooks/branch/useupdatebranch";
import { useFetchCities } from "@/hooks/branch/usefetchcities";
import { useFetchAllUsers } from "@/hooks/user/usefetchalluser";
import { FiMapPin, FiPlus } from "react-icons/fi";
import { BiSolidTrash } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa6";
import MapPicker from "@/components/checkout/mappicker";

interface BranchData {
  id: string;
  name: string;
  address: string;
  location?: string;

  cityId: string | null;
  managerId: string | null;
  status: boolean;
  operatingHours: string;
  phoneNumber: string;
  areas?: string[];
  deliveryRates?: { min: number; max: number; price: number }[];

  orderType?: string;
}

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchData | null;
}

type SelectItem = { label: string; value: string };

export const EditBranchModal = ({
  isOpen,
  onClose,
  branch,
}: EditBranchModalProps) => {
  const { mutate: updateBranch, isPending } = useUpdateBranch();
  const { data: cities, isLoading: isLoadingCities } = useFetchCities();
  const { data: allUsers, isLoading: isLoadingUsers } = useFetchAllUsers();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState(true);
  const [cityId, setCityId] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [managerId, setManagerId] = useState("");
  const [shifts, setShifts] = useState([{ openTime: "", closeTime: "" }]);
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [cityInputValue, setCityInputValue] = useState("");
  // const [deliveryRate, setDeliveryRate] = useState("");
  const [orderType, setOrderType] = useState("");

  const [deliveryRates, setDeliveryRates] = useState([
    { min: 0, max: 1, price: 0 },
  ]);

  const [isMapOpen, setIsMapOpen] = useState(false);

  const cityCollection = createListCollection<SelectItem>({
    items:
      cities?.map((city: any) => ({ label: city.name, value: city.id })) || [],
  });

  const orderTypeOptions = [
    { label: "Both", value: "both" },
    { label: "Pickup", value: "pickup" },
    { label: "Delivery", value: "delivery" },
  ];

  const orderTypeCollection = createListCollection({ items: orderTypeOptions });

  const managerOptions = useMemo(() => {
    if (!allUsers) return [];
    return allUsers
      .filter((user) => user.role.toLowerCase() === "manager")
      .map((user) => ({
        label: user.fullName ?? user.email ?? "Gerente sin nombre",
        value: user.id,
      }));
  }, [allUsers]);

  const managerCollection = createListCollection({ items: managerOptions });
  console.log(branch?.deliveryRates);
  useEffect(() => {
    if (branch) {
      setName(branch.name || "");
      setAddress(branch.address || "");
      setPhoneNumber(branch.phoneNumber || "");
      setStatus(branch.status);
      setCityId(branch.cityId || "");
      setManagerId(branch.managerId || "");
      setLocation(branch.location || null);

      setTags(branch.areas || []);
      setDeliveryRates(branch.deliveryRates || []);
      setOrderType(branch.orderType || "");

      // Set city input text for Combobox
      const cityName = cities?.find((c: any) => c.id === branch.cityId)?.name;
      if (cityName) setCityInputValue(cityName);

      if (branch.operatingHours) {
        const parsedShifts = branch.operatingHours.split(",").map((part) => {
          const times = part.trim().split(" - ");
          return { openTime: times[0] || "", closeTime: times[1] || "" };
        });
        setShifts(
          parsedShifts.length ? parsedShifts : [{ openTime: "", closeTime: "" }]
        );
      } else setShifts([{ openTime: "", closeTime: "" }]);
    }
  }, [branch, cities]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  const handleMapSelect = (data: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setAddress(data.address);
    setLocation(JSON.stringify([data.lat, data.lng]));
  };

  const handleAddRate = () => {
    setDeliveryRates([...deliveryRates, { min: 0, max: 1, price: 0 }]);
  };

  const handleRateChange = (
    index: number,
    field: "min" | "max" | "price",
    value: number
  ) => {
    const updated = [...deliveryRates];
    updated[index][field] = value;
    setDeliveryRates(updated);
  };

  const handleDeleteRate = (index: any) => {
    setDeliveryRates(deliveryRates.filter((_, i) => i !== index));
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveChanges = () => {
    if (!branch) return;

    const operatingHoursString = shifts
      .filter((shift) => shift.openTime && shift.closeTime)
      .map((shift) => `${shift.openTime} - ${shift.closeTime}`)
      .join(", ");

    updateBranch(
      {
        id: branch.id,
        name,
        address,
        operatingHours: operatingHoursString,
        phoneNumber,
        location: location ?? undefined,
        status,
        cityId,
        deliveryRates: deliveryRates,
        manager: managerId,
        areas: tags,
        orderType,
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => !details.open && onClose()}
        size={"xl"}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded={"2xl"}>
            <Dialog.Header
              fontSize="2xl"
              fontWeight="bold"
              bgColor={"Cgreen"}
              color={"Cbutton"}
              roundedTop={"2xl"}
              pb={5}
            >
              Editar Sucursal
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body mt={4} px={6}>
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {/* Nombre */}
                <GridItem>
                  <Text mb={2} fontSize={"md"}>
                    Nombre de la Sucursal
                  </Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </GridItem>

                {/* Ciudad (Combobox) */}
                <GridItem>
                  <Text mb={2} fontSize={"md"}>
                    Ciudad
                  </Text>
                  <Combobox.Root
                    allowCustomValue
                    collection={cityCollection}
                    onValueChange={(details) => {
                      const selectedCity = details.value?.[0];
                      if (selectedCity) {
                        setCityInputValue(selectedCity);
                        const cityObj = cities?.find(
                          (c: any) => c.name === selectedCity
                        );
                        if (cityObj) setCityId(cityObj.id);
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
                          const cityObj = cities?.find(
                            (c: any) => c.name === cityInputValue
                          );
                          if (cityObj) setCityId(cityObj.id);
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
                            setCityId("");
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
                </GridItem>

                {/* Dirección */}
                <GridItem>
                  <Text mb={2} fontSize={"md"}>
                    Dirección
                  </Text>
                  <Flex gap={2}>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Dirección"
                    />
                    <IconButton
                      aria-label="Abrir mapa"
                      bgColor="Cgreen"
                      color="white"
                      onClick={() => setIsMapOpen(true)}
                    >
                      <FiMapPin />
                    </IconButton>
                  </Flex>
                </GridItem>

                {/* Delivery Rate */}
                <GridItem>
                  <Box mt={4}>
                    <Text fontWeight="600" mb={2}>
                      Delivery Rates (KM Based)
                    </Text>

                    {deliveryRates.map((rate, index) => (
                      <Box
                        key={index}
                        display="flex"
                        gap="10px"
                        alignItems="center"
                        mb="10px"
                      >
                        <Input
                          placeholder="Min KM"
                          type="number"
                          value={rate.min}
                          onChange={(e) =>
                            handleRateChange(
                              index,
                              "min",
                              Number(e.target.value)
                            )
                          }
                        />

                        <Input
                          placeholder="Max KM"
                          type="number"
                          value={rate.max}
                          onChange={(e) =>
                            handleRateChange(
                              index,
                              "max",
                              Number(e.target.value)
                            )
                          }
                        />

                        <Input
                          placeholder="Price"
                          type="number"
                          value={rate.price}
                          onChange={(e) =>
                            handleRateChange(
                              index,
                              "price",
                              Number(e.target.value)
                            )
                          }
                        />

                        <Button
                          colorScheme="red"
                          onClick={() => handleDeleteRate(index)}
                        >
                          Delete
                        </Button>
                      </Box>
                    ))}

                    <Button mt={2} colorScheme="blue" onClick={handleAddRate}>
                      + Add Rate
                    </Button>
                  </Box>
                </GridItem>

                {/* Gerente */}
                <GridItem>
                  <Text mb={2} fontSize={"md"}>
                    Gerente
                  </Text>
                  <Select.Root
                    collection={managerCollection}
                    value={[managerId]}
                    onValueChange={(details) => {
                      if (details.value.length > 0)
                        setManagerId(details.value[0]);
                    }}
                    disabled={isLoadingUsers}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Asignar un gerente" />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {isLoadingUsers ? (
                            <Spinner />
                          ) : (
                            managerCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                              </Select.Item>
                            ))
                          )}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </GridItem>

                {/* Número de Contacto */}
                <GridItem>
                  <Text mb={2} fontSize={"md"}>
                    Número de Contacto
                  </Text>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </GridItem>

                {/* Horario de Atención */}
                <GridItem colSpan={3}>
                  <Text mb={2} fontSize={"md"}>
                    Horario de Atención
                  </Text>
                  <VStack align="stretch" spaceY={4}>
                    {shifts.map((shift, index) => (
                      <Flex key={index} align="center" gap={4}>
                        <Input
                          type="time"
                          value={shift.openTime}
                          onChange={(e) => {
                            const updated = [...shifts];
                            updated[index].openTime = e.target.value;
                            setShifts(updated);
                          }}
                        />
                        <Text>-</Text>
                        <Input
                          type="time"
                          value={shift.closeTime}
                          onChange={(e) => {
                            const updated = [...shifts];
                            updated[index].closeTime = e.target.value;
                            setShifts(updated);
                          }}
                        />
                        {shifts.length > 1 && (
                          <Icon
                            as={BiSolidTrash}
                            bgColor="#FFD3D3"
                            color="#EF4B4B"
                            p={2}
                            rounded="full"
                            fontSize="3xl"
                            cursor="pointer"
                            onClick={() =>
                              setShifts(shifts.filter((_, i) => i !== index))
                            }
                          />
                        )}
                      </Flex>
                    ))}
                    <Button
                      size="sm"
                      bgColor="#F4F4F4"
                      color="#373B3F"
                      rounded="md"
                      onClick={() =>
                        setShifts([...shifts, { openTime: "", closeTime: "" }])
                      }
                    >
                      <Icon as={FiPlus} mr={2} />
                      Añadir otro turno
                    </Button>
                  </VStack>
                </GridItem>

                {/* Áreas */}
                <GridItem colSpan={2}>
                  <Text mb={2} fontSize={"md"}>
                    Áreas a cubrir
                  </Text>
                  <Box w={"full"}>
                    <Input
                      placeholder="Ingrese un tag y presione Enter"
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
                              <Tag.CloseTrigger
                                onClick={() => removeTag(tag)}
                              />
                            </Tag.EndElement>
                          </Tag.Root>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                </GridItem>

                {/* Order Type */}

                <GridItem colSpan={1}>
                  <Text mb={2} fontSize={"md"}>
                    Tipo de orden
                  </Text>
                  <Box w={"full"}>
                    {/* 3. Implement the Select component using the collection */}
                    <Select.Root
                      collection={orderTypeCollection}
                      value={orderType ? [orderType] : []}
                      onValueChange={(details) => {
                        // Ensure a value exists before setting state
                        if (details.value.length > 0) {
                          setOrderType(details.value[0]);
                        } else {
                          setOrderType(""); // Handle clearing the selection
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
                  </Box>
                </GridItem>
              </Grid>
            </Dialog.Body>
            <Dialog.Footer p={6}>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                bgColor="Cgreen"
                color="Cbutton"
                onClick={handleSaveChanges}
                disabled={isPending}
              >
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={handleMapSelect}
      />
    </>
  );
};
