import { Button, Center, Flex, Text } from "@chakra-ui/react";
import type React from "react";
// import { FaSortAlphaDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BulkImportModal } from "../food Item/bulkproductmodal";
import { useState } from "react";
import { BulkImportModalCategory } from "./bulkcategorymodal";
import { AddonCategoryBulkImportModal } from "../addon/bulkmodaladdon";
import { BulkImportAddonModal } from "../addon/bulkmodaladdonitem";

type ShowButton = {
  showImportButton?: boolean;
  showProductModal?: boolean;
  showCategoryModal?: boolean;
  showAddonCategory?: boolean;
  showAddonItem?: boolean;

  link: string;
};

export const FoodHeader: React.FC<ShowButton> = ({
  link,
  showProductModal,
  showCategoryModal,
  showAddonCategory,
  showAddonItem,
}) => {
  const [isImportModalOpen, setImportModalOpen] = useState(false);

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
        </Flex>
        {/* {showImportButton ? (
          <Box>
            <Button
              bgColor={"#000"}
              color={"#fff"}
              rounded={"md"}
              onClick={() => setImportModalOpen(true)}
            >
              <FaPlus />
              <Text mb={1}>Importar/Exportar en Masa</Text>
            </Button>
          </Box>
        ) : null} */}

        {showProductModal ? (
          <BulkImportModal
            isOpen={isImportModalOpen}
            onClose={() => setImportModalOpen(false)}
          />
        ) : null}

        {showCategoryModal ? (
          <BulkImportModalCategory
            isOpen={isImportModalOpen}
            onClose={() => setImportModalOpen(false)}
          />
        ) : null}

        {showAddonCategory ? (
          <AddonCategoryBulkImportModal
            isOpen={isImportModalOpen}
            onClose={() => setImportModalOpen(false)}
          />
        ) : null}

        {showAddonItem ? (
          <BulkImportAddonModal
            isOpen={isImportModalOpen}
            onClose={() => setImportModalOpen(false)}
          />
        ) : null}
      </Center>
    </>
  );
};
