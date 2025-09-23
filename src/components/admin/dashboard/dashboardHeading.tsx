import { Center, Text } from "@chakra-ui/react";
import type React from "react";

type HeadingTitle = {
  title: string;
};

export const DashboardHeading: React.FC<HeadingTitle> = ({ title }) => {
  return (
    <>
      <Center
        gap={[2, 4]}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[3, 5, 10]}
        py={4}
        flexDirection={["column", "column", "row"]}
        bgColor={"Dgreen"}
      >
        <Text
          color={"Cbutton"}
          fontFamily={"AmsiProCond-Black"}
          fontSize={["2xl", "3xl"]}
        >
          {title}
        </Text>
        {/* <Flex gap={3} alignItems={"center"}>
          <Text
            color={"#58615A"}
            fontSize={"xs"}
            fontFamily={"AmsiProCond-Light"}
          >
            Designed & Developed
          </Text>
          <Box boxSize={16} display={"flex"} alignItems={"center"}>
            <Image src="/Logos/Dotclicklogo.png" />
          </Box>
        </Flex> */}
      </Center>
    </>
  );
};
