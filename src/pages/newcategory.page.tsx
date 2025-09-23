import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { NewFoodCategoryContent } from "@/components/admin/foodcategory/newfoodcategorycontent";
import { Box } from "@chakra-ui/react";

const NewCategory = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CATEGORÍA DE ALIMENTOS" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <NewFoodCategoryContent />
        </Box>
        <Box px={[0, 0, 8]} position={"relative"}></Box>
      </Box>
    </>
  );
};

export default NewCategory;
