import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { NewItemContent } from "@/components/admin/food Item/newitemcontent";
import { Box } from "@chakra-ui/react";

const NewItem = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="ARTÍCULO DE COMIDA" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <NewItemContent />
        </Box>
        <Box px={[0, 0, 8]} position={"relative"}>
          <Box
            bgColor={"#fff"}
            h={"100px"}
            display={"flex"}
            justifyContent={"flex-end"}
            py={5}
            px={8}
          ></Box>
        </Box>
      </Box>
    </>
  );
};

export default NewItem;