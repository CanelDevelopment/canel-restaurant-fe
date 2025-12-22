import { Box } from "@chakra-ui/react";
import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { CustomerListContent } from "@/components/admin/customerlist/customerlistContent";
const CustomerList = () => {
  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="LISTA DE CLIENTES" />
        <Box px={[0, 0, 8]} pb={3} rounded={"none"}>
          <CustomerListContent />
        </Box>
      </Box>
    </>
  );
};

export default CustomerList;
