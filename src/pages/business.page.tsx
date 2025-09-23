import { MainPageContent } from "@/components/admin/businesssettings/mainpagecontent";
import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { Box } from "@chakra-ui/react";

const Business = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CONFIGURACIÓN DEL NEGOCIO" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          {/* <AddBranchContent /> */}
          <MainPageContent />
        </Box>
      </Box>
    </>
  );
};

export default Business;