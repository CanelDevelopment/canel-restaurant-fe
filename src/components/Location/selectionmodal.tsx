// src/components/Location/SelectionModal.tsx

import {
  Dialog, // Import the Dialog component
  VStack,
  Box,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FaArrowRightLong } from "react-icons/fa6";
// import React from "react";

interface SelectionModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  renderItem: (item: T) => string;
  onSelectItem: (item: T) => void;
  isLoading?: boolean;
}

export const SelectionModal = <T,>({
  isOpen,
  onClose,
  title,
  items,
  renderItem,
  onSelectItem,
  isLoading,
}: SelectionModalProps<T>) => {
  return (
    // The main component is now Dialog.Root. We control it with the `open` prop.
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      {/* The trigger is not needed here because the parent component controls opening */}
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bgColor="#7a9f8a" color="white" rounded="lg">
          <Dialog.Header>
            {/* The title goes inside Dialog.Title */}
            <Dialog.Title fontFamily="AmsiProCond-Bold" fontSize="2xl">
              {title}
            </Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            {isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <VStack>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <Box
                      key={index}
                      width="100%"
                      bg="#fff"
                      rounded="md"
                      color="#7a9f8a"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      px={4}
                      py={2}
                      fontSize="xl"
                      cursor="pointer"
                      onClick={() => onSelectItem(item)}
                      _hover={{ borderColor: "#5a7d6a", color: "#5a7d6a" }}
                    >
                      <Text mb={1} fontFamily="AmsiProCond">
                        {renderItem(item)}
                      </Text>
                      <FaArrowRightLong color="#7a9f8a" size={18} />
                    </Box>
                  ))
                ) : (
                  <Text>No items available.</Text>
                )}
              </VStack>
            )}
          </Dialog.Body>
          {/* Footer is not needed for this design */}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
