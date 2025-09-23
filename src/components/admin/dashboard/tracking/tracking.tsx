import { Box, Center, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export const Tracking = () => {
  const trackingData = [
    {
      order: "1q8-268",
      name: "William Sheikhspear",
      address: "West Arizona Near Palm tree Street 204 821 Flat 101",
      color: "#F7FEE0",
    },
    {
      order: "1q8-268",
      name: "William Sheikhspear",
      address: "West Arizona Near Palm tree Street 204 821 Flat 101",
      color: "#F7FEE0",
    },
    {
      order: "1q8-268",
      name: "William Sheikhspear",
      address: "West Arizona Near Palm tree Street 204 821 Flat 101",
      color: "#F7FEE0",
    },
    {
      order: "1q8-268",
      name: "William Sheikhspear",
      address: "West Arizona Near Palm tree Street 204 821 Flat 101",
      color: "#F7FEE0",
    },
    {
      order: "1q8-268",
      name: "William Sheikhspear",
      address: "West Arizona Near Palm tree Street 204 821 Flat 101",
      color: "#F7FEE0",
    },
  ];

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <Center alignItems={"start"} w={"100%"} bg={"#f3f3f3"}>
      <Box bg={"white"} w={["100%", "93%"]} overflow={"hidden"}>
        <Center alignItems={"start"} justifyContent={"space-between"} gap={2}>
          <Flex flexDirection={"column"} p={[6, 6, 12]} gap={2}>
            {trackingData.map((item, index) => (
              <Center
                justifyContent={"start"}
                alignItems={"start"}
                width={["100%", "100%", "320px", "520px"]}
                border={index === 0 ? "2px solid #4c9f7b" : "2px solid #EBEBEB"}
                rounded={"2xl"}
                _hover={{ border: "2px solid #4c9f7b" }}
                cursor={"pointer"}
              >
                <Flex
                  p={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                  key={index}
                  gap={2}
                >
                  <Stack bg={item.color} rounded={"2xl"} p={4}>
                    <Text fontWeight={"Black"} color={"Cbutton"}>
                      Pedido#:
                    </Text>
                    <Text color={"#000"}>{item.order}</Text>
                  </Stack>

                  <Stack lineHeight={1}>
                    <Text fontWeight={"Black"} color={"Cbutton"}>
                      {item.name}
                    </Text>
                    <Text fontWeight={"light"} color={"#000"} fontSize={"14px"}>
                      {item.address}
                    </Text>
                  </Stack>
                </Flex>
              </Center>
            ))}
          </Flex>

          <Image
            loading="lazy"
            src="/admin/trackingmap.png"
            alt="seguimiento"
            // width={"100%"}
            height={"100vh"}
            display={{ base: "none", md: "block" }}
          />
        </Center>
      </Box>
    </Center>
  );
};
