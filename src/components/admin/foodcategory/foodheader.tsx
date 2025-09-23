import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import type React from "react";
// import { FaSortAlphaDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

type ShowButton = {
  showImportButton?: boolean;
  link: string;
};

export const FoodHeader: React.FC<ShowButton> = ({
  showImportButton = false,
  link,
}) => {
  return (
    <>
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
          <Link to={link}>
            <Button
              fontFamily={"AmsiProCond"}
              bgColor={"Cgreen"}
              color={"Cbutton"}
              rounded={"md"}
              fontSize={"md"}
            >
              <FaPlus />
              <Text mb={0.5}>Añadir Nuevo</Text>
            </Button>
          </Link>
          {/* <Button bgColor={"#000"} color={"#fff"} fontFamily={"AmsiProCond"}>
            <FaSortAlphaDown />
            <Text mb={0.5}>Ordenar</Text>
          </Button> */}
        </Flex>
        {showImportButton ? (
          <Box>
            <Button bgColor={"#000"} color={"#fff"} rounded={"md"}>
              <FaPlus />
              <Text mb={1}>Importar/Exportar en Masa</Text>
            </Button>
          </Box>
        ) : null}
      </Center>
    </>
  );
};
