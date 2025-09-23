import {
  Box,
  Heading,
  Image,
  Flex,
  useToken,
  Container,
} from "@chakra-ui/react";
import { useRef } from "react";

type elevatedheadingprop = {
  title: String;
};

export const Headingelevated: React.FC<elevatedheadingprop> = ({ title }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerPadding = useToken("space", "36");
  const containerPaddingSM = useToken("space", "10");
  const containerPaddingMD = useToken("space", "12");

  return (
    <>
      <Box position={"relative"} ref={contentRef}>
        <Container maxW={"container.xl"}>
          <Box px={[0, 0, 0]} position="relative">
            <Flex align="center">
              <Heading
                fontSize={["2xl", "3xl", "5xl", "7xl"]}
                color="Cgreen"
                px={[1, 6]}
                fontFamily={"AmsiProCond-Black"}
              >
                {title}
              </Heading>
              <Image
                loading="lazy"
                src="./Logos/logo.png"
                alt="logo"
                width={["40px", "50px", "80px"]}
                mt={4}
              />
            </Flex>

            <Box
              position={"absolute"}
              width={"10%"}
              height={"8%"}
              top={0}
              right={[2, 12, 12, 72]}
            >
              <Image
                loading="lazy"
                src="/Background/designElement-heart2.png"
                w={"54px"}
              />
            </Box>

            <Box
              position="absolute"
              bottom={["-10px", "-10px", "-16px"]}
              left={[
                `-${containerPaddingSM}`,
                `-${containerPaddingMD}`,
                `-${containerPadding}`,
              ]}
              width={["33%", "33%", "44%"]}
              height="1px"
              bg="#fff"
              opacity={0.6}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};
