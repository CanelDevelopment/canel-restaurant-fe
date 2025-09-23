import {
  Box,
  Button,
  Center,
  createListCollection,
  Flex,
  Input,
  InputGroup,
  Portal,
  Select,
  Separator,
  Text,
} from "@chakra-ui/react";
import type React from "react";
import { FaPlus } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { PermissionList } from "./permissionlist";
import { Link } from "react-router-dom";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useMemo, useState, useEffect } from "react";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";

export const RoleContent: React.FC = () => {
  const { data: user } = useFetchCurrentUser();
  const { data: allBranches } = useFetchBranch();

  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");

  // --- MODIFICATION START ---
  // 1. Add state for the search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  // --- MODIFICATION END ---

  const availableBranches = useMemo(() => {
    if (!user || !allBranches) return [];
    if (user.role.toLowerCase() === "admin") {
      return allBranches;
    }
    if (user.role.toLowerCase() === "manager" && user.id) {
      const assignedBranch = allBranches.find(
        (branch) => branch.manager?.id === user.id
      );
      return assignedBranch ? [assignedBranch] : [];
    }
    return [];
  }, [user, allBranches]);

  useEffect(() => {
    if (
      user?.role.toLowerCase() === "manager" &&
      availableBranches.length > 0
    ) {
      setSelectedBranchId(availableBranches[0].id);
      setSelectedBranchText(availableBranches[0].name);
    }
  }, [user, availableBranches]);

  const branchOptions = createListCollection({
    items: [
      ...(user && user.role.toLowerCase() === "admin"
        ? [{ key: "all", textValue: "All Branches", children: "All Branches" }]
        : []),
      ...(availableBranches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  return (
    <Box>
      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[3, 5, 5, 10]}
        py={7}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Flex
          gapY={4}
          flexWrap={["wrap", "nowrap"]}
          justifyContent={"space-between"}
          w={"full"}
        >
          <Flex gapX={4}>
            <Link to="/dashboard/role_management/add_new_role">
              <Button
                fontFamily={"AmsiProCond"}
                bgColor={"Cgreen"}
                color={"Cbutton"}
                rounded={"md"}
                fontSize={"md"}
              >
                <FaPlus />
                <Text mb={0.5}>Añadir Nuevo</Text>
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Center>

      <Separator opacity={0.1} />

      <Box bgColor={"#fff"}>
        <Box
          px={[3, 5, 5, 10]}
          py={5}
          display={"flex"}
          gap={5}
          justifyContent={"space-between"}
          flexDirection={["column", "column", "row"]}
        >
          <Flex
            flexDirection={["column", "column", "row"]}
            alignItems={["start", "start", "center"]}
          >
            <Text minW={["100%", "140px"]} mb="1" color={"#000"}>
              Seleccionar Sucursal
            </Text>
            <Select.Root
              collection={branchOptions}
              value={selectedBranchId ? [selectedBranchId] : []}
              onValueChange={(details) => {
                const selectedItem = branchOptions.items.find(
                  (item) => item.key === details?.value[0]
                );
                if (selectedItem) {
                  setSelectedBranchId(selectedItem.key);
                  setSelectedBranchText(selectedItem.textValue);
                }
              }}
            >
              <Select.Control>
                <Select.Trigger bg="#ebebeb" h="42px" border="none">
                  <Select.ValueText placeholder="Seleccionar Sucursal">
                    {selectedBranchText || "Seleccionar Sucursal"}
                  </Select.ValueText>
                  <Select.Indicator color={"#575757"} />
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner zIndex={2000}>
                  <Select.Content zIndex={2000}>
                    {branchOptions.items.map((item) => (
                      <Select.Item key={item.key} item={item.key}>
                        {item.textValue}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>
          <Flex flexDirection={["column", "row"]}>
            <InputGroup startElement={<LuSearch color={"Cbutton"} />}>
              {/* --- MODIFICATION START --- */}
              {/* 2. Control the input with state */}
              <Input
                bgColor={"#f4f4f4"}
                border={"none"}
                color={"#000"}
                placeholder="Buscar por rol y nombre"
                _placeholder={{ color: "#929292" }}
                w={["100%", "250px", "250px", "400px"]}
                rounded={"md"}
                pb={1}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* --- MODIFICATION END --- */}
            </InputGroup>
          </Flex>
        </Box>

        {/* --- MODIFICATION START --- */}
        {/* 3. Pass the searchQuery prop */}
        <PermissionList
          selectedBranchText={selectedBranchText}
          searchQuery={searchQuery}
        />
        {/* --- MODIFICATION END --- */}
      </Box>
    </Box>
  );
};
