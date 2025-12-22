import {
  Box,
  Select,
  createListCollection,
  Spinner,
  Icon, // Import Text for the error message
} from "@chakra-ui/react";
import { useFreeAreas } from "@/hooks/branch/usefetchareas";
import React, { useState } from "react"; // <-- Import useState
import { IoIosArrowDown } from "react-icons/io";

type SelectLocationProps = {
  cityName: string;
  isVisible?: boolean;
};
export const SelectLocation: React.FC<SelectLocationProps> = ({
  cityName,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  const { data: areas, isLoading, error } = useFreeAreas(cityName);

  const [selectedValue, setSelectedValue] = useState<string | null>(() =>
    localStorage.getItem("selectedArea")
  );

  const handleSelectionChange = (details: { value: string[] }) => {
    const newArea = details.value[0];

    if (newArea) {
      setSelectedValue(newArea);
      localStorage.setItem("selectedArea", newArea);
    }
  };

  if (!cityName) {
    return (
      <Box mt={4} color="gray.500">
        Please select a city first
      </Box>
    );
  }
  if (isLoading) {
    return (
      <Box mt={4} display="flex" alignItems="center">
        <Spinner size="sm" mr={2} /> Loading areas...
      </Box>
    );
  }
  if (error) {
    return (
      <Box mt={4} color="red.500">
        Error loading areas
      </Box>
    );
  }

  // Your data mapping is fine.
  const collection = createListCollection({
    items: (areas ?? []).map((name) => ({
      label: name,
      value: name,
    })),
  });

  return (
    <Box mt={4} w="100%" maxW="400px">
      {/* --- 3. Connect the handler and control the component's value --- */}
      <Select.Root
        collection={collection}
        size="md"
        onValueChange={handleSelectionChange}
        value={selectedValue ? [selectedValue] : []}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger
            mt={3}
            bgColor={"#E0E0E0"}
            color={"#7B7B7B"}
            width={"full"}
            height={10}
            borderRadius={8}
            fontSize={12}
            fontWeight={500}
            cursor={"pointer"}
          >
            <Select.ValueText placeholder="Select Location" />
            <Select.IndicatorGroup>
              <Icon as={IoIosArrowDown} color="gray.600" />
            </Select.IndicatorGroup>
          </Select.Trigger>
        </Select.Control>

        <Select.Positioner>
          <Select.Content>
            {collection.items.length > 0 ? (
              collection.items.map((item) => (
                <Select.Item item={item} key={item.value as string}>
                  <Select.ItemText>{item.label as string}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))
            ) : (
              <Box p={3} textAlign="center" color="gray.500">
                No areas found for {cityName}.
              </Box>
            )}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Box>
  );
};
