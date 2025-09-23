import { Icon } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

type headerprops = {
  title: string;
  description: string;
};

export const BusinessHeader: React.FC<headerprops> = ({
  title,
  description,
}) => {
  return (
    <Box bgColor={"Dgreen"} h={"130px"} px={[3, 5, 10]} py={6}>
      <Box w={["100%", "100%", "50%"]}>
        <Link to={"/dashboard/business_settings"}>
          <Text
            color={"Cbutton"}
            fontSize={"lg"}
            fontFamily={"AmsiProCond-Black"}
            mb={2}
          >
            <Icon color={"Cbutton"} as={FaArrowLeft} mr={2} />
            {title}
          </Text>
        </Link>
        <Text color={"#58615A"} fontSize={"sm"}>
          {description}
        </Text>
      </Box>
    </Box>
  );
};
