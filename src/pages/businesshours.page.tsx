import { BusinessHoursContent } from "@/components/admin/businesssettings/businesshourscontent";
import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { Box } from "@chakra-ui/react";

const BusinessHours = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CONFIGURACIÓN DEL NEGOCIO" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <BusinessHoursContent />
        </Box>
      </Box>
    </>
  );
};

export default BusinessHours;