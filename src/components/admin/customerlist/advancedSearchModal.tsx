import {
  Dialog,
  RadioGroup,
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Icon,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

// SearchCriteria type remains the same
type SearchCriteria = {
  amountSpendCondition: string;
  amountSpendValue: string;
  numOrdersCondition: string;
  numOrdersValue: string;
  blacklistStatus: "all" | "blacklisted" | "not_blacklisted";
};

interface AdvancedSearchModalProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const AdvancedSearchModal = ({ onSearch }: AdvancedSearchModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    amountSpendCondition: "more",
    amountSpendValue: "",
    numOrdersCondition: "more",
    numOrdersValue: "",
    blacklistStatus: "all",
  });

  const handleInputChange = (field: keyof SearchCriteria, value: string) => {
    setSearchCriteria((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchClick = () => {
    onSearch(searchCriteria);
    setIsOpen(false);
  };

  const RadioItem = ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <RadioGroup.Item
      value={value}
      fontFamily={"AmsiProCond"}
      fontSize={"sm"}
      display="flex"
      alignItems="center"
      w="max-content"
    >
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemIndicator mr={2} />
      <RadioGroup.ItemText>{children}</RadioGroup.ItemText>
    </RadioGroup.Item>
  );

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
      size={"lg"}
    >
      <Dialog.Trigger>
        <Button
          rounded={"md"}
          bgColor={"Cgreen"}
          fontFamily={"AmsiProCond"}
          onClick={() => setIsOpen(true)}
          color={"#000"}
          pb={1}
        >
          <CiSearch />
          Abrir Búsqueda Avanzada
        </Button>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bgColor={"#fff"}
          color={"#000"}
          height={"max-content"}
          shadow={"none"}
          border={"2px solid  #DFDFDF"}
          width="800px"
          rounded="2xl"
          p={6}
        >
          <Dialog.Header>
            <Dialog.Title
              position={"absolute"}
              top={0}
              left={0}
              p={4}
              w={"full"}
              roundedTop={"2xl"}
              bgColor={"#E2F8ED"}
              color="Cbutton"
              fontFamily={"AmsiProCond-Black"}
              fontSize="lg"
            >
              Búsqueda Avanzada
              <Dialog.CloseTrigger
                position="absolute"
                top="50%"
                right="1rem"
                transform="translateY(-50%)"
                bgColor={"#58615A"}
                rounded={"full"}
                h={5}
                w={5}
                p={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Icon
                  as={AiOutlineClose}
                  color={"#fff"}
                  boxSize={3}
                  cursor={"pointer"}
                />
              </Dialog.CloseTrigger>
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body px={0} mt={12}>
            <VStack align="start">
              {/* Monto Gastado */}
              <Box w="full">
                <Text fontFamily={"AmsiProCond-Black"} fontSize="lg" mb={2}>
                  Monto Gastado
                </Text>
                <HStack align="center" justify="space-between" w="full">
                  <RadioGroup.Root
                    value={searchCriteria.amountSpendCondition}
                    onValueChange={(e) =>
                      handleInputChange("amountSpendCondition", e.value || "")
                    }
                  >
                    <VStack align="start">
                      <RadioItem value="more">Más que esta cantidad</RadioItem>
                      <RadioItem value="exact">Cantidad exacta</RadioItem>
                      <RadioItem value="less">
                        Menos que esta cantidad
                      </RadioItem>
                    </VStack>
                  </RadioGroup.Root>
                  <Input
                    placeholder="Introduce el importe"
                    value={searchCriteria.amountSpendValue}
                    onChange={(e) =>
                      handleInputChange("amountSpendValue", e.target.value)
                    }
                    type="number"
                    bgColor={"#EBEBEB"}
                    border={"1px solid #D1D1D1"}
                    w="300px"
                  />
                </HStack>
              </Box>

              {/* Número de Pedidos */}
              <Box w="full">
                <Text fontFamily={"AmsiProCond-Black"} fontSize="lg" mb={2}>
                  Número de Pedidos
                </Text>
                <HStack align="center" justify="space-between" w="full">
                  <RadioGroup.Root
                    value={searchCriteria.numOrdersCondition}
                    onValueChange={(e) =>
                      handleInputChange("numOrdersCondition", e.value || "")
                    }
                  >
                    <VStack align="start">
                      <RadioItem value="more">Más que este número</RadioItem>
                      <RadioItem value="exact">Número exacto</RadioItem>
                      <RadioItem value="less">Menos que este número</RadioItem>
                    </VStack>
                  </RadioGroup.Root>
                  <Input
                    placeholder="Introduce el número"
                    value={searchCriteria.numOrdersValue}
                    onChange={(e) =>
                      handleInputChange("numOrdersValue", e.target.value)
                    }
                    type="number"
                    bgColor={"#EBEBEB"}
                    border={"1px solid #D1D1D1"}
                    w="300px"
                  />
                </HStack>
              </Box>

              {/* Lista Negra */}
              <Box w="full">
                <Text fontFamily={"AmsiProCond-Black"} fontSize="lg" mb={2}>
                  Estado de la Lista Negra
                </Text>
                <RadioGroup.Root
                  value={searchCriteria.blacklistStatus}
                  onValueChange={(e) =>
                    handleInputChange("blacklistStatus", e.value || "")
                  }
                >
                  <HStack>
                    <RadioItem value="all">Todos los usuarios</RadioItem>
                    <RadioItem value="blacklisted">
                      Solo en lista negra
                    </RadioItem>
                    <RadioItem value="not_blacklisted">
                      No en lista negra
                    </RadioItem>
                  </HStack>
                </RadioGroup.Root>
              </Box>
            </VStack>
            <Button
              mt={8}
              w="100%"
              bgColor={"Cgreen"}
              color="Cbutton"
              _hover={{ opacity: 0.7 }}
              onClick={handleSearchClick}
              fontSize="lg"
              py={6}
            >
              Buscar
            </Button>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AdvancedSearchModal;
