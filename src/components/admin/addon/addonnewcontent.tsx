import {
  Box,
  Button,
  Center,
  createListCollection,
  Flex,
  Input,
  Select,
  Separator,
  Spinner,
  Text,
  Portal,
} from "@chakra-ui/react";
// import { IoListOutline } from "react-icons/io5";
// import { FaPlus } from "react-icons/fa";
import { Textarea } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAddonCategory } from "@/hooks/addoncategory/useaddoncategory";
import { useState } from "react";
// import { useEffect } from "react";

interface AddonCategory {
  name: string;
  description: string;
  visibility: boolean;
}

export const AddonNewContent = () => {
  const options = [
    { value: "false", label: "En instance" },
    { value: "true", label: "Publier" },
  ];

  const visibilityCollection = createListCollection({
    items: options,
  });

  const [visibility, setVisibility] = useState<string>("false");

  const { register, handleSubmit } = useForm<AddonCategory>();
  const { mutate, isPending } = useAddonCategory();

  async function onSubmit(values: AddonCategory) {
    mutate({
      ...values,
      visibility: visibility === "true",
    });
  }

  return (
    <>
      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[3, 5, 5, 8]}
        py={7}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Flex
          gapY={4}
          flexWrap={["wrap", "nowrap"]}
          justifyContent={"space-between"}
          w={"full"}
        >
          <Flex alignItems={"center"} gapX={5}>
            <Text color={"#000"}>Staut</Text>

            <Box w={"full"}>
              <Select.Root
                collection={visibilityCollection}
                value={[visibility]}
                onValueChange={(details) => {
                  if (details.value.length > 0) {
                    setVisibility(details.value[0]);
                  }
                }}
              >
                <Select.Control>
                  <Select.Trigger
                    bg="#f3f3f3"
                    border="none"
                    borderRadius="md"
                    cursor="pointer"
                  >
                    <Select.ValueText placeholder="Seleccionar estado" />
                    <Select.Indicator />
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#fff" borderWidth="1px">
                      {visibilityCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              {/* </Box> */}
            </Box>
          </Flex>
        </Flex>
      </Center>

      <Separator w={"full"} orientation={"horizontal"} opacity={0.1} />

      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[0, 0, 5, 5]}
        py={7}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Box p={[6, 6, 2, 6]} w={"50%"}>
          <Flex flexDirection={"column"} gapY={5} wrap="wrap">
            {/* Food Category */}
            <Box
              display={"flex"}
              flexDirection={["column", "column", "row"]}
              alignItems={["start", "start", "center"]}
              gapX={6}
            >
              <Box
                flex="1"
                display={"flex"}
                flexDirection={["column", "column", "row", "row"]}
                alignItems={["start", "start", "center"]}
                w={"full"}
                minW={["200px", "400px"]}
              >
                <Text fontFamily={"AmsiProCond"} color={"#000"} minW="150px">
                  Nom
                </Text>
                <Input
                  placeholder="nom complemento"
                  border={"none"}
                  bg="gray.100"
                  {...register("name")}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box
              display={"flex"}
              flexDirection={["column", "column", "row"]}
              //   alignItems={["start", "start", "center"]}
              minW={["200px", "400px"]}
            >
              <Text minW="150px" color={"#000"}>
                Descripci
              </Text>
              <Textarea
                border={"none"}
                placeholder="Ingrese la descripci del complemento"
                bg="gray.100"
                rows={4}
                {...register("description")}
              />
            </Box>
          </Flex>
        </Box>
      </Center>

      <Box
        bgColor={"#fff"}
        h={"100px"}
        display={"flex"}
        justifyContent={"flex-end"}
        py={5}
        px={8}
      >
        <Button
          bgColor={"Cgreen"}
          color={"Cbutton"}
          w={["100%", "100%", "10%"]}
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          <Text mb={1}>{isPending ? <Spinner /> : "Guardar"}</Text>
        </Button>
      </Box>
    </>
  );
};
