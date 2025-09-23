import { Box, Button, Center, Flex, Separator } from "@chakra-ui/react";
import { FaPlus, FaSortAlphaDown } from "react-icons/fa";
import { Link } from "react-router-dom";

type navlink = {
  link: string;
};

export const AddonContent: React.FC<navlink> = ({ link }) => {
  return (
    <>
      <Box bg={"#fff"}>
        <Center
          gap={4}
          alignItems={["start", "start", "center", "center"]}
          justifyContent={"space-between"}
          px={[2, 0, 5]}
          py={7}
          flexDirection={["column", "column", "row"]}
          bgColor={"#FFF"}
        >
          <Flex gapX={4}>
            <Link to={`${link}`}>
              <Button
                fontFamily={"AmsiProCond"}
                bgColor={"Cgreen"}
                color={"Cbutton"}
                rounded={"md"}
                fontSize={"md"}
              >
                <FaPlus />
                Añadir Nuevo
              </Button>
            </Link>
            <Button
              bgColor={"#000"}
              color={"#fff"}
              fontFamily={"AmsiProCond"}
            >
              <FaSortAlphaDown />
              Ordenar
            </Button>
          </Flex>
        </Center>
        <Separator opacity={0.1} pt={4} />
      </Box>
    </>
  );
};