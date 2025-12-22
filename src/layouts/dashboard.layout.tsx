import { Sidebar } from "@/components/sidebar/sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <Flex h="100vh">
      <Sidebar />

      <Box flex="1" overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  );
};
