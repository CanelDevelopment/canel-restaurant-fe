import { AddonNewContent } from "@/components/admin/addon/addonnewcontent";
import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { Box } from "@chakra-ui/react";

const NewAddonCategory = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CATEGORÍA DE COMPLEMENTO" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <AddonNewContent />
        </Box>
      </Box>
    </>
  );
};

export default NewAddonCategory;
