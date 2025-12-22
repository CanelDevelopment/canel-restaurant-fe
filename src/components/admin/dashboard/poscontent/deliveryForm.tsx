import {
  Box,
  Center,
  createListCollection,
  Icon,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import type React from "react";
import { useMemo } from "react";
import type { PosOrderInfo, Branch } from "./posContent"; // Import the updated interfaces
import { IoIosArrowDown } from "react-icons/io";

interface DeliveryFormProps {
  orderInfo: PosOrderInfo;
  onInfoChange: (field: keyof PosOrderInfo, value: string) => void;
  selectedBranch?: Branch;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  orderInfo,
  onInfoChange,
  selectedBranch,
}) => {
  const areaOptions = useMemo(() => {
    if (!selectedBranch || !selectedBranch.areas) {
      return createListCollection<{ label: string; value: string }>({
        items: [],
      });
    }
    const items = selectedBranch.areas.map((area) => ({
      label: area,
      value: area,
    }));
    return createListCollection<{ label: string; value: string }>({ items });
  }, [selectedBranch]);

  const cityOptions = useMemo(() => {
    if (!selectedBranch || !selectedBranch.city) {
      return createListCollection<{ label: string; value: string }>({
        items: [],
      });
    }
    const items = [
      {
        label: selectedBranch.city.name,
        value: selectedBranch.city.name,
      },
    ];
    return createListCollection<{ label: string; value: string }>({ items });
  }, [selectedBranch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInfoChange(e.target.name as keyof PosOrderInfo, e.target.value);
  };

  const handleSelectChange = (
    field: "city" | "area",
    details: { value: string[] }
  ) => {
    const value = details.value[0] || "";
    onInfoChange(field, value);
  };

  return (
    <>
      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        py={4}
        flexDirection={["column", "column", "row"]}
        bg={"#fff"}
      >
        <Box
          display={"flex"}
          flexDirection={["column", "column", "row"]}
          gapX={9}
          gapY={[4, 4, 4]}
          px={[2, 5, 4, 6]}
          my={6}
          w={"full"}
          fontFamily={"AmsiProCond"}
        >
          <Input
            name="phoneNumber"
            placeholder="Ingrese Número de Teléfono"
            value={orderInfo.phoneNumber}
            onChange={handleChange}
            py={6}
            px={5}
            border={"none"}
            bgColor={"#F4F4F4"}
          />
          <Input
            name="name"
            placeholder="Nombre del Cliente"
            value={orderInfo.name}
            onChange={handleChange}
            py={6}
            px={5}
            border={"none"}
            bgColor={"#F4F4F4"}
          />
          <Input
            name="email"
            type="email"
            placeholder="E-mail del Cliente"
            value={orderInfo.email}
            onChange={handleChange}
            py={6}
            px={5}
            border={"none"}
            bgColor={"#F4F4F4"}
          />
        </Box>
      </Center>

      <Box bgColor={"#FBFFF0"} py={6} fontFamily={"AmsiProCond"}>
        <Text
          color={"#000"}
          fontFamily={"AmsiProCond-Black"}
          px={[6, 6, 7, 8]}
          fontSize={"xl"}
        >
          Dirección
        </Text>
      </Box>

      <Center
        gap={4}
        alignItems={"start"}
        justifyContent={"space-between"}
        pt={4}
        pb={10}
        flexDirection={"column"}
        bg={"#fff"}
      >
        <Box
          display={"flex"}
          flexDirection={["column", "column", "row"]}
          gapX={9}
          gapY={4}
          px={6}
          my={6}
          w={"full"}
          fontFamily={"AmsiProCond"}
        >
          <Input
            name="location"
            placeholder="Dirección Completa"
            value={orderInfo.location}
            onChange={handleChange}
            py={6}
            px={5}
            border={"none"}
            bgColor={"#F4F4F4"}
          />
          <Input
            name="nearestLandmark"
            placeholder="Cerca de un Punto de Referencia"
            value={orderInfo.nearestLandmark}
            onChange={handleChange}
            py={6}
            px={5}
            border={"none"}
            bgColor={"#F4F4F4"}
          />

          {/* DYNAMIC AREA SELECT */}
          <Select.Root
            collection={areaOptions}
            size="lg"
            value={[orderInfo.area]}
            onValueChange={(details) => handleSelectChange("area", details)}
            disabled={!selectedBranch}
          >
            <Select.Control>
              <Select.Trigger
                bgColor={"#F4F4F4"}
                rounded={"md"}
                border={"none"}
                py={3.2}
                px={5}
              >
                <Select.ValueText placeholder="Seleccionar Área" />
                <Select.IndicatorGroup>
                  <Icon as={IoIosArrowDown} />
                </Select.IndicatorGroup>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content bg="#fff" borderWidth="1px">
                {areaOptions.items.map((item) => (
                  <Select.Item
                    item={item}
                    key={item.value as string}
                    cursor={"pointer"}
                    bgColor={"#fff"}
                    color="gray.800"
                  >
                    <Select.ItemText>{item.label as string}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>

        {/* DYNAMIC CITY SELECT */}
        <Box px={6} w={["full", "full", "35%"]} fontFamily={"AmsiProCond"}>
          <Select.Root
            collection={cityOptions}
            size="lg"
            value={[orderInfo.city]}
            onValueChange={(details) => handleSelectChange("city", details)}
            disabled={!selectedBranch}
          >
            <Select.Control>
              <Select.Trigger
                bgColor={"#F4F4F4"}
                rounded={"md"}
                border={"none"}
                py={3.2}
                px={5}
              >
                <Select.ValueText placeholder="Ciudad" />
                <Select.IndicatorGroup>
                  <Icon as={IoIosArrowDown} />
                </Select.IndicatorGroup>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content bg="#fff" borderWidth="1px">
                {cityOptions.items.map((item) => (
                  <Select.Item
                    item={item}
                    key={item.value as string}
                    cursor={"pointer"}
                    bgColor={"#fff"}
                    color="gray.800"
                  >
                    <Select.ItemText>{item.label as string}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>
      </Center>
    </>
  );
};
