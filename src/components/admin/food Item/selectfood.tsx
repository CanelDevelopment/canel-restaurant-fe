// src/components/SelectFood.tsx

import {
  Text,
  Spinner,
  Center,
  Menu,
  Portal,
  Button,
  Icon,
  useCheckboxGroup,
} from "@chakra-ui/react";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import { useFetchGroupedAddons } from "@/hooks/addon/usefetchgroupedaddon";
import { useEffect } from "react";

// The component expects a callback function to notify the parent of changes.
interface SelectFoodProps {
  onSelectionChange: (selectedIds: string[]) => void;
  hidePortal?: boolean;
  selectedIds?: string[];
}

export const SelectFood: React.FC<SelectFoodProps> = ({
  onSelectionChange,
  selectedIds,
  hidePortal = false,
}) => {
  const { data: groupedAddons, isLoading, isError } = useFetchGroupedAddons();

  // const checkboxGroup = useCheckboxGroup();

  const checkboxGroup = useCheckboxGroup({
    value: selectedIds ?? [],
  });

  useEffect(() => {
    if (selectedIds) {
      checkboxGroup.setValue(selectedIds);
    }
  }, [selectedIds]);

  useEffect(() => {
    onSelectionChange(checkboxGroup.value);
  }, [checkboxGroup.value, onSelectionChange]);

  const getTriggerText = () => {
    if (isError) return "Error al cargar";

    const selectedCount = checkboxGroup.value.length;

    if (selectedCount === 0) return "Seleccionar complementos";
    if (selectedCount === 1) {
      const selectedItemId = checkboxGroup.value[0];
      const selectedItem = groupedAddons
        ?.flatMap((group) => group.items)
        .find((item) => item.id === selectedItemId);
      return selectedItem?.name || "1 artículo seleccionado";
    }
    return `${selectedCount} artículos seleccionados`;
  };

  return (
    <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild width="60%">
        <Button
          w="100%"
          color={"#575757"}
          bgColor={"#EBEBEB"}
          border={"none"}
          fontWeight="normal"
          textAlign="left"
          justifyContent="space-between"
        >
          {getTriggerText()}
          <Icon as={FaChevronDown} boxSize={3} />
        </Button>
      </Menu.Trigger>
      <Portal disabled={hidePortal}>
        <Menu.Positioner>
          <Menu.Content
            bgColor={"#fff"}
            color={"#000"}
            py={2}
            shadow={"none"}
            border={"1px solid #DEDEDE"}
            maxH="300px"
            overflowY="auto"
            width="var(--reference-width)"
          >
            {isLoading && (
              <Center p={4}>
                <Spinner />
              </Center>
            )}
            {isError && (
              <Center p={4}>
                <Text color="red.500">
                  No se pudieron cargar los artículos.
                </Text>
              </Center>
            )}

            {/* 6. Map over the fetched data to build the menu items. */}
            {groupedAddons?.map((group) => (
              <Menu.ItemGroup key={group.addonId}>
                <Menu.ItemGroupLabel>
                  <Text
                    color="teal.500"
                    fontFamily={"AmsiProCond"}
                    fontWeight="bold"
                    px={3}
                  >
                    {group.addonName}
                  </Text>
                </Menu.ItemGroupLabel>

                {/* Map over the items within each group */}
                {group.items.map((item) => (
                  <Menu.CheckboxItem
                    key={item.id}
                    value={item.id}
                    checked={checkboxGroup.isChecked(item.id)}
                    onCheckedChange={() => checkboxGroup.toggleValue(item.id)}
                  >
                    <Menu.ItemIndicator>
                      <FaCheck />
                    </Menu.ItemIndicator>
                    <Text as="span" ml={2}>
                      {item.name}
                    </Text>
                  </Menu.CheckboxItem>
                ))}
              </Menu.ItemGroup>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
