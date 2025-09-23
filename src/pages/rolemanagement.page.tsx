import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { RoleContent } from "@/components/admin/role/rolecontent";
import { Box } from "@chakra-ui/react";

const RoleManagement = () => {
  return (
    <>
      <Box className="I' here" width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="RÔLE" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <RoleContent />
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

export default RoleManagement;
