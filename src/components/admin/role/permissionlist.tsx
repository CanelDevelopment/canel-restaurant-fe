import { useMemo } from "react";
import { Box, Flex, Text, VStack, Spinner, Center } from "@chakra-ui/react";
import { useFetchRolePermissions } from "@/hooks/user/usefetchrolepermission";
import toast from "react-hot-toast";

type PermissionListProps = {
  selectedBranchText: string;
  searchQuery: string;
};

export const PermissionList = ({
  searchQuery,
  selectedBranchText,
}: PermissionListProps) => {
  const {
    data: rolePermissions,
    isLoading,
    isError,
    error,
  } = useFetchRolePermissions();

  const filteredPermissions = useMemo(() => {
    if (!rolePermissions) return [];

    let filteredData = rolePermissions;

    // --- FIX APPLIED HERE ---
    // The condition is updated to check for "All Branches".
    // If a specific branch is selected (and it's not "All Branches"), filter by its name.
    // Otherwise, the branch filter is skipped entirely.
    if (selectedBranchText && selectedBranchText !== "All Branches") {
      filteredData = filteredData.filter(
        (permission) => permission.branch === selectedBranchText
      );
    }
    // --- END OF FIX ---

    // The search filter is then applied to the result of the branch filter.
    if (searchQuery) {
      filteredData = filteredData.filter((permission) =>
        permission.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData;
  }, [rolePermissions, selectedBranchText, searchQuery]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100px">
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    toast.error(`Error fetching permissions: ${error.message}`);
    return (
      <Center p={10}>
        <Text color="red.500">Failed to load permissions.</Text>
      </Center>
    );
  }

  if (!selectedBranchText) {
    return (
      <Center p={10}>
        <Text>Please select a branch to view permissions.</Text>
      </Center>
    );
  }

  return (
    <VStack align="stretch" px={[3, 5, 5, 10]} w={["100%", "100%", "40%"]}>
      {filteredPermissions.length > 0 ? (
        filteredPermissions.map(({ id, role, branch, permissions }) => (
          <Flex
            key={id}
            justify="space-between"
            align="center"
            bg="#F6F6F6"
            borderRadius="xl"
            overflow="hidden"
            border={"0.3px solid #EBEBEB"}
          >
            <Box px={4} py={3}>
              <Text fontFamily={"AmsiProCond"} color={"#323334"}>
                {role}
              </Text>
            </Box>
            <Box
              bg="Cbutton"
              px={4}
              py={3}
              color="white"
              textAlign="center"
              minW="120px"
            >
              <Text fontSize="xs">{branch}</Text>
              <Text fontSize={"sm"} fontFamily={"AmsiProCond"}>
                {permissions} Permisos
              </Text>
            </Box>
          </Flex>
        ))
      ) : (
        <Center p={10}>
          <Text>No permissions found for the current selection.</Text>
        </Center>
      )}
    </VStack>
  );
};
