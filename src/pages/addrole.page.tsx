import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { AddRoleContent } from "@/components/admin/role/addrolecontent";
import { Box } from "@chakra-ui/react";

const AddRole = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="ROL" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <AddRoleContent />
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

export default AddRole;