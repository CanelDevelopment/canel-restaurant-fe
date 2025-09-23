import { BusinessPasswordContent } from "@/components/admin/businesssettings/businesspasswordcontent";
import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { Box } from "@chakra-ui/react";

const BusinessPassword = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CONFIGURACIÓN DEL NEGOCIO" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <BusinessPasswordContent />
        </Box>
      </Box>
    </>
  );
};

export default BusinessPassword;