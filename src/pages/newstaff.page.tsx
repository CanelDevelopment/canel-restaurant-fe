import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { AddNewStaffContent } from "@/components/admin/staffmanagement/newstaffcontent";
import { Box } from "@chakra-ui/react";

const NewStaff = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="GESTIÓN DE PERSONAL" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <AddNewStaffContent />
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

export default NewStaff;