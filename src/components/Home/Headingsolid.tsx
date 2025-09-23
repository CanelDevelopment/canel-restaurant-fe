import {
  Box,
  Heading,
  Image,
  Flex,
  useToken,
  Container,
} from "@chakra-ui/react";
import { useRef } from "react";

type headingProps = {
  title: string;
};

export const Headingsolid: React.FC<headingProps> = ({ title }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerPadding = useToken("space", "36");
  const containerPaddingSM = useToken("space", "10");
  const containerPaddingMD = useToken("space", "12");

  return (
    <Box bg="Cgreen" py={10}>
      <Container
        maxW="container.xl"
        mx="auto"
        position="relative"
        ref={contentRef}
      >
        <Flex align="center">
          <Heading
            pl={[3, 0, 7]}
            fontFamily={"AmsiProCond-Black"}
            fontSize={["3xl", "4xl"]}
            color="Cbutton"
          >
            {title}
          </Heading>
          <Image
            loading="lazy"
            src="./Logos/black.png"
            alt="logo"
            ml={4}
            width={["40px", "60px"]}
          />
        </Flex>

        {/* Pushing to GITHUB */}

        {/* Underline matching Headingelevated style */}
        <Box
          position="absolute"
          bottom={["-10px", "-10px", "-16px"]}
          left={[
            `-${containerPaddingSM}`,
            `-${containerPaddingMD}`,
            `-${containerPadding}`,
          ]}
          width={["33%", "40%", "44%"]}
          height="1px"
          bg="Cbutton"
          opacity={0.6}
        />
      </Container>
    </Box>
  );
};
