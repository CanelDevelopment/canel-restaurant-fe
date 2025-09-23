import { Box, Text } from "@chakra-ui/react";

type HeaderSectionProps = {
  title: string;
};

export const HeaderSection: React.FC<HeaderSectionProps> = ({ title }) => {
  return (
    <Box bgColor={"Dgreen"} p={6}>
      <Text fontSize="lg" fontFamily={"AmsiProCond-Black"} color={"#000"}>
        {title}
      </Text>
    </Box>
  );
};
