import React from "react";
import { Flex, Text, Box, Icon } from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa6";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  incrementBg?: string;
  incrementColor?: string;
  decrementBg?: string;
  decrementColor?: string;
  borderColor?: string;
  boxSize?: Number;
  counterBgColor?: string;
  increamentPadding?: [Number, Number];
  decrementPadding?: Number;
  modalBorderColor: string;
  dBoxSizeSM?: Number;
  iBoxSizeSM?: Number;
  min?: number;
  max?: number;
}

export const Counter: React.FC<CounterProps> = ({
  value = 1,
  onChange,
  incrementBg = "Cgreen",
  incrementColor = "black",
  decrementBg = "gray.400",
  decrementColor = "white",
  borderColor = "#ddd",
  boxSize = 4,
  increamentPadding = 1.5,
  decrementPadding = 1,
  dBoxSizeSM = 2,
  iBoxSizeSM = 2,
  modalBorderColor = "transparent",
  counterBgColor = "none",
  min = 1,
  max = 99,
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <Flex
      align="center"
      gap={2}
      p={1}
      border={`1px solid ${borderColor}`}
      bgColor={`${counterBgColor}`}
    >
      <Box
        onClick={decrement}
        bg={decrementBg}
        _hover={{ opacity: 0.85 }}
        color={decrementColor}
        borderRadius="md"
        px={2}
        py={{ base: 0.2, md: `${decrementPadding}` }}
        cursor="pointer"
        borderX={`0.5px solid ${modalBorderColor}`}
        display={"flex"}
        alignItems={"center"}
        opacity={value <= min ? 0.5 : 1}
      >
        <Icon as={FaMinus} boxSize={[`${dBoxSizeSM}`, 4]} />
      </Box>

      <Text minW="20px" textAlign="center">
        {value}
      </Text>

      <Box
        onClick={increment}
        bg={incrementBg}
        _hover={{ opacity: 0.85 }}
        color={incrementColor}
        borderRadius="md"
        px={2}
        py={`${increamentPadding}`}
        cursor="pointer"
        borderX={`0.5px solid ${modalBorderColor}`}
        display={"flex"}
        alignItems={"center"}
        opacity={value >= max ? 0.5 : 1}
      >
        <Icon as={FaPlus} boxSize={[`${iBoxSizeSM}`, `${boxSize}`]} />
      </Box>
    </Flex>
  );
};
