import { Box, Card, Image, Stack, Text } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
// import { BsCart3 } from "react-icons/bs";

export type SolidCardProps = {
  description: string;
  imageSource: string;
  title: string;
  price: string;
  imageSize?: string;
};

export const SolidCard: React.FC<SolidCardProps> = ({
  description,
  imageSource,
  title,
  price,
  // imageSize,
}) => {
  return (
    <Stack position="relative">
      <Box mx="auto" width="100%" maxW="260px">
        <Box
          p="1px"
          borderRadius="20px"
          background="linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0))"
          position={"relative"}
          zIndex={9}
        >
          {/* Actual card with transparent background */}
          <Card.Root
            bg="#264C33"
            backdropFilter="blur(10px)"
            border="none"
            rounded="20px"
            py={[6, 9, 8, 6]}
            overflow="hidden"
            position={"relative"}
            zIndex={99}
            height={"100%"}
            // minH={"20vh"}
            h={["280px", "340px"]}
          >
            <Card.Body
              gap={"2"}
              p={[0, 2, 3]}
              bg="transparent"
              position="relative"
              zIndex={1}
            >
              {/* CARD IMAGE */}
              <Box display="flex" justifyContent="center">
                <Image
                  loading="lazy"
                  src={imageSource}
                  // width={["60%", "60%", `${imageSize || "90%"}`]}
                  width={["120px", "160px"]}
                  height={["120px", "160px"]}
                  minW={"120px"}
                  objectFit="contain"
                  objectPosition="center"
                />
              </Box>

              {/* CARD TITLE & PRICE */}
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Card.Title
                  color="white"
                  fontSize={["xs", "sm", "xl"]}
                  fontFamily={"AmsiProCond"}
                  fontWeight={400}
                  textAlign={"center"}
                  p={0}
                >
                  {title}
                </Card.Title>
                <Card.Header
                  color="Cgreen"
                  p={0}
                  fontSize={["sm", "sm", "20px"]}
                  fontFamily={"AmsiProCond-Black"}
                  letterSpacing={1}
                >
                  {price}
                </Card.Header>
              </Box>

              {/* CARD DESCRIPTION */}
              <Card.Description
                textAlign="center"
                color="white"
                fontSize={["10px", "xs", "14px"]}
                px={["2", "0"]}
                fontFamily={"AmsiProCond"}
                lineHeight={"1.2"}
                letterSpacing={"1px"}
              >
                <Tooltip content={description}>
                  <Text truncate>{description}</Text>
                </Tooltip>
              </Card.Description>
              {/* <Button
                bg="Cbutton"
                color="#fff"
                fontFamily={"AmsiProCond"}
                fontSize={"lg"}
                pb={2}
                mt={2}
                rounded={"md"}
              >
                <BsCart3 />
                Agregar al carrito
              </Button> */}
            </Card.Body>
          </Card.Root>
        </Box>
      </Box>
    </Stack>
  );
};
